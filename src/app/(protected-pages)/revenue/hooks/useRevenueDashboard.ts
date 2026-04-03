import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    fetchRevenueData,
    selectRevenueData,
    selectRevenueLoading,
    selectRevenueError,
    clearRevenueError
} from '@/store/slices/revenue'
import { RevenuePageData, RevenuePeriod } from '../types'

/**
 * useRevenueDashboard - Hook for managing revenue dashboard state and actions.
 * Fetches real platform analytics from the backend API.
 */
export const useRevenueDashboard = () => {
    const dispatch = useAppDispatch()
    const loading = useAppSelector(selectRevenueLoading)
    const error = useAppSelector(selectRevenueError)
    const revenueData = useAppSelector(selectRevenueData)

    useEffect(() => {
        if (!revenueData && !loading && !error) {
            dispatch(fetchRevenueData('monthly'))
        }
    }, [dispatch, revenueData, loading, error])

    // Return current data or null if not yet loaded
    const data = revenueData as RevenuePageData

    const handlePeriodChange = (frontendPeriod: string) => {
        // Map frontend period values to backend period values
        let backendPeriod: RevenuePeriod = 'monthly'

        switch (frontendPeriod) {
            case 'weekly':
                backendPeriod = 'week' as any
                break
            case 'monthly':
                backendPeriod = 'month' as any
                break
            case 'annually':
                backendPeriod = 'year' as any
                break
            case 'half-year':
                backendPeriod = 'month' as any // Fallback or handle separately
                break
            default:
                backendPeriod = 'month' as any
        }

        dispatch(fetchRevenueData(backendPeriod))
    }

    const handleRetry = () => {
        dispatch(fetchRevenueData('monthly'))
    }

    const handleClearError = () => {
        dispatch(clearRevenueError())
    }

    return {
        data,
        loading,
        error,
        handlePeriodChange,
        handleRetry,
        handleClearError
    }
}
