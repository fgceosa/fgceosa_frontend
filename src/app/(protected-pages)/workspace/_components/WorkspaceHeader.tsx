'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'
import classNames from '@/utils/classNames'

interface WorkspaceHeaderProps {
    title: string
    description?: string
    icon?: React.ElementType
    iconColorClass?: string
    iconBgClass?: string
    tag?: string
    label?: string
    actions?: React.ReactNode
    showBackButton?: boolean
    backPath?: string
}

export default function WorkspaceHeader({
    title,
    description,
    icon: Icon,
    iconColorClass = 'text-white',
    iconBgClass = 'bg-primary',
    tag,
    label = 'Workspace Name:',
    actions,
    showBackButton = true,
    backPath = '/organizations/workspaces',
    workspaceId,
    isVerified = false,
}: WorkspaceHeaderProps & { workspaceId?: string; isVerified?: boolean }) {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="space-y-4 lg:space-y-1">
                <div className="flex items-center gap-4 mb-2">
                    {showBackButton && (
                        <button
                            onClick={() => router.push(backPath)}
                            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl h-9 w-9 flex items-center justify-center transition-all active:scale-95 shadow-sm group"
                        >
                            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
                        </button>
                    )}
                    {tag && (
                        <>
                            <span className="text-xs font-bold text-primary whitespace-nowrap">
                                {tag}
                            </span>
                            <div className="h-px w-12 bg-primary/20" />
                            <span className="text-xs font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                {title}
                            </span>
                        </>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                <Icon className="h-6 w-6 text-primary" />
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            {label && <span className="text-xs font-bold text-gray-900 dark:text-gray-100 mt-1">{label}</span>}
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                                {title}
                            </h1>
                            {isVerified && (
                                <div className="w-5 h-5 rounded-full border border-emerald-500 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
                {description && (
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                        {description}
                    </p>
                )}
            </div>


            {actions && (
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {actions}
                </div>
            )}
        </div>
    )
}
