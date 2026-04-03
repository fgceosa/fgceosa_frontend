'use client'
import ScrollBar from '@/components/ui/ScrollBar'
import ChatHistoryItem from './ChatHistoryItem'
import { MessageSquare } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    chatSelectors,
    setRenameDialog,
    setDeleteDialog,
    setSelectedConversation,
    fetchChatById,
} from '@/store/slices/chat'
type ChatHistoryProps = {
    queryText?: string
    onClick?: () => void
}

const ChatHistory = ({ queryText = '', onClick }: ChatHistoryProps) => {
    const dispatch = useAppDispatch()

    // Use real chat data from Redux store
    const chatHistory = useAppSelector(chatSelectors?.selectChatData)
    const selectedConversation = useAppSelector(
        chatSelectors.selectSelectedConversation,
    )

    const handleDelete = (id: string, title: string) => {
        // Open confirmation dialog
        dispatch(setDeleteDialog({ id, title, open: true }))
    }

    const handleRename = (id: string, title: string) => {
        dispatch(
            setRenameDialog({
                id,
                title,
                open: true,
            }),
        )
    }

    const handleClick = (id: string) => {
        // If this chat doesn't have messages loaded, fetch them
        const chat = chatHistory?.find((c) => c.id === id)
        if (!chat || !chat.conversation || chat.conversation.length === 0) {
            dispatch(fetchChatById(id))
        }
        dispatch(setSelectedConversation(id))
        onClick?.()
    }

    // Filter chats based on search query
    const filteredChats = chatHistory
        ?.filter((item) => {
            // Skip disabled chats
            if (item.enable === false) return false

            // If no query, show all
            if (!queryText.trim()) return true

            // Search in title and last conversation
            const query = queryText.toLowerCase()
            return (
                item.title?.toLowerCase().includes(query) ||
                item.lastConversation?.toLowerCase().includes(query)
            )
        })
        .sort((a, b) => (b.updatedTime || 0) - (a.updatedTime || 0)) // Sort by most recent

    return (
        <ScrollBar className="h-full">
            <div className="flex flex-col gap-1 py-2 px-2">
                {filteredChats?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <MessageSquare className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 leading-relaxed">
                            {queryText ? 'No results found' : 'Your history is empty'}
                        </p>
                    </div>
                ) : (
                    filteredChats?.map((item) => (
                        <ChatHistoryItem
                            key={item.id}
                            data-testid={item.id}
                            title={item.title}
                            conversation={item.lastConversation || ''}
                            active={selectedConversation === item.id}
                            onDelete={() => handleDelete(item.id, item.title)}
                            onRename={() => handleRename(item.id, item.title)}
                            onClick={() => handleClick(item.id)}
                        />
                    ))
                )}
            </div>
        </ScrollBar>
    )
}

export default ChatHistory
