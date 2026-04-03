'use client'

import { useAppDispatch, useAppSelector } from '@/store'
import { setRateLimitDialog } from '@/store/slices/chat'
import RateLimitDialog from './RateLimitDialog'

const ChatRateLimitDialog = () => {
    const dispatch = useAppDispatch()
    const { open, retryAfter } = useAppSelector(
        (state) => state.chat?.rateLimitDialog || { open: false, retryAfter: 60 }
    )

    const handleClose = () => {
        dispatch(setRateLimitDialog({ open: false }))
    }

    return (
        <RateLimitDialog
            isOpen={open}
            onClose={handleClose}
            retryAfter={retryAfter}
        />
    )
}

export default ChatRateLimitDialog
