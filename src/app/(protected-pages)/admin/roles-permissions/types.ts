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
    type?: 'System' | 'Organization' | 'Custom'
}

export type PermissionCategory = 'Workspace' | 'Billing' | 'Agents' | 'Settings' | 'Users' | 'Models'
