
'use client'

import React, { useState } from 'react'
import { Card, Button, Tabs, Notification, toast } from '@/components/ui'
import {
    Settings,
    Building2,
    Shield,
    Bot,
    Users,
    Database,
    Lock,
    Bell
} from 'lucide-react'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import classNames from '@/utils/classNames'

// Components
import GeneralSettings from './_components/GeneralSettings'
import MembersAccessSettings from './_components/MembersAccessSettings'
import CopilotManagementSettings from './_components/CopilotManagementSettings'
import SecuritySettings from './_components/SecuritySettings'
import AuditLogsSettings from './_components/AuditLogsSettings'
import DataComplianceSettings from './_components/DataComplianceSettings'

const { TabNav, TabList, TabContent } = Tabs

export default function OrganizationSettingsPage() {
    // Require org_super_admin or org_admin authority
    useRequireAuthority(['org_super_admin', 'org_admin'])

    const [activeTab, setActiveTab] = useState('general')

    const settingsTabs = [
        { label: 'General', value: 'general', icon: Building2 },
        { label: 'Access Control', value: 'access', icon: Users },
        { label: 'AI & Copilot', value: 'copilots', icon: Bot },
        { label: 'Security', value: 'security', icon: Shield },
        { label: 'Compliance', value: 'compliance', icon: Database },
    ]

    return (
        <div className="max-w-[1400px] mx-auto p-4 sm:p-8 space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
                <div className="space-y-4 lg:space-y-1">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-xs font-black text-primary whitespace-nowrap">Organization</span>
                        <div className="h-px w-12 bg-primary/20" />
                        <span className="text-xs font-black text-gray-900 dark:text-gray-100 whitespace-nowrap">Settings</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                            <Settings className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                            Organization Settings
                        </h1>
                    </div>
                    <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                        Manage your organization's core parameters, security protocols, and operational defaults.
                    </p>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                {/* Left Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-2">
                    {settingsTabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={classNames(
                                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group font-bold text-sm",
                                    activeTab === tab.value
                                        ? "bg-primary text-white shadow-xl shadow-primary/20"
                                        : "bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={classNames(
                                        "w-5 h-5 transition-transform group-hover:scale-110",
                                        activeTab === tab.value ? "text-white" : "text-gray-400"
                                    )} />
                                    <span>{tab.label}</span>
                                </div>
                                {activeTab === tab.value && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-9">
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        {activeTab === 'general' && <GeneralSettings />}
                        {activeTab === 'access' && <MembersAccessSettings />}
                        {activeTab === 'copilots' && <CopilotManagementSettings />}
                        {activeTab === 'security' && <SecuritySettings />}
                        {activeTab === 'compliance' && <DataComplianceSettings />}
                    </div>
                </div>
            </div>
        </div>
    )
}
