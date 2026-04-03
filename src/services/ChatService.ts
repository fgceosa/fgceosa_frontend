// src/services/chatService.ts
import ApiService from './ApiService'
import {
    AIChatPublic,
    AIChatsPublic,
    AIChatMessageResponse,
} from '@/app/(protected-pages)/dashboard/chat/types'

/**
 * Create a new empty AI chat conversation
 */
export async function apiCreateChat(
    data?: { title?: string }
) {
    return ApiService.fetchDataWithAxios<AIChatPublic>({
        url: '/ai-chat',
        method: 'post',
        data: data || {},
    })
}

/**
 * Fetch all user chat histories
 */
export async function apiFetchChatHistories(
    params?: { skip?: number; limit?: number }
) {
    return ApiService.fetchDataWithAxios<AIChatsPublic>({
        url: '/ai-chat',
        method: 'get',
        params,
    })
}

/**
 * Search chats by title or message content
 */
export async function apiSearchChats(
    query: string,
    params?: { skip?: number; limit?: number }
) {
    return ApiService.fetchDataWithAxios<AIChatsPublic>({
        url: '/ai-chat/search',
        method: 'get',
        params: { q: query, ...params },
    })
}

/**
 * Fetch a single chat by its ID with all messages
 */
export async function apiFetchChatById(chatId: string) {
    return ApiService.fetchDataWithAxios<AIChatPublic>({
        url: `/ai-chat/${chatId}`,
        method: 'get',
    })
}

/**
 * Send a message to an AI chat and get a response
 */
export async function apiSendMessage(
    data: { chatId: string; message: string; model?: string },
    signal?: AbortSignal
) {
    // Prepare the request data
    const requestData: { message: string; model?: string } = {
        message: data.message,
    }

    // Only include model if provided (let backend use its default)
    if (data.model) {
        requestData.model = data.model
        console.log('🤖 Sending model to backend:', data.model)
    } else {
        console.log('⚠️  No model specified, backend will use default')
    }

    console.log('📤 Chat request:', {
        chatId: data.chatId,
        messageLength: data.message.length,
        model: data.model || 'backend-default',
    })

    return ApiService.fetchDataWithAxios<AIChatMessageResponse>({
        url: `/ai-chat/${data.chatId}/messages`,
        method: 'post',
        data: requestData,
        signal,
    })
}

/**
 * Rename a chat conversation
 */
export async function apiRenameChat(
    data: { chatId: string; title: string }
) {
    return ApiService.fetchDataWithAxios<AIChatPublic>({
        url: `/ai-chat/${data.chatId}`,
        method: 'patch',
        data: { title: data.title },
    })
}

/**
 * Delete a chat conversation and all its messages
 */
export async function apiDeleteChat(chatId: string) {
    return ApiService.fetchDataWithAxios<void>({
        url: `/ai-chat/${chatId}`,
        method: 'delete',
    })
}

/**
 * Update a previous message, truncate the chat from that point, and get a new AI response
 */
export async function apiUpdateMessage(
    chatId: string,
    messageId: string,
    data: { message: string; model?: string },
    signal?: AbortSignal
) {
    return ApiService.fetchDataWithAxios<AIChatMessageResponse>({
        url: `/ai-chat/${chatId}/messages/${messageId}`,
        method: 'put',
        data,
        signal,
    })
}
