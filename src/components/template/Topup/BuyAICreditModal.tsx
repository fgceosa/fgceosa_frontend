'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui'
import { Building2, CreditCard, Bitcoin, ChevronRight, X, Zap } from 'lucide-react'
import classNames from '@/utils/classNames'

export type PaymentMethod = 'bank_transfer' | 'card' | 'crypto'

interface PaymentOption {
    id: PaymentMethod
    title: string
    description: string
    icon: React.ReactNode
    enabled: boolean
    comingSoon?: boolean
}

interface BuyAICreditModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectMethod: (method: PaymentMethod) => void
    amount?: number
    credits?: number
}

const paymentOptions: PaymentOption[] = [
    {
        id: 'bank_transfer',
        title: 'Pay Via Bank Transfer',
        description: 'Buy AI credit by transferring from your bank app',
        icon: <Building2 className="w-6 h-6" />,
        enabled: true,
    },
    {
        id: 'card',
        title: 'Pay Via Debit/Credit Card',
        description: 'Coming soon!',
        icon: <CreditCard className="w-6 h-6" />,
        enabled: false,
        comingSoon: true,
    },
    {
        id: 'crypto',
        title: 'Pay With Crypto',
        description: 'Coming soon!',
        icon: <Bitcoin className="w-6 h-6" />,
        enabled: false,
        comingSoon: true,
    },
]

export default function BuyAICreditModal({
    isOpen,
    onClose,
    onSelectMethod,
    amount,
    credits,
}: BuyAICreditModalProps) {
    const [hoveredOption, setHoveredOption] = useState<PaymentMethod | null>(null)
    const [selectedOption, setSelectedOption] = useState<PaymentMethod | null>(null)

    const handleSelectOption = (option: PaymentOption) => {
        if (!option.enabled) return
        setSelectedOption(option.id)
        onSelectMethod(option.id)
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={600}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Visual Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Payment Method</h3>
                            <p className="text-[10px] font-black text-gray-400 mt-0.5">Choose how to pay</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-8 space-y-6">
                    {amount !== undefined && credits !== undefined && (
                        <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl border border-primary/10 flex items-center justify-between overflow-hidden relative">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <span className="text-[9px] font-black text-primary">Amount to Pay</span>
                                <div className="text-2xl font-black text-gray-900 dark:text-white">₦{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>
                            <div className="relative z-10 text-right">
                                <span className="text-[9px] font-black text-gray-400">Credits you'll get</span>
                                <div className="text-xl font-black text-primary">{credits.toFixed(2)} CREDITS</div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pl-1">
                            <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                            <h4 className="text-[10px] font-black text-gray-900 dark:text-gray-100">Select your payment method</h4>
                        </div>

                        <div className="grid gap-3">
                            {paymentOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelectOption(option)}
                                    disabled={!option.enabled}
                                    className={classNames(
                                        'w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group',
                                        option.enabled
                                            ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'
                                            : 'bg-gray-50/50 border-gray-50 dark:bg-gray-800/40 dark:border-gray-800/50 cursor-not-allowed opacity-60'
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={classNames(
                                            'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                                            option.enabled
                                                ? 'bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white'
                                                : 'bg-gray-100 text-gray-400'
                                        )}>
                                            {option.icon}
                                        </div>
                                        <div className="text-left">
                                            <h4 className={classNames(
                                                'text-sm font-black tracking-tight',
                                                option.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                                            )}>
                                                {option.title}
                                            </h4>
                                            <p className="text-[10px] font-bold text-gray-500 truncate max-w-[200px]">
                                                {option.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {option.comingSoon && (
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[8px] font-black text-gray-400 tracking-widest">
                                                Coming Soon
                                            </span>
                                        )}
                                        {option.enabled && (
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Visual Footer */}
                <div className="p-8 bg-gray-50/30 dark:bg-gray-800/10 border-t border-gray-50 dark:border-gray-800 text-center">
                    <p className="text-[9px] font-black text-gray-400 leading-relaxed">
                        Your payments are safe and secure • Secure checkout
                    </p>
                </div>
            </div>
        </Dialog>
    )
}
