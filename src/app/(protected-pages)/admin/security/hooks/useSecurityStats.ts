import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    fetchSecurityStats,
    selectSecurityStats,
    selectSecurityLoading
} from '@/store/slices/security'

/**
 * Custom hook for managing security statistics
 */
export function useSecurityStats() {
    const dispatch = useAppDispatch()
    const stats = useAppSelector(selectSecurityStats)
    const loading = useAppSelector(selectSecurityLoading)

    useEffect(() => {
        dispatch(fetchSecurityStats())
    }, [dispatch])

    const refetchStats = () => {
        dispatch(fetchSecurityStats())
    }

    return {
        stats,
        loading,
        refetchStats
    }
}
