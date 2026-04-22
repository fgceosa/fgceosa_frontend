import { Crown, Shield, Settings, Eye } from 'lucide-react'
import type { BasicRole } from '../types'
import type { ReactElement } from 'react'

/**
 * Basic roles available for users
 * These are the main platformal roles
 */
export const BASIC_ROLES: BasicRole[] = [
    {
        value: 'super_admin',
        label: 'Super Admin',
        description: 'Total control over the entire platform, including global settings and financial oversight',
    },
    {
        value: 'admin',
        label: 'Admin',
        description: 'Manage users, view analytics, and handle standard administrative tasks',
    },
    {
        value: 'member',
        label: 'Member',
        description: 'Access to platform features, profile management, and community tools',
    },
]

/**
 * Returns the appropriate icon for a role
 */
export const getRoleIcon = (role?: string | null): ReactElement => {
    const roleName = typeof role === 'string' ? role.toLowerCase() : ''

    switch (roleName) {
        case 'super_admin':
            return <Crown className="w-5 h-5 text-yellow-500" />
        case 'admin':
            return <Shield className="w-5 h-5 text-[#8B0000]" />
        case 'member':
            return <Eye className="w-5 h-5 text-gray-500" />
        default:
            return <Settings className="w-5 h-5 text-gray-400" />
    }
}

/**
 * Returns detailed permissions description for each role
 */
export const getRolePermissions = (roleValue: string): string[] => {
    switch (roleValue) {
        case 'super_admin':
            return [
                'Full platform access',
                'Manage global settings and financial data',
                'Access to all administrative tools',
                'Override any system constraints',
            ]
        case 'admin':
            return [
                'Manage all platform users',
                'View cross-platform analytics',
                'Monitor system-wide usage',
                'Standard administrative access',
            ]
        case 'member':
            return [
                'Access to community features',
                'Manage personal profile',
                'Participate in platform activities',
                'General system access',
            ]
        default:
            return []
    }
}
