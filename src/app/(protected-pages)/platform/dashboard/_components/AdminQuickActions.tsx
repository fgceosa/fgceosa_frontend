'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
    Users,
    ShieldCheck,
    ArrowRightLeft,
    Plus,
    Database,
    Zap,
    ArrowUpRight,
    Sparkles
} from 'lucide-react'
import classNames from '@/utils/classNames'

export default function AdminQuickActions() {
    const router = useRouter()

    const actions = [
        {
            label: 'Roles & Permissions',
            icon: ShieldCheck,
            onClick: () => router.push('/admin/roles-permissions'),
            color: 'text-purple-600',
            glowColor: 'group-hover:shadow-purple-500/20',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            borderColor: 'border-purple-100/50 dark:border-purple-800/20',
            description: 'Define system authorities'
        },
        {
            label: 'Bulk Credits',
            icon: Zap,
            onClick: () => router.push('/admin/credits/bulk'),
            color: 'text-amber-600',
            glowColor: 'group-hover:shadow-amber-500/20',
            bgColor: 'bg-amber-50 dark:bg-amber-900/20',
            borderColor: 'border-amber-100/50 dark:border-amber-800/20',
            description: 'Manage asset distribution'
        },
        {
            label: 'Copilot Management',
            icon: Sparkles,
            onClick: () => router.push('/platform-copilot-management'),
            color: 'text-indigo-600',
            glowColor: 'group-hover:shadow-indigo-500/20',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
            borderColor: 'border-indigo-100/50 dark:border-indigo-800/20',
            description: 'Global agent registry'
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 px-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                    <h2 className="text-[10px] font-black text-gray-400">Quick Actions</h2>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-gray-800 to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {actions.map((action) => {
                    const Icon = action.icon
                    return (
                        <button
                            key={action.label}
                            onClick={action.onClick}
                            className={classNames(
                                "group relative flex flex-col items-start p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-sm transition-all duration-500 text-left overflow-hidden",
                                "hover:scale-[1.03] hover:shadow-2xl hover:border-primary/20",
                                action.glowColor
                            )}
                        >
                            {/* Hover Background Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Decorative Corner Icon */}
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500">
                                <ArrowUpRight className="w-4 h-4 text-primary/30" />
                            </div>

                            <div className={classNames(
                                "relative z-10 p-3 rounded-2xl mb-3 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm border",
                                action.bgColor,
                                action.color,
                                action.borderColor
                            )}>
                                <Icon className="w-6 h-6" strokeWidth={2.5} />
                            </div>

                            <div className="relative z-10 space-y-1.5 flex-1 w-full">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-none">
                                        {action.label}
                                    </span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 leading-snug group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                                    {action.description}
                                </p>
                            </div>

                            <div className="relative z-10 mt-4 flex items-center gap-2 text-[9px] font-black text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                <span>Execute Action</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
