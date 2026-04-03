import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    fetchSecurityEvents,
    setEventsParams,
    selectSecurityEvents,
    selectSecurityEventsTotal,
    selectCurrentEventsParams,
    selectSecurityLoading
} from '@/store/slices/security'

/**
 * Custom hook for managing security events data and state
 */
export function useSecurityEvents() {
    const dispatch = useAppDispatch()
    const events = useAppSelector(selectSecurityEvents)
    const total = useAppSelector(selectSecurityEventsTotal)
    const params = useAppSelector(selectCurrentEventsParams)
    const loading = useAppSelector(selectSecurityLoading)

    useEffect(() => {
        // Initial fetch handled by component or here?
        // If handled here, it resets on remount.
        dispatch(fetchSecurityEvents({ pageIndex: 1, pageSize: 10 }))
    }, [dispatch])

    const refetchEvents = (newParams?: Partial<typeof params>) => {
        const updatedParams = { ...params, ...newParams }
        if (newParams) {
            dispatch(setEventsParams(newParams))
        }
        dispatch(fetchSecurityEvents(updatedParams))
    }

    return {
        events,
        total,
        params,
        loading,
        refetchEvents
    }
}
