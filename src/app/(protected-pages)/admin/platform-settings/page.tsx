'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Button, Tabs, Dialog } from '@/components/ui'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import QorebitLoading from '@/components/shared/QorebitLoading'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    fetchPlatformSettings,
    updatePlatformSettings,
    selectPlatformSettingsData,
    selectPlatformSettingsLoading,
    selectPlatformSettingsError,
    updateSettingsLocal
} from '@/store/slices/platformSettings'
import { GeneralSettingsCard } from './_components/GeneralSettingsCard'
import { NotificationSettingsCard } from './_components/NotificationSettingsCard'
import { PaymentSettingsCard } from './_components/PaymentSettingsCard'
import { GatewaySettingsCard } from './_components/GatewaySettingsCard'
import { EmailSettingsCard } from './_components/EmailSettingsCard'
import { SecuritySettingsCard } from './_components/SecuritySettingsCard'
import { RateLimitSettingsCard } from './_components/RateLimitSettingsCard'
import { IntegrationSettingsCard } from './_components/IntegrationSettingsCard'
import { ComplianceSettingsCard } from './_components/ComplianceSettingsCard'
import UserProfileForm from '../../dashboard/user-settings/_components/UserProfileForm'
import PasswordSettingsCard from '../../dashboard/user-settings/_components/PasswordSettingsCard'
import CommunityAndReferral from '../../dashboard/user-settings/_components/CommunityAndReferral'
import { fetchUserProfile } from '@/store/slices/userSettings'
import { useSearchParams, useRouter } from 'next/navigation'
import {
    User,
    Lock,
    Users,
    Settings2,
    Bell,
    CreditCard,
    ShieldCheck,
    Mail,
    Activity,
    Save,
    ShieldAlert,
    Link2,
    X
} from 'lucide-react'
import type { PlatformSettingsData } from './types'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

const { TabNav, TabList, TabContent } = Tabs

