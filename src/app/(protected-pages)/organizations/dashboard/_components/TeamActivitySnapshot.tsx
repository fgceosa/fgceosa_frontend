'use client'

import { useMemo } from 'react'
import { useAppSelector } from '@/store'
import {
    selectOrganizationActivities,
    selectOrganizationActivityLoading
} from '@/store/slices/organization/organizationSelectors'
import { Card } from '@/components/ui'
import {
    UserPlus,
    Shield,
    Activity,
    Building2,
    Clock,
    Sparkles,
    CreditCard,
    Key,
    LayoutDashboard,
    AlertCircle
} from 'lucide-react'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function TeamActivitySnapshot() {
    const activitiesData = useAppSelector(selectOrganizationActivities)
    const isLoading = useAppSelector(selectOrganizationActivityLoading)

    const mappedActivities = useMemo(() => {
        if (!activitiesData || activitiesData.length === 0) return []

        return activitiesData.slice(0, 5).map((log: any) => {
            let icon = Activity
            let color = 'text-gray-500'
            let bg = 'bg-gray-50 dark:bg-gray-900/20'

            const action = log.action.toUpperCase()

            if (action.includes('USER') || action.includes('MEMBER') || action.includes('JOINED')) {
                icon = UserPlus
                color = 'text-emerald-500'
                bg = 'bg-emerald-50 dark:bg-emerald-900/20'
            } else if (action.includes('ROLE') || action.includes('PERMISSION')) {
                icon = Shield
                color = 'text-blue-500'
                bg = 'bg-blue-50 dark:bg-blue-900/20'
            } else if (action.includes('CREDIT') || action.includes('WALLET') || action.includes('FINANCIAL')) {
                icon = CreditCard
                color = 'text-amber-500'
                bg = 'bg-amber-50 dark:bg-amber-900/20'
            } else if (action.includes('COPILOT') || action.includes('AI')) {
                icon = Sparkles
                color = 'text-purple-500'
                bg = 'bg-purple-50 dark:bg-purple-900/20'
            } else if (action.includes('KEY')) {
                icon = Key
                color = 'text-rose-500'
                bg = 'bg-rose-50 dark:bg-rose-900/20'
            } else if (action.includes('WORKSPACE') || action.includes('ORG')) {
                icon = Building2
                color = 'text-indigo-500'
                bg = 'bg-indigo-50 dark:bg-indigo-900/20'
            }

            const initials = log.actorName
                ? log.actorName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                : 'SY'

            return {
                id: log.id,
                user: log.actorName || 'System',
                action: log.action.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
                target: log.targetType === 'Organization' ? null : (log.targetId ? `${log.targetType || 'Target'}: ${log.targetId.slice(0, 8)}...` : (log.targetType || 'System Platform')),
                time: dayjs(log.timestamp).fromNow(),
                icon,
                color,
                bg,
                initials
            }
        })
    }, [activitiesData])

    return (
        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 p-10 overflow-hidden relative h-full group/main">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover/main:bg-emerald-500/10 transition-colors duration-500" />

            <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm">
                        <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                            Team Activity
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-400">Real-time Feed</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/20 shadow-sm shadow-emerald-100/50 dark:shadow-none">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-black text-emerald-600">Live Updates</span>
                </div>
            </div>

            <div className="space-y-0 relative z-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Hydrating feed...</p>
                    </div>
                ) : mappedActivities.length > 0 ? (
                    mappedActivities.map((activity, index) => {
                        const Icon = activity.icon
                        return (
                            <div key={activity.id} className="group relative flex items-start gap-8">
                                {/* Timeline Line */}
                                {index !== mappedActivities.length - 1 && (
                                    <div className="absolute left-[23.5px] top-12 bottom-0 w-[1px] bg-gradient-to-b from-gray-100 via-gray-100 to-transparent dark:from-gray-800 dark:via-gray-800" />
                                )}

                                {/* Icon/Avatar Container */}
                                <div className="relative">
                                    <div className={classNames(
                                        "relative z-10 w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl border border-white dark:border-gray-900 shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                                        activity.bg,
                                        activity.color
                                    )}>
                                        <div className="text-xs font-black opacity-100 group-hover:opacity-0 transition-opacity absolute">
                                            {activity.initials}
                                        </div>
                                        <Icon className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-sm z-20">
                                        <Icon className={classNames("w-2.5 h-2.5", activity.color)} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className={classNames(
                                    "flex-1 pb-10 transition-all duration-300",
                                    index !== mappedActivities.length - 1 && "border-b border-gray-50/50 dark:border-gray-800/30"
                                )}>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    <span className="font-black text-gray-900 dark:text-gray-100 transition-colors group-hover:text-primary">
                                                        {activity.user}
                                                    </span>
                                                    <span className="mx-2 opacity-30 font-light">|</span>
                                                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-tight">{activity.action}</span>
                                                </p>
                                            </div>
                                            <time className="text-[10px] font-black text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-md whitespace-nowrap">
                                                {activity.time}
                                            </time>
                                        </div>

                                        {activity.target && (
                                            <div className="flex items-center gap-2">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm group-hover:border-primary/20 transition-all">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <span className="text-xs font-black text-gray-900 dark:text-gray-100 tracking-tight">
                                                        {activity.target}
                                                    </span>
                                                </div>
                                                {index === 0 && (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-600 rounded-lg">
                                                        <Sparkles className="w-3 h-3" />
                                                        <span className="text-[10px] font-black">Latest</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {!activity.target && index === 0 && (
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-600 rounded-lg w-fit">
                                                <Sparkles className="w-3 h-3" />
                                                <span className="text-[10px] font-black">Latest</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4">
                            <Activity className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500">No activity recorded yet</p>
                        <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1 uppercase tracking-widest">Stay tuned for updates</p>
                    </div>
                )}
            </div>
        </Card>
    )
}
