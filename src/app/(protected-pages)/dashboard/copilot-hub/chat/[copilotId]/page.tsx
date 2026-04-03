'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'


import { Spinner, Dropdown, Notification, toast, Dialog, Button } from '@/components/ui'
import QorebitLoading from '@/components/shared/QorebitLoading'
import { useAppSelector } from '@/store'
import { selectCurrentWorkspace } from '@/store/slices/workspace/workspaceSelectors'
import {
    ArrowLeft,
    Send,
    Paperclip,
    Mic,
    MoreHorizontal,
    Settings,
    RefreshCw,
    Copy,
    ThumbsUp,
    ThumbsDown,
    Bot,
    User,
    Sparkles,
    Image as ImageIcon,
    Share2,
    Download,
    Trash2,
    Check,
    Code,
    Zap,
    MessageSquare,
    Plus,
    ChevronLeft,
    X,
    AlertTriangle,
    Pencil,
    Undo,
    Square,
    AlertCircle,
    CreditCard,
} from 'lucide-react'

import type { Copilot, CopilotMessage, CopilotConversation, DocumentUploadResponse } from '../../types'
import {
    apiGetCopilot,
    apiSendCopilotMessage,
    apiListConversations,
    apiCreateConversation,
    apiListMessages,
    apiDeleteConversation,
    apiSubmitMessageFeedback,
    apiUpdateConversation,
    apiUploadDocument,
    apiGenerateSuggestions,
    apiUpdateMessage,
    apiDeleteMessagesAfter,
} from '@/services/CopilotService'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import classNames from '@/utils/classNames'

// Category icon mapping
const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
        coding: <Code className="w-5 h-5" />,
        general: <Sparkles className="w-5 h-5" />,
    }
    return icons[category] || <Bot className="w-5 h-5" />
}

const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        coding: 'from-blue-500 to-indigo-600',
        writing: 'from-purple-500 to-pink-600',
        research: 'from-green-500 to-teal-600',
        'data-analysis': 'from-orange-500 to-amber-600',
        'customer-support': 'from-pink-500 to-rose-600',
        sales: 'from-indigo-500 to-violet-600',
        marketing: 'from-rose-500 to-red-600',
        legal: 'from-slate-500 to-gray-600',
        hr: 'from-teal-500 to-cyan-600',
        general: 'from-gray-500 to-slate-600',
    }
    return colors[category] || colors.general
}

