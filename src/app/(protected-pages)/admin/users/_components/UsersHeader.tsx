'use client'

import { Users, Send } from 'lucide-react'
import InviteUserForm from './InviteUserForm'

export default function UsersHeader() {
    return (
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="space-y-4 lg:space-y-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-[10px] font-black text-primary whitespace-nowrap">Administration</span>
                    <div className="h-px w-12 bg-primary/20" />
                    <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">Directory</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                        User Management
                    </h1>
                </div>
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                    Manage users, their roles, and credit balances.
                </p>
            </div>


            <div className="flex items-center gap-4 w-full lg:w-auto">
                <InviteUserForm />
            </div>
        </div>
    )
}
