/**
 * AI Engine Async Thunks
 *
 * Handles async operations for AI Engine features
 */

import { createAsyncThunk } from '@reduxjs/toolkit'
import type {
    ChatCompletionRequest,
    ChatCompletionResponse,
    EmbeddingRequest,
    EmbeddingResponse,
    ModerationRequest,
    ModerationResponse,
    CreditTopUpRequest,
    APIKeyCreateRequest,
    AIEngineError,
} from '@/@types/aiEngine'
import {
    AIEngineService,
    RetryableError,
    InsufficientCreditsError,
} from '@/services/AIEngineService'
import {
    setCredits,
    setHealthStatus,
    addUsageRecord,
    deductCredits,
    setError,
    addPendingTopUp,
    updateTopUpStatus,
    setAPIKeys,
    addAPIKey,
} from './aiEngineSlice'

// ==================== Credits ====================

export const fetchCreditsAsync = createAsyncThunk(
    'aiEngine/fetchCredits',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const credits = await AIEngineService.getCredits()
            dispatch(setCredits(credits))
            return credits
        } catch (error: any) {
            const aiError: AIEngineError = {
                code: 'NETWORK_ERROR',
                message: error.message || 'Failed to fetch credits',
                retryable: true,
            }
            dispatch(setError(aiError))
            return rejectWithValue(aiError)
        }
    },
)

export const initiateTopUpAsync = createAsyncThunk(
    'aiEngine/initiateTopUp',
    async (request: CreditTopUpRequest, { dispatch, rejectWithValue }) => {
        try {
            const topUp = await AIEngineService.initiateTopUp(request)
            dispatch(addPendingTopUp(topUp))
            return topUp
        } catch (error: any) {
            const aiError: AIEngineError = {
                code: 'NETWORK_ERROR',
                message: error.message || 'Failed to initiate top-up',
                retryable: true,
            }
            dispatch(setError(aiError))
            return rejectWithValue(aiError)
        }
    },
)

