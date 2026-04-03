import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME, CHAT_STATUS } from './constants'
import type { ChatStatus } from './constants'
import type { ChatHistories, ChatHistory, Conversation, AIChatMessageResponse } from '@/app/(protected-pages)/dashboard/chat/types'
import {
    fetchChatHistories,
    fetchChatById,
    sendChatMessage,
    renameChat,
    createChatConversation,
    deleteChat,
    searchChats,
    updateChatMessage,
} from './chatThunk'

export interface ChatState {
    chatHistory: ChatHistories
    selectedConversation: string
    selectedConversationRecord: string[]
    renameDialog: { id: string; title: string; open: boolean }
    rateLimitDialog: { open: boolean; retryAfter: number }
    insufficientCreditsDialog: { open: boolean; message: string; currentBalance: number; model: string }
    deleteDialog: { id: string; title: string; open: boolean }
    isTyping: boolean
    loading: boolean
    status: ChatStatus
    error: string | null
    lastFetched: number | null
}

// Initial State
const initialState: ChatState = {
    chatHistory: [],
    selectedConversation: '',
    selectedConversationRecord: [],
    renameDialog: { id: '', title: '', open: false },
    rateLimitDialog: { open: false, retryAfter: 60 },
    insufficientCreditsDialog: { open: false, message: '', currentBalance: 0, model: '' },
    deleteDialog: { id: '', title: '', open: false },
    isTyping: false,
    loading: false,
    status: CHAT_STATUS.IDLE,
    error: null,
    lastFetched: null,
}

