// src/app/(protected-pages)/chat/types.ts

// Frontend-specific conversation type for ChatBox component
export interface Conversation {
    id: string
    sender: {
        id: string
        name: string
        avatarImageUrl?: string
    }
    content?: string
    timestamp?: number // Unix timestamp in milliseconds
    type: 'regular' | 'reply' | 'deleted' | 'divider'
    attachments?: Array<{
        type: 'image' | 'video' | 'audio' | 'misc'
        source: File
        mediaUrl: string
    }>
    isMyMessage?: boolean
    fresh?: boolean
}

// Backend API response types
export interface AIChatMessagePublic {
    id: string
    chat_id: string
    role: 'user' | 'assistant'
    content: string
    tokens_used: number | null
    model: string | null
    created_at: string
}

export interface AIChatPublic {
    id: string
    user_id: string
    title: string
    created_at: string
    updated_at: string
    messages: AIChatMessagePublic[]
}

export interface AIChatListPublic {
    id: string
    user_id: string
    title: string
    created_at: string
    updated_at: string
    last_message_preview: string | null
}

export interface AIChatsPublic {
    data: AIChatListPublic[]
    count: number
}

export interface AIChatMessageResponse {
    user_message: AIChatMessagePublic
    assistant_message: AIChatMessagePublic
}

// Frontend state types (mapped from backend)
export interface ChatHistory {
    id: string
    title: string
    conversation?: Conversation[]
    lastConversation?: string
    createdTime?: number
    updatedTime?: number
    enable?: boolean
}

export type ChatHistories = ChatHistory[]

export interface AIModel {
    id: string
    name: string
    provider: string
    description: string
    pricing: {
        input: number
        output: number
    }
    context_length: number
    supports_streaming: boolean
}
