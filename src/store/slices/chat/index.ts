// Export the main reducer as default
export { default } from './chatSlice'

// Export all slice actions
export {
    setSelectedConversation,
    setSelectedConversationRecord,
    setChatHistory,
    setChatHistoryName,
    setRenameDialog,
    setRateLimitDialog,
    setInsufficientCreditsDialog,
    setDeleteDialog,
    setIsTyping,
    pushChatHistory,
    pushConversation,
    disabledChatFresh,
    clearAllFreshFlags,
    clearChatError,
    resetChatState,
    truncateConversation,
} from './chatSlice'

// Export the state interface
export type { ChatState } from './chatSlice'

// Export all thunks
export {
    fetchChatHistories,
    fetchChatById,
    sendChatMessage,
    renameChat,
    createChatConversation,
    deleteChat,
    searchChats,
    updateChatMessage,
} from './chatThunk'

// Export all selectors
export {
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
} from './chatSelectors'

// Export default selectors object
export { default as chatSelectors } from './chatSelectors'

// Export all constants
export {
    SLICE_BASE_NAME,
    CHAT_STATUS,
} from './constants'

// Export types
export type { ChatStatus } from './constants'