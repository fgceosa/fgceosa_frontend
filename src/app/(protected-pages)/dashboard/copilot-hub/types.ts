// Copilot Hub Types - Aligned with Backend API Schemas

// ==================== Core Types ====================

export interface Copilot {
    id: string
    name: string
    description: string
    avatar?: string | null
    category: CopilotCategory
    domain?: string | null
    status: CopilotStatus
    visibility: CopilotVisibility
    model: string
    temperature: number
    maxTokens: number
    systemPrompt: string
    welcomeMessage?: string | null
    suggestedPrompts: string[]
    capabilities: CopilotCapability[]
    tags: string[]
    createdBy: string
    createdByName?: string | null
    created_by_name?: string | null
    createdByUsername?: string | null
    created_by_username?: string | null
    workspaceId?: string | null
    assignedWorkspacesIds?: string[]
    organizationId?: string | null
    usageCount: number
    rating?: number | null
    isFeatured: boolean
    isOfficial: boolean
    allowedIntegrations?: string[]
    createdAt: string
    updatedAt: string
}

export type CopilotCategory =
    | 'coding'
    | 'writing'
    | 'research'
    | 'data-analysis'
    | 'customer-support'
    | 'sales'
    | 'legal'
    | 'hr'
    | 'finance'
    | 'operations'
    | 'logistics'
    | 'general'
    | 'custom'

export type CopilotStatus = 'active' | 'draft' | 'inactive' | 'disabled'

export type CopilotVisibility = 'public' | 'private' | 'workspace'

export type CopilotCapability =
    | 'web-search'
    | 'code-execution'
    | 'file-upload'
    | 'image-generation'
    | 'voice-input'
    | 'api-integration'
    | 'memory'
    | 'function-calling'
    | 'vision'

// ==================== Conversation Types ====================


export interface CopilotConversation {
    id: string
    copilotId: string
    userId: string
    title: string
    isActive: boolean
    context: Record<string, unknown>
    memorySummary?: string | null
    messageCount: number
    totalTokensUsed: number
    totalCost: string | number
    createdAt: string
    updatedAt: string
    lastMessageAt?: string | null
}

export interface CopilotMessage {
    id: string
    conversationId: string
    role: 'user' | 'assistant' | 'system' | 'tool'
    content: string
    toolCalls?: Record<string, unknown>[] | null
    toolCallId?: string | null
    attachments: CopilotAttachment[]
    metadata: Record<string, unknown>
    modelUsed?: string | null
    tokensUsed?: number | null
    cost?: string | number | null
    responseTimeMs?: number | null
    feedbackRating?: number | null
    feedbackComment?: string | null
    agentSteps?: any[] | null
    createdAt: string
}

export interface CopilotAttachment {
    id: string
    name: string
    type: string
    url: string
    size: number
}

// ==================== Document Types ====================

export interface CopilotDocument {
    id: string
    copilotId: string
    uploadedBy: string
    filename: string
    originalFilename: string
    fileType: string
    fileSize: number
    fileUrl: string
    status: DocumentStatus
    errorMessage?: string | null
    title?: string | null
    description?: string | null
    metadata: Record<string, unknown>
    totalChunks: number
    totalTokens: number
    processingStartedAt?: string | null
    processingCompletedAt?: string | null
    createdAt: string
    updatedAt: string
}

export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface DocumentChunk {
    id: string
    documentId: string
    chunkIndex: number
    content: string
    startChar?: number | null
    endChar?: number | null
    pageNumber?: number | null
    section?: string | null
    metadata: Record<string, unknown>
    tokenCount: number
    createdAt: string
}

// ==================== Integration Types ====================

export interface CopilotIntegration {
    id: string
    name: string
    type: 'slack' | 'discord' | 'teams' | 'api' | 'webhook'
    config: Record<string, unknown>
    isActive: boolean
}

// ==================== Settings Types ====================

export interface CopilotSettings {
    id: string
    copilotId: string
    model: string
    temperature: number
    maxTokens: number
    topP: number
    frequencyPenalty: number
    presencePenalty: number
    stopSequences: string[]
    systemPrompt: string
    welcomeMessage: string
    suggestedPrompts: string[]
    capabilities: CopilotCapability[]
    allowFileUploads: boolean
    allowWebSearch: boolean
    allowCodeExecution: boolean
    memoryEnabled: boolean
    memoryWindowSize: number
}

// ==================== Request Payloads ====================

export interface CreateCopilotPayload {
    name: string
    description?: string
    category?: CopilotCategory
    domain?: string
    visibility?: CopilotVisibility
    model?: string
    systemPrompt?: string
    welcomeMessage?: string
    suggestedPrompts?: string[]
    capabilities?: CopilotCapability[]
    temperature?: number
    maxTokens?: number
    tags?: string[]
}

export interface UpdateCopilotPayload {
    name?: string
    description?: string
    category?: CopilotCategory
    visibility?: CopilotVisibility
    domain?: string
    status?: CopilotStatus
    model?: string
    systemPrompt?: string
    welcomeMessage?: string
    suggestedPrompts?: string[]
    capabilities?: CopilotCapability[]
    temperature?: number
    maxTokens?: number
    topP?: number
    frequencyPenalty?: number
    presencePenalty?: number
    stopSequences?: string[]
    tags?: string[]
    allowFileUploads?: boolean
    allowWebSearch?: boolean
    allowCodeExecution?: boolean
    memoryEnabled?: boolean
    memoryWindowSize?: number
    avatar?: string
    isFeatured?: boolean
}

