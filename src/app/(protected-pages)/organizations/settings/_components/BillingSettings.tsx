'use client'

import { Card, Button, Input } from '@/components/ui'
import { CreditCard, Receipt, Wallet } from 'lucide-react'

export default function BillingSettings() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Billing Overview</h3>
                </div>
                <div className="p-8 space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 mb-1">Current Plan</p>
                                <h2 className="text-2xl font-black">Enterprise</h2>
                            </div>
                            <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20">
                                <span className="text-[10px] font-black text-white">Active</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100 font-bold">Manage Subscription</Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Payment Methods</h3>
                </div>
                <div className="p-8 space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                                <span className="text-[10px] font-bold">VISA</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Visa ending in 4242</p>
                                <p className="text-xs text-gray-500">Expires 12/28</p>
                            </div>
                        </div>
                        <Button size="sm" variant="plain" className="text-gray-500 hover:text-gray-900">Edit</Button>
                    </div>
                    <Button variant="plain" className="w-full h-12 border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-400 hover:border-primary hover:text-primary font-bold transition-all rounded-xl">
                        + Add Payment Method
                    </Button>
                </div>
            </Card>

            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Billing Contacts</h3>
                </div>
                <div className="p-8 space-y-4">
                    <p className="text-xs text-gray-500 mb-2">Invoices will be sent to the following email addresses.</p>
                    <Input placeholder="billing@company.com" className="rounded-xl" />
                </div>
            </Card>
        </div>
    )
}
