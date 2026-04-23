'use client'

import React, { useState, useEffect } from 'react'
import { CreditCard, ShieldCheck, Wallet, ExternalLink, Save } from 'lucide-react'
import { Card, Button, Input, Switcher, Select, toast } from '@/components/ui'
import Loading from '@/components/shared/Loading'
import useSystemSettings from '@/utils/hooks/useSystemSettings'

export default function PaymentSettings() {
    const { rawSettings, loading, updateSettings } = useSystemSettings()
    const [saving, setSaving] = useState(false)
    
    const [formData, setFormData] = useState({
        currency: 'NGN',
        payment_enabled: true,
        paystack_public_key: '',
        paystack_secret_key: '',
        bank_name: '',
        account_number: '',
        account_name: '',
    })

    useEffect(() => {
        if (rawSettings) {
            setFormData({
                currency: rawSettings.currency || 'NGN',
                payment_enabled: rawSettings.payment_enabled ?? true,
                paystack_public_key: rawSettings.paystack_public_key || '',
                paystack_secret_key: rawSettings.paystack_secret_key || '',
                bank_name: rawSettings.bank_name || '',
                account_number: rawSettings.account_number || '',
                account_name: rawSettings.account_name || '',
            })
        }
    }, [rawSettings])

    const handleSave = async () => {
        setSaving(true)
        await updateSettings(formData)
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <Loading loading type="association" />
            </div>
        )
    }

    const currencyOptions = [
        { value: 'NGN', label: 'Nigerian Naira (₦)' },
        { value: 'USD', label: 'US Dollar ($)' },
        { value: 'GBP', label: 'British Pound (£)' },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Payment Settings</h2>
                <p className="text-base font-medium text-gray-500">Configure how members pay their dues and manage transaction settings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-900/30 text-blue-600">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Active Payment Provider</h3>
                            <p className="text-sm font-bold text-blue-600 capitalize tracking-tight flex items-center gap-1.5 mt-0.5">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Secured by Paystack
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold capitalize tracking-tight text-gray-400">API Public Key</label>
                            <Input 
                                value={formData.paystack_public_key}
                                onChange={(e) => setFormData(prev => ({ ...prev, paystack_public_key: e.target.value }))}
                                placeholder="pk_test_********************************" 
                                type="password" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold capitalize tracking-tight text-gray-400">API Secret Key</label>
                            <Input 
                                value={formData.paystack_secret_key}
                                onChange={(e) => setFormData(prev => ({ ...prev, paystack_secret_key: e.target.value }))}
                                placeholder="sk_test_********************************" 
                                type="password" 
                            />
                        </div>
                    </div>

                    <Button 
                        variant="plain" 
                        size="sm" 
                        className="h-12 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl font-black text-[10px] capitalize hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        Test Connection
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                </Card>

                <Card className="p-6 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center border border-amber-100 dark:border-amber-900/30 text-amber-600">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Official Bank Account</h3>
                            <p className="text-sm font-bold text-amber-600 capitalize tracking-tight flex items-center gap-1.5 mt-0.5">
                                For Manual Bank Transfers
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold capitalize tracking-tight text-gray-400">Bank Name</label>
                            <Input 
                                value={formData.bank_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                                placeholder="e.g. Zenith Bank PLC" 
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold capitalize tracking-tight text-gray-400">Account Number</label>
                                <Input 
                                    value={formData.account_number}
                                    onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
                                    placeholder="0000000000" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold capitalize tracking-tight text-gray-400">Account Name</label>
                                <Input 
                                    value={formData.account_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
                                    placeholder="FGCEOSA Official" 
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Payment Experience</h3>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div>
                                <h4 className="text-base font-black text-gray-900 dark:text-white">Enable Online Payments</h4>
                                <p className="text-sm font-medium text-gray-500">Allow members to pay via card/bank</p>
                            </div>
                            <Switcher 
                                checked={formData.payment_enabled}
                                onChange={(val) => setFormData(prev => ({ ...prev, payment_enabled: val }))}
                                color="emerald-600" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold capitalize tracking-tight text-gray-400">Default Currency</label>
                            <Select 
                                value={currencyOptions.find(o => o.value === formData.currency)}
                                options={currencyOptions}
                                onChange={(val) => setFormData(prev => ({ ...prev, currency: val?.value || 'NGN' }))}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <div>
                                <h4 className="text-base font-black text-gray-900 dark:text-white">Member Covers Fees</h4>
                                <p className="text-sm font-medium text-gray-500">Add payment gateway charges to member dues</p>
                            </div>
                            <Switcher color="emerald-600" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex justify-end pr-4">
                 <Button 
                    variant="solid" 
                    size="lg" 
                    onClick={handleSave}
                    loading={saving}
                    className="h-12 px-10 bg-[#8B0000] text-white rounded-2xl font-black text-[10px] capitalize shadow-lg shadow-[#8B0000]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Save Payment Settings
                </Button>
            </div>
        </div>
    )
}
