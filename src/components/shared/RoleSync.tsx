'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { apiGetMyOrganization } from '@/services/OrganizationService'
import { setUserRole, setCurrentOrganization } from '@/store/slices/organization/organizationSlice'

/**
 * Component to synchronize the user's organization role into the global Redux state.
 * This ensures that organization-level permissions are available even when
 * navigating to pages outside the /organizations layout (like workspace pages).
 */
const RoleSync = () => {
    const dispatch = useAppDispatch()
    const roleFetched = useAppSelector((state: any) => state.organization?.roleFetched)
    const signedIn = useAppSelector((state) => state.auth.session.signedIn)
    const sessionUser = useAppSelector((state) => state.auth.session.session?.user)
    const authority = (sessionUser as any)?.authority || []

    useEffect(() => {
        const syncRole = async () => {
            try {
                const response = await apiGetMyOrganization()
                if (response && response.userRole) {
                    dispatch(setCurrentOrganization({
                        id: response.id,
                        role: response.userRole
                    }))
                } else {
                    dispatch(setCurrentOrganization(null))
                }
            } catch (error: any) {
                // If 404, user just doesn't have an organization yet, which is fine
                if (error?.response?.status !== 404) {
                    console.error('Failed to sync organization role:', error)
                }
                // Even if it fails (e.g. no org), we mark it as fetched so guards can proceed
                dispatch(setUserRole(null))
            }
        }

        if (signedIn && !roleFetched) {
            // Only sync if they might actually have an organization role
            const hasOrgRole = authority.some((role: string) => role.startsWith('org_'))
            const isPlatformAdmin = authority.some((role: string) => role.startsWith('platform_'))

            if (hasOrgRole || isPlatformAdmin || authority.length === 0) {
                syncRole()
            } else {
                // For plain users, we don't need to check org role
                dispatch(setUserRole(null))
            }
        }
    }, [signedIn, roleFetched, dispatch, authority])

    return null
}

export default RoleSync
