'use client'

import { Suspense } from 'react'
import OrgAdminDashboard from './OrgAdminDashboard'
import OrgMemberDashboard from './OrgMemberDashboard'
import { useOrganization } from '../OrganizationContext'

export default function OrganizationDashboardPage() {
    const { userRole } = useOrganization()

    return (
        <Suspense fallback={<div className="p-8">Loading dashboard...</div>}>
            {userRole === 'org_member' ? (
                <OrgMemberDashboard />
            ) : (
                <OrgAdminDashboard />
            )}
        </Suspense>
    )
}
