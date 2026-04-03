'use client'

import { useState } from 'react'
import { ArrowLeft, Sparkles, CreditCard, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui'
import Link from 'next/link'
import PurchaseTab from '../_components/PurchaseTab'
import { creditPlans } from '@/mock/billing'
import TopUpModal from '@/components/template/Topup/TopUpModal'
import type { TopUpConfig } from '../types'

export default function TopUpPage() {
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
    const [presetPlanId, setPresetPlanId] = useState<string | undefined>()
    const [presetAmount, setPresetAmount] = useState<number | undefined>()
    const [topUpConfig, setTopUpConfig] = useState<TopUpConfig>({})

    const openTopUpModal = (config?: {
        initialStep?: TopUpConfig['initialStep']
        presetPlanId?: string
        presetAmount?: number
    }) => {
        if (config) {
            setTopUpConfig(config)
            setPresetPlanId(config.presetPlanId)
            setPresetAmount(config.presetAmount)
        }
        setIsTopUpModalOpen(true)
    }

    const closeTopUpModal = () => {
        setIsTopUpModalOpen(false)
        setTopUpConfig({})
    }

    return (
        <div className="py-8 px-4 sm:px-6 space-y-12 max-w-full">
            {/* Header Section */}
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <Link
                    href="/dashboard/billing"
                    className="flex items-center gap-2 text-xs font-black text-gray-500 hover:text-primary transition-colors group w-fit"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Billing
                </Link>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-[9px] sm:text-[10px] font-black text-primary whitespace-nowrap uppercase tracking-widest">Pricing</span>
                        <div className="h-px w-12 bg-primary/20" />
                        <span className="text-[9px] sm:text-[10px] font-black text-gray-400 whitespace-nowrap uppercase tracking-widest">Add Credits</span>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                                Add <span className="text-gray-900 dark:text-white">Credits</span>
                            </h1>
                            <p className="text-sm sm:text-base lg:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
                                Choose your credit package to get more credits. Credits are added instantly and never expire.
                            </p>
                        </div>


                    </div>
                </div>
            </div>

            {/* Plans List */}
            <div className="relative z-10">
                <PurchaseTab
                    data={creditPlans}
                    onPurchaseClick={(plan) =>
                        openTopUpModal({
                            initialStep: 'payment',
                            presetPlanId: plan?.id,
                            presetAmount: plan?.amount ? Number(plan.amount) : undefined,
                        })
                    }
                />
            </div>

            {/* Modal */}
            <TopUpModal
                isOpen={isTopUpModalOpen}
                onClose={closeTopUpModal}
                presetPlanId={presetPlanId}
                presetAmount={presetAmount}
                initialStep={topUpConfig.initialStep}
            />

            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/4 -right-48 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -left-48 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>
        </div>
    )
}
