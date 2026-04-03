import { useState, useEffect } from 'react'
import { AIEngineService } from '@/services/AIEngineService'
import type { AIModel } from '../types'

export const useChatModels = (selectedModelId?: string, onModelSelect?: (id: string) => void) => {
    const [models, setModels] = useState<AIModel[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true

        const fetchModels = async () => {
            try {
                setIsLoading(true)
                const response = await AIEngineService.getAvailableModels()

                if (mounted) {
                    setModels(response.models)

                    // Auto-select first model if none selected
                    if (response.models.length > 0 && !selectedModelId && onModelSelect) {
                        onModelSelect(response.models[0].id)
                    }
                }
            } catch (err) {
                if (mounted) {
                    console.error('Failed to fetch models:', err)
                    setError('Failed to load AI models')
                }
            } finally {
                if (mounted) {
                    setIsLoading(false)
                }
            }
        }

        fetchModels()

        return () => {
            mounted = false
        }
    }, [selectedModelId, onModelSelect])

    return { models, isLoading, error }
}
