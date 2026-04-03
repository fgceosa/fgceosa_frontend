import { useState, useRef } from 'react'
import { Dropdown } from '@/components/ui'
import classNames from '@/utils/classNames'
import { MoreHorizontal, Pencil, Trash2, MessageSquare } from 'lucide-react'
import type { DropdownRef } from '@/components/ui/Dropdown'
import type { MouseEvent, SyntheticEvent } from 'react'

type ChatHistoryItemProps = {
    title: string
    conversation: string
    active?: boolean
    onDelete?: () => void
    onRename?: () => void
    onClick?: () => void
}

const ChatHistoryItem = (props: ChatHistoryItemProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<DropdownRef>(null)

    const {
        title,
        conversation,
        active,
        onRename,
        onDelete,
        onClick,
        ...rest
    } = props

    const handleAction = (
        e: SyntheticEvent,
        callback?: () => void,
    ) => {
        e.stopPropagation()
        dropdownRef.current?.handleDropdownClose()
        callback?.()
    }

    const handleDropdownToggleClick = (e: MouseEvent) => {
        e.stopPropagation()
        dropdownRef.current?.handleDropdownOpen()
    }

    return (
        <div
            className={classNames(
                'group relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 cursor-pointer border',
                active
                    ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50 shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-100 dark:hover:border-gray-800'
            )}
            onClick={onClick}
            {...rest}
        >
            {/* Active Indicator Line */}
            {active && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#0055BA] rounded-r-full" />
            )}

            <div className={classNames(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500",
                active
                    ? "bg-gradient-to-br from-[#0055BA] to-[#003d85] text-white shadow-lg shadow-blue-500/20"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-white dark:group-hover:bg-gray-700 group-hover:text-blue-500"
            )}>
                <MessageSquare className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 pr-2">
                <div className={classNames(
                    "font-bold text-sm truncate tracking-tight transition-colors capitalize",
                    active ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100 group-hover:text-blue-600"
                )}>
                    {title || 'Untitled Chat'}
                </div>
                <div className="text-[10px] items-center text-gray-400 font-medium truncate mt-0.5">
                    {conversation || 'New conversation...'}
                </div>
            </div>

            <div className="shrink-0">
                <Dropdown
                    ref={dropdownRef}
                    placement="bottom-end"
                    onOpen={setDropdownOpen}
                    renderTitle={
                        <button
                            onClick={handleDropdownToggleClick}
                            className={classNames(
                                'h-8 w-8 flex items-center justify-center rounded-lg transition-all',
                                dropdownOpen || active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                                'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                            )}
                        >
                            <MoreHorizontal className="w-5 h-5" strokeWidth={3} />
                        </button>
                    }
                >
                    <div className="py-2 px-1 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl min-w-[160px]">
                        <Dropdown.Item
                            eventKey="rename"
                            onClick={(e) => handleAction(e, onRename)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                        >
                            <Pencil className="w-4 h-4" />
                            <span>Rename</span>
                        </Dropdown.Item>
                        <div className="h-px bg-gray-50 dark:bg-gray-900/50 my-1 mx-2" />
                        <Dropdown.Item
                            eventKey="delete"
                            onClick={(e) => handleAction(e, onDelete)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                        </Dropdown.Item>
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}

export default ChatHistoryItem
