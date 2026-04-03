'use client'

import { useState } from 'react'
import { Card, Button, toast, Notification as UINotification } from '@/components/ui'
import { CreditCard, Plus, Zap, Settings2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'
import classNames from '@/utils/classNames'

type Props = {
    onPurchaseClick: () => void
}

const PaymentTab = ({ onPurchaseClick }: Props) => {
    const [autoTopUpEnabled, setAutoTopUpEnabled] = useState(false)
    const [threshold, setThreshold] = useState(5000)
    const [reloadAmount, setReloadAmount] = useState(15000)

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                    <Settings2 className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-black text-primary">Billing Settings</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    Payments & Automation
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
                    Streamline your experience with zero-downtime credit management.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Auto Top-up Card */}
                <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 space-y-8">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none">Smart Reload</h3>
                                    <p className="text-xs font-black text-gray-900 dark:text-gray-100 mt-1">Zero-Downtime Protection</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAutoTopUpEnabled(!autoTopUpEnabled)}
                                className={classNames(
                                    "relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20",
                                    autoTopUpEnabled ? "bg-primary" : "bg-gray-200 dark:bg-gray-800"
                                )}
                            >
                                <span
                                    className={classNames(
                                        "inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm",
                                        autoTopUpEnabled ? "translate-x-8" : "translate-x-1"
                                    )}
                                />
                            </button>
                        </div>

                        {/* Instructional Logic Area */}
                        <div className={classNames(
                            "p-6 rounded-3xl border transition-all duration-500",
                            autoTopUpEnabled
                                ? "bg-primary/5 border-primary/20 shadow-inner"
                                : "bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 opacity-60"
                        )}>
                            <div className="space-y-6">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-relaxed tracking-tight">
                                    When my credit balance drops below <span className="text-primary font-black">₦{threshold.toLocaleString()}</span>,
                                    automatically top-up my account with <span className="text-primary font-black">₦{reloadAmount.toLocaleString()}</span>.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2 font-black">
                                        <div className="flex justify-between text-xs font-black text-gray-900 dark:text-gray-100">
                                            <span>Low Balance Threshold</span>
                                            <span className="text-primary">₦{threshold.toLocaleString()}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1000"
                                            max="50000"
                                            step="1000"
                                            disabled={!autoTopUpEnabled}
                                            value={threshold}
                                            onChange={(e) => setThreshold(Number(e.target.value))}
                                            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary disabled:cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2 font-black">
                                        <div className="flex justify-between text-xs font-black text-gray-900 dark:text-gray-100">
                                            <span>Automatic Top-up Amount</span>
                                            <span className="text-primary">₦{reloadAmount.toLocaleString()}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="5000"
                                            max="200000"
                                            step="5000"
                                            disabled={!autoTopUpEnabled}
                                            value={reloadAmount}
                                            onChange={(e) => setReloadAmount(Number(e.target.value))}
                                            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Benefits Info */}
                        <div className="flex items-start gap-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/20">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-black text-emerald-800 dark:text-emerald-400 tracking-tight leading-none">Continuous Service</p>
                                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-500 leading-relaxed tracking-tight">
                                    Auto-reload prevents your API requests from failing when you run out of credits.
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="solid"
                            disabled={!autoTopUpEnabled}
                            className="w-full h-14 bg-primary hover:bg-primary-deep text-white font-black text-xs rounded-2xl shadow-xl shadow-primary/20"
                            onClick={() => {
                                toast.push(
                                    <UINotification type="success" title="Settings Saved" duration={3000}>
                                        Automatic reload rule has been updated.
                                    </UINotification>
                                )
                            }}
                        >
                            Save Reload Rule
                        </Button>
                    </div>
                </Card>

                {/* Payment Methods Card */}
                <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 space-y-8">
                        {/* Header */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                                <CreditCard className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none">Saved Cards</h3>
                                <p className="text-xs font-black text-gray-900 dark:text-gray-100 mt-1">Encrypted Payment Methods</p>
                            </div>
                        </div>

                        {/* Primary Card Visualization - Realistic Glassmorphism */}
                        <div className="relative p-8 bg-gradient-to-br from-primary via-primary-deep/90 to-black rounded-[2rem] overflow-hidden shadow-2xl group border border-white/10">
                            {/* Texture & Light Effects */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

                            <div className="flex justify-between items-start mb-16 relative z-10">
                                {/* Chip Visualization */}
                                <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-md shadow-inner relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 border border-black/10" />
                                    <div className="w-full h-[1px] bg-black/10 absolute top-1/4" />
                                    <div className="w-full h-[1px] bg-black/10 absolute top-2/4" />
                                    <div className="w-full h-[1px] bg-black/10 absolute top-3/4" />
                                    <div className="h-full w-[1px] bg-black/10 absolute left-1/4" />
                                    <div className="h-full w-[1px] bg-black/10 absolute left-2/4" />
                                    <div className="h-full w-[1px] bg-black/10 absolute left-3/4" />
                                </div>
                                <div className="px-3 py-1 bg-white/10 backdrop-blur-xl text-white text-[10px] font-black rounded-full border border-white/20 shadow-lg">
                                    Primary Source
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <p className="text-white text-3xl font-black tracking-[0.25em] mb-2 drop-shadow-lg opacity-90">•••• •••• •••• 4242</p>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-white/40 font-black leading-none">Expiration</p>
                                        <p className="text-white font-bold text-sm tracking-widest drop-shadow-md leading-none">12 / 26</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400 drop-shadow-md" />
                                        <span className="text-[10px] text-white font-black drop-shadow-md">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="pt-2 space-y-4">
                            <button
                                onClick={onPurchaseClick}
                                className="w-full h-14 bg-gray-50/50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 font-black rounded-2xl text-xs hover:bg-white dark:hover:bg-gray-800 hover:border-primary/20 transition-all flex items-center justify-center gap-3"
                            >
                                <Plus className="w-4 h-4" />
                                Add Backup Method
                            </button>

                            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 opacity-30 select-none grayscale">
                                {['VISA', 'MASTERCARD', 'VERVE'].map(brand => (
                                    <span key={brand} className="text-xs font-black text-gray-400">{brand}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default PaymentTab

