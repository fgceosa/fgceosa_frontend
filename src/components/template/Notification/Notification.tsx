'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import NotificationAvatar from './NotificationAvatar'
import NotificationToggle from './NotificationToggle'
import { HiOutlineMailOpen, HiOutlineTrash } from 'react-icons/hi'
import {
    apiGetNotifications,
    apiMarkNotificationRead,
    apiMarkAllNotificationsRead,
    apiDeleteNotification
} from '@/services/CommonService'
import isLastChild from '@/utils/isLastChild'
import useResponsive from '@/utils/hooks/useResponsive'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import type { DropdownRef } from '@/components/ui/Dropdown'
import type { NotificationRemote } from '@/@types/notifications'

dayjs.extend(relativeTime)
dayjs.extend(utc)

const notificationHeight = 'h-[320px]'

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<NotificationRemote[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    const { larger } = useResponsive()
    const router = useRouter()
    const notificationDropdownRef = useRef<DropdownRef>(null)
    const isFetchingRef = useRef(false) // Prevent duplicate requests

    const fetchData = useCallback(async () => {
        // Prevent duplicate simultaneous requests
        if (isFetchingRef.current) {
            return
        }

        isFetchingRef.current = true
        try {
            const resp = await apiGetNotifications({ limit: 50 })
            if (resp) {
                // Trigger wallet refresh if there's a new credit-related notification
                if (resp.unreadCount > unreadCount) {
                    const hasNewCreditNotif = resp.data.some((n: any) =>
                        !n.isRead && ['credit_received', 'topup_success', 'adjustment'].includes(n.type)
                    )
                    if (hasNewCreditNotif) {
                        window.dispatchEvent(new Event('wallet-updated'))
                    }
                }

                setNotificationList(resp.data || [])
                setUnreadCount(resp.unreadCount || 0)
                setIsLoaded(true)
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error)
        } finally {
            isFetchingRef.current = false
        }
    }, [])

    useEffect(() => {
        fetchData()
        // Poll every 30 seconds for updates for more real-time feel, but only when tab is visible
        const interval = setInterval(() => {
            if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
                fetchData()
            }
        }, 30000)
        return () => clearInterval(interval)
    }, [fetchData])

    const onNotificationOpen = async () => {
        if (!isLoaded) {
            setLoading(true)
            await fetchData()
            setLoading(false)
        }
    }

    const onMarkAllAsRead = async () => {
        try {
            await apiMarkAllNotificationsRead()
            setNotificationList(prev => prev.map(item => ({ ...item, isRead: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error('Failed to mark all as read', error)
        }
    }

    const onMarkAsRead = async (id: string, isRead: boolean) => {
        if (isRead) return
        try {
            await apiMarkNotificationRead(id)
            setNotificationList(prev => prev.map(item =>
                item.id === id ? { ...item, isRead: true } : item
            ))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error('Failed to mark as read', error)
        }
    }

    const onDeleteNotification = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        try {
            await apiDeleteNotification(id)
            setNotificationList(prev => prev.filter(item => item.id !== id))
            // Recalculate unread if needed or just refetch
            fetchData()
        } catch (error) {
            console.error('Failed to delete notification', error)
        }
    }

    return (
        <Dropdown
            ref={notificationDropdownRef}
            renderTitle={
                <NotificationToggle
                    unreadCount={unreadCount}
                    className={className}
                />
            }
            menuClass="min-w-[320px] md:min-w-[400px] p-0 overflow-hidden rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800"
            placement={larger.md ? 'bottom-end' : 'bottom'}
            onOpen={onNotificationOpen}
        >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <h6 className="font-bold text-gray-900 dark:text-white">Notifications</h6>
                    {unreadCount > 0 && (
                        <Badge
                            innerClass="text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full"
                            style={{ backgroundColor: '#0055BA' }}
                            content={unreadCount}
                        />
                    )}
                </div>
                <Tooltip title="Mark all as read">
                    <Button
                        variant="plain"
                        shape="circle"
                        size="sm"
                        className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        icon={<HiOutlineMailOpen className="text-xl" style={{ color: '#0055BA' }} />}
                        onClick={onMarkAllAsRead}
                    />
                </Tooltip>
            </div>

            <ScrollBar className={classNames('overflow-y-auto', notificationHeight)}>
                {loading ? (
                    <div className={classNames('flex items-center justify-center', notificationHeight)}>
                        <Spinner size={32} />
                    </div>
                ) : notificationList?.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {notificationList.map((item, index) => (
                            <div
                                key={item.id}
                                className={classNames(
                                    'group relative flex px-5 py-4 cursor-pointer transition-all duration-200',
                                    item.isRead ? 'bg-white dark:bg-gray-900' : 'bg-primary-50/30 dark:bg-primary-500/5'
                                )}
                                onClick={() => onMarkAsRead(item.id, item.isRead)}
                            >
                                <div className="flex-shrink-0">
                                    <NotificationAvatar type={item.type} />
                                </div>
                                <div className="ltr:ml-3 rtl:mr-3 flex-1 pr-6">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className={classNames(
                                                'text-sm font-semibold mb-0.5',
                                                item.isRead ? 'text-gray-700 dark:text-gray-200' : 'text-gray-900 dark:text-white font-bold'
                                            )}>
                                                {item.title}
                                            </span>
                                            {!item.isRead && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 underline-offset-4 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-col mt-2">
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                                            {dayjs.utc(item.createdAt).local().fromNow()}
                                        </span>
                                        <span className="text-[9px] text-gray-400 opacity-60 font-medium">
                                            {dayjs.utc(item.createdAt).local().format('MMM DD, YYYY · HH:mm:ss')}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-all text-gray-400"
                                    onClick={(e) => onDeleteNotification(e, item.id)}
                                >
                                    <HiOutlineTrash size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={classNames('flex flex-col items-center justify-center p-8 text-center', notificationHeight)}>
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <HiOutlineMailOpen size={30} className="text-gray-400" />
                        </div>
                        <h6 className="font-bold text-gray-900 dark:text-white">All caught up!</h6>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            No new notifications at the moment.
                        </p>
                    </div>
                )}
            </ScrollBar>

            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-center">
                <button
                    className="text-xs font-bold hover:opacity-80 transition-opacity"
                    style={{ color: '#0055BA' }}
                >
                    View All Activity
                </button>
            </div>
        </Dropdown >
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification
