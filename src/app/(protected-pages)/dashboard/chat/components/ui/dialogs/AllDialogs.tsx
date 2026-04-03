'use client'

import ChatHistoryRenameDialog from './ChatHistoryRenameDialog'
import ChatRateLimitDialog from './ChatRateLimitDialog'
import ChatInsufficientCreditsDialog from './ChatInsufficientCreditsDialog'
import ChatDeleteDialog from './ChatDeleteDialog'

export default function AllDialogs() {
    return (
        <>
            <ChatHistoryRenameDialog />
            <ChatRateLimitDialog />
            <ChatInsufficientCreditsDialog />
            <ChatDeleteDialog />
        </>
    )
}
