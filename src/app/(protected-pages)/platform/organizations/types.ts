export interface PlatformOrgAnalytics {
    totalOrganizations: number
    activeOrganizations: number
    overLimitOrganizations: number
    suspendedOrganizations: number
}

export interface PlatformOrgListItem {
    id: string
    name: string
    owner: string
    ownerEmail: string
    status: 'active' | 'suspended' | 'trial' | 'overdue'
    workspaces: number
    members: number
    monthlyUsage: number
    credits: number
    lastActivity: string | null
    createdAt: string
}

export interface PlatformOrgListResponse {
    list: PlatformOrgListItem[]
    total: number
}

export interface PlatformOrgDetailProfile {
    id: string
    name: string
    owner: string
    email: string
    status: 'active' | 'suspended'
    createdAt: string
    description: string | null
}

export interface PlatformOrgDetailBilling {
    credits: number
    monthlyUsage: number
    overages: number
}

export interface PlatformOrgDetailActivity {
    usageTrends: { date: string; usage: number }[]
    topWorkspaces: { name: string; usage: number }[]
}

export interface PlatformOrgDetail {
    profile: PlatformOrgDetailProfile
    billing: PlatformOrgDetailBilling
    activity: PlatformOrgDetailActivity
}
