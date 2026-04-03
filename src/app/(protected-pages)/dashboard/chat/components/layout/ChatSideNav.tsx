import { useState } from 'react'
import Button from '@/components/ui/Button'
import ChatHistory from '../ui/history/ChatHistory'
import useDebounce from '@/utils/hooks/useDebounce'
import classNames from '@/utils/classNames'
import { Plus, Search, PanelLeftClose } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { useAppDispatch } from '@/store/hook'
import { setSelectedConversation } from '@/store/slices/chat'

type ChatSideNavProps = {
    className?: string
    onClick?: () => void
    showOnMobile?: boolean
    onClose?: () => void
}

const ChatSideNav = ({ className, onClick, showOnMobile, onClose }: ChatSideNavProps) => {
    const [queryText, setQueryText] = useState('')
    const dispatch = useAppDispatch()

    function handleDebounceFn(e: ChangeEvent<HTMLInputElement>) {
        setQueryText?.(e.target.value)
    }

    const debounceFn = useDebounce(handleDebounceFn, 500)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        debounceFn(e)
    }

    const handleNewChat = () => {
        dispatch(setSelectedConversation(''))
        onClick?.()
    }

    return (
        <div
            className={classNames(
                'flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 w-full shrink-0 z-20',
                className,
            )}
        >
            <div className="p-4 shrink-0 space-y-4">
                <div className="flex items-center gap-2">
                    <Button
                        block
                        variant="solid"
                        onClick={handleNewChat}
                        className="h-11 flex-1 bg-[#0055BA] hover:bg-[#004299] text-white font-black text-[10px] rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Chat</span>
                    </Button>
                    {!showOnMobile && onClose && (
                        <button
                            onClick={onClose}
                            className="h-11 w-11 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-[#0055BA] hover:bg-white dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-700/50"
                            title="Close sidebar"
                        >
                            <PanelLeftClose className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Search className="w-4 h-4 text-gray-400 group-focus-within:text-[#0055BA] transition-colors" />
                    </div>
                    <input
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 text-sm font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#0055BA]/30 transition-all"
                        placeholder="Search chats..."
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 py-2">
                <div className="px-5 mb-2 flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-gray-400">Recent Chats</h3>
                    <div className="h-px flex-1 bg-gray-50 dark:bg-gray-800/50 ml-4" />
                </div>
                <ChatHistory queryText={queryText} onClick={onClick} />
            </div>
        </div>
    )
}

export default ChatSideNav
