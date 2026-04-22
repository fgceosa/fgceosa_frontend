'use client'

import React, { useState, useEffect } from 'react'
import { Settings2, BellRing, Mail, Clock, Save, ShieldAlert } from 'lucide-react'
import { Card, Button, Input, Switcher, Select, toast } from '@/components/ui'
import Loading from '@/components/shared/Loading'
import useSystemSettings from '@/utils/hooks/useSystemSettings'

export default function SystemPreferences() {
    const { rawSettings, loading, updateSettings } = useSystemSettings()
    const [saving, setSaving] = useState(false)
    
    const [formData, setFormData] = useState({
        default_member_status: 'active',
        allow_self_registration: true,
        enable_email_notifications: true,
        timezone: 'WAT',
        date_format: 'DD/MM/YYYY',
    })

    useEffect(() => {
        if (rawSettings) {
            setFormData({
                default_member_status: rawSettings.default_member_status || 'active',
                allow_self_registration: rawSettings.allow_self_registration ?? true,
                enable_email_notifications: rawSettings.enable_email_notifications ?? true,
                timezone: rawSettings.timezone || 'WAT',
                date_format: rawSettings.date_format || 'DD/MM/YYYY',
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

    const statusOptions = [
        { value: 'active', label: 'Active (Instant Access)' },
        { value: 'pending', label: 'Pending (Manual Approval)' },
        { value: 'inactive', label: 'Inactive' },
    ]

    const timezoneOptions = [
        { value: 'WAT', label: 'West Africa Time (GMT+1)' },
        { value: 'GMT', label: 'Greenwich Mean Time (GMT+0)' },
        { value: 'EST', label: 'Eastern Standard Time (GMT-5)' },
    ]

    const dateFormatOptions = [
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)' },
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)' },
        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)' },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">System Preferences</h2>
                <p className="text-base font-medium text-gray-500">Global system configuration and general application rules.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Registration Rules */}
                 <Card className="p-6 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Account & Signups</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold capitalize tracking-tight text-gray-400">New Account Status</label>
                            <Select 
                                value={statusOptions.find(o => o.value === formData.default_member_status)}
                                options={statusOptions}
                                onChange={(val) => setFormData(prev => ({ ...prev, default_member_status: val?.value || 'active' }))}
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="w-5 h-5 text-amber-600" />
                                <div>
                                    <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400 capitalize tracking-tight">Allow Alumni Signups</h4>
                                    <p className="text-sm font-medium text-amber-700/70">Allow new alumni to sign up</p>
                                </div>
                            </div>
                            <Switcher 
                                checked={formData.allow_self_registration}
                                onChange={(val) => setFormData(prev => ({ ...prev, allow_self_registration: val }))}
                                color="amber-600" 
                            />
                        </div>
                    </div>
                </Card>

                {/* Communication Settings */}
                <Card className="p-6 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Notifications & Emails</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold capitalize tracking-tight text-gray-400">Platform Notifications</label>
                            <p className="text-sm font-medium text-gray-500 italic">Global toggle for automated emails</p>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                             <div className="flex items-center gap-3">
                                <BellRing className="w-5 h-5 text-[#8B0000]" />
                                <div>
                                    <h4 className="text-base font-black text-gray-900 dark:text-white">System Emails</h4>
                                    <p className="text-sm font-medium text-gray-500">Send system-wide alerts</p>
                                </div>
                            </div>
                            <Switcher 
                                checked={formData.enable_email_notifications}
                                onChange={(val) => setFormData(prev => ({ ...prev, enable_email_notifications: val }))}
                            />
                        </div>
                    </div>
                </Card>

                {/* Regional & Time */}
                <Card className="p-6 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6 md:col-span-2">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Time & Date</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold capitalize tracking-tight text-gray-400">Select Timezone</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Select 
                                    className="pl-7"
                                    value={timezoneOptions.find(o => o.value === formData.timezone)}
                                    options={timezoneOptions}
                                    onChange={(val) => setFormData(prev => ({ ...prev, timezone: val?.value || 'WAT' }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold capitalize tracking-tight text-gray-400">Date Format</label>
                            <Select 
                                value={dateFormatOptions.find(o => o.value === formData.date_format)}
                                options={dateFormatOptions}
                                onChange={(val) => setFormData(prev => ({ ...prev, date_format: val?.value || 'DD/MM/YYYY' }))}
                            />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="pt-4 flex justify-end">
                <Button 
                    variant="solid" 
                    size="lg" 
                    onClick={handleSave}
                    loading={saving}
                    className="h-12 px-10 bg-[#8B0000] text-white rounded-2xl font-black text-[10px] capitalize shadow-lg shadow-[#8B0000]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Save Settings
                </Button>
            </div>
        </div>
    )
}
