'use client'

import React from 'react'
import { Card } from '@/components/ui'
import { Activity, ShieldCheck, Zap, Plus, Globe, ArrowUpRight, Cpu } from 'lucide-react'
import type { SystemHealthData } from '../types'
import Loading from '@/components/shared/Loading'
import classNames from '@/utils/classNames'

interface SystemHealthProps {
    data?: SystemHealthData
    loading?: boolean
}

export default function SystemHealth({ data, loading }: SystemHealthProps) {
    const uptime = data?.uptime ?? 0
    const latency = data?.latency ?? 0
    const successRate = data?.successRate ?? 0
    const status = data?.status || 'OFFLINE'

    const strokeDashoffset = 440 * (1 - uptime / 100)

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'ONLINE': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100/50'
            case 'DEGRADED': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-100/50'
            default: return 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-100/50'
        }
    }

    return (
        <Card className="group relative shadow-xl border-none bg-white dark:bg-gray-900 overflow-hidden h-full flex flex-col rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-700" />

            <div className="relative z-10 flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">
                            System Health
                        </h3>
                        <p className="text-[10px] font-black text-gray-400">Operational Status</p>
                    </div>
                </div>
                <div className={classNames(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black",
                    getStatusStyles(status)
                )}>
                    <div className={classNames("w-1.5 h-1.5 rounded-full animate-pulse", status === 'ONLINE' ? 'bg-emerald-500' : 'bg-red-500')} />
                    {status}
                </div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loading loading type="qorebit" />
                    </div>
                ) : !data ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4 py-8">
                        <Globe className="w-12 h-12 opacity-10" />
                        <p className="text-sm italic">Status data unavailable</p>
                    </div>
                ) : (
                    <div className="w-full space-y-8">
                        {/* Gauge & Main Metric */}
                        <div className="flex items-center justify-center py-4 relative">
                            {/* Decorative Glow behind gauge */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                            </div>

                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="10"
                                        fill="transparent"
                                        className="text-gray-100 dark:text-gray-800"
                                    />
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="10"
                                        fill="transparent"
                                        strokeDasharray={440}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        className="text-primary transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-gray-900 dark:text-white">{uptime}%</span>
                                    <span className="text-[10px] font-black text-gray-400 mt-1">Uptime</span>
                                </div>
                            </div>
                        </div>

                        {/* Grid Metrics */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="group/item flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-transparent hover:border-blue-100/50 dark:hover:border-blue-900/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center border border-blue-100/50 dark:border-blue-800/20 group-hover/item:scale-110 transition-transform">
                                        <Cpu className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-400 leading-none mb-1">Latency</span>
                                        <span className="text-sm font-black text-gray-900 dark:text-white leading-none">System Global</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-black text-gray-900 dark:text-white">{latency}ms</span>
                                </div>
                            </div>

                            <div className="group/item flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-transparent hover:border-emerald-100/50 dark:hover:border-emerald-900/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-800/20 group-hover/item:scale-110 transition-transform">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-gray-400 leading-none mb-1">Reliability</span>
                                        <span className="text-sm font-black text-gray-900 dark:text-white leading-none">Success Rate</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{successRate}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative z-10 mt-auto pt-6 border-t border-gray-50 dark:border-gray-800">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0055BA] text-white text-[11px] font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group">
                    System Live Logs
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </Card>
    )
}
