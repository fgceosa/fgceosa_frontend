'use client'

import { Card, Button } from '@/components/ui'
import { FileText, ArrowRight, Activity } from 'lucide-react'
import Link from 'next/link'

export default function AuditLogsSettings() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Activity Log</h3>
                </div>
                <div className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Centralized Audit Trail</h4>
                            <p className="text-xs text-gray-500 max-w-md">View and export detailed logs of user activity, system changes, and security events.</p>
                        </div>
                        <Link href="/organizations/audit-logs">
                            <Button variant="solid" className="h-11 px-6 bg-primary text-white font-black text-xs rounded-xl flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-primary/20">
                                View Logs <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>

            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Log Retention</h3>
                </div>
                <div className="p-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50">
                            <div>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Retention Period</p>
                                <p className="text-xs text-gray-500">How long activity logs are stored on our servers.</p>
                            </div>
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded">1 Year</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
