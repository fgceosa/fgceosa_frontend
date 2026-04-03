'use client'

import { Card, Button } from '@/components/ui'
import { Users, UserPlus, ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'

export default function MembersAccessSettings() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Team Management</h3>
                    </div>
                </div>
                <div className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Member Directory</h4>
                            <p className="text-xs text-gray-500 max-w-md">Manage your team members, sending invitations, and organizing department access.</p>
                        </div>
                        <Link href="/organizations/team">
                            <Button variant="solid" className="h-11 px-6 bg-primary text-white font-black text-xs rounded-xl flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary/20">
                                Manage Members <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>

            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Roles & Permissions</h3>
                </div>
                <div className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Role Hierarchy</h4>
                            <p className="text-xs text-gray-500 max-w-md">Define granular access controls, custom roles, and permission scopes for your organization.</p>
                        </div>
                        <Link href="/organizations/roles-permissions">
                            <Button variant="plain" className="h-11 px-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-black text-xs rounded-xl flex items-center gap-2 active:scale-95 transition-all hover:bg-gray-50 dark:hover:bg-gray-700">
                                Configure Roles <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    )
}
