'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import { LineChart } from 'lucide-react'
import WorkspacePageLayout from '../../_components/WorkspacePageLayout'
import WorkspaceHeader from '../../_components/WorkspaceHeader'
import UsageSummary from '../../_components/UsageSummary'
import TeamInsights from '../../_components/TeamInsights'

export default function WorkspaceInsightsPage() {
    const params = useParams()
    const workspaceId = params.workspaceId as string

    // Require org_admin or org_super_admin authority
    const hasAuthority = useRequireAuthority(['org_admin', 'org_super_admin'])

    return (
        <div className="min-h-full bg-[#f5f5f5] dark:bg-gray-950/50">
            <WorkspacePageLayout
                fullWidth={true}
                header={
                    <WorkspaceHeader
                        title="Insights"
                        description="Professional analytics and resource consumption metrics for your workspace."
                        icon={LineChart}
                        iconBgClass="bg-gradient-to-br from-indigo-500 to-purple-600"
                        tag="Analytics"
                    />
                }
            >
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <UsageSummary />
                        <TeamInsights />
                    </div>
                </div>
            </WorkspacePageLayout>
        </div>
    )
}
