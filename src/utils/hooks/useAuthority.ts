'use client'

import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'

function useAuthority(
    userAuthority: string[] = [],
    authority: string[] = [],
    userPermissions: string[] = [],
    requiredPermission?: string,
    emptyCheck = false,
) {
    const roleMatched = useMemo(() => {
        const hasRole = authority.some((role) => userAuthority.includes(role))
        const hasPermission = requiredPermission ? userPermissions.includes(requiredPermission) : false

        // If both are provided, we check for either (OR logic). 
        // This allows developers to protect by role OR by a specific permission.
        return hasRole || hasPermission
    }, [authority, userAuthority, userPermissions, requiredPermission])

    if (
        isEmpty(authority) &&
        isEmpty(requiredPermission)
    ) {
        return !emptyCheck
    }

    if (
        isEmpty(userAuthority) &&
        isEmpty(userPermissions)
    ) {
        return !emptyCheck
    }

    return roleMatched
}

export default useAuthority
