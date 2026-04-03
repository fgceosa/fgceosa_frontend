// src/services/CopilotService.ts
/**
 * Copilot Hub API Service
 * Handles all API interactions for copilots, conversations, messages, and documents
 *
 * Note: Backend expects snake_case for request bodies but returns camelCase via field aliases
 */
import ApiService from './ApiService'
import type {
    Copilot,
    CopilotConversation,
    CopilotMessage,
    CopilotDocument,
    CopilotsResponse,
    ConversationsResponse,
    MessagesResponse,
    DocumentsResponse,
    CreateCopilotPayload,
    UpdateCopilotPayload,
    SendMessageRequest,
    SendMessageResponse,
    DocumentSearchRequest,
    DocumentSearchResponse,
    DocumentUploadResponse,
    DocumentProcessingStatus,
} from '@/app/(protected-pages)/dashboard/copilot-hub/types'

// ==================== Copilot Management Operations ====================

/**
 * Create a new copilot
 * Backend expects snake_case fields
 */
export async function apiCreateCopilot(data: CreateCopilotPayload) {
    // Convert camelCase to snake_case for backend
    const payload = {
        name: data.name,
        description: data.description || '',
        category: data.category || 'general',
        domain: data.domain || null,
        visibility: data.visibility || 'private',
        model: data.model || 'gpt-4o',
        system_prompt: data.systemPrompt || '',
        welcome_message: data.welcomeMessage || null,
        suggested_prompts: data.suggestedPrompts || [],
        capabilities: data.capabilities || [],
        temperature: data.temperature ?? 0.7,
        max_tokens: data.maxTokens ?? 4096,
        tags: data.tags || [],
    }

    return ApiService.fetchDataWithAxios<Copilot>({
        url: 'copilots',
        method: 'post',
        data: payload,
    })
}

/**
 * List all copilots (with filters)
 */
export async function apiListCopilots(params?: {
    skip?: number
    limit?: number
    category?: string
    visibility?: string
    search?: string
    workspaceId?: string
    isFeatured?: boolean
}) {
    const queryParams: Record<string, any> = {}
    if (params?.skip !== undefined) queryParams.skip = params.skip
    if (params?.limit !== undefined) queryParams.limit = params.limit
    if (params?.category) queryParams.category = params.category
    if (params?.visibility) queryParams.visibility = params.visibility
    if (params?.search) queryParams.search = params.search
    if (params?.workspaceId) queryParams.workspace_id = params.workspaceId
    if (params?.isFeatured !== undefined) queryParams.is_featured = params.isFeatured

    return ApiService.fetchDataWithAxios<CopilotsResponse>({
        url: 'copilots',
        method: 'get',
        params: queryParams,
    })
}

/**
 * List ALL copilots (Admin only)
 */
export async function apiAdminListCopilots(params?: {
    skip?: number
    limit?: number
    category?: string
    visibility?: string
    search?: string
    workspaceId?: string
    isFeatured?: boolean
    status?: string
}) {
    const queryParams: Record<string, any> = {}
    if (params?.skip !== undefined) queryParams.skip = params.skip
    if (params?.limit !== undefined) queryParams.limit = params.limit
    if (params?.category) queryParams.category = params.category
    if (params?.visibility) queryParams.visibility = params.visibility
    if (params?.search) queryParams.search = params.search
    if (params?.workspaceId) queryParams.workspace_id = params.workspaceId
    if (params?.isFeatured !== undefined) queryParams.is_featured = params.isFeatured
    if (params?.status) queryParams.status = params.status

    return ApiService.fetchDataWithAxios<CopilotsResponse>({
        url: 'copilots/admin/list',
        method: 'get',
        params: queryParams,
    })
}

/**
 * List featured copilots
 */
export async function apiListFeaturedCopilots(params?: {
    skip?: number
    limit?: number
}) {
    return ApiService.fetchDataWithAxios<CopilotsResponse>({
        url: 'copilots/featured',
        method: 'get',
        params,
    })
}

/**
 * List user's own copilots
 */
export async function apiListMyCopilots(params?: {
    skip?: number
    limit?: number
}) {
    return ApiService.fetchDataWithAxios<CopilotsResponse>({
        url: 'copilots/my',
        method: 'get',
        params,
    })
}