export interface SendMessageRequest {
    conversationId?: string | null
    content: string
    attachments?: CopilotAttachment[]
    stream?: boolean
    context?: Record<string, unknown>
    workspaceId?: string | null
    adminPreview?: boolean
}


export interface SendMessageResponse {
    conversationId: string
    userId?: string
    messageId: string
    responseId: string
    content: string
    toolCalls?: Record<string, unknown>[] | null
    modelUsed: string
    tokensUsed: number
    cost: string | number
    responseTimeMs: number
    createdAt: string
}

// ==================== Document Request/Response ====================

export interface DocumentSearchRequest {
    query: string
    documentIds?: string[]
    topK?: number
    similarityThreshold?: number
    includeMetadata?: boolean
}

export interface DocumentSearchResult {
    chunkId: string
    documentId: string
    documentTitle?: string | null
    content: string
    similarityScore: number
    pageNumber?: number | null
    section?: string | null
    metadata: Record<string, unknown>
}

export interface DocumentSearchResponse {
    results: DocumentSearchResult[]
    query: string
    totalResults: number
    searchTimeMs: number
}

export interface DocumentUploadResponse {
    id: string
    filename: string
    status: string
    message: string
}

export interface DocumentProcessingStatus {
    id: string
    status: DocumentStatus
    progress: number
    totalChunks: number
    processedChunks: number
    errorMessage?: string | null
}

// ==================== List Responses ====================

export interface CopilotsResponse {
    copilots: Copilot[]
    total: number
}

export interface ConversationsResponse {
    conversations: CopilotConversation[]
    total: number
}

export interface MessagesResponse {
    messages: CopilotMessage[]
    total: number
}

export interface DocumentsResponse {
    documents: CopilotDocument[]
    total: number
}

// ==================== Filter Types ====================

export interface CopilotFilters {
    category?: CopilotCategory
    status?: CopilotStatus
    visibility?: CopilotVisibility
    search?: string
    tags?: string[]
    isFeatured?: boolean
    isOfficial?: boolean
    workspaceId?: string
}

// ==================== Streaming Types ====================

export interface StreamChunk {
    type: 'content' | 'tool_call' | 'done' | 'error'
    content?: string | null
    toolCall?: Record<string, unknown> | null
    messageId?: string | null
    conversationId?: string | null
    error?: string | null
}

// ==================== Constants ====================

export const COPILOT_CATEGORIES: { value: CopilotCategory; label: string; icon: string }[] = [
    { value: 'finance', label: 'Finance & Accounting', icon: 'credit-card' },
    { value: 'legal', label: 'Legal & Compliance', icon: 'scale' },
    { value: 'hr', label: 'HR & Payroll', icon: 'users' },
    { value: 'sales', label: 'Sales & CRM', icon: 'briefcase' },
    { value: 'operations', label: 'Operations & Logistics', icon: 'clock' },
    { value: 'customer-support', label: 'Customer Support', icon: 'headset' },
    { value: 'data-analysis', label: 'Data Analysis', icon: 'chart' },
    { value: 'coding', label: 'Coding & Dev', icon: 'code' },
    { value: 'writing', label: 'Content Writing', icon: 'pen' },
    { value: 'research', label: 'Market Research', icon: 'search' },
    { value: 'general', label: 'General Assistant', icon: 'sparkles' },
    { value: 'custom', label: 'Custom Copilot', icon: 'settings' },
]

export const COPILOT_MODELS = [
    {
        value: 'openai/gpt-4o',
        label: 'OpenAI',
        company: 'OpenAI',
        description: 'GPT-4o - High intelligence & speed',
        color: '#74aa9c'
    },
    {
        value: 'anthropic/claude-3-5-sonnet',
        label: 'Anthropic',
        company: 'Anthropic',
        description: 'Claude 3.5 Sonnet - Superior reasoning',
        color: '#d97757'
    },
    {
        value: 'google/gemini-pro-1.5',
        label: 'Google',
        company: 'Google',
        description: 'Gemini 1.5 Pro - Massive context window',
        color: '#4285f4'
    },
    {
        value: 'mistral/mistral-large',
        label: 'Mistral AI',
        company: 'Mistral',
        description: 'Mistral Large 2 - Open & powerful',
        color: '#f15a24'
    },
]

export const COPILOT_CAPABILITIES: { value: CopilotCapability; label: string; description: string }[] = [
    { value: 'web-search', label: 'Web Search', description: 'Search the internet for information' },
    { value: 'code-execution', label: 'Code Execution', description: 'Execute code snippets' },
    { value: 'file-upload', label: 'File Upload', description: 'Accept and process file uploads' },
    { value: 'image-generation', label: 'Image Generation', description: 'Generate images from text' },
    { value: 'voice-input', label: 'Voice Input', description: 'Accept voice input' },
    { value: 'api-integration', label: 'API Integration', description: 'Connect to external APIs' },
    { value: 'memory', label: 'Memory', description: 'Remember conversation context' },
    { value: 'function-calling', label: 'Function Calling', description: 'Call custom functions' },
    { value: 'vision', label: 'Vision', description: 'Analyze and understand uploaded images' },
]


export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
}

export type ViewMode = 'grid' | 'list'
export type TabKey = 'all' | 'templates' | 'my-copilots' | 'shared' | 'workspace'

