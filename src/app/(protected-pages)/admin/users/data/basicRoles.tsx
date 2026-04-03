import { Crown, Shield, Settings, Eye } from 'lucide-react'
import type { BasicRole } from '../types'
import type { ReactElement } from 'react'

/**
 * Basic roles available for users
 * These are the main organizational roles
 */
export const BASIC_ROLES: BasicRole[] = [
    {
        value: 'platform_super_admin',
        label: 'Platform Super Admin',
        description: 'Total control over the entire platform, including treasury and global settings',
    },
    {
        value: 'platform_admin',
        label: 'Platform Admin',
        description: 'Manage users, view global analytics, and handle standard administrative tasks',
    },
]

/**
 * Returns the appropriate icon for a role
 */
export const getRoleIcon = (role?: string | null): ReactElement => {
    const roleName = typeof role === 'string' ? role.toLowerCase() : ''

    switch (roleName) {
        case 'platform_super_admin':
            return <Crown className="w-5 h-5 text-yellow-500" />
        case 'platform_admin':
            return <Shield className="w-5 h-5 text-blue-500" />
        default:
            return <Settings className="w-5 h-5 text-gray-400" />
    }
}

/**
 * Returns detailed permissions description for each role
 */
export const getRolePermissions = (roleValue: string): string[] => {
    switch (roleValue) {
        case 'platform_super_admin':
            return [
                'Full platform access',
                'Manage global settings and treasury',
                'Access to all administrative tools',
                'Override any system constraints',
            ]
        case 'platform_admin':
            return [
                'Manage all platform users',
                'View cross-organization analytics',
                'Monitor system-wide usage',
                'Standard administrative access',
            ]
        default:
            return []
    }
}
