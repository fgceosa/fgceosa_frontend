export interface Permission {
    id: string
    name: string
    description: string
    enabled: boolean
    isSensitive?: boolean
}

export interface PermissionGroup {
    id: string
    category: string
    permissions: Permission[]
}

export interface Role {
    id: string
    name: string
    description: string
    userCount: number
    permissions: PermissionGroup[]
    icon?: string
    isSystem?: boolean
    type?: 'System' | 'Custom'
}

export type PermissionCategory = 'Members & Access' | 'Payments & Dues' | 'Announcements' | 'Events' | 'Analytics' | 'System Settings'
