'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui'
import {
    UserPlus,
    ShieldCheck,
    ArrowRightLeft,
    FileText,
    Settings,
    Clock,
    Activity,
    AlertCircle
} from 'lucide-react'
import classNames from '@/utils/classNames'
import { apiGetWorkspaceActivities } from '@/services/workspace/workspaceService'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface ActivityItem {
    id: string
    type: string
    content: React.ReactNode
    time: string
}

export default function RecentActivity() {
    const params = useParams()
    const workspaceId = params.workspaceId as string
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchActivities = async () => {
            if (!workspaceId) return
            try {
                const response = await apiGetWorkspaceActivities(workspaceId)
                const mappedActivities = response.activities.map((log: any) => ({
                    id: log.id,
                    type: log.action ? log.action.toLowerCase() : 'unknown',
                    content: formatContent(log),
                    time: dayjs(log.timestamp).fromNow()
                }))
                setActivities(mappedActivities)
            } catch (error) {
                console.error('Failed to fetch activities:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchActivities()
    }, [workspaceId])

    const formatContent = (log: any) => {
        const action = log.action ? log.action.toLowerCase() : 'unknown'
        const actorName = log.actorName || 'System'

        if (action.includes('role')) {
            return (
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    <span className="font-black text-gray-900 dark:text-gray-100">{actorName}</span> updated roles for member.
                </p>
            )
        }

        if (action.includes('credit')) {
            return (
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    <span className="text-orange-600 font-bold">Credit Transaction:</span> <span className="font-black text-gray-900 dark:text-gray-100">{actorName}</span> managed credits.
                </p>
            )
        }

        return (
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                <span className="font-black text-gray-900 dark:text-gray-100">{actorName}</span> performed <span className="text-primary font-bold">{log.action ? log.action.replace(/_/g, ' ') : 'action'}</span>
                {log.targetType && (
                    <> on <span className="font-black text-gray-900 dark:text-gray-100">{log.targetType}</span></>
                )}
            </p>
        )
    }

    const getIcon = (type: string) => {
        if (type.includes('role')) return <ShieldCheck className="w-4 h-4" />
        if (type.includes('credit')) return <ArrowRightLeft className="w-4 h-4" />
        if (type.includes('report')) return <FileText className="w-4 h-4" />
        if (type.includes('key') || type.includes('api')) return <Settings className="w-4 h-4" />
        if (type.includes('member') || type.includes('user')) return <UserPlus className="w-4 h-4" />
        return <Activity className="w-4 h-4" />
    }

    const getIconColor = (type: string) => {
        if (type.includes('role')) return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20'
        if (type.includes('credit')) return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20'
        if (type.includes('report')) return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
        if (type.includes('key') || type.includes('api')) return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'
        return 'bg-gray-50 text-gray-600 dark:bg-gray-800'
    }

    if (isLoading) {
        return (
            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 p-10 overflow-hidden relative min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-medium text-gray-400">Loading activity log...</p>
                </div>
            </Card>
        )
    }

    if (activities.length === 0) {
        return (
            <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 p-10 overflow-hidden relative">
                <div className="flex items-center justify-between mb-12 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 italic tracking-tight">
                            Timeline Activity
                        </h3>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Clock className="w-12 h-12 mb-4 opacity-50" />
                    <p>No recent activity recorded.</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 p-10 overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <Clock className="w-32 h-32" />
            </div>

            <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                    <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 italic tracking-tight">
                        Timeline Activity
                    </h3>
                </div>
                <button className="h-10 px-6 rounded-xl bg-gray-50 dark:bg-gray-800 text-[10px] font-black text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                    View Entire Log
                </button>
            </div>

            <div className="space-y-0 relative z-10">
                {activities.map((activity, index) => (
                    <div
                        key={activity.id}
                        className="group relative flex items-start gap-6"
                    >
                        {/* Timeline Line */}
                        {index !== activities.length - 1 && (
                            <div className="absolute left-[21px] top-12 bottom-0 w-px bg-gradient-to-b from-gray-100 to-transparent dark:from-gray-800" />
                        )}

                        {/* Icon Container */}
                        <div className={classNames(
                            "relative z-10 w-11 h-11 shrink-0 flex items-center justify-center rounded-2xl border-2 border-white dark:border-gray-900 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
                            getIconColor(activity.type)
                        )}>
                            {getIcon(activity.type)}
                        </div>

                        {/* Content */}
                        <div className={classNames(
                            "flex-1 pb-10 transition-all duration-300",
                            index !== activities.length - 1 && "border-b border-gray-50 dark:border-gray-800/50"
                        )}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex-1">
                                    {activity.content}
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">
                                        {activity.time}
                                    </span>
                                </div>
                            </div>

                            {/* Tags or Additional Info based on type */}
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-800/50 text-[9px] font-black text-gray-400 border border-gray-100 dark:border-gray-700">
                                    {activity.type.replace(/_/g, ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