export default function PlatformSettingsPage() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentTab = searchParams.get('tab') || 'general'

    // Redux State
    const serverSettings = useAppSelector(selectPlatformSettingsData)
    const { fetch: isFetching, update: isUpdating } = useAppSelector(selectPlatformSettingsLoading)
    const error = useAppSelector(selectPlatformSettingsError)

    // Local Draft State
    const [draftSettings, setDraftSettings] = useState<PlatformSettingsData | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    // Initialize draft from server settings
    useEffect(() => {
        dispatch(fetchPlatformSettings())
        dispatch(fetchUserProfile() as any)
    }, [dispatch])

    useEffect(() => {
        if (serverSettings && !draftSettings) {
            setDraftSettings(cloneDeep(serverSettings))
        }
    }, [serverSettings, draftSettings])

    // Change Detection
    const hasUnsavedChanges = useMemo(() => {
        if (!serverSettings || !draftSettings) return false
        return !isEqual(serverSettings, draftSettings)
    }, [serverSettings, draftSettings])

    const handleSettingChange = useCallback((section: keyof PlatformSettingsData, key: string, value: any) => {
        setDraftSettings(prev => {
            if (!prev) return null
            const currentSectionValue = prev[section]

            // If it's a primitive (like updatedAt), handle it directly
            if (typeof currentSectionValue !== 'object' || currentSectionValue === null) {
                return {
                    ...prev,
                    [section]: value
                }
            }

            return {
                ...prev,
                [section]: {
                    ...currentSectionValue,
                    [key]: value
                }
            }
        })
    }, [])

    // Memoized change handlers for each section to prevent unnecessary re-renders
    const handleGeneralChange = useCallback((key: string, value: any) => {
        handleSettingChange('general', key, value)
    }, [handleSettingChange])

    const handleNotificationsChange = useCallback((key: string, value: any) => {
        handleSettingChange('notifications', key, value)
    }, [handleSettingChange])

    const handlePaymentsChange = useCallback((key: string, value: any) => {
        handleSettingChange('payments', key, value)
    }, [handleSettingChange])

    const handleEmailChange = useCallback((key: string, value: any) => {
        handleSettingChange('email', key, value)
    }, [handleSettingChange])

    const handleSecurityChange = useCallback((key: string, value: any) => {
        handleSettingChange('security', key, value)
    }, [handleSettingChange])

    const handleRateLimitingChange = useCallback((key: string, value: any) => {
        handleSettingChange('rateLimiting', key, value)
    }, [handleSettingChange])

    const handleComplianceChange = useCallback((key: string, value: any) => {
        handleSettingChange('compliance', key, value)
    }, [handleSettingChange])

    const handleDiscardLocalChanges = useCallback(() => {
        if (serverSettings) {
            setDraftSettings(cloneDeep(serverSettings))
            toast.push(
                <Notification type="info" title="Draft Discarded">
                    Local modifications have been reverted to the last synchronized state.
                </Notification>
            )
        }
    }, [serverSettings])

    const handleSyncPlatformPolicy = useCallback(async () => {
        if (!draftSettings) return

        try {
            const resultAction = await dispatch(updatePlatformSettings(draftSettings))

            if (updatePlatformSettings.fulfilled.match(resultAction)) {
                toast.push(
                    <Notification type="success" title="Settings Updated">
                        Your settings have been successfully updated.
                    </Notification>
                )
                setIsConfirmOpen(false)
                setDraftSettings(cloneDeep(resultAction.payload))
            } else {
                throw new Error(resultAction.payload as string)
            }
        } catch (err: any) {
            toast.push(
                <Notification type="danger" title="Update Failed">
                    {err.message || 'An error occurred while saving your settings.'}
                </Notification>
            )
        }
    }, [draftSettings, dispatch])

    if (isFetching && !serverSettings) {
        return <QorebitLoading />
    }

    if (error && !serverSettings) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <ShieldAlert className="w-12 h-12 text-red-500" />
                <h2 className="text-xl font-black uppercase text-gray-900 dark:text-white">External Policy Error</h2>
                <p className="text-gray-500 max-w-md text-center">{error}</p>
                <Button variant="solid" onClick={() => dispatch(fetchPlatformSettings())}>Retry Synchronization</Button>
            </div>
        )
    }

    if (!draftSettings) return null

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 -m-4 sm:-m-8 p-4 sm:p-8">
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700">
                {/* Enterprise Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2">
                    <div className="space-y-4 lg:space-y-1">
                        <div className="flex items-center gap-4 mb-2">
                            <span className="text-[10px] font-black text-primary whitespace-nowrap">Governance & Security</span>
                            <div className="h-px w-12 bg-primary/20" />
                            <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">Global Configuration</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                <Settings2 className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-none">
                                Platform Settings
                            </h1>
                        </div>
                        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed italic">
                            Global system configurations and security controls.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        {hasUnsavedChanges && (
                            <Button
                                variant="plain"
                                onClick={handleDiscardLocalChanges}
                                className="text-gray-400 font-bold text-[10px] hover:text-gray-900 dark:hover:text-white"
                            >
                                Discard Draft
                            </Button>
                        )}
                        <Button
                            variant="solid"
                            loading={isUpdating}
                            disabled={!hasUnsavedChanges || isUpdating}
                            onClick={() => setIsConfirmOpen(true)}
                            className="h-12 sm:h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] sm:text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group w-full sm:w-auto disabled:opacity-50 disabled:scale-100"
                        >
                            <Save className="w-4 h-4 transition-transform group-hover:rotate-12" />
                            <span>Save Changes</span>
                        </Button>
                    </div>
                </div>


                {/* Application Configuration Tabs */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />

                    <div className="relative z-10">
                        <Tabs
                            value={currentTab}
                            onChange={(val) => router.push(`/admin/platform-settings?tab=${val}`)}
                            className="w-full"
                        >
                            <TabList className="bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl w-fit mb-8 border border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto scrollbar-hide">
                                <TabNav value="general" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap text-gray-900">
                                    <Settings2 className="w-4 h-4" />
                                    <span>System</span>
                                </TabNav>
                                <TabNav value="account" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap text-gray-900">
                                    <User className="w-4 h-4" />
                                    <span>Profile</span>
                                </TabNav>
                                <TabNav value="security-info" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap text-gray-900">
                                    <Lock className="w-4 h-4" />
                                    <span>Security</span>
                                </TabNav>
                                <TabNav value="notifications" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap text-gray-900">
                                    <Bell className="w-4 h-4" />
                                    <span>Alerts</span>
                                </TabNav>
                                <TabNav value="payments" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap text-gray-900">
                                    <CreditCard className="w-4 h-4" />
                                    <span>Billing</span>
                                </TabNav>
                                {/* <TabNav value="integrations" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap text-gray-900">
                                    <Link2 className="w-4 h-4" />
                                    <span>Connect</span>
                                </TabNav> */}
                                <TabNav value="compliance" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap text-gray-900">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Policy</span>
                                </TabNav>
                                <TabNav value="email" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap text-gray-900">
                                    <Mail className="w-4 h-4" />
                                    <span>Mail</span>
                                </TabNav>
                                <TabNav value="security" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap text-gray-900">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Auth</span>
                                </TabNav>
                                <TabNav value="api" className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-xs whitespace-nowrap text-gray-900">
                                    <Activity className="w-4 h-4" />
                                    <span>Usage</span>
                                </TabNav>
                            </TabList>

                            <div className="mt-0">
                                <TabContent value="general">
                                    <GeneralSettingsCard
                                        settings={{ ...draftSettings.general, updatedAt: draftSettings.updatedAt }}
                                        onChange={handleGeneralChange}
                                    />
                                </TabContent>
                                <TabContent value="account">
                                    <UserProfileForm />
                                </TabContent>
                                <TabContent value="security-info">
                                    <PasswordSettingsCard />
                                </TabContent>
                                <TabContent value="notifications">
                                    <NotificationSettingsCard
                                        settings={{ ...draftSettings.notifications, updatedAt: draftSettings.updatedAt }}
                                        onChange={handleNotificationsChange}
                                    />
                                </TabContent>
                                <TabContent value="payments" className="space-y-8">
                                    <PaymentSettingsCard
                                        settings={{ ...draftSettings.payments, updatedAt: draftSettings.updatedAt }}
                                        onChange={handlePaymentsChange}
                                    />
                                </TabContent>
                                {/* <TabContent value="integrations" className="space-y-10">
                                    <IntegrationSettingsCard
                                        settings={{ ...draftSettings.integrations, updatedAt: draftSettings.updatedAt }}
                                        onChange={(key: string, val: any) => handleSettingChange('integrations', key, val)}
                                    />
                                    <GatewaySettingsCard
                                        settings={{ ...draftSettings.gateways, updatedAt: draftSettings.updatedAt }}
                                        onChange={(key: string, val: any) => handleSettingChange('gateways', key, val)}
                                    />
                                </TabContent> */}
                                <TabContent value="compliance">
                                    <ComplianceSettingsCard
                                        settings={{ ...draftSettings.compliance, updatedAt: draftSettings.updatedAt }}
                                        onChange={handleComplianceChange}
                                    />
                                </TabContent>
                                <TabContent value="email">
                                    <EmailSettingsCard
                                        settings={{ ...draftSettings.email, updatedAt: draftSettings.updatedAt }}
                                        onChange={handleEmailChange}
                                        saving={isUpdating}
                                    />
                                </TabContent>
                                <TabContent value="security">
                                    <SecuritySettingsCard
                                        settings={{ ...draftSettings.security, updatedAt: draftSettings.updatedAt }}
                                        onChange={handleSecurityChange}
                                    />
                                </TabContent>
                                <TabContent value="api">
                                    <RateLimitSettingsCard
                                        settings={{ ...draftSettings.rateLimiting, updatedAt: draftSettings.updatedAt }}
                                        onChange={handleRateLimitingChange}
                                    />
                                </TabContent>
                            </div>
                        </Tabs>
                    </div>
                </div>

                {/* Sync Confirmation Dialog */}
                <Dialog
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    width={480}
                    closable={false}
                    className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
                    contentClassName="!shadow-none"
                >
                    <div className="relative">
                        {/* Custom Header */}
                        <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                                    <ShieldAlert className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Confirm Update</h3>
                                    <p className="text-[10px] font-black text-gray-400 mt-0.5">System-wide update</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                            >
                                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-8">
                            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                Are you sure you want to save these changes? This action will overwrite existing configurations.
                            </p>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-8 pb-8 pt-0 flex gap-4">
                            <Button
                                variant="plain"
                                onClick={() => setIsConfirmOpen(false)}
                                disabled={isUpdating}
                                className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="solid"
                                loading={isUpdating}
                                onClick={handleSyncPlatformPolicy}
                                className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-black text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>Confirm Update</span>
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}
