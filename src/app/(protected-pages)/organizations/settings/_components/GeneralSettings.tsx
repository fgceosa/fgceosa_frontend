'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    fetchMyOrganization,
    updateOrganization,
} from '@/store/slices/organization/organizationThunk'
import {
    selectCurrentOrganization,
    selectOrganizationLoading,
    selectOrganizationError,
} from '@/store/slices/organization/organizationSelectors'
import {
    Button,
    Card,
    Input,
    Notification,
    toast,
    Select,
} from '@/components/ui'
import { Save, Building2, Upload as UploadIcon } from 'lucide-react'

export default function GeneralSettings() {
    const dispatch = useAppDispatch()

    const currentOrganization = useAppSelector(selectCurrentOrganization)
    const loading = useAppSelector(selectOrganizationLoading)
    const error = useAppSelector(selectOrganizationError)

    const [orgName, setOrgName] = useState('')
    const [orgDescription, setOrgDescription] = useState('')

    useEffect(() => {
        if (!currentOrganization) {
            dispatch(fetchMyOrganization())
        }
    }, [dispatch, currentOrganization])

    useEffect(() => {
        if (currentOrganization) {
            setOrgName(currentOrganization.name)
            setOrgDescription(currentOrganization.description || '')
        }
    }, [currentOrganization])

    const handleUpdateOrganization = async () => {
        if (!orgName.trim()) {
            toast.push(<Notification type="warning" duration={2000}>Please enter an organization name</Notification>)
            return
        }
        try {
            await dispatch(
                updateOrganization({ name: orgName, description: orgDescription }),
            ).unwrap()
            toast.push(<Notification type="success" duration={2000}>Organization updated successfully</Notification>)
        } catch (err: any) {
            toast.push(<Notification type="danger" duration={3000}>{err || 'Failed to update organization'}</Notification>)
        }
    }

    if (!currentOrganization && loading) {
        return <div className="p-8 text-center italic text-gray-500">Loading organization profile...</div>
    }

    if (!currentOrganization) return null

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Organization Profile</h3>
                </div>
                <div className="p-8 space-y-8">
                    {/* Logo Section */}
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative group cursor-pointer transition-all hover:border-primary/50 overflow-hidden">
                            <div className="text-3xl font-black text-gray-300 dark:text-gray-600">
                                {orgName.substring(0, 1).toUpperCase()}
                            </div>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <UploadIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Organization Logo</h4>
                            <p className="text-xs text-gray-500 max-w-xs">Upload a logo to identify your organization across Qorebit. Recommended size: 512x512px.</p>
                            <Button size="sm" variant="default" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">Upload New</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Organization Name <span className="text-red-500">*</span></label>
                            <Input
                                placeholder="Enter organization name"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                className="h-12 rounded-xl border-gray-200 dark:border-gray-800 font-bold"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Industry</label>
                            <Select
                                placeholder="Select Industry"
                                options={[
                                    { value: 'tech', label: 'Technology' },
                                    { value: 'finance', label: 'Finance' },
                                    { value: 'healthcare', label: 'Healthcare' },
                                    { value: 'other', label: 'Other' }
                                ]}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Country / Region</label>
                            <Select
                                placeholder="Select Country"
                                options={[
                                    { value: 'us', label: 'United States' },
                                    { value: 'uk', label: 'United Kingdom' },
                                    { value: 'eu', label: 'European Union' },
                                ]}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Default Timezone</label>
                            <Select
                                placeholder="Select Timezone"
                                options={[
                                    { value: 'utc', label: 'UTC' },
                                    { value: 'est', label: 'EST' },
                                    { value: 'pst', label: 'PST' },
                                ]}
                                className="rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Description</label>
                        <Input
                            placeholder="Briefly describe your organization..."
                            value={orgDescription}
                            onChange={(e) => setOrgDescription(e.target.value)}
                            textArea
                            rows={3}
                            className="rounded-xl border-gray-200 dark:border-gray-800 p-4 resize-none font-medium"
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-50 dark:border-gray-800">
                        <Button
                            variant="solid"
                            onClick={handleUpdateOrganization}
                            loading={loading}
                            className="h-12 px-8 bg-primary text-white font-black text-xs rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
