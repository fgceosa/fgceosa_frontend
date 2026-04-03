/**
 * AI Engine Custom Hooks
 *
 * Provides convenient hooks for using AI Engine features throughout the app
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    fetchCreditsAsync,
    sendChatCompletionAsync,
    createEmbeddingsAsync,
    moderateContentAsync,
    checkHealthAsync,
    initiateTopUpAsync,
    checkTopUpStatusAsync,
} from '@/store/slices/aiEngine/aiEngineThunks'
import type {
    ChatCompletionRequest,
    ChatMessage,
    EmbeddingRequest,
    ModerationRequest,
    CreditTopUpRequest,
} from '@/@types/aiEngine'
import { clearError } from '@/store/slices/aiEngine/aiEngineSlice'

// ==================== useAICredits ====================

export function useAICredits() {
    const dispatch = useAppDispatch()
    const { credits, isLoading, error } = useAppSelector((state) => state.aiEngine)

    const refreshCredits = useCallback(() => {
        dispatch(fetchCreditsAsync())
    }, [dispatch])

    const hasSufficientCredits = useCallback(
        (required: number = 0.01) => {
            return credits ? credits.aiCredits >= required : false
        },
        [credits],
    )

    useEffect(() => {
        // Fetch credits on mount if not already loaded
        if (!credits) {
            refreshCredits()
        }
    }, [])

    return {
        credits,
        isLoading,
        error,
        refreshCredits,
        hasSufficientCredits,
    }
}

// ==================== useAIChat ====================

export function useAIChat() {
    const dispatch = useAppDispatch()
    const { credits, isLoading, error } = useAppSelector((state) => state.aiEngine)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isGenerating, setIsGenerating] = useState(false)

    const sendMessage = useCallback(
        async (content: string, options?: Partial<ChatCompletionRequest>) => {
            // Check credits
            if (!credits || credits.aiCredits < 0.01) {
                throw new Error('Insufficient credits')
            }

            // Add user message
            const userMessage: ChatMessage = { role: 'user', content }
            setMessages((prev) => [...prev, userMessage])

            setIsGenerating(true)

            try {
                const request: ChatCompletionRequest = {
                    messages: [...messages, userMessage],
                    model: options?.model || 'gpt-3.5-turbo',
                    temperature: options?.temperature,
                    maxTokens: options?.maxTokens,
                    ...options,
                }

                const result = await dispatch(sendChatCompletionAsync(request)).unwrap()

                // Add assistant message
                const assistantMessage = result.choices[0]?.message
                if (assistantMessage) {
                    setMessages((prev) => [...prev, assistantMessage])
                }

                return result
            } catch (error) {
                // Remove user message on error
                setMessages((prev) => prev.slice(0, -1))
                throw error
            } finally {
                setIsGenerating(false)
            }
        },
        [dispatch, credits, messages],
    )

    const clearMessages = useCallback(() => {
        setMessages([])
    }, [])

    const resetChat = useCallback(() => {
        setMessages([])
        dispatch(clearError())
    }, [dispatch])

    return {
        messages,
        isGenerating,
        sendMessage,
        clearMessages,
        resetChat,
        error,
    }
}

// ==================== useAIEmbeddings ====================

export function useAIEmbeddings() {
    const dispatch = useAppDispatch()
    const { credits, error } = useAppSelector((state) => state.aiEngine)
    const [isCreating, setIsCreating] = useState(false)

    const createEmbeddings = useCallback(
        async (input: string | string[], options?: Partial<EmbeddingRequest>) => {
            if (!credits || credits.aiCredits < 0.01) {
                throw new Error('Insufficient credits')
            }

            setIsCreating(true)

            try {
                const request: EmbeddingRequest = {
                    input,
                    model: options?.model || 'text-embedding-ada-002',
                    ...options,
                }

                const result = await dispatch(createEmbeddingsAsync(request)).unwrap()
                return result
            } finally {
                setIsCreating(false)
            }
        },
        [dispatch, credits],
    )

    return {
        createEmbeddings,
        isCreating,
        error,
    }
}

// ==================== useAIModeration ====================

export function useAIModeration() {
    const dispatch = useAppDispatch()
    const { credits, error } = useAppSelector((state) => state.aiEngine)
    const [isModerating, setIsModerating] = useState(false)

    const moderate = useCallback(
        async (input: string | string[], options?: Partial<ModerationRequest>) => {
            if (!credits || credits.aiCredits < 0.001) {
                throw new Error('Insufficient credits')
            }

            setIsModerating(true)

            try {
                const request: ModerationRequest = {
                    input,
                    model: options?.model,
                }

                const result = await dispatch(moderateContentAsync(request)).unwrap()
                return result
            } finally {
                setIsModerating(false)
            }
        },
        [dispatch, credits],
    )

    return {
        moderate,
        isModerating,
        error,
    }
}

// ==================== useAIHealth ====================

export function useAIHealth(pollInterval: number = 30000) {
    const dispatch = useAppDispatch()
    const { healthStatus } = useAppSelector((state) => state.aiEngine)
    const intervalRef = useRef<NodeJS.Timeout>()

    const checkHealth = useCallback(() => {
        dispatch(checkHealthAsync())
    }, [dispatch])

    useEffect(() => {
        // Initial check
        checkHealth()

        // Set up polling
        if (pollInterval > 0) {
            intervalRef.current = setInterval(() => {
                checkHealth()
            }, pollInterval)
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [checkHealth, pollInterval])

    return {
        healthStatus,
        checkHealth,
        isHealthy: healthStatus?.status === 'healthy',
    }
}

// ==================== useCreditTopUp ====================

export function useCreditTopUp() {
    const dispatch = useAppDispatch()
    const { pendingTopUps } = useAppSelector((state) => state.aiEngine)
    const [isInitiating, setIsInitiating] = useState(false)
    const pollingRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())

    const initiateTopUp = useCallback(
        async (request: CreditTopUpRequest) => {
            setIsInitiating(true)

            try {
                const result = await dispatch(initiateTopUpAsync(request)).unwrap()

                // Start polling for status
                startPolling(result.id)

                return result
            } finally {
                setIsInitiating(false)
            }
        },
        [dispatch],
    )

    const startPolling = useCallback(
        (topUpId: string) => {
            // Poll every 5 seconds
            const intervalId = setInterval(() => {
                dispatch(checkTopUpStatusAsync(topUpId))
            }, 5000)

            pollingRefs.current.set(topUpId, intervalId)

            // Stop polling after 10 minutes
            setTimeout(() => {
                stopPolling(topUpId)
            }, 600000)
        },
        [dispatch],
    )

    const stopPolling = useCallback((topUpId: string) => {
        const intervalId = pollingRefs.current.get(topUpId)
        if (intervalId) {
            clearInterval(intervalId)
            pollingRefs.current.delete(topUpId)
        }
    }, [])

    useEffect(() => {
        // Stop polling for completed or failed top-ups
        pendingTopUps.forEach((topUp) => {
            if (topUp.status === 'completed' || topUp.status === 'failed') {
                stopPolling(topUp.id)
            }
        })

        return () => {
            // Clean up all polling on unmount
            pollingRefs.current.forEach((intervalId) => clearInterval(intervalId))
            pollingRefs.current.clear()
        }
    }, [pendingTopUps, stopPolling])

    return {
        pendingTopUps,
        isInitiating,
        initiateTopUp,
        stopPolling,
    }
}

// ==================== useAIUsageHistory ====================

export function useAIUsageHistory() {
    const { usageHistory } = useAppSelector((state) => state.aiEngine)

    const getRecentUsage = useCallback(
        (limit: number = 10) => {
            return usageHistory.records.slice(0, limit)
        },
        [usageHistory],
    )

    const getTotalCost = useCallback(() => {
        return usageHistory.totalCost
    }, [usageHistory])

    const getUsageByModel = useCallback(() => {
        const byModel = new Map<string, {
            count: number
            totalTokens: number
            totalCost: number
        }>()

        usageHistory.records.forEach((record) => {
            const existing = byModel.get(record.model) || {
                count: 0,
                totalTokens: 0,
                totalCost: 0,
            }

            byModel.set(record.model, {
                count: existing.count + 1,
                totalTokens: existing.totalTokens + record.totalTokens,
                totalCost: existing.totalCost + record.cost,
            })
        })

        return Array.from(byModel.entries()).map(([model, stats]) => ({
            model,
            ...stats,
        }))
    }, [usageHistory])

    return {
        usageHistory,
        getRecentUsage,
        getTotalCost,
        getUsageByModel,
    }
}
