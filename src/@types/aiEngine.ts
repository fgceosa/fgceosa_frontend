/**
 * AI Engine Type Definitions
 *
 * Types for AI chat, embeddings, moderation, credits, and usage tracking
 */

// ==================== Credit Types ====================

export interface AICredits {
  nairaBalance: number
  aiCredits: number
  lastUpdated: string
}

export interface OrganizationCredits {
  balance: number
  monthlyUsage: number
  remainingCredits: number
  lastUpdated: string
}

export interface CreditTopUpRequest {
  amount: number // Naira amount
  paymentMethod: 'bank_transfer' | 'card' | 'wallet'
  reference?: string
  workspaceId?: string
  organizationId?: string
}

export interface PendingTopUp {
  id: string
  amount: number
  aiCreditsEquivalent: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED'
  reference: string
  createdAt: string
  updatedAt: string
  paymentMethod: string
  // New fields from updated payment system
  accountNumber?: string
  bankName?: string
  accountName?: string
  expiresAt?: string
  provider?: string
  message?: string
}

export interface CreditTransaction {
  id: string
  userId: string
  amount: number
  balanceAfter: number
  transactionType: 'purchase' | 'usage' | 'refund' | 'bonus'
  description: string
  referenceId?: string
  createdAt: string
}

// ==================== AI Chat Types ====================

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  name?: string
}

export interface ChatCompletionRequest {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  n?: number
  stream?: boolean
  stop?: string | string[]
  presencePenalty?: number
  frequencyPenalty?: number
  user?: string
}

export interface ChatCompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: ChatMessage
    finishReason: string
  }[]
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// ==================== Embeddings Types ====================

export interface EmbeddingRequest {
  input: string | string[]
  model?: string
  encodingFormat?: string
  user?: string
}

export interface EmbeddingResponse {
  object: string
  data: {
    object: string
    embedding: number[]
    index: number
  }[]
  model: string
  usage: {
    promptTokens: number
    totalTokens: number
  }
}

// ==================== Moderation Types ====================

export interface ModerationRequest {
  input: string | string[]
  model?: string
}

export interface ModerationResponse {
  id: string
  model: string
  results: {
    flagged: boolean
    categories: {
      [key: string]: boolean
    }
    categoryScores: {
      [key: string]: number
    }
  }[]
}

// ==================== Health Check Types ====================

export interface AIHealthStatus {
  status: 'healthy' | 'degraded' | 'unavailable'
  service: string
  user: string
  creditBalance: number
  lastChecked: string
}

// ==================== Usage Tracking Types ====================

export interface APIUsageRecord {
  id: string
  endpoint: '/chat/completions' | '/embeddings' | '/moderations'
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  status: 'success' | 'error' | 'timeout'
  responseTimeMs?: number
  createdAt: string
  errorMessage?: string
}

export interface UsageHistory {
  records: APIUsageRecord[]
  totalRequests: number
  totalCost: number
  totalTokens: number
}

// ==================== API Key Types ====================

export interface APIKey {
  id: string
  key: string
  name: string
  createdAt: string
  lastUsedAt?: string
  isActive: boolean
  usageCount: number
  remainingCredits: number
}

export interface APIKeyCreateRequest {
  name: string
  description?: string
}

// ==================== Error Types ====================

export interface AIEngineError {
  code: 'INSUFFICIENT_CREDITS' | 'TIMEOUT' | 'RATE_LIMIT' | 'INVALID_REQUEST' | 'SERVICE_UNAVAILABLE' | 'NETWORK_ERROR' | 'UNKNOWN'
  message: string
  statusCode?: number
  details?: any
  retryable: boolean
}

// ==================== State Types ====================

export interface AIEngineState {
  // Credits
  credits: AICredits | null
  organizationCredits: OrganizationCredits | null
  pendingTopUps: PendingTopUp[]
  creditTransactions: CreditTransaction[]

  // Usage
  usageHistory: UsageHistory

  // Health
  healthStatus: AIHealthStatus | null

  // API Keys
  apiKeys: APIKey[]

  // UI State
  isLoading: boolean
  error: AIEngineError | null

  // Multi-tab sync
  lastSyncTimestamp: string | null
}

// ==================== Model Types ====================

export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  context_length: number
  pricing: {
    input: number  // per 1M tokens
    output: number
  }
  supports_streaming: boolean
  supports_functions: boolean
  is_free: boolean
}

export interface ModelsListResponse {
  models: AIModel[]
  total: number
  currency: string
  pricing_unit: string
}

// ==================== Request Options ====================

export interface RequestOptions {
  retry?: boolean
  maxRetries?: number
  timeout?: number
  onProgress?: (progress: number) => void
}
