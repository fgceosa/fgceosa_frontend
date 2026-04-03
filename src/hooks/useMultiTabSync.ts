/**
 * Multi-Tab Synchronization Hook
 *
 * Synchronizes AI Engine state across multiple browser tabs using localStorage events
 */

import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { syncFromStorage } from '@/store/slices/aiEngine/aiEngineSlice'
import type { AIEngineState } from '@/@types/aiEngine'

const SYNC_KEY = 'qorebit_ai_engine_sync'
const DEBOUNCE_DELAY = 500 // ms

export function useMultiTabSync() {
    const dispatch = useAppDispatch()
    const aiEngineState = useAppSelector((state) => state.aiEngine)
    const lastSyncRef = useAppSelector((state) => state.aiEngine.lastSyncTimestamp)

    // Broadcast state changes to other tabs
    const broadcastState = useCallback((state: Partial<AIEngineState>) => {
        try {
            const syncData = {
                timestamp: new Date().toISOString(),
                data: state,
            }
            localStorage.setItem(SYNC_KEY, JSON.stringify(syncData))
            // Immediately remove to trigger storage event in other tabs
            localStorage.removeItem(SYNC_KEY)
        } catch (error) {
            console.error('Failed to broadcast state:', error)
        }
    }, [])

    // Listen for changes from other tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key !== SYNC_KEY || !event.newValue) {
                return
            }

            try {
                const syncData = JSON.parse(event.newValue)

                // Only apply if the sync is newer than our last sync
                if (
                    !lastSyncRef ||
                    new Date(syncData.timestamp) > new Date(lastSyncRef)
                ) {
                    dispatch(syncFromStorage(syncData.data))
                }
            } catch (error) {
                console.error('Failed to parse sync data:', error)
            }
        }

        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [dispatch, lastSyncRef])

    // Broadcast important state changes
    useEffect(() => {
        let timeoutId: NodeJS.Timeout

        const debouncedBroadcast = () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                // Only broadcast critical state that should be synced
                broadcastState({
                    credits: aiEngineState.credits,
                    pendingTopUps: aiEngineState.pendingTopUps,
                    healthStatus: aiEngineState.healthStatus,
                })
            }, DEBOUNCE_DELAY)
        }

        debouncedBroadcast()

        return () => clearTimeout(timeoutId)
    }, [
        aiEngineState.credits,
        aiEngineState.pendingTopUps,
        aiEngineState.healthStatus,
        broadcastState,
    ])

    return {
        broadcastState,
    }
}
