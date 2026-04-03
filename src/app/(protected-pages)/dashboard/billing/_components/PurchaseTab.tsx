'use client'

import React, { useState } from 'react'
import { Button, Card } from '@/components/ui'
import { CreditPlan } from '../types'
import { ArrowRight, Sparkles, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react'
import classNames from '@/utils/classNames'

type Props = {
    data: CreditPlan[]
    onPurchaseClick: (plan: CreditPlan) => void
}

const PurchaseTab = ({ data, onPurchaseClick }: Props) => {
    const [selectedId, setSelectedId] = useState<string | null>(data.find(p => p.popular)?.id ?? data[0]?.id ?? null)

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-black text-primary">Plans</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                    Choose Your Credit Package
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-relaxed">
                    Get credits instantly and use them whenever you need. They never expire.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-0">
                {data.map((plan: CreditPlan, index: number) => {
                    const isSelected = selectedId === plan.id;

                    return (
                        <Card
                            key={plan.id ?? index}
                            className={classNames(
                                "relative w-full border-none rounded-3xl transition-all duration-500 overflow-hidden group cursor-pointer",
                                isSelected
                                    ? "shadow-2xl shadow-primary/20 bg-white dark:bg-gray-900 scale-105 z-10 ring-4 ring-primary"
                                    : plan.popular
                                        ? "shadow-2xl shadow-primary/20 bg-white dark:bg-gray-900 scale-105 z-10 ring-4 ring-primary/10"
                                        : "shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 hover:scale-[1.02] border border-transparent"
                            )}
                            onClick={() => setSelectedId(plan.id ?? null)}
                        >
                            {plan.popular && (
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                                    <div className="bg-primary text-white rounded-full px-4 py-1.5 text-[8px] font-black flex items-center gap-2 shadow-xl shadow-primary/30 whitespace-nowrap">
                                        <Sparkles className="w-3 h-3" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <div className="p-6 space-y-6">
                                {/* Plan Header */}
                                <div className={classNames("space-y-4", plan.popular ? "pt-10" : "pt-2")}>
                                    <div className={classNames(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12",
                                        isSelected || plan.popular ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-gray-50 dark:bg-gray-800 text-primary border border-gray-100 dark:border-gray-700"
                                    )}>
                                        <Zap className="w-6 h-6" />
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black text-gray-900 dark:text-white">{plan.name}</h4>
                                        <p className="text-gray-400 dark:text-gray-500 text-[11px] font-medium leading-normal italic line-clamp-2 min-h-[2.5rem]">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="space-y-0">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-gray-900 dark:text-white">
                                                {typeof plan.amount === 'number' ? `₦${plan.amount.toLocaleString()}` : plan.amount}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <div className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-black text-[9px] text-gray-500">
                                                {plan.credits.toLocaleString()} Credits
                                            </div>
                                            {plan.bonus && (
                                                <div className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded font-black text-[9px] border border-emerald-100 dark:border-emerald-800/50">
                                                    +{plan.bonus}% Bonus
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-800" />

                                {/* Features */}
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black text-gray-400 dark:text-gray-500">Service Level</p>
                                    <div className="space-y-2">
                                        {[
                                            'Instant Activation',
                                            'No Expiration',
                                            'Priority Support',
                                            'All Models Access'
                                        ].map((feature, fIdx) => (
                                            <div key={fIdx} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPurchaseClick(plan);
                                    }}
                                    className={classNames(
                                        "w-full h-11 rounded-xl flex items-center justify-center gap-2 font-black text-[9px] transition-all duration-300 group/btn",
                                        "bg-primary text-white shadow-xl shadow-primary/30 hover:bg-primary-deep"
                                    )}
                                >
                                    <span>Select Plan</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </Card>
                    )
                })}
            </div>


            {/* Security Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-6 pb-2 sm:pt-8 sm:pb-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-500/50" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 leading-none">Safe & Secure</span>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Encrypted Payments</span>
                    </div>
                </div>
                <div className="w-px h-10 bg-gray-100 dark:bg-gray-800 hidden sm:block" />
                <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-indigo-500/50" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 leading-none">Instant Boost</span>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Credits added immediately</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PurchaseTab

