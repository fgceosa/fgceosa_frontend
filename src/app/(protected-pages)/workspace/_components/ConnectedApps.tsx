'use client'

import React from 'react'
import { Card } from '@/components/ui'
import { CheckCircle2, MoreHorizontal } from 'lucide-react'
import classNames from '@/utils/classNames'

interface ConnectedApp {
    name: string
    id: string
    logo: React.ReactNode
    status: 'connected' | 'error'
}

export default function ConnectedApps() {
    const apps: ConnectedApp[] = [
        {
            name: 'Google Drive',
            id: 'drive',
            logo: (
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 p-1.4 flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" className="w-6 h-6" />
                </div>
            ),
            status: 'connected'
        },
        {
            name: 'Slack',
            id: 'slack',
            logo: (
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 p-1.4 flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" alt="Slack" className="w-6 h-6" />
                </div>
            ),
            status: 'connected'
        },
        {
            name: 'HubSpot',
            id: 'hubspot',
            logo: (
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 p-1.4 flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/HubSpot_Logo.svg/2560px-HubSpot_Logo.svg.png" alt="HubSpot" className="w-6 h-2 object-contain" />
                </div>
            ),
            status: 'connected'
        },
        {
            name: 'Xero',
            id: 'xero',
            logo: (
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 p-1.4 flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Xero_logo.svg/2048px-Xero_logo.svg.png" alt="Xero" className="w-6 h-6" />
                </div>
            ),
            status: 'connected'
        }
    ]

    return (
        <Card className="rounded-[2.5rem] border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                    Connected Apps
                </h3>
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {apps.map((app) => (
                    <div
                        key={app.id}
                        className="p-4 bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col gap-3 group hover:border-primary/30 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            {app.logo}
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                                    Active
                                </span>
                            </div>
                        </div>
                        <span className="text-xs font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                            {app.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800/50 text-center">
                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                    Manage Integrations
                </button>
            </div>
        </Card>
    )
}
