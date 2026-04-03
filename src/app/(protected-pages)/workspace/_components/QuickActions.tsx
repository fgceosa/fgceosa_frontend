'use client'

import React from 'react'
import { Card, Button } from '@/components/ui'
import { UserPlus, ShieldCheck, Plus } from 'lucide-react'

interface QuickActionsProps {
    onInvite: () => void
    onManageRoles: () => void
    onCopilotHub?: () => void
    onCreateWorkspace?: () => void
}

export default function QuickActions({
    onInvite,
    onManageRoles,
    onCopilotHub,
    onCreateWorkspace,
}: QuickActionsProps) {
    const actions = [
        {
            label: 'Invite Members',
            icon: <UserPlus className="w-5 h-5" />,
            onClick: onInvite,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: 'Manage Roles',
            icon: <ShieldCheck className="w-5 h-5" />,
            onClick: onManageRoles,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            label: 'Copilot Hub',
            icon: <Plus className="w-5 h-5 rotate-45" />,
            onClick: onCopilotHub,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
        },
    ].filter(action => action.onClick)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action) => (
                <button
                    key={action.label}
                    onClick={action.onClick}
                    className="flex flex-row items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:scale-[1.02] transition-all duration-300 text-left group min-h-[100px]"
                >
                    <div className={`w-12 h-12 shrink-0 rounded-xl ${action.bgColor} ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        {action.icon}
                    </div>
                    <span className="text-[14px] font-bold text-gray-800 dark:text-gray-200 leading-tight">
                        {action.label}
                    </span>
                </button>
            ))}
        </div>
    )
}
