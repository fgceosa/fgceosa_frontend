'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import classNames from '@/utils/classNames'

interface WorkspaceTab {
    name: string
    path: string
}

interface WorkspaceTabNavigationProps {
    tabs: WorkspaceTab[]
    currentPath: string
}

export default function WorkspaceTabNavigation({
    tabs,
    currentPath,
}: WorkspaceTabNavigationProps) {
    const router = useRouter()

    return (
        <div className="flex bg-white dark:bg-gray-900 p-1.5 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none backdrop-blur-sm overflow-x-auto no-scrollbar relative z-20">
            {tabs.map((tab) => {
                const isActive = currentPath === tab.path
                return (
                    <button
                        key={tab.name}
                        onClick={() => router.push(tab.path)}
                        className={classNames(
                            'px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex-shrink-0 whitespace-nowrap',
                            isActive
                                ? 'bg-gray-50 dark:bg-gray-800 text-primary border border-gray-100 dark:border-gray-700'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
                        )}
                    >
                        {tab.name}
                    </button>
                )
            })}
        </div>
    )
}
