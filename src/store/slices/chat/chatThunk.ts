import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiFetchChatHistories,
    apiFetchChatById,
    apiSendMessage,
    apiRenameChat,
    apiCreateChat,
    apiDeleteChat,
    apiSearchChats,
    apiUpdateMessage,
} from '@/services/ChatService'
import type {
    AIChatPublic,
    AIChatsPublic,
    AIChatMessageResponse,
    AIChatMessagePublic,
    ChatHistories,
    ChatHistory,
    Conversation,
} from '@/app/(protected-pages)/dashboard/chat/types'

// Helper function to convert backend message to frontend conversation format
const convertMessageToConversation = (msg: AIChatMessagePublic, isUser: boolean = false): Conversation => ({
    id: msg.id,
    sender: isUser ? {
        id: 'user',
        name: 'You',
    } : {
        id: 'ai',
        name: 'Chat AI',
        avatarImageUrl: '/img/thumbs/ai.jpg',
    },
    content: msg.content,
    timestamp: new Date(msg.created_at).getTime(),
    type: 'regular',
    isMyMessage: isUser,
    fresh: false,
})

// Helper function to convert backend chat to frontend format
const convertBackendChatToFrontend = (chat: AIChatPublic): ChatHistory => ({
    id: chat.id,
    title: chat.title,
    conversation: chat.messages?.map(msg =>
        convertMessageToConversation(msg, msg.role === 'user')
    ) || [],
    lastConversation: chat.messages && chat.messages.length > 0
        ? chat.messages[chat.messages.length - 1].content
        : '',
    createdTime: new Date(chat.created_at).getTime(),
    updatedTime: new Date(chat.updated_at).getTime(),
    enable: true,
})

// Helper function to convert backend list item to frontend format
const convertBackendListToFrontend = (chatList: AIChatsPublic): ChatHistories =>
    chatList.data.map(chat => ({
        id: chat.id,
        title: chat.title,
        conversation: [],
        lastConversation: chat.last_message_preview || '',
        createdTime: new Date(chat.created_at).getTime(),
        updatedTime: new Date(chat.updated_at).getTime(),
        enable: true,
    }))

export const fetchChatHistories = createAsyncThunk<ChatHistories>(
    'chat/fetchChatHistories',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiFetchChatHistories()
            return convertBackendListToFrontend(data)
        } catch (error: any) {
            console.error('fetchChatHistories error:', error)
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error
                    ? error.message
                    : 'Failed to fetch chat histories')
            return rejectWithValue(errorMessage)
        }
    }
)

export const fetchChatById = createAsyncThunk<ChatHistory, string>(
    'chat/fetchChatById',
    async (chatId: string, { rejectWithValue }) => {
        try {
            const data = await apiFetchChatById(chatId)
            return convertBackendChatToFrontend(data)
        } catch (error: any) {
            console.error('fetchChatById error:', error)
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error
                    ? error.message
                    : `Failed to fetch chat with id ${chatId}`)
            return rejectWithValue(errorMessage)
        }
    }
)

export const sendChatMessage = createAsyncThunk<
    { response: AIChatMessageResponse; chatId: string },
    { chatId: string; message: string; model?: string }
>(
    'chat/sendChatMessage',
    async (payload: { chatId: string; message: string; model?: string }, { signal, rejectWithValue }) => {
        try {
            const data = await apiSendMessage(payload, signal)
            return { response: data, chatId: payload.chatId, model: payload.model }
        } catch (error: any) {
            if (axios.isCancel(error)) {
                throw error
            }
            console.error('sendChatMessage error:', error)

            // Check for insufficient credits error (HTTP 402)
            if (error?.response?.status === 402 || error?.status === 402) {
                const errorDetail = error?.response?.data?.detail || error?.detail
                return rejectWithValue({
                    type: 'insufficient_credits',
                    message: typeof errorDetail === 'string' ? errorDetail : errorDetail?.message || 'Insufficient credits',
                    details: errorDetail
                })
            }

            // Check for rate limit error (HTTP 429)
            if (error?.response?.status === 429 || error?.status === 429) {
                return rejectWithValue({
                    type: 'rate_limit',
                    message: 'Rate limit exceeded. Please wait a moment and try again.'
                })
            }

            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error
                    ? error.message
                    : 'Failed to send message')
            return rejectWithValue({
                type: 'error',
                message: errorMessage
            })
        }
    }
)

export const renameChat = createAsyncThunk<
    { chatId: string; title: string },
    { chatId: string; title: string }
>(
    'chat/renameChat',
    async (payload: { chatId: string; title: string }, { rejectWithValue }) => {
        try {
            await apiRenameChat(payload)
            return payload
        } catch (error) {
            console.error('renameChat error:', error)
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error
                    ? error.message
                    : 'Failed to rename chat')
            return rejectWithValue(errorMessage)
        }
    }
)

export const createChatConversation = createAsyncThunk<
    { chat: ChatHistory; firstMessage: string },
    { message: string; title?: string; model?: string }
