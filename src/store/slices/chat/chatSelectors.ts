import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducer'
import { CHAT_STATUS } from './constants'

// Base selector
const selectChatState = (state: RootState) => state.chat

// Basic state selectors
export const selectChatData = createSelector(
    selectChatState,
    (chat) => chat?.chatHistory
)

export const selectChatLoading = createSelector(
    selectChatState,
    (chat) => chat?.loading
)

export const selectChatStatus = createSelector(
    selectChatState,
    (chat) => chat?.status
)

export const selectChatError = createSelector(
    selectChatState,
    (chat) => chat?.error
)

export const selectSelectedConversation = createSelector(
    selectChatState,
    (chat) => chat?.selectedConversation
)

export const selectSelectedConversationRecord = createSelector(
    selectChatState,
    (chat) => chat?.selectedConversationRecord
)

export const selectRenameDialog = createSelector(
    selectChatState,
    (chat) => chat?.renameDialog
)

export const selectRateLimitDialog = createSelector(
    selectChatState,
    (chat) => chat?.rateLimitDialog
)

export const selectInsufficientCreditsDialog = createSelector(
    selectChatState,
    (chat) => chat?.insufficientCreditsDialog
)

export const selectIsTyping = createSelector(
    selectChatState,
    (chat) => chat?.isTyping
)

// Data-specific selectors
export const selectConversationById = (id: string) =>
    createSelector(selectChatData, (chatHistory) =>
        chatHistory.find((chat) => chat.id === id)
    )

export const selectConversations = createSelector(
    selectChatData,
    (chatHistory) => chatHistory ?? []
)

export const selectSelectedConversationObject = createSelector(
    [selectChatData, selectSelectedConversation],
    (chatHistory, selectedId) =>
        chatHistory.find((chat) => chat.id === selectedId) || null
)

// Derived selectors
export const selectHasChatData = createSelector(
    selectChatData,
    (chatHistory) => chatHistory && chatHistory.length > 0
)

export const selectIsInitialLoading = createSelector(
    [selectChatLoading, selectHasChatData],
    (loading, hasData) => loading && !hasData
)

export const selectIsRefreshing = createSelector(
    [selectChatLoading, selectHasChatData],
    (loading, hasData) => loading && hasData
)

export const selectHasError = createSelector(
    selectChatError,
    (error) => error !== null
)

export const selectIsSuccessful = createSelector(
    selectChatStatus,
    (status) => status === CHAT_STATUS.SUCCEEDED
)

export const selectIsFailed = createSelector(
    selectChatStatus,
    (status) => status === CHAT_STATUS.FAILED
)

export const selectIsIdle = createSelector(
    selectChatStatus,
    (status) => status === CHAT_STATUS.IDLE
)

// Chat readiness selector
export const selectChatReady = createSelector(
    [selectHasChatData, selectChatError, selectChatLoading],
    (hasData, error, loading) => hasData && !error && !loading
)

// Export all as a group
const chatSelectors = {
    selectChatData,
    selectChatLoading,
    selectChatStatus,
    selectChatError,
    selectSelectedConversation,
    selectSelectedConversationRecord,
    selectRenameDialog,
    selectRateLimitDialog,
    selectInsufficientCreditsDialog,
    selectIsTyping,

    selectConversationById,
    selectConversations,
    selectSelectedConversationObject,

    selectHasChatData,
    selectIsInitialLoading,
    selectIsRefreshing,
    selectHasError,
    selectIsSuccessful,
    selectIsFailed,
    selectIsIdle,
    selectChatReady,
}

export default chatSelectors
