'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import type { CommonProps } from '@/@types/common'
import type { ChatHistories } from '../../types'
import { fetchChatHistories, setChatHistory, clearAllFreshFlags } from '@/store/slices/chat'

type ChatProviderProps = CommonProps & {
    chatHistory?: ChatHistories
}

export default function ChatProvider({ children, chatHistory }: ChatProviderProps) {
    const dispatch = useAppDispatch()
    const allIds = useAppSelector((state) => state.chat?.chatHistory)
    const lastFetched = useAppSelector((state) => state.chat?.lastFetched)

    useEffect(() => {
        // Clear all fresh flags on mount (no typewriter on page load)
        dispatch(clearAllFreshFlags())

        // Only fetch if we don't have data AND haven't fetched recently (prevents duplicate calls)
        const hasData = allIds && allIds.length > 0
        const shouldFetch = !hasData && !lastFetched

        if (chatHistory && chatHistory?.length > 0 && !hasData) {
            // SSR/Preloaded hydration (only if no persisted data)
            dispatch(setChatHistory(chatHistory))
        } else if (shouldFetch) {
            // Client fetch fallback (only if needed)
            dispatch(fetchChatHistories())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Empty deps - only run once on mount

    return <>{children}</>
}
