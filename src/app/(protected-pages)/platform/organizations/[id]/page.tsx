'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { toast, Notification } from '@/components/ui'
import { apiGetPlatformOrgDetail } from '@/services/PlatformOrganizationService'
import type { PlatformOrgDetail } from '../types'
import OrgDetailsHeader from './_components/OrgDetailsHeader'
import OrgDetailsAnalytics from './_components/OrgDetailsAnalytics'
import OrgDetailsTabs from './_components/OrgDetailsTabs'

export default function PlatformOrgDetailPage() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [detail, setDetail] = useState<PlatformOrgDetail | null>(null)

    useEffect(() => {
        if (id) {
            fetchDetail()
        }
    }, [id])

    const fetchDetail = async () => {
        try {
            setLoading(true)
            const res = await apiGetPlatformOrgDetail(id as string)
            setDetail(res)
        } catch (error) {
            toast.push(<Notification type="danger" title="System Error">Failed to fetch organization details.</Notification>)
        } finally {
            setLoading(false)
        }
    }

    if (loading && !detail) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6 animate-pulse">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-gray-400">Retrieving Intelligence...</p>
                    <p className="text-[8px] font-bold text-gray-300">Synchronizing secure data packets</p>
                </div>
            </div>
        )
    }

    if (!detail) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/10 rounded-full flex items-center justify-center mb-6">
                    <div className="w-12 h-12 border-4 border-rose-500 rounded-lg flex items-center justify-center font-black text-rose-500 text-2xl rotate-45">!</div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Organization Not Found</h2>
                <p className="text-gray-500 max-w-sm font-medium text-sm leading-relaxed">
                    The organizational identity requested does not exist in the system or your session does not have clearance.
                </p>
            </div>
        )
    }

    return (
        <div className="w-full py-8 px-4 sm:px-6 lg:px-10 space-y-10 animate-in fade-in duration-1000">
            {/* Redesigned Premium Header */}
            <OrgDetailsHeader data={detail} onRefresh={fetchDetail} />

            {/* Top Row Analytics - Enterprise Grade */}
            <OrgDetailsAnalytics data={detail} />

            {/* Detailed Content Modules */}
            <OrgDetailsTabs data={detail} onRefresh={fetchDetail} />
        </div>
    )
}