/**
 * Get a single copilot by ID
 */
export async function apiGetCopilot(copilotId: string) {
    return ApiService.fetchDataWithAxios<Copilot>({
        url: `copilots/${copilotId}`,
        method: 'get',
    })
}

/**
 * Update a copilot
 * Backend expects snake_case fields
 */
export async function apiUpdateCopilot(
    copilotId: string,
    data: UpdateCopilotPayload
) {
    // Convert camelCase to snake_case for backend - only include defined fields
    const payload: Record<string, unknown> = {}

    if (data.name !== undefined) payload.name = data.name
    if (data.description !== undefined) payload.description = data.description
    if (data.category !== undefined) payload.category = data.category
    if (data.visibility !== undefined) payload.visibility = data.visibility
    if (data.domain !== undefined) payload.domain = data.domain
    if (data.status !== undefined) payload.status = data.status
    if (data.model !== undefined) payload.model = data.model
    if (data.systemPrompt !== undefined) payload.system_prompt = data.systemPrompt
    if (data.welcomeMessage !== undefined) payload.welcome_message = data.welcomeMessage
    if (data.suggestedPrompts !== undefined) payload.suggested_prompts = data.suggestedPrompts
    if (data.capabilities !== undefined) payload.capabilities = data.capabilities
    if (data.temperature !== undefined) payload.temperature = data.temperature
    if (data.maxTokens !== undefined) payload.max_tokens = data.maxTokens
    if (data.topP !== undefined) payload.top_p = data.topP
    if (data.frequencyPenalty !== undefined) payload.frequency_penalty = data.frequencyPenalty
    if (data.presencePenalty !== undefined) payload.presence_penalty = data.presencePenalty
    if (data.stopSequences !== undefined) payload.stop_sequences = data.stopSequences
    if (data.tags !== undefined) payload.tags = data.tags
    if (data.allowFileUploads !== undefined) payload.allow_file_uploads = data.allowFileUploads
    if (data.allowWebSearch !== undefined) payload.allow_web_search = data.allowWebSearch
    if (data.allowCodeExecution !== undefined) payload.allow_code_execution = data.allowCodeExecution
    if (data.memoryEnabled !== undefined) payload.memory_enabled = data.memoryEnabled
    if (data.memoryWindowSize !== undefined) payload.memory_window_size = data.memoryWindowSize
    if (data.avatar !== undefined) payload.avatar = data.avatar
    if (data.isFeatured !== undefined) payload.is_featured = data.isFeatured

    return ApiService.fetchDataWithAxios<Copilot>({
        url: `copilots/${copilotId}`,
        method: 'patch',
        data: payload,
    })
}

/**
 * Delete a copilot
 */
export async function apiDeleteCopilot(copilotId: string) {
    return ApiService.fetchDataWithAxios<void>({
        url: `copilots/${copilotId}`,
        method: 'delete',
    })
}

/**
 * Duplicate a copilot
 * Creates a copy of an existing copilot with a new name
 */
export async function apiDuplicateCopilot(copilotId: string) {
    return ApiService.fetchDataWithAxios<Copilot>({
        url: `copilots/${copilotId}/duplicate`,
        method: 'post',
    })
}

/**
 * Share a copilot with other users
 * Backend expects: emails, message (optional)
 */
export async function apiShareCopilot(
    copilotId: string,
    data: { emails: string[]; message?: string }
) {
    return ApiService.fetchDataWithAxios<{ status: string; message: string }>({
        url: `copilots/${copilotId}/share`,
        method: 'post',
        data: {
            emails: data.emails,
            message: data.message || '',
        },
    })
}

/**
 * Toggle copilot visibility (public/private/workspace)
 */
export async function apiToggleCopilotVisibility(
    copilotId: string,
    visibility: 'public' | 'private' | 'workspace'
) {
    return ApiService.fetchDataWithAxios<Copilot>({
        url: `copilots/${copilotId}`,
        method: 'patch',
        data: {
            visibility,
        },
    })
}

/**
 * Generate dynamic suggested prompts
 */
export async function apiGenerateSuggestions(copilotId: string) {
    return ApiService.fetchDataWithAxios<{ suggestions: string[]; source: string }>({
        url: `copilots/${copilotId}/generate-suggestions`,
        method: 'get',
    })
}


