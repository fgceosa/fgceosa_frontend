import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    fetchMonitoredApiKeys,
    selectMonitoredApiKeys,
    selectMonitoredApiKeysTotal,
    selectMonitoredApiKeysLoading
} from '@/store/slices/security'

export function useMonitoredApiKeys() {
    const dispatch = useAppDispatch()
    const keys = useAppSelector(selectMonitoredApiKeys)
    const total = useAppSelector(selectMonitoredApiKeysTotal)
    const loading = useAppSelector(selectMonitoredApiKeysLoading)

    const fetchKeys = useCallback((page: number, limit: number, search?: string) => {
        dispatch(fetchMonitoredApiKeys({ page, limit, search }))
    }, [dispatch])

    return {
        keys,
        total,
        loading,
        fetchKeys
    }
}
