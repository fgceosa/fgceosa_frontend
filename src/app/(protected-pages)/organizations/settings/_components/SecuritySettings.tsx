'use client'

import { Card, Switcher, Input, Button } from '@/components/ui'
import { ShieldCheck, Lock, Globe } from 'lucide-react'

export default function SecuritySettings() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Authentication & SSO</h3>
                </div>
                <div className="p-8 space-y-8">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Single Sign-On (SSO)</h4>
                            <p className="text-xs text-gray-500 max-w-md">Enforce SAML based Single Sign-On for your domain. Requires Enterprise plan.</p>
                        </div>
                        <Switcher />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">SSO Provider Domain</label>
                        <Input placeholder="e.g. acme-corp.okta.com" className="rounded-xl" disabled />
                    </div>
                </div>
            </Card>

            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Password Policy</h3>
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Require Minimum Length (12 chars)</span>
                        <Switcher defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Require Special Characters</span>
                        <Switcher defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Enforce 2FA for All Members</span>
                        <Switcher />
                    </div>
                </div>
            </Card>
        </div>
    )
}
