'use client'

import React from 'react'
import { Card } from '@/components/ui'
import { ArrowUpRight, Building2, Trophy, MoreHorizontal, Zap, TrendingUp } from 'lucide-react'
import type { TopWorkspace } from '../types'
import Loading from '@/components/shared/Loading'
import classNames from '@/utils/classNames'

interface TopWorkspacesProps {
    workspaces?: TopWorkspace[]
    loading?: boolean
}

export default function TopWorkspaces({ workspaces = [], loading }: TopWorkspacesProps) {
    const data = workspaces || []
    const maxRevenue = Math.max(...data.map(w => w.revenue), 1)

    return (
        <Card className="group relative shadow-xl border-none bg-white dark:bg-gray-900 overflow-hidden flex flex-col rounded-[2.5rem] p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-700" />

            <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white leading-none mb-1">
                            Top Workspaces
                        </h3>
                        <p className="text-[9px] font-black text-gray-400">Platform Leaderboard</p>
                    </div>
                </div>

            </div>

            <div className="relative z-10 flex-1 flex flex-col min-h-[250px]">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loading loading type="qorebit" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                            <Building2 className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-sm font-medium italic">No workspace data tracked yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.map((ws, index) => {
                            const progress = (ws.revenue / maxRevenue) * 100
                            const rank = index + 1

                            return (
                                <div
                                    key={ws.id || ws.name}
                                    className="group/item relative p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Rank Indicator */}
                                        <div className={classNames(
                                            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black",
                                            rank === 1 ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40" :
                                                rank === 2 ? "bg-slate-100 text-slate-600 dark:bg-slate-800" :
                                                    rank === 3 ? "bg-orange-100 text-orange-600 dark:bg-orange-900/40" :
                                                        "bg-gray-100 text-gray-400 dark:bg-gray-900"
                                        )}>
                                            {rank}
                                        </div>

                                        {/* Avatar */}
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0055BA] to-blue-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20 group-hover/item:scale-110 transition-transform duration-500">
                                                {ws.name.charAt(0).toUpperCase()}
                                            </div>
                                            {rank === 1 && (
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-sm">
                                                    <Zap className="w-2 h-2 text-white fill-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900 dark:text-white truncate group-hover/item:text-primary transition-colors">
                                                        {ws.name}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Zap className="w-3 h-3 text-amber-500" />
                                                        <span className="text-[10px] font-black text-gray-400 leading-none">
                                                            {ws.tokens} Tokens
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-black text-[#0055BA] dark:text-blue-400 leading-none mb-0.5">
                                                        ₦{ws.revenue.toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center justify-end gap-1 text-[9px] font-bold text-gray-400">
                                                        Revenue
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="relative h-1.5 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-sm"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-gray-50 dark:border-gray-800">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0055BA] text-white text-[11px] font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group">
                    View Complete Platform Report
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </Card>
    )
}
