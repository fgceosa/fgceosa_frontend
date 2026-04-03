'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    fetchCampaigns,
    selectCampaigns,
    selectCampaignsTotal,
    selectCampaignsLoading,
    selectBulkCreditsError,
} from '@/store/slices/bulkCredits'
import { Spinner } from '@/components/ui'
import QorebitLoading from '@/components/shared/QorebitLoading'
import { Rocket, Zap, Plus, ShieldCheck, Filter, Download } from 'lucide-react'
import { CampaignCard } from './CampaignCard'
import { CreateCampaignModal } from './CreateCampaignModal'
import type { TreasuryType } from '../../../types'
import classNames from '@/utils/classNames'

interface CampaignsTabProps {
    treasuryType?: TreasuryType
    organizationId?: string
}

export default function CampaignsTab({ treasuryType = 'platform', organizationId }: CampaignsTabProps) {
    const dispatch = useAppDispatch()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const campaigns = useAppSelector(selectCampaigns)
    const total = useAppSelector(selectCampaignsTotal)
    const loading = useAppSelector(selectCampaignsLoading)
    const error = useAppSelector(selectBulkCreditsError)

    const isSuperAdmin = treasuryType === 'platform'

    useEffect(() => {
        dispatch(fetchCampaigns({ organizationId }))
            .unwrap()
            .catch((err) => {
                if (err?.response?.status === 404 || err?.message?.includes('404')) {
                    console.log('Bulk credits campaigns endpoint not available yet')
                }
            })
    }, [dispatch, organizationId])

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Rocket className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Active Programs</h3>
                        <p className="text-xs font-black text-gray-600 dark:text-gray-400 mt-1">
                            {isSuperAdmin ? 'Global account allocation programs' : 'Organization specific programs'} {total > 0 && `(${total} total)`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="h-12 w-12 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm">
                        <Filter className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-12 px-8 bg-primary hover:bg-primary-deep text-white font-black text-sm rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                    >
                        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
                        <span>Start Program</span>
                    </button>
                </div>
            </div>

            {isSuperAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-primary/[0.02] border-primary/10 rounded-3xl flex flex-col gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-primary">Global Override</p>
                            <p className="text-sm font-bold text-gray-500 mt-1 italic">Super Admins can fund any program regardless of org scope.</p>
                        </div>
                    </Card>
                    <Card className="p-6 bg-emerald-500/[0.02] border-emerald-500/10 rounded-3xl flex flex-col gap-4">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                            <Download className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-emerald-600">Program Templates</p>
                            <p className="text-sm font-bold text-gray-500 mt-1 italic">Use standardized structures for new hackathons/bootcamps.</p>
                        </div>
                    </Card>
                </div>
            )}

            {loading && campaigns.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <QorebitLoading />
                </div>
            ) : error && !error.includes('404') && !error.includes('Not Found') ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-rose-500 font-bold text-sm mb-2 tracking-tight">Failed to load programs</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">{error}</p>
                    <button
                        onClick={() => dispatch(fetchCampaigns({}))}
                        className="mt-6 px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary-deep transition-all shadow-xl shadow-primary/20"
                    >
                        Retry Connection
                    </button>
                </div>
            ) : campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mb-6">
                        <Rocket className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                    </div>
                    <p className="text-gray-900 dark:text-white font-black text-lg tracking-tight">No active programs</p>
                    <p className="text-gray-500 text-sm mt-1 italic">Initiate your first credit program to see analytics</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-8 h-12 sm:h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black text-sm rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
                        <span>Create First Program</span>
                    </button>
                </div>
            ) : (
                <div className="grid gap-8">
                    {campaigns.map((campaign, idx) => (
                        <CampaignCard key={campaign.id || idx} campaign={campaign} />
                    ))}
                </div>
            )}

            <CreateCampaignModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    )
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={classNames("bg-white dark:bg-gray-800 border p-6", className)}>
            {children}
        </div>
    )
}
