'use client'

import React, { useState } from 'react'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import { Card, Button, Input, Notification, toast } from '@/components/ui'
import {
    Puzzle,
    Search,
    Plus,
    ExternalLink,
    CheckCircle2,
    Zap,
    Settings,
    Grid,
    SearchIcon,
    ArrowUpRight
} from 'lucide-react'
import classNames from '@/utils/classNames'

export default function IntegrationsPage() {
    // Require org_super_admin authority
    useRequireAuthority(['org_super_admin'])

    const [searchQuery, setSearchQuery] = useState('')

    const integrations = [
        {
            name: 'Google Drive',
            description: 'Connect your cloud storage for RAG and document processing.',
            category: 'Storage',
            status: 'connected',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg',
            popularity: 'Most Popular'
        },
        {
            name: 'Slack',
            description: 'Deploy copilots directly into your team channels.',
            category: 'Communication',
            status: 'connected',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
            popularity: 'Top Used'
        },
        {
            name: 'HubSpot',
            description: 'Sync your CRM data for sales automation copilots.',
            category: 'CRM',
            status: 'connected',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/HubSpot_Logo.svg/2560px-HubSpot_Logo.svg.png',
            popularity: 'New'
        },
        {
            name: 'Xero',
            description: 'Automate accounting tasks and financial reporting.',
            category: 'Finance',
            status: 'connected',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Xero_logo.svg/2048px-Xero_logo.svg.png'
        },
        {
            name: 'GitHub',
            description: 'Index your repositories for coding assistance.',
            category: 'Dev Ops',
            status: 'disconnected',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'
        },
        {
            name: 'Microsoft Teams',
            description: 'Enterprise communication integration.',
            category: 'Communication',
            status: 'disconnected',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg'
        }
    ]

    const filteredIntegrations = integrations.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="max-w-[1400px] mx-auto p-4 sm:p-8 space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-orange-100/50 dark:bg-orange-900/20 rounded-[2rem] border border-orange-200 dark:border-orange-800 shadow-xl shadow-orange-200/20 dark:shadow-none">
                        <Puzzle className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white">
                            Connected Apps
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-400 font-black mt-1">
                            Bridge outside data sources to your AI workspace
                        </p>
                    </div>
                </div>
                <Button
                    variant="solid"
                    className="bg-primary hover:bg-primary-deep text-white rounded-2xl shadow-xl shadow-primary/20 font-black text-[10px] px-8 h-12"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Integration
                </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 rounded-[2rem] border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                            <Zap className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400">Active Links</p>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">4 Connected</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 rounded-[2rem] border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <Grid className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400">Available Marketplace</p>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">45+ Plugins</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 rounded-[2rem] border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <Settings className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400">API Status</p>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Healthy</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search & Grid */}
            <div className="space-y-6">
                <div className="relative max-w-xl mx-auto md:mx-0">
                    <Input
                        placeholder="Search integration directory..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-14 pl-12 rounded-2xl bg-white dark:bg-gray-900 border-none shadow-lg shadow-gray-200/50 dark:shadow-none font-bold italic"
                    />
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIntegrations.map((app) => (
                        <Card
                            key={app.name}
                            className="p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all duration-500 bg-white dark:bg-gray-900 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all">
                                <ArrowUpRight className="w-5 h-5 text-primary/30" />
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-lg border border-gray-100 p-2.5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <img src={app.logo} alt={app.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className={classNames(
                                        "px-3 py-1 rounded-full text-[9px] font-black border capitalize",
                                        app.status === 'connected'
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            : "bg-gray-50 text-gray-400 border-gray-100"
                                    )}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white capitalize">{app.name}</h3>
                                        {app.popularity && (
                                            <span className="text-[8px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">{app.popularity}</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                        {app.description}
                                    </p>
                                </div>

                                <div className="pt-4 flex items-center gap-2">
                                    <Button
                                        variant="solid"
                                        className={classNames(
                                            "flex-1 h-10 rounded-xl text-[10px] font-black transition-all",
                                            app.status === 'connected'
                                                ? "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100"
                                                : "bg-primary text-white shadow-lg shadow-primary/20"
                                        )}
                                    >
                                        {app.status === 'connected' ? 'Configure' : 'Connect'}
                                    </Button>
                                    <button className="p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-gray-400 transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
