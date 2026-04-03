import { useState, useCallback, useEffect } from 'react'
import { Copilot } from '../types'
import {
    apiListCopilots,
    apiListFeaturedCopilots,
    apiListMyCopilots,
} from '@/services/CopilotService'

export function useCopilots(searchQuery: string, selectedCategory: string) {
    const [copilots, setCopilots] = useState<Copilot[]>([])
    const [prebuiltTemplates, setPrebuiltTemplates] = useState<Copilot[]>([])
    const [myCopilots, setMyCopilots] = useState<Copilot[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCopilots = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const params: {
                search?: string
                category?: string
            } = {}

            if (searchQuery) params.search = searchQuery
            if (selectedCategory !== 'all') params.category = selectedCategory

            const response = await apiListCopilots(params)
            setCopilots(response.copilots)
        } catch (err) {
            console.error('Failed to fetch copilots:', err)
            setError('Failed to load copilots. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }, [searchQuery, selectedCategory])

    const fetchPrebuiltTemplates = useCallback(async () => {
        try {
            const response = await apiListFeaturedCopilots()
            setPrebuiltTemplates(response.copilots)
        } catch (err) {
            console.error('Failed to fetch prebuilt templates:', err)
        }
    }, [])

    const fetchMyCopilots = useCallback(async () => {
        try {
            const response = await apiListMyCopilots()
            setMyCopilots(response.copilots)
        } catch (err) {
            console.error('Failed to fetch my copilots:', err)
        }
    }, [])

    const refreshAll = useCallback(() => {
        fetchCopilots()
        fetchPrebuiltTemplates()
        fetchMyCopilots()
    }, [fetchCopilots, fetchPrebuiltTemplates, fetchMyCopilots])

    // Initial fetch
    useEffect(() => {
        refreshAll()
    }, [refreshAll])

    return {
        copilots,
        prebuiltTemplates,
        myCopilots,
        isLoading,
        error,
        setCopilots,
        setMyCopilots,
        refreshAll
    }
}
