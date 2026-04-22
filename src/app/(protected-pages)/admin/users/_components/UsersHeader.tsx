'use client'

import { Users } from 'lucide-react'
import InviteUserForm from './InviteUserForm'

export default function UsersHeader() {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pb-4 animate-in fade-in slide-in-from-top-6 duration-1000 ease-out">
            <div className="space-y-4 lg:space-y-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 dark:bg-primary/10 rounded-full border border-primary/10">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Admin Control</span>
                    </div>
                    <div className="h-px w-8 bg-gray-200 dark:bg-gray-800" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Members</span>
                </div>
                
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative p-3.5 bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 shrink-0 transform group-hover:scale-105 transition-transform duration-500">
                            <Users className="h-7 w-7 text-primary" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-none mb-1">
                            Member List
                        </h1>
                        <p className="text-base text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
                            View and manage all association members, roles, and account permissions.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                <div className="h-12 w-[1px] bg-gray-100 dark:bg-gray-800 hidden lg:block mx-2" />
                <InviteUserForm />
            </div>
        </div>
    )
}