// Slice
const chatSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        setSelectedConversation: (state, action: PayloadAction<string>) => {
            state.selectedConversation = action.payload
        },

        setSelectedConversationRecord: (state, action: PayloadAction<string>) => {
            const id = action.payload
            const record = state.selectedConversationRecord
            state.selectedConversationRecord = record.includes(id)
                ? record.filter((r) => r !== id)
                : [...record, id]
        },

        setChatHistory: (state, action: PayloadAction<ChatHistories>) => {
            state.chatHistory = action.payload
        },

        setChatHistoryName: (state, action: PayloadAction<{ id: string; title: string }>) => {
            state.chatHistory = state.chatHistory.map((chat) =>
                chat.id === action.payload.id ? { ...chat, title: action.payload.title } : chat
            )
        },

        setRenameDialog: (state, action: PayloadAction<{ id: string; title: string; open: boolean }>) => {
            state.renameDialog = action.payload
        },

        setRateLimitDialog: (state, action: PayloadAction<{ open: boolean; retryAfter?: number }>) => {
            state.rateLimitDialog = {
                open: action.payload.open,
                retryAfter: action.payload.retryAfter ?? 60,
            }
        },

        setInsufficientCreditsDialog: (state, action: PayloadAction<{ open: boolean; message?: string; currentBalance?: number; model?: string }>) => {
            state.insufficientCreditsDialog = {
                open: action.payload.open,
                message: action.payload.message || '',
                currentBalance: action.payload.currentBalance || 0,
                model: action.payload.model || '',
            }
        },

        setDeleteDialog: (state, action: PayloadAction<{ id: string; title: string; open: boolean }>) => {
            state.deleteDialog = action.payload
        },

        setIsTyping: (state, action: PayloadAction<boolean>) => {
            state.isTyping = action.payload
        },

        pushChatHistory: (state, action: PayloadAction<ChatHistory>) => {
            state.chatHistory = [action.payload, ...state.chatHistory]
        },

        pushConversation: (state, action: PayloadAction<{ id: string; conversation: Conversation }>) => {
            state.chatHistory = state.chatHistory.map((chat) =>
                chat.id === action.payload.id
                    ? {
                        ...chat,
                        conversation: [...(chat.conversation ?? []), action.payload.conversation],
                        updatedTime: Date.now(),
                    }
                    : chat
            )
        },

        disabledChatFresh: (state, action?: PayloadAction<string>) => {
            const chatId = action?.payload || state.selectedConversation
            state.chatHistory = state.chatHistory.map((chat) =>
                chat.id === chatId
                    ? {
                        ...chat,
                        conversation: chat.conversation?.map((c) => ({ ...c, fresh: false })),
                    }
                    : chat
            )
        },

        clearAllFreshFlags: (state) => {
            state.chatHistory = state.chatHistory.map((chat) => ({
                ...chat,
                conversation: chat.conversation?.map((c) => ({ ...c, fresh: false })),
            }))
        },
        clearChatError: (state) => {
            state.error = null
            if (state.status === CHAT_STATUS.FAILED) state.status = CHAT_STATUS.IDLE
        },

        truncateConversation: (state, action: PayloadAction<{ chatId: string; messageId: string }>) => {
            const { chatId, messageId } = action.payload
            state.chatHistory = state.chatHistory.map((chat) => {
                if (chat.id === chatId) {
                    const messageIndex = (chat.conversation || []).findIndex((m) => m.id === messageId)
                    if (messageIndex !== -1) {
                        return {
                            ...chat,
                            conversation: chat.conversation?.slice(0, messageIndex + 1) || [],
                            updatedTime: Date.now(),
                        }
                    }
                }
                return chat
            })
        },

        resetChatState: () => initialState,
    },

    extraReducers: (builder) => {
        builder
            .addCase(updateChatMessage.pending, (state) => {
                state.isTyping = true
                state.error = null
            })
            .addCase(updateChatMessage.fulfilled, (state, action: PayloadAction<{ response: AIChatMessageResponse; chatId: string; messageId: string; model?: string }>) => {
                state.isTyping = false
                const { response, chatId, messageId } = action.payload

                // 1. Truncate in state first (belt and suspenders)
                state.chatHistory = state.chatHistory.map((chat) => {
                    if (chat.id === chatId) {
                        const messageIndex = (chat.conversation || []).findIndex((m) => m.id === messageId)
                        if (messageIndex !== -1) {
                            // Update the edited message content
                            const updatedConv = [...(chat.conversation || []).slice(0, messageIndex)]
                            
                            const userMessage: Conversation = {
                                id: response.user_message.id,
                                sender: { id: 'user', name: 'You' },
                                content: response.user_message.content,
                                timestamp: new Date(response.user_message.created_at).getTime(),
                                type: 'regular',
                                isMyMessage: true,
                                fresh: false,
                            }
                            
                            const aiMessage: Conversation = {
                                id: response.assistant_message.id,
                                sender: {
                                    id: 'ai',
                                    name: 'Chat AI',
                                    avatarImageUrl: '/img/thumbs/ai.jpg',
                                },
                                content: response.assistant_message.content,
                                timestamp: new Date(response.assistant_message.created_at).getTime(),
                                type: 'regular',
                                isMyMessage: false,
                                fresh: true,
                            }

                            return {
                                ...chat,
                                conversation: [...updatedConv, userMessage, aiMessage],
                                lastConversation: aiMessage.content ?? '',
                                updatedTime: Date.now(),
                            }
                        }
                    }
                    return chat
                })
                state.lastFetched = Date.now()
            })
            .addCase(updateChatMessage.rejected, (state, action) => {
                state.isTyping = false
                state.error = (action.payload as any)?.message ?? 'Failed to update message'
            })
        builder
            .addCase(fetchChatHistories.pending, (state) => {
                state.loading = true
                state.status = CHAT_STATUS.LOADING
                state.error = null
            })
            .addCase(fetchChatHistories.fulfilled, (state, action: PayloadAction<ChatHistories>) => {
                state.loading = false
                state.status = CHAT_STATUS.SUCCEEDED
                state.chatHistory = action.payload
                state.error = null
                state.lastFetched = Date.now()
            })
            .addCase(fetchChatHistories.rejected, (state, action) => {
                state.loading = false
                state.status = CHAT_STATUS.FAILED
                state.error = (action.payload as string) ?? 'Failed to fetch chat histories'
            })

        builder
            .addCase(fetchChatById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchChatById.fulfilled, (state, action: PayloadAction<ChatHistory>) => {
                state.loading = false
                state.status = CHAT_STATUS.SUCCEEDED
                const existingIndex = state.chatHistory.findIndex((c) => c.id === action.payload.id)
                if (existingIndex >= 0) {
                    state.chatHistory[existingIndex] = action.payload
                } else {
                    state.chatHistory = [action.payload, ...state.chatHistory]
                }
                state.error = null
                state.lastFetched = Date.now()
            })
            .addCase(fetchChatById.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) ?? 'Failed to fetch chat'
            })

        builder
            .addCase(sendChatMessage.pending, (state) => {
                state.isTyping = true
                state.error = null
            })
            .addCase(sendChatMessage.fulfilled, (state, action: PayloadAction<{ response: AIChatMessageResponse; chatId: string; model?: string }>) => {
                state.isTyping = false
                const { response, chatId, model: requestedModel } = action.payload

                const aiContent = response.assistant_message.content || ''

                // 🚨 Detect 'insufficient_credits' inside success response (Technical Hurdle pattern)
                if (aiContent.includes('402:') && aiContent.includes('insufficient_credits')) {
                    let currentBalance = 0
                    let modelInErr = requestedModel || ''

                    try {
                        const balanceMatch = aiContent.match(/current_balance': ([\d.]+)/)
                        if (balanceMatch) currentBalance = parseFloat(balanceMatch[1])

                        const modelMatch = aiContent.match(/model': '([^']+)'/)
                        if (modelMatch) modelInErr = modelMatch[1]
                    } catch (e) { }

                    state.insufficientCreditsDialog = {
                        open: true,
                        message: 'Insufficient credits to process this request.',
                        currentBalance,
                        model: modelInErr
                    }
                    return
                }

                console.log('✅ Message received from API:', {
                    chatId,
                    userContent: response.user_message.content,
                    aiContent: response.assistant_message.content,
                })

                // Create conversation objects for both messages
                const userMessage: Conversation = {
                    id: response.user_message.id,
                    sender: {
                        id: 'user',
                        name: 'You',
                    },
                    content: response.user_message.content,
                    timestamp: new Date(response.user_message.created_at).getTime(),
                    type: 'regular',
                    isMyMessage: true,
                    fresh: false,
                }

                const aiMessage: Conversation = {
                    id: response.assistant_message.id,
                    sender: {
                        id: 'ai',
                        name: 'Chat AI',
                        avatarImageUrl: '/img/thumbs/ai.jpg',
                    },
                    content: response.assistant_message.content,
                    timestamp: new Date(response.assistant_message.created_at).getTime(),
                    type: 'regular',
                    isMyMessage: false,
                    fresh: true,
                }

                console.log('📝 Adding messages to chat history:', {
                    chatId,
                    totalChats: state.chatHistory.length,
                    chatExists: state.chatHistory.some(c => c.id === chatId)
                })

                // Check if chat exists in history
                const chatExists = state.chatHistory.some(c => c.id === chatId)

                if (chatExists) {
                    // Update existing chat
                    state.chatHistory = state.chatHistory.map((chat) =>
                        chat.id === chatId
                            ? {
                                ...chat,
                                conversation: [...(chat.conversation ?? []), userMessage, aiMessage],
                                lastConversation: aiMessage.content ?? '',
                                updatedTime: Date.now(),
                            }
                            : chat
                    )
                } else {
                    // Chat doesn't exist yet - add it (this happens when sending first message)
                    console.warn('⚠️ Chat not found in history, adding it now')
                    const newChat: ChatHistory = {
                        id: chatId,
                        title: 'New Chat',
                        conversation: [userMessage, aiMessage],
                        lastConversation: aiMessage.content ?? '',
                        createdTime: Date.now(),
                        updatedTime: Date.now(),
                        enable: true,
                    }
                    state.chatHistory = [newChat, ...state.chatHistory]
                    state.selectedConversation = chatId
                }

                console.log('✅ Chat history updated')
                state.lastFetched = Date.now()
            })
            .addCase(sendChatMessage.rejected, (state, action) => {
                state.isTyping = false
                const error = action.payload as any

                // Check if it's an insufficient credits error
                if (error?.type === 'insufficient_credits') {
                    state.insufficientCreditsDialog = {
                        open: true,
                        message: error.message || 'Insufficient credits',
                        currentBalance: error.details?.current_balance || 0,
                        model: error.details?.model || '',
                    }
                }
                // Check if it's a rate limit error
                else if (error?.type === 'rate_limit' || (typeof error === 'string' && (error.includes('429') || error.includes('rate_limit') || error.includes('Rate limit')))) {
                    state.rateLimitDialog = { open: true, retryAfter: 60 }
                } else {
                    state.error = (typeof error === 'string' ? error : error?.message) ?? 'Failed to send message'
                }
            })

        builder
            .addCase(renameChat.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(renameChat.fulfilled, (state, action: PayloadAction<{ chatId: string; title: string }>) => {
                state.loading = false
                state.chatHistory = state.chatHistory.map((chat) =>
                    chat.id === action.payload.chatId
                        ? { ...chat, title: action.payload.title, updatedTime: Date.now() }
                        : chat
                )
                state.lastFetched = Date.now()
            })
            .addCase(renameChat.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) ?? 'Failed to rename chat'
            })

        builder
            .addCase(createChatConversation.pending, (state) => {
                state.isTyping = true
                state.error = null
            })
            .addCase(
                createChatConversation.fulfilled,
                (state, action: PayloadAction<{ chat: ChatHistory; firstMessage: string; model?: string }>) => {
                    const { chat, model: requestedModel } = action.payload

                    const aiResponse = chat.conversation?.[1]?.content || ''

                    // 🚨 Detect 'insufficient_credits' inside success response (Technical Hurdle pattern)
                    if (aiResponse.includes('402:') && aiResponse.includes('insufficient_credits')) {
                        let currentBalance = 0
                        let modelInErr = requestedModel || ''

                        try {
                            const balanceMatch = aiResponse.match(/current_balance': ([\d.]+)/)
                            if (balanceMatch) currentBalance = parseFloat(balanceMatch[1])

                            const modelMatch = aiResponse.match(/model': '([^']+)'/)
                            if (modelMatch) modelInErr = modelMatch[1]
                        } catch (e) { }

                        state.insufficientCreditsDialog = {
                            open: true,
                            message: 'Insufficient credits to process this request.',
                            currentBalance,
                            model: modelInErr
                        }
                        state.isTyping = false
                        return
                    }

                    console.log('🚀 Redux: createChatConversation.fulfilled', {
                        chatId: chat.id,
                        messageCount: chat.conversation?.length,
                        firstMessage: chat.conversation?.[0]?.content,
                        aiResponse: chat.conversation?.[1]?.content,
                    })
                    state.chatHistory = [chat, ...state.chatHistory]
                    state.selectedConversation = chat.id
                    state.isTyping = false
                    state.status = CHAT_STATUS.SUCCEEDED
                    state.lastFetched = Date.now()
                    console.log('✅ Redux state updated:', {
                        totalChats: state.chatHistory.length,
                        selectedConversation: state.selectedConversation
                    })
                }
            )
            .addCase(createChatConversation.rejected, (state, action) => {
                state.isTyping = false
                state.status = CHAT_STATUS.FAILED
                const error = action.payload as any

                // Check if it's an insufficient credits error
                if (error?.type === 'insufficient_credits') {
                    state.insufficientCreditsDialog = {
                        open: true,
                        message: error.message || 'Insufficient credits',
                        currentBalance: error.details?.current_balance || 0,
                        model: error.details?.model || '',
                    }
                }
                // Check if it's a rate limit error
                else if (error?.type === 'rate_limit' || (typeof error === 'string' && (error.includes('429') || error.includes('rate_limit') || error.includes('Rate limit')))) {
                    state.rateLimitDialog = { open: true, retryAfter: 60 }
                } else {
                    state.error = (typeof error === 'string' ? error : error?.message) ?? 'Failed to create conversation'
                }
            })

        builder
            .addCase(deleteChat.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteChat.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false
                state.chatHistory = state.chatHistory.filter(chat => chat.id !== action.payload)
                // Clear selected conversation if it was deleted
                if (state.selectedConversation === action.payload) {
                    state.selectedConversation = ''
                }
                state.lastFetched = Date.now()
            })
            .addCase(deleteChat.rejected, (state, action) => {
                state.loading = false
                state.error = (action.payload as string) ?? 'Failed to delete chat'
            })

        builder
            .addCase(searchChats.pending, (state) => {
                state.loading = true
                state.status = CHAT_STATUS.LOADING
                state.error = null
            })
            .addCase(searchChats.fulfilled, (state, action: PayloadAction<ChatHistories>) => {
                state.loading = false
                state.status = CHAT_STATUS.SUCCEEDED
                // Note: This replaces the chat history with search results
                // You may want different behavior depending on your UI
                state.chatHistory = action.payload
                state.error = null
                state.lastFetched = Date.now()
            })
            .addCase(searchChats.rejected, (state, action) => {
                state.loading = false
                state.status = CHAT_STATUS.FAILED
                state.error = (action.payload as string) ?? 'Failed to search chats'
            })
    },
})

export const {
    setSelectedConversation,
    setSelectedConversationRecord,
    setChatHistory,
    setChatHistoryName,
    setRenameDialog,
    setRateLimitDialog,
    setInsufficientCreditsDialog,
    setDeleteDialog,
    setIsTyping,
    pushChatHistory,
    pushConversation,
    disabledChatFresh,
    clearAllFreshFlags,
    clearChatError,
    resetChatState,
    truncateConversation,
} = chatSlice.actions

export default chatSlice.reducer
export { chatSlice }
