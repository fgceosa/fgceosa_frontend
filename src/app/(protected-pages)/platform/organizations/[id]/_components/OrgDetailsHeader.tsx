'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Dialog, toast, Notification } from '@/components/ui'
import {
    ArrowLeft,
    Building2,
    ShieldCheck,
    ShieldAlert,
    User,
    Mail,
    Calendar,
    Globe,
    Download,
    X,
    Slash,
    CheckCircle,
    AlertTriangle
} from 'lucide-react'
import type { PlatformOrgDetail } from '../../types'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import { apiUpdatePlatformOrg } from '@/services/PlatformOrganizationService'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

interface OrgDetailsHeaderProps {
    data: PlatformOrgDetail
    onRefresh: () => void
}

const OrgDetailsHeader = ({ data, onRefresh }: OrgDetailsHeaderProps) => {
    const router = useRouter()
    const { profile } = data
    const [loading, setLoading] = useState(false)
    const [statusConfirmOpen, setStatusConfirmOpen] = useState(false)

    const handleBack = () => {
        router.push('/platform/organizations')
    }

    const handleStatusChange = async () => {
        const newStatus = profile.status === 'active' ? 'suspended' : 'active'
        const action = newStatus === 'active' ? 'reactivated' : 'suspended'

        setLoading(true)
        try {
            await apiUpdatePlatformOrg(profile.id, { is_active: newStatus === 'active' })

            toast.push(
                <Notification title={`Organization ${action}`} type="success">
                    Organization has been successfully {action}.
                </Notification>
            )
            onRefresh()
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to update organization status
                </Notification>
            )
        } finally {
            setLoading(false)
            setStatusConfirmOpen(false)
        }
    }

    return (
        <div className="relative overflow-hidden mb-6 p-5 md:p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none font-sans">
            {/* Background Decorative Blobs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="relative z-10">
                {/* Top Row: Back Button and Breadcrumbs */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="plain"
                            size="sm"
                            onClick={handleBack}
                            className="h-9 w-9 p-0 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-gray-400">Organizations</span>
                            <span className="h-1 w-1 rounded-full bg-gray-300" />
                            <span className="text-[10px] font-black text-primary">Organization Details</span>
                        </div>
                    </div>


                </div>

                {/* Profile Overview Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-6 text-center sm:text-left">
                        <div className="relative shrink-0">
                            <div className="w-20 md:w-24 h-20 md:h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center shadow-xl ring-4 ring-blue-50 dark:ring-blue-900/20 border border-primary/10">
                                <Building2 className="w-10 md:w-12 h-10 md:h-12 text-primary" />
                            </div>
                            <div className={classNames(
                                "absolute -bottom-1 -right-1 w-8 h-8 border-4 border-white dark:border-gray-900 rounded-full flex items-center justify-center shadow-lg transition-colors",
                                profile.status === 'active' ? "bg-emerald-500" : "bg-rose-500"
                            )}>
                                {profile.status === 'active' ? (
                                    <ShieldCheck className="h-4 w-4 text-white" />
                                ) : (
                                    <ShieldAlert className="h-4 w-4 text-white" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight capitalize">
                                    {profile.name}
                                </h1>
                                <div className={classNames(
                                    "px-4 py-1 rounded-full text-[9px] font-black capitalize border whitespace-nowrap",
                                    profile.status === 'active'
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30"
                                        : "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/30"
                                )}>
                                    {profile.status}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-3">
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-[11px] font-black">
                                    <User className="h-4 w-4 text-primary" />
                                    <span>{profile.owner}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-[11px] font-black">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <span className="lowercase">{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-[11px] font-black">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>Since {dayjs(profile.createdAt).format('MMM D, YYYY')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-[11px] font-mono tracking-tight bg-gray-50 dark:bg-gray-800/50 px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-800 cursor-help" title="Organization ID">
                                    <span>ID: {profile.id}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                        {profile.status === 'active' ? (
                            <Button
                                variant="plain"
                                className="h-14 w-full sm:w-auto px-8 border border-gray-200 dark:border-gray-700 rounded-2xl font-black text-[11px] text-gray-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 dark:hover:bg-rose-900/10 transition-all shadow-sm"
                                onClick={() => setStatusConfirmOpen(true)}
                                loading={loading}
                            >
                                Suspend Account
                            </Button>
                        ) : (
                            <Button
                                variant="plain"
                                className="h-14 w-full sm:w-auto px-8 border border-emerald-200 dark:border-emerald-700 rounded-2xl font-black text-[11px] text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-900/10 transition-all shadow-sm"
                                onClick={() => setStatusConfirmOpen(true)}
                                loading={loading}
                            >
                                Reactivate Account
                            </Button>
                        )}
                    </div>
                </div>

                <Dialog
                    isOpen={statusConfirmOpen}
                    onClose={() => setStatusConfirmOpen(false)}
                    closable={false}
                    width={500}
                    className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
                    contentClassName="!shadow-none"
                >
                    <div className="relative">
                        {/* Dynamic Header */}
                        <div className={classNames(
                            "px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between",
                            profile.status === 'active' ? "bg-rose-50/30 dark:bg-rose-500/5" : "bg-emerald-50/30 dark:bg-emerald-500/5"
                        )}>
                            <div className="flex items-center gap-4">
                                <div className={classNames(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                                    profile.status === 'active'
                                        ? "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400"
                                        : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                )}>
                                    {profile.status === 'active' ? <Slash className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                                        {profile.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                                    </h3>
                                    <p className="text-[10px] text-gray-400 font-black mt-0.5">Confirm Identity State Mutation</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setStatusConfirmOpen(false)}
                                className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                            >
                                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {profile.status === 'active'
                                        ? "Are you sure you want to suspend this organization? This critical action will immediately revoke platform access for all associated users and halt active workspace processes until manually reactivated."
                                        : "Are you sure you want to reactivate this organization? This will restore full platform capabilities and workspace access for all associated members immediately."
                                    }
                                </p>

                                {profile.status === 'active' && (
                                    <div className="p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600">
                                                <AlertTriangle className="w-4 h-4" />
                                            </div>
                                            <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 leading-tight">
                                                Caution: High Impact Action impacts all org members
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStatusConfirmOpen(false)}
                                    className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-inter"
                                >
                                    Dismiss
                                </button>
                                <Button
                                    variant="solid"
                                    loading={loading}
                                    className={classNames(
                                        "flex-[2] h-14 text-white rounded-2xl font-black text-[11px] shadow-xl transition-all border-none active:scale-95",
                                        profile.status === 'active'
                                            ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                                            : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                                    )}
                                    onClick={handleStatusChange}
                                >
                                    {profile.status === 'active' ? 'Confirm Suspension' : 'Confirm Activation'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

export default OrgDetailsHeader
