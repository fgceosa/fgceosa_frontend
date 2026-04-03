'use client'

import React from 'react'
import { Card } from '@/components/ui'
import { User, Key, FileText, Settings, Activity, Clock, ArrowRight, Bell, Sparkles } from 'lucide-react'
import type { ActivityItem } from '../types'
import classNames from '@/utils/classNames'

interface ActivityFeedProps {
    activities?: ActivityItem[]
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'key': return Key
        case 'user': return User
        case 'contract': return FileText
        case 'system': return Settings
        default: return Activity
    }
}

export default function ActivityFeed({ activities = [] }: ActivityFeedProps) {
    const data = activities || []
    return (
        <Card className="group relative shadow-xl border-none bg-white dark:bg-gray-900 overflow-hidden flex flex-col rounded-[2.5rem] p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-700" />

            <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white leading-none mb-1">
                            Activity Feed
                        </h3>
                        <p className="text-[9px] font-black text-gray-400">Real-time Updates</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600">Live</span>
                </div>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 py-12">
                        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                            <Clock className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-sm font-medium italic">No recent system events</p>
                    </div>
                ) : (
                    <div className="relative space-y-6">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-gray-100 via-gray-100 to-transparent dark:from-gray-800 dark:via-gray-800" />

                        {data.map((activity, index) => {
                            const Icon = getActivityIcon(activity.type)
                            const isNew = index < 2

                            return (
                                <div
                                    key={activity.id}
                                    className="group/item relative flex gap-6 animate-in slide-in-from-bottom-2 duration-500"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Timeline Marker */}
                                    <div className={classNames(
                                        "relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover/item:scale-110 shadow-sm",
                                        activity.bg || 'bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800'
                                    )}>
                                        <Icon className={classNames(
                                            "w-5 h-5 transition-transform duration-500 group-hover/item:rotate-12",
                                            activity.color || 'text-gray-400'
                                        )} />
                                        {isNew && (
                                            <div className="absolute -top-1 -right-1">
                                                <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight transition-colors group-hover/item:text-primary">
                                                {activity.content}
                                            </p>
                                            <span className="text-[10px] font-black text-gray-400 whitespace-nowrap mt-0.5">
                                                {activity.time}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={classNames(
                                                "text-[9px] font-black px-2 py-0.5 rounded-md border",
                                                activity.type === 'system' ? "bg-blue-50 text-blue-600 border-blue-100/50" :
                                                    activity.type === 'user' ? "bg-emerald-50 text-emerald-600 border-emerald-100/50" :
                                                        activity.type === 'key' ? "bg-amber-50 text-amber-600 border-amber-100/50" :
                                                            "bg-gray-50 text-gray-500 border-gray-100"
                                            )}>
                                                {activity.type}
                                            </span>
                                            <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                            <button className="text-[9px] font-black text-gray-400 hover:text-primary transition-colors">
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="relative z-10 mt-auto pt-6 border-t border-gray-50 dark:border-gray-800">
                <button className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white text-[11px] font-black hover:bg-primary hover:text-white transition-all duration-300 group shadow-sm hover:shadow-primary/20">
                    View Audit Logs
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </Card>
    )
}
