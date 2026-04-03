'use client'

import { Card, Switcher, Select } from '@/components/ui'
import { Database, FileCheck } from 'lucide-react'

export default function DataComplianceSettings() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center">
                        <Database className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Data Residency</h3>
                </div>
                <div className="p-8 space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Primary Data Region</label>
                        <Select
                            placeholder="Select Region"
                            defaultValue={{ value: 'us-east', label: 'US East (N. Virginia)' }}
                            options={[
                                { value: 'us-east', label: 'US East (N. Virginia)' },
                                { value: 'eu-west', label: 'EU West (Ireland)' },
                                { value: 'ap-northeast', label: 'Asia Pacific (Tokyo)' },
                            ]}
                            className="rounded-xl"
                        />
                        <p className="text-xs text-gray-500">All new copilot data and embeddings will be stored in this region. Existing data is not moved automatically.</p>
                    </div>
                </div>
            </Card>

            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                        <FileCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Retention & Compliance</h3>
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Audit Logging</h4>
                            <p className="text-xs text-gray-500">Log all user activity and API requests.</p>
                        </div>
                        <Switcher defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">HIPAA Compliance Mode</h4>
                            <p className="text-xs text-gray-500">Enforce strict data handling for healthcare data.</p>
                        </div>
                        <Switcher />
                    </div>
                </div>
            </Card>
        </div>
    )
}
