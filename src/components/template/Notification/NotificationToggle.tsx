import classNames from '@/utils/classNames'
import Badge from '@/components/ui/Badge'
import { PiBellDuotone } from 'react-icons/pi'
import React from 'react'

interface NotificationToggleProps {
    className?: string
    unreadCount?: number
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
    className,
    unreadCount = 0,
}) => {
    const hasUnread = unreadCount > 0

    return (
        <div
            className={classNames(
                'relative flex items-center justify-center w-10 h-10 cursor-pointer rounded-xl transition-all duration-300',
                'bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-800/50',
                'hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 active:scale-95 group',
                className
            )}
        >
            <Badge
                content={unreadCount > 0 ? unreadCount : undefined}
                maxCount={99}
                className="flex items-center justify-center"
                innerClass={classNames(
                    "text-[10px] min-w-[16px] h-[16px] flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm",
                    hasUnread ? "bg-red-500 text-white animate-pulse" : "hidden"
                )}
            >
                <PiBellDuotone className={classNames(
                    "text-xl transition-all duration-300 group-hover:rotate-12",
                    hasUnread ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"
                )} />
            </Badge>
        </div>
    )
}

export default NotificationToggle