>(
    'chat/createChatConversation',
    async (payload: { message: string; title?: string; model?: string }, { signal, rejectWithValue }) => {
        try {
            console.log('🆕 Creating new chat with message:', payload.message)

            // Step 1: Create new chat
            const newChat = await apiCreateChat({ title: payload.title || 'New Chat' })
            console.log('✅ Chat created:', newChat.id)

            // Step 2: Send first message
            const messageResponse = await apiSendMessage({
                chatId: newChat.id,
                message: payload.message,
                model: payload.model,
            }, signal)
            console.log('✅ First message sent, got response:', messageResponse)

            // Step 3: Fetch updated chat to get auto-generated title
            const updatedChat = await apiFetchChatById(newChat.id)
            console.log('✅ Fetched updated chat with title:', updatedChat.title)

            // Step 4: Convert to frontend format with auto-generated title
            const chat: ChatHistory = {
                id: updatedChat.id,
                title: updatedChat.title, // Use auto-generated title from backend
                conversation: [
                    convertMessageToConversation(messageResponse.user_message, true),
                    { ...convertMessageToConversation(messageResponse.assistant_message, false), fresh: true },
                ],
                lastConversation: messageResponse.assistant_message.content,
                createdTime: new Date(updatedChat.created_at).getTime(),
                updatedTime: new Date(updatedChat.updated_at).getTime(),
                enable: true,
            }

            console.log('✅ Chat object created for Redux with title:', chat.title)
            return { chat, firstMessage: payload.message, model: payload.model }
        } catch (error: any) {
            if (axios.isCancel(error)) {
                throw error
            }
            console.error('❌ createChatConversation error:', error)

            // Check for insufficient credits error (HTTP 402)
            if (error?.response?.status === 402 || error?.status === 402) {
                const errorDetail = error?.response?.data?.detail || error?.detail
                return rejectWithValue({
                    type: 'insufficient_credits',
                    message: typeof errorDetail === 'string' ? errorDetail : errorDetail?.message || 'Insufficient credits',
                    details: errorDetail
                })
            }

            // Check for rate limit error (HTTP 429)
            if (error?.response?.status === 429 || error?.status === 429) {
                return rejectWithValue({
                    type: 'rate_limit',
                    message: 'Rate limit exceeded. Please wait a moment and try again.'
                })
            }

            let errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error
                    ? error.message
                    : 'Failed to create chat conversation')

            // If detail is an object (FastAPI sometimes returns error objects), stringify it
            if (typeof errorMessage === 'object') {
                errorMessage = JSON.stringify(errorMessage)
            }
            return rejectWithValue({
                type: 'error',
                message: errorMessage
            })
        }
    }
)

export const deleteChat = createAsyncThunk<string, string>(
    'chat/deleteChat',
    async (chatId: string, { rejectWithValue }) => {
        try {
            await apiDeleteChat(chatId)
            return chatId
        } catch (error) {
            console.error('deleteChat error:', error)
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error
                    ? error.message
                    : 'Failed to delete chat')
            return rejectWithValue(errorMessage)
        }
    }
)

export const searchChats = createAsyncThunk<
    ChatHistories,
    { query: string; skip?: number; limit?: number }
>(
    'chat/searchChats',
    async (payload: { query: string; skip?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const data = await apiSearchChats(payload.query, {
                skip: payload.skip,
                limit: payload.limit,
            })
            return convertBackendListToFrontend(data)
        } catch (error) {
            console.error('searchChats error:', error)
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to search chats'
            return rejectWithValue(errorMessage)
        }
    }
)

export const chatThunks = {
    fetchChatHistories,
    fetchChatById,
    sendChatMessage,
    renameChat,
    createChatConversation,
    deleteChat,
    searchChats,
}

export default chatThunks
export interface UpdateChatMessagePayload {
    chatId: string
    messageId: string
    message: string
    model?: string
}

export const updateChatMessage = createAsyncThunk(
    'chat/updateChatMessage',
    async (payload: UpdateChatMessagePayload, { rejectWithValue, signal }) => {
        try {
            const data = await apiUpdateMessage(
                payload.chatId,
                payload.messageId,
                { message: payload.message, model: payload.model },
                signal
            )
            return {
                response: data,
                chatId: payload.chatId,
                messageId: payload.messageId,
                model: payload.model
            }
        } catch (error: any) {
            if (axios.isCancel(error)) {
                throw error
            }

            // Standard error handling like sendChatMessage
            if (error?.response?.status === 402 || error?.status === 402) {
                const errorDetail = error?.response?.data?.detail || error?.detail
                return rejectWithValue({
                    type: 'insufficient_credits',
                    message: typeof errorDetail === 'string' ? errorDetail : errorDetail?.message || 'Insufficient credits',
                    details: errorDetail
                })
            }

            if (error?.response?.status === 429 || error?.status === 429) {
                return rejectWithValue({
                    type: 'rate_limit',
                    message: 'Rate limit exceeded. Please wait a moment and try again.'
                })
            }

            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error
                    ? error.message
                    : 'Failed to update message')
            return rejectWithValue({
                type: 'error',
                message: errorMessage
            })
        }
    }
)