export default function CopilotChatPage() {
    const params = useParams()
    const router = useRouter()
    const { session } = useCurrentSession()
    const copilotId = params.copilotId as string
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const abortControllerRef = useRef<AbortController | null>(null)
    const currentWorkspace = useAppSelector(selectCurrentWorkspace)
    const orgRole = useAppSelector((state: any) => state.organization?.userRole)
    const roleFetched = useAppSelector((state: any) => state.organization?.roleFetched)
    const isOrgMember = roleFetched && orgRole === 'org_member'

    // State
    const [copilot, setCopilot] = useState<Copilot | null>(null)
    const [conversations, setConversations] = useState<CopilotConversation[]>([])
    const [currentConversation, setCurrentConversation] = useState<CopilotConversation | null>(null)
    const [messages, setMessages] = useState<CopilotMessage[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
    const [showSidebar, setShowSidebar] = useState(false)
    const [attachedFiles, setAttachedFiles] = useState<File[]>([])
    const [showDeleteConvDialog, setShowDeleteConvDialog] = useState(false)
    const [convToDeleteId, setConvToDeleteId] = useState<string | null>(null)
    const [chatError, setChatError] = useState<string | null>(null)
    const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([])
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
    const [editingValue, setEditingValue] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [showInsufficientCreditsDialog, setShowInsufficientCreditsDialog] = useState(false)
    const [insufficientCreditsError, setInsufficientCreditsError] = useState<{ message: string; currentBalance: number; model: string } | null>(null)

    // Fetch copilot data
    const fetchCopilot = useCallback(async () => {
        try {
            const data = await apiGetCopilot(copilotId)
            setCopilot(data)
        } catch (err) {
            console.error('Failed to fetch copilot:', err)
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to load copilot. Please try again.
                </Notification>
            )
        }
    }, [copilotId])

    // Fetch conversations
    const fetchConversations = useCallback(async () => {
        try {
            const response = await apiListConversations(copilotId)
            setConversations(response.conversations)
        } catch (err) {
            console.error('Failed to fetch conversations:', err)
        }
    }, [copilotId])

    // Fetch messages for a conversation
    const fetchMessages = useCallback(async (conversationId: string) => {
        try {
            const response = await apiListMessages(conversationId)
            setMessages(response.messages)
        } catch (err) {
            console.error('Failed to fetch messages:', err)
        }
    }, [])

    // Initial load
    useEffect(() => {
        const init = async () => {
            setIsLoading(true)
            await fetchCopilot()
            await fetchConversations()
            setIsLoading(false)
        }
        init()
    }, [fetchCopilot, fetchConversations])

    // Generate/Fetch Dynamic Suggestions
    const fetchDynamicSuggestions = useCallback(async () => {
        if (!copilotId || isLoadingSuggestions) return

        setIsLoadingSuggestions(true)
        try {
            const response = await apiGenerateSuggestions(copilotId)
            if (response.suggestions && response.suggestions.length > 0) {
                setDynamicSuggestions(response.suggestions)
            }
        } catch (err) {
            console.error('Failed to fetch dynamic suggestions:', err)
        } finally {
            setIsLoadingSuggestions(false)
        }
    }, [copilotId])

    // Fetch initial dynamic suggestions
    useEffect(() => {
        if (!isLoading) {
            fetchDynamicSuggestions()
        }
    }, [isLoading, fetchDynamicSuggestions])

    // Auto-dismiss chat error after 5 seconds
    useEffect(() => {
        if (chatError) {
            const timer = setTimeout(() => {
                setChatError(null)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [chatError])

    // Ref to track if we've already restored a conversation on mount
    const hasInitializedRef = useRef(false)

    // Consolidate restoration and initialization
    useEffect(() => {
        const restoreSession = async () => {
            if (hasInitializedRef.current || isLoading) return

            // 1. Check for saved conversation in localStorage
            const savedConversationId = localStorage.getItem(`copilot-${copilotId}-last-conversation`)
            console.log('[DEBUG] Session Restore - LocalStorage ID:', savedConversationId)

            if (savedConversationId) {
                // Try to find it in the loaded list
                const savedConversation = conversations.find(c => c.id === savedConversationId)

                if (savedConversation) {
                    console.log('[DEBUG] found in list, restoring:', savedConversationId)
                    setCurrentConversation(savedConversation)
                    await fetchMessages(savedConversationId)
                    hasInitializedRef.current = true
                } else if (!isLoading && conversations.length > 0) {
                    // Not in the list but list is loaded? Might be an old ID.
                    console.log('[DEBUG] ID not in fetched list, ignoring.')
                    hasInitializedRef.current = true
                }
                // If isLoading is true or conversations is empty, we wait for next cycle
            } else if (!isLoading) {
                // No saved ID, mark as initialized
                console.log('[DEBUG] No session to restore.')
                hasInitializedRef.current = true
            }
        }
        restoreSession()
    }, [conversations, copilotId, fetchMessages, isLoading])

    // Simplified persistence effect
    useEffect(() => {
        if (currentConversation?.id) {
            localStorage.setItem(`copilot-${copilotId}-last-conversation`, currentConversation.id)
        }
    }, [currentConversation?.id, copilotId])

    // When copilot loads, add welcome message if no conversation
    useEffect(() => {
        if (copilot?.welcomeMessage && messages.length === 0 && !currentConversation) {
            setMessages([
                {
                    id: 'welcome',
                    conversationId: '',
                    role: 'assistant',
                    content: copilot.welcomeMessage,
                    attachments: [],
                    metadata: {},
                    createdAt: new Date().toISOString(),
                }
            ])
        }
    }, [copilot, currentConversation, messages.length])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto'
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`
        }
    }, [inputValue])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            // Check if any of the files are images
            const hasImages = files.some(file => file.type.startsWith('image/'))
            const visionEnabled = copilot?.capabilities?.includes('vision')

            if (hasImages && !visionEnabled) {
                toast.push(
                    <Notification title="Vision Disabled" type="warning" duration={5000}>
                        This copilot does not have "Vision" capability enabled. Please enable it in Settings to analyze images.
                    </Notification>
                )
                // Filter out images if vision is disabled
                const nonImageFiles = files.filter(file => !file.type.startsWith('image/'))
                if (nonImageFiles.length === 0) {
                    if (fileInputRef.current) fileInputRef.current.value = ''
                    return
                }
                setAttachedFiles(prev => [...prev, ...nonImageFiles])
            } else {
                setAttachedFiles(prev => [...prev, ...files])
            }

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }


    const removeAttachedFile = (index: number) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleStopGeneration = () => {
        const controller = abortControllerRef.current
        if (controller) {
            abortControllerRef.current = null

            // 1. Immediately update UI state
            setIsGenerating(false)
            setIsSending(false)
            setIsTyping(false)

            // 2. Abort the actual request in the next tick to prevent sync error propagation
            setTimeout(() => {
                try {
                    controller.abort()
                } catch (err) {
                    console.log('[DEBUG] Silent abort:', err)
                }
            }, 0)

            toast.push(
                <Notification title="Stopped" type="info">
                    Response generation stopped.
                </Notification>
            )
        }
    }




    const handleSendMessage = async () => {
        if ((!inputValue.trim() && attachedFiles.length === 0) || isSending || !copilot) return

        // Safety check for vision
        const hasImages = attachedFiles.some(f => f.type.startsWith('image/'))
        if (hasImages && !copilot.capabilities.includes('vision')) {
            toast.push(
                <Notification title="Action Blocked" type="danger">
                    Cannot send images. Vision capability is disabled.
                </Notification>
            )
            return
        }


        const currentInput = inputValue
        const currentFiles = [...attachedFiles]

        setInputValue('')
        setAttachedFiles([])
        setIsSending(true)

        // Reset textarea height
        if (inputRef.current) {
            inputRef.current.style.height = 'auto'
        }

        // Prepare user message metadata outside try block for error handling
        let userMessage: CopilotMessage | null = null

        try {
            let uploadResults: PromiseSettledResult<DocumentUploadResponse>[] = []
            let successfulUploads: PromiseSettledResult<DocumentUploadResponse>[] = []

            // Step 1: Upload attached files to knowledge base first (if any)
            if (currentFiles.length > 0) {
                uploadResults = await Promise.allSettled(
                    currentFiles.map(file =>
                        apiUploadDocument(copilotId, file, {
                            title: file.name,
                            description: `Uploaded during chat on ${new Date().toLocaleString()}`
                        })
                    )
                )

                const failedUploads = uploadResults.filter(r => r.status === 'rejected')
                successfulUploads = uploadResults.filter(r => r.status === 'fulfilled')

                if (failedUploads.length > 0) {
                    console.error('[DEBUG] File upload failures:', failedUploads)
                    const errorMessages = failedUploads.map((result) => {
                        const fileName = currentFiles[uploadResults.indexOf(result)]?.name || 'unknown'
                        const error = (result as PromiseRejectedResult).reason
                        const errorMsg = error?.response?.data?.detail || error?.message || 'Unknown error'
                        return `${fileName}: ${errorMsg}`
                    })

                    toast.push(
                        <Notification title="Upload Failed" type="danger">
                            {failedUploads.length} file(s) failed to upload: {errorMessages.join(', ')}
                        </Notification>
                    )

                    // Don't continue if all uploads failed
                    if (successfulUploads.length === 0) {
                        setIsSending(false)
                        setIsTyping(false)
                        setInputValue(currentInput)
                        setAttachedFiles(currentFiles)
                        return
                    }
                    console.log('[DEBUG] Successfully uploaded', currentFiles.length, 'files to knowledge base')
                }

                // Refresh suggestions because new Knowledge has been added
                fetchDynamicSuggestions()
            }

            // Step 2: Prepare user message (with or without file context)
            let messageContent = currentInput.trim()
            const isImageUpload = currentFiles.some(f => f.type.startsWith('image/'))

            if (currentFiles.length > 0 && !messageContent) {
                messageContent = isImageUpload
                    ? "Please analyze these image(s) and tell me what you see."
                    : `I've uploaded ${currentFiles.length} file(s). Please analyze them.`
            } else if (currentFiles.length > 0) {
                const typeLabel = isImageUpload ? "image(s)" : "file(s)"
                messageContent = `${messageContent}\n\n[Note: ${currentFiles.length} ${typeLabel} uploaded for analysis]`
            }

            const finalAttachments = successfulUploads.map((result) => {
                const docResponse = (result as PromiseFulfilledResult<DocumentUploadResponse>).value
                const originalFile = currentFiles[uploadResults.indexOf(result)]
                return {
                    id: docResponse.id, // Real DB ID
                    name: originalFile.name,
                    type: originalFile.type,
                    size: originalFile.size,
                    url: '',
                }
            })

            userMessage = {
                id: `temp-${Date.now()}`,
                conversationId: currentConversation?.id || '',
                role: 'user',
                content: messageContent,
                attachments: finalAttachments,
                metadata: {},
                createdAt: new Date().toISOString(),
            }

            // Optimistically add user message
            setMessages(prev => [...prev.filter(m => m.id !== 'welcome'), userMessage!])
            setIsTyping(true)
            setIsGenerating(true)

            // Step 3: Send message to copilot
            // Create AbortController for this request
            abortControllerRef.current = new AbortController()

            const conversationIdToUse = currentConversation?.id
            console.log('[DEBUG] Sending message. currentConversationId:', conversationIdToUse || 'NONE (New Chat)')

            const response = await apiSendCopilotMessage(copilotId, {
                conversationId: conversationIdToUse || undefined,
                content: messageContent,
                attachments: finalAttachments,
                stream: false,
                workspaceId: currentWorkspace?.id,
                context: {
                    ...currentConversation?.context,
                }
            }, abortControllerRef.current.signal)


            console.log('[DEBUG] API Response conversationId:', response.conversationId)

            // Update or create conversation object
            const updatedConversation: CopilotConversation = {
                id: response.conversationId,
                copilotId: copilotId,
                userId: currentConversation?.userId || response.userId || '',
                title: currentConversation?.title || (response.content.substring(0, 30) + '...'),
                isActive: true,
                context: currentConversation?.context || {},
                messageCount: (currentConversation?.messageCount || 0) + 2,
                totalTokensUsed: (currentConversation?.totalTokensUsed || 0) + response.tokensUsed,
                totalCost: Number(currentConversation?.totalCost || 0) + Number(response.cost),
                createdAt: currentConversation?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            // Always update current conversation state IMMEDIATELY
            setCurrentConversation(updatedConversation)
            localStorage.setItem(`copilot-${copilotId}-last-conversation`, response.conversationId)
            console.log('[DEBUG] State and localStorage updated with:', response.conversationId)

            // Update conversations list for sidebar
            setConversations(prev => {
                const exists = prev.some(c => c.id === updatedConversation.id)
                if (exists) {
                    return prev.map(c => c.id === updatedConversation.id ? updatedConversation : c)
                } else {
                    return [updatedConversation, ...prev]
                }
            })

            // Update user message with real ID
            setMessages(prev => prev.map(m =>
                m.id === userMessage!.id
                    ? { ...m, id: response.messageId, conversationId: response.conversationId }
                    : m
            ))

            // Add assistant response
            const responseContent = response.content || ''

            // Check if the content is actually a 402 error returned as a success string (happens in agent service)
            if (responseContent.includes('402:') && responseContent.includes('insufficient_credits')) {
                console.warn('[DEBUG] Detected 402 error in success response content')

                // Try to parse the error details if they are in the string
                let processedMessage = "Your account has insufficient credits to process this request."
                let currentBalance = 0
                let model = copilot?.model || 'AI Model'

                try {
                    // Simple regex/parsing to extract some info if possible, but the technical hurdle string is messy
                    if (responseContent.includes('current_balance')) {
                        const balanceMatch = responseContent.match(/current_balance': ([\d.]+)/)
                        if (balanceMatch) currentBalance = parseFloat(balanceMatch[1])
                    }
                    if (responseContent.includes('model')) {
                        const modelMatch = responseContent.match(/model': '([^']+)'/)
                        if (modelMatch) model = modelMatch[1]
                    }
                } catch (e) { /* ignore parsing errors */ }

                setInsufficientCreditsError({
                    message: processedMessage,
                    currentBalance: currentBalance,
                    model: model
                })
                setShowInsufficientCreditsDialog(true)
                setIsTyping(false)

                // Remove the optimistic user message since it wasn't actually processed
                if (userMessage) {
                    setMessages(prev => prev.filter(m => m.id !== userMessage!.id))
                }
                return
            }

            const assistantMessage: CopilotMessage = {
                id: response.responseId,
                conversationId: response.conversationId,
                role: 'assistant',
                content: response.content,
                toolCalls: response.toolCalls,
                attachments: [],
                metadata: {},
                modelUsed: response.modelUsed,
                tokensUsed: response.tokensUsed,
                cost: response.cost,
                responseTimeMs: response.responseTimeMs,
                createdAt: response.createdAt,
            }

            setIsTyping(false)
            setMessages(prev => [...prev, assistantMessage])

            // Fetch fresh dynamic suggestions based on the latest history
            fetchDynamicSuggestions()

        } catch (err: any) {
            console.error('Failed to send message:', err)
            setIsTyping(false)

            // Check if request was aborted
            if (axios.isCancel(err) || err.name === 'AbortError' || err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
                console.log('[DEBUG] Request was aborted by user')
                // Remove the optimistic user message if it was added
                if (userMessage) {
                    setMessages(prev => prev.filter(m => m.id !== userMessage!.id))
                }
                return // Don't show error for user-initiated cancellation
            }


            // Extract error message from API response if possible
            let errorMessage = "Failed to send message. Please try again."
            if (err?.response?.status === 403) {
                errorMessage = err.response.data?.detail || "You don't have permission to use this copilot."
            } else if (err?.response?.status === 402) {
                const errorData = err?.response?.data?.detail || {}
                setInsufficientCreditsError({
                    message: typeof errorData === 'string' ? errorData : errorData.message || "Insufficient credits",
                    currentBalance: errorData.current_balance || 0,
                    model: errorData.model || copilot?.model || 'AI Model'
                })
                setShowInsufficientCreditsDialog(true)
                // Don't set chatError banner if we're showing the modal
                if (userMessage) {
                    setMessages(prev => prev.filter(m => m.id !== userMessage!.id))
                }
                return
            }

            setChatError(errorMessage)

            // Remove the optimistic user message if it was added
            if (userMessage) {
                setMessages(prev => prev.filter(m => m.id !== userMessage!.id))
            }
        } finally {
            setIsSending(false)
            setIsGenerating(false)
            abortControllerRef.current = null
        }

    }

    const handleSaveEdit = async () => {
        if (!editingMessageId || !editingValue.trim() || isSending || !currentConversation) return

        const originalMessageId = editingMessageId
        const newContent = editingValue

        setEditingMessageId(null)
        setEditingValue('')
        setIsSending(true)
        setIsTyping(true)

        try {
            // 1. Update the message on the server
            await apiUpdateMessage(currentConversation.id, originalMessageId, newContent)

            // 2. Delete all messages after this one (rewind history)
            await apiDeleteMessagesAfter(currentConversation.id, originalMessageId)

            // 3. Update local state: remove everything after this message and update this message
            const messageIndex = messages.findIndex(m => m.id === originalMessageId)
            if (messageIndex === -1) return

            const updatedMessages = messages.slice(0, messageIndex + 1).map((m, idx) => {
                if (idx === messageIndex) {
                    return { ...m, content: newContent }
                }
                return m
            })
            setMessages(updatedMessages)

            // 4. Re-send to get a new response
            // Create AbortController for this request
            abortControllerRef.current = new AbortController()

            const originalMessage = messages.find(m => m.id === originalMessageId)
            const response = await apiSendCopilotMessage(copilotId, {
                conversationId: currentConversation.id,
                content: newContent,
                attachments: originalMessage?.attachments || [],
                stream: false,
                workspaceId: currentWorkspace?.id,
                context: {
                    ...currentConversation.context,
                }
            }, abortControllerRef.current.signal)



            // 5. Add assistant response
            const assistantMessage: CopilotMessage = {
                id: response.responseId,
                conversationId: response.conversationId,
                role: 'assistant',
                content: response.content,
                toolCalls: response.toolCalls,
                attachments: [],
                metadata: {},
                modelUsed: response.modelUsed,
                tokensUsed: response.tokensUsed,
                cost: response.cost,
                responseTimeMs: response.responseTimeMs,
                createdAt: response.createdAt,
            }

            setIsTyping(false)
            setIsSending(false)
            setMessages(prev => [...prev, assistantMessage])
            fetchDynamicSuggestions()

        } catch (err: any) {
            console.error('Failed to save edit:', err)
            setIsTyping(false)
            setIsSending(false)

            // Extract detailed error if possible
            const errorDetail = err?.response?.data?.detail || err?.message || "Check your connection"

            // Check if request was aborted
            if (axios.isCancel(err) || err.name === 'AbortError' || err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
                console.log('[DEBUG] Edit request was aborted by user')
                return // Don't show error for user-initiated cancellation
            }

            toast.push(
                <Notification type="danger" duration={5000} title="Update Failed">
                    Failed to update message: {errorDetail}
                </Notification>
            )
        }

    }


    const handleSuggestedPrompt = (prompt: string) => {
        setInputValue(prompt)
        inputRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleNewConversation = () => {
        setCurrentConversation(null)
        setMessages(copilot?.welcomeMessage ? [{
            id: 'welcome',
            conversationId: '',
            role: 'assistant',
            content: copilot.welcomeMessage,
            attachments: [],
            metadata: {},
            createdAt: new Date().toISOString(),
        }] : [])
    }

    const handleSelectConversation = async (conversation: CopilotConversation) => {
        setCurrentConversation(conversation)
        setShowSidebar(false)
        await fetchMessages(conversation.id)
    }

    const handleDeleteConversation = (conversationId: string) => {
        setConvToDeleteId(conversationId)
        setShowDeleteConvDialog(true)
    }

    const confirmDeleteConversation = async () => {
        if (!convToDeleteId) return

        try {
            await apiDeleteConversation(convToDeleteId)
            setConversations(prev => prev.filter(c => c.id !== convToDeleteId))
            if (currentConversation?.id === convToDeleteId) {
                handleNewConversation()
            }
            toast.push(
                <Notification title="Success" type="success">
                    Conversation deleted.
                </Notification>
            )
        } catch (err) {
            console.error('Failed to delete conversation:', err)
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to delete conversation.
                </Notification>
            )
        } finally {
            setShowDeleteConvDialog(false)
            setConvToDeleteId(null)
        }
    }

    const handleCopyMessage = async (messageId: string, content: string) => {
        await navigator.clipboard.writeText(content)
        setCopiedMessageId(messageId)
        setTimeout(() => setCopiedMessageId(null), 2000)
    }

    const handleFeedback = async (messageId: string, rating: 1 | 2) => {
        if (!currentConversation) return

        try {
            await apiSubmitMessageFeedback(currentConversation.id, messageId, { rating })
            setMessages(prev => prev.map(m =>
                m.id === messageId ? { ...m, feedbackRating: rating } : m
            ))
        } catch (err) {
            console.error('Failed to submit feedback:', err)
        }
    }

    const handleShareConversation = async () => {
        if (!currentConversation || messages.length === 0) {
            toast.push(
                <Notification title="Nothing to share" type="warning">
                    Start a conversation first before sharing.
                </Notification>
            )
            return
        }

        try {
            // Format conversation as text
            let conversationText = `Conversation with ${copilot?.name}\n`
            conversationText += `Title: ${currentConversation.title}\n`
            conversationText += `Date: ${new Date(currentConversation.createdAt).toLocaleString()}\n`
            conversationText += `\n${'='.repeat(60)}\n\n`

            messages.forEach((msg, idx) => {
                if (msg.id === 'welcome') return

                const role = msg.role === 'user' ? 'You' : copilot?.name || 'Assistant'
                conversationText += `${role}:\n${msg.content}\n\n`

                if (idx < messages.length - 1) {
                    conversationText += `${'-'.repeat(60)}\n\n`
                }
            })

            conversationText += `${'='.repeat(60)}\n`
            conversationText += `\nGenerated by Qorebit Copilot Hub`

            // Copy to clipboard
            await navigator.clipboard.writeText(conversationText)

            toast.push(
                <Notification title="Success" type="success">
                    Conversation copied to clipboard!
                </Notification>
            )
        } catch (err) {
            console.error('Failed to share conversation:', err)
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to copy conversation. Please try again.
                </Notification>
            )
        }
    }

    const handleExportConversation = async () => {
        if (!currentConversation || messages.length === 0) {
            toast.push(
                <Notification title="Nothing to export" type="warning">
                    Start a conversation first before exporting.
                </Notification>
            )
            return
        }

        try {
            const { jsPDF } = await import('jspdf')
            const doc = new jsPDF()
            let yPos = 20

            // Title section
            doc.setFontSize(18)
            doc.setTextColor(0, 85, 186) // Theme Blue
            doc.text(`${copilot?.name || 'Copilot'} - Conversation`, 10, yPos)
            yPos += 10

            doc.setFontSize(14)
            doc.setTextColor(50, 50, 50)
            doc.text(currentConversation.title, 10, yPos)
            yPos += 15

            doc.setDrawColor(200, 200, 200)
            doc.line(10, yPos - 5, 200, yPos - 5)

            // Messages
            doc.setFontSize(10)
            const chatMessages = messages.filter(m => m.id !== 'welcome')

            chatMessages.forEach((msg) => {
                // Check if we need a new page
                if (yPos > 270) {
                    doc.addPage()
                    yPos = 20
                }

                doc.setFont('helvetica', 'bold')
                doc.setTextColor(msg.role === 'user' ? 0 : 70, msg.role === 'user' ? 85 : 70, msg.role === 'user' ? 186 : 70)
                doc.text(msg.role.toUpperCase(), 10, yPos)
                yPos += 5

                doc.setFont('helvetica', 'normal')
                doc.setTextColor(30, 30, 30)
                const splitText = doc.splitTextToSize(msg.content, 180)
                doc.text(splitText, 10, yPos)
                yPos += (splitText.length * 5) + 8
            })

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
            doc.save(`chat-${currentConversation.title.substring(0, 20)}-${timestamp}.pdf`)

            toast.push(
                <Notification title="Success" type="success">
                    Conversation exported as PDF!
                </Notification>
            )
        } catch (err) {
            console.error('Failed to export conversation as PDF:', err)
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to export as PDF.
                </Notification>
            )
        }
    }

    const handleDownloadMessage = async (content: string, role: string) => {
        try {
            const { jsPDF } = await import('jspdf')
            const doc = new jsPDF()

            // Add title
            doc.setFontSize(16)
            doc.text(`${role.toUpperCase()} MESSAGE`, 10, 20)

            // Add date
            doc.setFontSize(10)
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 30)

            // Add horizontal line
            doc.setLineWidth(0.5)
            doc.line(10, 35, 200, 35)

            // Add content
            doc.setFontSize(12)
            const splitContent = doc.splitTextToSize(content, 180)
            doc.text(splitContent, 10, 45)

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
            doc.save(`${role}-${timestamp}.pdf`)

            toast.push(
                <Notification title="Success" type="success">
                    Message downloaded as PDF.
                </Notification>
            )
        } catch (err) {
            console.error('Failed to download message as PDF:', err)

            // Fallback to text if PDF fails
            const blob = new Blob([content], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `message-${Date.now()}.txt`
            link.click()
            URL.revokeObjectURL(url)

            toast.push(
                <Notification title="Partial Success" type="warning">
                    PDF failed, downloaded as text instead.
                </Notification>
            )
        }
    }

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    // Render message content with markdown-like formatting
    const renderMessageContent = (content: string, isUser: boolean, isStreaming: boolean = false) => {
        // Pre-process content to detect raw URLs and wrap them in markdown syntax if they aren't already
        const autoLinkedContent = content.replace(
            /(?<!\]\()(?<!\()(https?:\/\/[^\s\)]+)/g,
            '[$1]($1)'
        );

        return (
            <div className={classNames(
                "prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800",
                isUser ? "prose-p:text-blue-50 prose-strong:text-white prose-headings:text-white" : "prose-p:text-gray-700 dark:prose-p:text-gray-300 font-medium"
            )}>
                <ReactMarkdown
                    components={{
                        a: ({ node, ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0055BA] dark:text-blue-400 font-black underline hover:no-underline transition-all"
                            />
                        ),
                    }}
                >
                    {autoLinkedContent}
                </ReactMarkdown>
                {/* Blinking cursor for streaming effect */}
                {isStreaming && (
                    <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-primary animate-pulse duration-75" />
                )}
            </div>
        )
    }

    // Extract code blocks from content
    const extractCodeBlocks = (content: string) => {
        const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g
        const blocks: { language: string; code: string }[] = []
        let match
        while ((match = codeBlockRegex.exec(content)) !== null) {
            blocks.push({ language: match[1] || 'code', code: match[2].trim() })
        }
        return blocks
    }


    if (isLoading) {
        return <QorebitLoading />
    }

    if (!copilot) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
                <Bot className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Copilot not found
                </h2>
                <p className="text-gray-500 mb-4">The copilot you're looking for doesn't exist.</p>
                <button
                    onClick={() => router.push('/dashboard/copilot-hub')}
                    className="text-indigo-600 hover:text-indigo-700"
                >
                    Go back to Copilot Hub
                </button>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-80px)] bg-[#f5f5f5] dark:bg-gray-950 -m-4 overflow-hidden font-sans">
            {/* Sidebar - Conversation History */}
            <div className={`${showSidebar ? 'w-80' : 'w-0'} shrink-0 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-hidden bg-white dark:bg-gray-900 shadow-xl z-20`}>
                <div className="w-80 h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-black text-gray-400">{copilot.name} History</h2>
                            <button
                                onClick={() => setShowSidebar(false)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                        <button
                            onClick={handleNewConversation}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0055BA] hover:bg-[#004299] text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 group"
                        >
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            <span className="text-[10px] font-black">New Chat</span>
                        </button>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {conversations.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <div className="w-12 h-12 mx-auto bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                                    <MessageSquare className="w-5 h-5 text-gray-300" />
                                </div>
                                <p className="text-xs font-bold text-gray-400">No History Found</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={`group flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${currentConversation?.id === conv.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 shadow-sm'
                                        : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-100 dark:hover:border-gray-700'
                                        }`}
                                    onClick={() => handleSelectConversation(conv)}
                                >
                                    <MessageSquare className={`w-4 h-4 shrink-0 transition-colors ${currentConversation?.id === conv.id ? 'text-[#0055BA]' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-bold truncate mb-0.5 ${currentConversation?.id === conv.id ? 'text-[#0055BA] dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {conv.title}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-medium truncate">
                                            {new Date(conv.updatedAt).toLocaleDateString()} • {conv.messageCount} msgs
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteConversation(conv.id)
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-300 hover:text-red-500 transition-all transform hover:scale-110"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Header */}
                <header className="shrink-0 h-[80px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between z-10 shadow-sm">
                    {/* Left Section */}
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2">
                            {!showSidebar && (
                                <button
                                    onClick={() => setShowSidebar(true)}
                                    className="p-2.5 rounded-xl text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                >
                                    <MessageSquare className="w-5 h-5" strokeWidth={2.5} />
                                </button>
                            )}
                            <button
                                onClick={() => router.push('/dashboard/copilot-hub')}
                                className="p-2.5 rounded-xl text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                            </button>
                        </div>

                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getCategoryColor(copilot.category)} flex items-center justify-center shadow-lg ring-4 ring-gray-50 dark:ring-gray-800`}>
                                <span className="text-white drop-shadow-md">
                                    {getCategoryIcon(copilot.category)}
                                </span>
                            </div>

                            <div>
                                <h1 className="text-sm font-black text-gray-900 dark:text-white">
                                    {copilot.name}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-black text-white bg-gray-900 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                        {copilot.model}
                                    </span>
                                    {currentConversation && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                            <span className="text-[10px] font-bold text-gray-500 truncate max-w-[200px]">
                                                {currentConversation.title}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleNewConversation}
                            className="p-2.5 rounded-xl text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
                            title="Reset Chat"
                        >
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" strokeWidth={2.5} />
                        </button>
                        {(() => {
                            const userRole = (session?.user as any)?.role
                            const userAuthority = (session?.user as any)?.authority || []
                            const currentUserId = (session?.user as any)?.id

                            const isPlatformSuperAdmin = userAuthority.includes('platform_super_admin') || userRole === 'platform_super_admin'
                            const isOrgSuperAdmin = userAuthority.includes('org_super_admin') || userRole === 'org_super_admin'
                            const isUserRole = userRole === 'user'
                            const isOwner = copilot?.createdBy === currentUserId

                            // Only show settings button to owners or requested roles
                            const canManage = isPlatformSuperAdmin || isOrgSuperAdmin || isUserRole || isOwner

                            if (!canManage) return null

                            return (
                                <Button
                                    variant="solid"
                                    size="sm"
                                    onClick={() => router.push(`/dashboard/copilot-hub/${copilotId}/settings`)}
                                    className="h-10 px-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 font-black text-[10px] rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ml-1 sm:ml-2"
                                >
                                    <Settings className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    <span className="hidden lg:inline">Configure Settings</span>
                                    <span className="lg:hidden sm:inline hidden">Configure</span>
                                </Button>
                            )
                        })()}
                        <Dropdown
                            placement="bottom-end"
                            renderTitle={
                                <button className="p-2.5 rounded-xl text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                                    <MoreHorizontal className="w-5 h-5" strokeWidth={2.5} />
                                </button>
                            }
                        >
                            <div className="p-1">
                                <Dropdown.Item eventKey="share" onClick={handleShareConversation} className="rounded-lg font-bold text-xs p-2.5">
                                    <Share2 className="w-4 h-4 mr-3 text-gray-400" />
                                    <span>Share Conversation</span>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="export" onClick={handleExportConversation} className="rounded-lg font-bold text-xs p-2.5">
                                    <Download className="w-4 h-4 mr-3 text-gray-400" />
                                    <span>Export to PDF</span>
                                </Dropdown.Item>
                                {currentConversation && (
                                    <>
                                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                                        <Dropdown.Item eventKey="clear" onClick={() => handleDeleteConversation(currentConversation.id)} className="rounded-lg font-bold text-xs p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                            <Trash2 className="w-4 h-4 mr-3" />
                                            <span>Delete Chat</span>
                                        </Dropdown.Item>
                                    </>
                                )}
                            </div>
                        </Dropdown>
                    </div>
                </header>

                {/* Chat Messages Area */}
                <main className="flex-1 overflow-y-auto scroll-smooth bg-[#f5f5f5] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {messages.length === 0 && !isLoading && (
                            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                <Bot className="w-16 h-16 text-gray-300 mb-4" />
                                <p className="text-sm font-black text-gray-400">Start a new conversation</p>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={message.id}
                                className={`group flex gap-5 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {/* Avatar */}
                                <div className="shrink-0 pt-2">
                                    {message.role === 'assistant' ? (
                                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getCategoryColor(copilot.category)} flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900`}>
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900">
                                            <User className="w-5 h-5 text-gray-500" />
                                        </div>
                                    )}
                                </div>

                                {/* Message Content */}
                                <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                                    {/* Name & Time */}
                                    <div className={`flex items-center gap-2 mb-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-[10px] font-black text-[#0055BA] dark:text-blue-400">
                                            {message.role === 'user' ? 'You' : copilot.name}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400">
                                            {formatTime(message.createdAt)}
                                        </span>
                                    </div>

                                    {/* Bubble */}
                                    <div
                                        className={classNames(
                                            "relative px-6 py-5 rounded-[1.5rem] transition-all duration-300",
                                            message.role === 'user'
                                                ? editingMessageId === message.id
                                                    ? 'bg-gray-50 dark:bg-gray-800/50 border-2 border-primary/20 shadow-sm'
                                                    : 'bg-[#0055BA] text-white rounded-tr-md shadow-sm'
                                                : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-tl-md border border-gray-100 dark:border-gray-800 shadow-sm'
                                        )}
                                    >

                                        {editingMessageId === message.id ? (
                                            <div className="space-y-4 min-w-[300px] sm:min-w-[400px]">
                                                <textarea
                                                    value={editingValue}
                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                    className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none min-h-[120px] placeholder-gray-400 transition-all font-medium"
                                                    autoFocus
                                                />
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => setEditingMessageId(null)}
                                                        className="px-4 py-2 text-[10px] font-black text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <Button
                                                        size="sm"
                                                        variant="solid"
                                                        onClick={handleSaveEdit}
                                                        disabled={isSending || !editingValue.trim()}
                                                        className="font-black text-[10px] h-10 px-8 rounded-xl shadow-md shadow-primary/10"
                                                    >
                                                        Save & Re-send
                                                    </Button>
                                                </div>

                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {/* Agent Reasoning Visualization */}
                                                {message.role === 'assistant' && message.agentSteps && message.agentSteps.length > 0 && (
                                                    <div className="mb-6 space-y-3">
                                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 w-fit">
                                                            <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                                            <span className="text-[10px] font-black text-gray-500">Autonomous Execution Log</span>
                                                        </div>
                                                        <div className="space-y-2.5 pl-2 border-l-2 border-primary/10">
                                                            {message.agentSteps.map((step, idx) => (
                                                                <div key={idx} className="animate-in fade-in slide-in-from-left-2 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                                                                    <div className="flex items-start gap-3">
                                                                        <div className={classNames(
                                                                            "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0",
                                                                            step.action === 'think' ? 'bg-blue-400' : 'bg-emerald-400'
                                                                        )} />
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[10px] font-black text-gray-400">
                                                                                {step.action === 'think' ? 'Reasoning' : `Action: ${step.tool_name}`}
                                                                            </span>
                                                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                                                                {step.reasoning || (step.tool_input ? `Executed task: ${JSON.stringify(step.tool_input).substring(0, 100)}...` : 'Processing step...')}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />
                                                    </div>
                                                )}

                                                <div className={`text-[15px] leading-relaxed ${message.role === 'user' ? 'text-blue-50' : ''}`}>
                                                    {renderMessageContent(
                                                        message.content.replace(/```[\s\S]*?```/g, ''),
                                                        message.role === 'user',
                                                        index === messages.length - 1 && message.role === 'assistant' && isSending
                                                    )}


                                                    {extractCodeBlocks(message.content).map((block, idx) => (
                                                        <div key={idx} className="mt-5 rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-inner">
                                                            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/80 border-b border-gray-700">
                                                                <span className="text-[10px] font-black text-gray-400">{block.language}</span>
                                                                <button
                                                                    onClick={() => navigator.clipboard.writeText(block.code)}
                                                                    className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                                                                >
                                                                    <Copy className="w-3.5 h-3.5" />
                                                                    Copy Code
                                                                </button>
                                                            </div>
                                                            <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto custom-scrollbar">
                                                                <code>{block.code}</code>
                                                            </pre>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Actions - User Edit Button */}
                                    {message.role === 'user' && !editingMessageId && (
                                        <div className="flex items-center gap-1 mt-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                            <button
                                                onClick={() => {
                                                    setEditingMessageId(message.id)
                                                    setEditingValue(message.content)
                                                }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#0055BA] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center gap-1"
                                                title="Edit Message"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                <span className="text-[9px] font-black">Edit</span>
                                            </button>
                                        </div>
                                    )}


                                    {/* Message Actions */}
                                    {message.role === 'assistant' && message.id !== 'welcome' && (
                                        <div className="flex items-center gap-1 mt-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                                            <button
                                                onClick={() => handleCopyMessage(message.id, message.content)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#0055BA] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                                title="Copy"
                                            >
                                                {copiedMessageId === message.id ? (
                                                    <Check className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDownloadMessage(message.content, message.role)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-[#0055BA] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                                title="Save PDF"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-3 bg-gray-200 dark:bg-gray-800 mx-1"></div>
                                            <button
                                                onClick={() => handleFeedback(message.id, 2)}
                                                className={`p-1.5 rounded-lg transition-all ${message.feedbackRating === 2
                                                    ? 'text-emerald-500 bg-emerald-50'
                                                    : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                                                    }`}
                                            >
                                                <ThumbsUp className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleFeedback(message.id, 1)}
                                                className={`p-1.5 rounded-lg transition-all ${message.feedbackRating === 1
                                                    ? 'text-red-500 bg-red-50'
                                                    : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                    }`}
                                            >
                                                <ThumbsDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Dynamic Typing Indicator for Agent Activity */}
                        {isTyping && (
                            <div className="flex gap-5 animate-in fade-in duration-300">
                                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getCategoryColor(copilot.category)} flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900 shrink-0`}>
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="px-6 py-5 rounded-[1.5rem] rounded-tl-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm min-w-[200px]">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                            <span className="text-[10px] font-black text-primary">Agent Operating</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                                <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-400 animate-pulse">
                                                {/* Simple text rotation would usually need a state, but we can use a CSS animation or just a generic active message */}
                                                Reasoning & planning next steps...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                </main>

                {/* Suggestions & Input Container */}
                <div className="bg-[#f5f5f5] dark:bg-gray-950 p-4 sm:p-6 pt-0">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {/* Suggestions */}
                        {(dynamicSuggestions.length > 0 || (copilot.suggestedPrompts && copilot.suggestedPrompts.length > 0)) && messages.length < 2 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-2 mb-3 px-1">
                                    <Sparkles className="w-3.5 h-3.5 text-[#0055BA]" />
                                    <span className="text-[10px] font-black text-gray-400">Suggested Prompts</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[...new Set([...dynamicSuggestions, ...(copilot.suggestedPrompts || [])])].slice(0, 4).map((prompt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSuggestedPrompt(prompt)}
                                            className="px-5 py-3.5 bg-white dark:bg-gray-900 border border-transparent hover:border-[#0055BA]/30 text-sm font-normal text-gray-600 dark:text-gray-300 hover:text-[#0055BA] rounded-xl shadow-sm hover:shadow-md transition-all text-left flex-1 min-w-[200px]"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Box */}
                        <div className="bg-white dark:bg-gray-900 p-2 rounded-[1.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-gray-800 relative z-20">
                            {attachedFiles.length > 0 && (
                                <div className="flex flex-wrap gap-2 px-3 pt-3 pb-1">
                                    {attachedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                            <Paperclip className="w-3.5 h-3.5 text-[#0055BA]" />
                                            <span className="text-xs font-bold text-[#0055BA] truncate max-w-[150px]">{file.name}</span>
                                            <button onClick={() => removeAttachedFile(index)} className="hover:text-red-500 transition-colors">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-end gap-2 p-2">
                                <div className="flex items-center gap-1 pb-1.5">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
                                        className="hidden"
                                        multiple
                                    />
                                    <button
                                        onClick={() => {
                                            if (fileInputRef.current) {
                                                fileInputRef.current.accept = "image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
                                                fileInputRef.current.click()
                                            }
                                        }}
                                        className="p-3 rounded-xl text-gray-400 hover:text-[#0055BA] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                                        title="Attach File"
                                    >
                                        <Paperclip className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (fileInputRef.current) {
                                                fileInputRef.current.accept = "image/*"
                                                fileInputRef.current.click()
                                            }
                                        }}
                                        className="p-3 rounded-xl text-gray-400 hover:text-[#0055BA] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                                        title="Upload Image"
                                    >
                                        <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>

                                <textarea
                                    ref={inputRef}
                                    placeholder={`Message ${copilot.name}...`}
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value)
                                        if (chatError) setChatError(null)
                                    }}
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                    className="flex-1 bg-transparent border-0 resize-none text-[15px] font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 py-4 max-h-[200px] leading-relaxed"
                                    style={{ minHeight: '52px' }}
                                />


                                <div className="flex items-center gap-1 pb-1.5">
                                    {isGenerating ? (
                                        <button
                                            onClick={handleStopGeneration}
                                            className="p-3 rounded-xl transition-all shadow-lg bg-red-600 hover:bg-red-700 text-white shadow-red-500/20 active:scale-95"
                                            title="Stop generating"
                                        >
                                            <Square className="w-5 h-5 fill-current" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={(!inputValue.trim() && attachedFiles.length === 0) || isSending}
                                            className={`p-3 rounded-xl transition-all shadow-lg ${(!inputValue.trim() && attachedFiles.length === 0) || isSending
                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 shadow-none cursor-not-allowed'
                                                : 'bg-[#0055BA] hover:bg-[#004299] text-white shadow-blue-500/20 active:scale-95'
                                                }`}
                                        >
                                            {isSending ? <Spinner size={20} className="text-white" /> : <Send className="w-5 h-5" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="text-center space-y-2">
                            {chatError && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full text-xs font-bold border border-red-100 dark:border-red-800">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    {chatError}
                                    <button onClick={() => setChatError(null)} className="ml-2 hover:text-red-800"><X className="w-3 h-3" /></button>
                                </div>
                            )}
                            <p className="text-[10px] font-bold text-gray-400">
                                {copilot.name} can make mistakes. Verify important info.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                isOpen={showDeleteConvDialog}
                onClose={() => {
                    setShowDeleteConvDialog(false)
                    setConvToDeleteId(null)
                }}
                width={420}
            >
                <div className="p-1">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mb-4 border border-red-100 dark:border-red-800">
                            <Trash2 className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Delete Chat?</h3>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed px-4">
                            This action is irreversible. The conversation history will be permanently removed from the database.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setShowDeleteConvDialog(false)
                                setConvToDeleteId(null)
                            }}
                            className="h-12 rounded-xl font-black text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDeleteConversation}
                            className="h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 font-black text-xs transition-transform active:scale-95"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Dialog>

            {/* Insufficient Credits Dialog */}
            <Dialog
                isOpen={showInsufficientCreditsDialog}
                onClose={() => setShowInsufficientCreditsDialog(false)}
                width={500}
                className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            >
                <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-800/30">
                            <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                Insufficient Credits
                            </h2>
                            <p className="text-[10px] text-gray-400 font-black mt-1">
                                {isOrgMember ? `Contact your administrator to continue using ${copilot?.name}` : `Top up to continue using ${copilot?.name}`}
                            </p>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-4">
                        <div className="p-5 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800/20">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                                {insufficientCreditsError?.message || 'You don\'t have enough credits to complete this request.'}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-[10px] font-black text-gray-400 mb-2">
                                    Current Balance
                                </div>
                                <div className="text-2xl font-black text-gray-900 dark:text-white">
                                    ₦{(insufficientCreditsError?.currentBalance || 0).toFixed(2)}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-[10px] font-black text-gray-400 mb-2">
                                    Target Model
                                </div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                    {insufficientCreditsError?.model || copilot?.model}
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/20">
                            <p className="text-xs font-medium text-blue-900 dark:text-blue-100 italic">
                                <span className="font-black not-italic">💡 Tip:</span> Paid models require a minimum balance of ₦0.01 to process requests.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        {isOrgMember ? (
                            <Button
                                variant="solid"
                                onClick={() => setShowInsufficientCreditsDialog(false)}
                                className="h-14 px-12 bg-[#0055BA] hover:bg-[#004299] text-white font-black text-[11px] rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                Got it
                            </Button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowInsufficientCreditsDialog(false)}
                                    className="h-12 px-6 font-black text-[10px] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Later
                                </button>
                                <Button
                                    variant="solid"
                                    onClick={() => {
                                        setShowInsufficientCreditsDialog(false)
                                        router.push('/dashboard/billing')
                                    }}
                                    className="h-14 px-8 bg-[#0055BA] hover:bg-[#004299] text-white font-black text-[11px] rounded-2xl shadow-xl shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    Top Up Wallet
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
