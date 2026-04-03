import { useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { setIsTyping, truncateConversation } from '@/store/slices/chat'
import { sendChatMessage, createChatConversation, updateChatMessage } from '@/store/slices/chat/chatThunk'

export const useChatInteraction = (selectedModelId?: string) => {
    const dispatch = useAppDispatch()
    const selectedConversationId = useAppSelector(
        (state) => state.chat?.selectedConversation
    )
    
    // Track the active thunk promise to allow cancellation
    const activeRequestRef = useRef<any>(null)

    const handleStop = () => {
        if (activeRequestRef.current) {
            console.log('🛑 Aborting active chat request')
            activeRequestRef.current.abort()
            activeRequestRef.current = null
            dispatch(setIsTyping(false))
        }
    }

    const sendMessage = async (chatId: string, message: string, model?: string) => {
        try {
            const promise = dispatch(
                sendChatMessage({
                    chatId,
                    message,
                    model,
                })
            )
            activeRequestRef.current = promise
            await promise.unwrap()
        } catch (error: any) {
            // Gracefully handle abort/cancel errors
            if (
                error?.name === 'AbortError' || 
                error?.name === 'CanceledError' || 
                error?.message === 'canceled' ||
                error?.code === 'ERR_CANCELED'
            ) {
                console.log('💡 Chat request was intentionally aborted')
            } else {
                console.error('Failed to send message:', error)
            }
        } finally {
            activeRequestRef.current = null
            dispatch(setIsTyping(false))
        }
    }

    const createConversation = async (message: string, model?: string, title?: string) => {
        try {
            const promise = dispatch(
                createChatConversation({
                    message,
                    title,
                    model,
                })
            )
            activeRequestRef.current = promise
            await promise.unwrap()
        } catch (error: any) {
            // Gracefully handle abort/cancel errors
            if (
                error?.name === 'AbortError' || 
                error?.name === 'CanceledError' || 
                error?.message === 'canceled' ||
                error?.code === 'ERR_CANCELED'
            ) {
                console.log('💡 Conversation creation was intentionally aborted')
            } else {
                console.error('Failed to create conversation:', error)
            }
        } finally {
            activeRequestRef.current = null
            dispatch(setIsTyping(false))
        }
    }

    const handleUpdateMessage = async (messageId: string, newMessage: string) => {
        if (!selectedConversationId || !newMessage.trim()) return

        try {
            dispatch(setIsTyping(true))
            // Pre-emptively truncate in state for better UX
            dispatch(truncateConversation({ chatId: selectedConversationId, messageId }))
            
            const promise = dispatch(
                updateChatMessage({
                    chatId: selectedConversationId,
                    messageId,
                    message: newMessage,
                    model: selectedModelId,
                })
            )
            activeRequestRef.current = promise
            await promise.unwrap()
        } catch (error: any) {
            if (
                error?.name === 'AbortError' || 
                error?.name === 'CanceledError' || 
                error?.message === 'canceled' ||
                error?.code === 'ERR_CANCELED'
            ) {
                console.log('💡 Message update was intentionally aborted')
            } else {
                console.error('Failed to update message:', error)
            }
        } finally {
            activeRequestRef.current = null
            dispatch(setIsTyping(false))
        }
    }

    const handleSend = async (prompt: string) => {
        if (!prompt.trim()) return

        dispatch(setIsTyping(true))

        if (selectedConversationId) {
            await sendMessage(selectedConversationId, prompt, selectedModelId)
        } else {
            await createConversation(prompt, selectedModelId)
        }
    }

    return { handleSend, handleStop, handleUpdateMessage }
}
