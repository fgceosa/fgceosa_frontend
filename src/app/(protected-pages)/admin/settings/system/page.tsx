'use client'

import React from 'react'
import SystemSettings from './_components/SystemSettings'
import { Settings2 } from 'lucide-react'

export default function SystemSettingsPage() {
    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 p-4 sm:p-8 overflow-x-hidden pt-10">
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col gap-6 pb-2">
                    <div className="space-y-3 lg:space-y-1">
                        <div className="flex items-center gap-3 sm:gap-4 mb-2">
                            <span className="text-[9px] sm:text-xs font-black whitespace-nowrap" style={{ color: '#8B0000' }}>Administrative Control</span>
                            <div className="h-px w-8 sm:w-12" style={{ backgroundColor: 'rgba(139, 0, 0, 0.2)' }} />
                            <span className="text-[9px] sm:text-xs font-black text-gray-900 dark:text-gray-100 whitespace-nowrap">Global Configuration</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                <Settings2 className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#8B0000' }} />
                            </div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                                System Settings
                            </h1>
                        </div>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                            Manage association details, member dues, and platform settings.
                        </p>
                    </div>
                </div>

                <SystemSettings />
            </div>
        </div>
    )
}