export const checkTopUpStatusAsync = createAsyncThunk(
    'aiEngine/checkTopUpStatus',
    async (topUpId: string, { dispatch, rejectWithValue }) => {
        try {
            const status = await AIEngineService.checkTopUpStatus(topUpId)
            dispatch(
                updateTopUpStatus({
                    id: topUpId,
                    status: status.status,
                    updatedAt: status.updatedAt,
                }),
            )

            // If completed, refresh credits
            if (status.status === 'completed') {
                dispatch(fetchCreditsAsync())
            }

            return status
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    },
)

// ==================== Chat Completions ====================

export const sendChatCompletionAsync = createAsyncThunk(
    'aiEngine/sendChatCompletion',
    async (
        request: ChatCompletionRequest,
        { dispatch, getState, rejectWithValue },
    ) => {
        const startTime = Date.now()

        try {
            // Make the request
            const response = await AIEngineService.chatCompletion(request)

            // Calculate cost and deduct credits
            const cost = response.usage
                ? (response.usage.totalTokens / 1000000) * 2 // Example: $2 per 1M tokens
                : 0

            // Deduct credits (assuming ₦25 = 1 credit = $1)
            const creditsToDeduct = cost * 25

            dispatch(deductCredits(creditsToDeduct))

            // Log usage
            dispatch(
                addUsageRecord({
                    id: response.id,
                    endpoint: '/chat/completions',
                    model: response.model,
                    promptTokens: response.usage.promptTokens,
                    completionTokens: response.usage.completionTokens,
                    totalTokens: response.usage.totalTokens,
                    cost,
                    status: 'success',
                    responseTimeMs: Date.now() - startTime,
                    createdAt: new Date().toISOString(),
                }),
            )

            return response
        } catch (error: any) {
            let aiError: AIEngineError

            if (error instanceof InsufficientCreditsError) {
                aiError = {
                    code: 'INSUFFICIENT_CREDITS',
                    message: error.message,
                    statusCode: 402,
                    retryable: false,
                }
            } else if (error instanceof RetryableError) {
                aiError = {
                    code: 'TIMEOUT',
                    message: error.message,
                    retryable: true,
                }
            } else if (error.response?.status === 429) {
                aiError = {
                    code: 'RATE_LIMIT',
                    message: 'Rate limit exceeded. Please try again later.',
                    statusCode: 429,
                    retryable: true,
                }
            } else if (error.response?.status === 400) {
                aiError = {
                    code: 'INVALID_REQUEST',
                    message: error.response.data?.detail || 'Invalid request',
                    statusCode: 400,
                    retryable: false,
                }
            } else if (error.response?.status === 504) {
                aiError = {
                    code: 'TIMEOUT',
                    message: 'Request timed out. Please try again.',
                    statusCode: 504,
                    retryable: true,
                }
            } else {
                aiError = {
                    code: 'UNKNOWN',
                    message: error.message || 'An unexpected error occurred',
                    retryable: false,
                }
            }

            // Log failed usage
            dispatch(
                addUsageRecord({
                    id: `error-${Date.now()}`,
                    endpoint: '/chat/completions',
                    model: request.model || 'gpt-3.5-turbo',
                    promptTokens: 0,
                    completionTokens: 0,
                    totalTokens: 0,
                    cost: 0,
                    status: 'error',
                    responseTimeMs: Date.now() - startTime,
                    createdAt: new Date().toISOString(),
                    errorMessage: aiError.message,
                }),
            )

            dispatch(setError(aiError))
            return rejectWithValue(aiError)
        }
    },
)

// ==================== Embeddings ====================

export const createEmbeddingsAsync = createAsyncThunk(
    'aiEngine/createEmbeddings',
    async (
        request: EmbeddingRequest,
        { dispatch, getState, rejectWithValue },
    ) => {
        const startTime = Date.now()

        try {
            const response = await AIEngineService.createEmbeddings(request)

            const cost = response.usage
                ? (response.usage.totalTokens / 1000000) * 0.1 // Example: $0.1 per 1M tokens
                : 0

            const creditsToDeduct = cost * 25

            dispatch(deductCredits(creditsToDeduct))

            dispatch(
                addUsageRecord({
                    id: `embedding-${Date.now()}`,
                    endpoint: '/embeddings',
                    model: response.model,
                    promptTokens: response.usage.promptTokens,
                    completionTokens: 0,
                    totalTokens: response.usage.totalTokens,
                    cost,
                    status: 'success',
                    responseTimeMs: Date.now() - startTime,
                    createdAt: new Date().toISOString(),
                }),
            )

            return response
        } catch (error: any) {
            const aiError: AIEngineError = {
                code:
                    error instanceof InsufficientCreditsError
                        ? 'INSUFFICIENT_CREDITS'
                        : 'UNKNOWN',
                message: error.message || 'Failed to create embeddings',
                retryable: !(error instanceof InsufficientCreditsError),
            }

            dispatch(setError(aiError))
            return rejectWithValue(aiError)
        }
    },
)

// ==================== Moderation ====================

export const moderateContentAsync = createAsyncThunk(
    'aiEngine/moderateContent',
    async (
        request: ModerationRequest,
        { dispatch, getState, rejectWithValue },
    ) => {
        const startTime = Date.now()

        try {
            const response = await AIEngineService.moderateContent(request)

            // Moderation is typically free or very cheap
            const cost = 0.001

            const creditsToDeduct = cost * 25

            dispatch(deductCredits(creditsToDeduct))

            dispatch(
                addUsageRecord({
                    id: response.id,
                    endpoint: '/moderations',
                    model: response.model,
                    promptTokens: 0,
                    completionTokens: 0,
                    totalTokens: 0,
                    cost,
                    status: 'success',
                    responseTimeMs: Date.now() - startTime,
                    createdAt: new Date().toISOString(),
                }),
            )

            return response
        } catch (error: any) {
            const aiError: AIEngineError = {
                code: 'UNKNOWN',
                message: error.message || 'Failed to moderate content',
                retryable: true,
            }

            dispatch(setError(aiError))
            return rejectWithValue(aiError)
        }
    },
)

// ==================== Health Check ====================

export const checkHealthAsync = createAsyncThunk(
    'aiEngine/checkHealth',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const health = await AIEngineService.checkHealth()
            dispatch(setHealthStatus(health))

            // Update credits from health check
            if (health.creditBalance !== undefined) {
                dispatch(
                    setCredits({
                        nairaBalance: health.creditBalance * 25, // Assuming ₦25 = 1 credit
                        aiCredits: health.creditBalance,
                        lastUpdated: health.lastChecked,
                    }),
                )
            }

            return health
        } catch (error: any) {
            const aiError: AIEngineError = {
                code: 'SERVICE_UNAVAILABLE',
                message: 'AI service is currently unavailable',
                retryable: true,
            }
            dispatch(setError(aiError))
            return rejectWithValue(aiError)
        }
    },
)

// ==================== API Keys ====================

export const fetchAPIKeysAsync = createAsyncThunk(
    'aiEngine/fetchAPIKeys',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const keys = await AIEngineService.getAPIKeys()
            dispatch(setAPIKeys(keys))
            return keys
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    },
)

export const createAPIKeyAsync = createAsyncThunk(
    'aiEngine/createAPIKey',
    async (request: APIKeyCreateRequest, { dispatch, rejectWithValue }) => {
        try {
            const key = await AIEngineService.createAPIKey(request)
            dispatch(addAPIKey(key))
            return key
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    },
)