/**
 * Assign a copilot to one or more workspaces
 */
export async function apiAssignCopilotToWorkspaces(
    copilotId: string,
    workspaceIds: string[]
) {
    return ApiService.fetchDataWithAxios<Copilot>({
        url: `copilots/${copilotId}/workspaces`,
        method: 'put',
        data: {
            workspace_ids: workspaceIds,
        },
    })
}

// ==================== Conversation Endpoints ====================

/**
 * Create a new conversation with a copilot
 * Backend expects: copilot_id, title, context
 */
export async function apiCreateConversation(
    copilotId: string,
    data?: { title?: string; context?: Record<string, unknown> }
) {
    const payload = {
        copilot_id: copilotId,
        title: data?.title || 'New Conversation',
        context: data?.context || {},
    }

    return ApiService.fetchDataWithAxios<CopilotConversation>({
        url: `copilots/${copilotId}/conversations`,
        method: 'post',
        data: payload,
    })
}

/**
 * List conversations for a copilot
 */
export async function apiListConversations(
    copilotId: string,
    params?: { skip?: number; limit?: number; isActive?: boolean }
) {
    return ApiService.fetchDataWithAxios<ConversationsResponse>({
        url: `copilots/${copilotId}/conversations`,
        method: 'get',
        params: {
            skip: params?.skip,
            limit: params?.limit,
            is_active: params?.isActive,
        },
    })
}

/**
 * Get a single conversation by ID
 */
export async function apiGetConversation(conversationId: string) {
    return ApiService.fetchDataWithAxios<CopilotConversation>({
        url: `copilots/conversations/${conversationId}`,
        method: 'get',
    })
}

/**
 * Update a conversation
 * Backend expects snake_case fields
 */
export async function apiUpdateConversation(
    conversationId: string,
    data: { title?: string; isActive?: boolean; context?: Record<string, unknown>; memorySummary?: string }
) {
    const payload: Record<string, unknown> = {}

    if (data.title !== undefined) payload.title = data.title
    if (data.isActive !== undefined) payload.is_active = data.isActive
    if (data.context !== undefined) payload.context = data.context
    if (data.memorySummary !== undefined) payload.memory_summary = data.memorySummary

    return ApiService.fetchDataWithAxios<CopilotConversation>({
        url: `copilots/conversations/${conversationId}`,
        method: 'patch',
        data: payload,
    })
}

/**
 * Delete a conversation
 */
export async function apiDeleteConversation(conversationId: string) {
    return ApiService.fetchDataWithAxios<void>({
        url: `copilots/conversations/${conversationId}`,
        method: 'delete',
    })
}

// ==================== Message Endpoints ====================

/**
 * List messages in a conversation
 */
export async function apiListMessages(
    conversationId: string,
    params?: { skip?: number; limit?: number }
) {
    return ApiService.fetchDataWithAxios<MessagesResponse>({
        url: `copilots/conversations/${conversationId}/messages`,
        method: 'get',
        params,
    })
}

/**
 * Send a message to a copilot and get a response
 */
export async function apiSendCopilotMessage(
    copilotId: string,
    data: SendMessageRequest,
    signal?: AbortSignal
) {
    return ApiService.fetchDataWithAxios<SendMessageResponse>({
        url: `copilots/${copilotId}/chat`,
        method: 'post',
        data: {
            conversation_id: data.conversationId,
            content: data.content,
            attachments: data.attachments || [],
            stream: data.stream ?? false,
            context: data.context || {},
            workspace_id: data.workspaceId,
            admin_preview: data.adminPreview ?? false,
        },

        signal,
    })
}

/**
 * Submit feedback for a message
 */
export async function apiSubmitMessageFeedback(
    conversationId: string,
    messageId: string,
    data: { rating: number; comment?: string }
) {
    return ApiService.fetchDataWithAxios<{ status: string; message: string }>({
        url: `copilots/conversations/${conversationId}/messages/${messageId}/feedback`,
        method: 'post',
        data,
    })
}

/**
 * Update message content
 */
export async function apiUpdateMessage(
    conversationId: string,
    messageId: string,
    content: string
) {
    return ApiService.fetchDataWithAxios<CopilotMessage>({
        url: `copilots/conversations/${conversationId}/messages/${messageId}`,
        method: 'patch',
        data: { content },
    })
}

/**
 * Delete messages after a specific message
 */
export async function apiDeleteMessagesAfter(
    conversationId: string,
    messageId: string
) {
    return ApiService.fetchDataWithAxios<{ status: string; message: string }>({
        url: `copilots/conversations/${conversationId}/messages/${messageId}/after`,
        method: 'delete',
    })
}

// ==================== Document Endpoints ====================


/**
 * Upload a document to a copilot's knowledge base
 */
export async function apiUploadDocument(
    copilotId: string,
    file: File,
    data?: { title?: string; description?: string }
) {
    const formData = new FormData()
    formData.append('file', file)
    if (data?.title) formData.append('title', data.title)
    if (data?.description) formData.append('description', data.description)

    return ApiService.fetchDataWithAxios<DocumentUploadResponse>({
        url: `copilots/${copilotId}/documents/upload`,
        method: 'post',
        data: formData as any,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

/**
 * List documents in a copilot's knowledge base
 */
export async function apiListDocuments(
    copilotId: string,
    params?: { skip?: number; limit?: number; status?: string }
) {
    return ApiService.fetchDataWithAxios<DocumentsResponse>({
        url: `copilots/${copilotId}/documents`,
        method: 'get',
        params,
    })
}

/**
 * Get a single document by ID
 */
export async function apiGetDocument(copilotId: string, documentId: string) {
    return ApiService.fetchDataWithAxios<CopilotDocument>({
        url: `copilots/${copilotId}/documents/${documentId}`,
        method: 'get',
    })
}

/**
 * Get document processing status
 */
export async function apiGetDocumentStatus(
    copilotId: string,
    documentId: string
) {
    return ApiService.fetchDataWithAxios<DocumentProcessingStatus>({
        url: `copilots/${copilotId}/documents/${documentId}/status`,
        method: 'get',
    })
}

/**
 * Update document metadata
 * Backend expects: title, description, metadata
 */
export async function apiUpdateDocument(
    copilotId: string,
    documentId: string,
    data: { title?: string; description?: string; metadata?: Record<string, unknown> }
) {
    const payload: Record<string, unknown> = {}

    if (data.title !== undefined) payload.title = data.title
    if (data.description !== undefined) payload.description = data.description
    if (data.metadata !== undefined) payload.metadata = data.metadata

    return ApiService.fetchDataWithAxios<CopilotDocument>({
        url: `/copilots/${copilotId}/documents/${documentId}`,
        method: 'patch',
        data: payload,
    })
}

/**
 * Delete a document
 */
export async function apiDeleteDocument(copilotId: string, documentId: string) {
    return ApiService.fetchDataWithAxios<void>({
        url: `/copilots/${copilotId}/documents/${documentId}`,
        method: 'delete',
    })
}

/**
 * Search documents using semantic search (RAG)
 */
export async function apiSearchDocuments(
    copilotId: string,
    data: DocumentSearchRequest
) {
    return ApiService.fetchDataWithAxios<DocumentSearchResponse>({
        url: `copilots/${copilotId}/documents/search`,
        method: 'post',
        data: {
            query: data.query,
            document_ids: data.documentIds,
            top_k: data.topK ?? 5,
            similarity_threshold: data.similarityThreshold ?? 0.7,
            include_metadata: data.includeMetadata ?? true,
        },
    })
}

// ==================== Analytics & Activity Endpoints ====================

/**
 * Get analytics data for a copilot
 */
export async function apiGetCopilotAnalytics(copilotId: string) {
    return ApiService.fetchDataWithAxios<{
        totalChats: number
        successRate: number
        avgResponseTime: number
        totalTokens: number
        totalCost: number
    }>({
        url: `copilots/${copilotId}/analytics`,
        method: 'get',
    })
}

/**
 * Get recent activity for a copilot
 */
export async function apiGetCopilotActivity(
    copilotId: string,
    params?: { skip?: number; limit?: number }
) {
    return ApiService.fetchDataWithAxios<{
        activities: Array<{
            id: string
            activityType: string
            activityStatus: string
            title: string
            description?: string
            source?: string
            uniqueId?: string
            metadata: Record<string, any>
            createdAt: string
        }>
        total: number
    }>({
        url: `copilots/${copilotId}/activity`,
        method: 'get',
        params,
    })
}
