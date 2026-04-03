export interface OrganizationMember {
    id: string
    organizationId: string
    userId: string
    role: string // 'org_super_admin' | 'org_admin' | 'member'
    name: string
    email: string
    avatar?: string
    status: 'active' | 'invited' | 'suspended'
    joinedAt: string
    workspacesCount: number
}

export interface OrganizationRole {
    id: string
    name: string
    description: string
    isSystem: boolean
    permissions: string[]
    userCount: number
}

export interface InviteOrganizationMemberPayload {
    organizationId: string
    email: string
    role: string
    note?: string
    workspace_ids?: string[] // Optional: pre-assign workspaces at invite time
}

export interface OrganizationWorkspace {
    id: string
    name: string
    description?: string
    status?: string
}

export interface UpdateOrganizationMemberPayload {
    organizationId: string
    memberId: string
    role: string
}

export interface OrganizationContextType {
    organizationId: string | null
    organizationName: string | null
    userRole: string | null
}

export interface OrganizationCreditBalance {
    balance: number
    currency: string
    monthlyUsage: number
    remainingCredits: number
}

export interface OrganizationCreditTransaction {
    id: string
    organizationId: string
    amount: number
    balanceAfter: number
    transactionType: string
    description?: string
    workspaceId?: string
    performedBy?: string
    createdAt: string
    workspaceName?: string
    userName?: string
}

export interface WorkspaceUsageBreakdown {
    workspaceId: string
    workspaceName: string
    totalUsage: number
    monthlyLimit: number
    usagePercentage: number
    breakdown: Record<string, number>
}

export interface DailyUsage {
    date: string
    tokens: number
    requests: number
}

export interface OrganizationUsageSummary {
    totalUsage: number
    totalApiCalls: number
    workspacesUsage: WorkspaceUsageBreakdown[]
    periodStart: string
    periodEnd: string
    avgLatency?: number
    successRate?: number
    dailyUsage?: DailyUsage[]
}

export interface OrganizationProfile {
    id: string
    name: string
    description?: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    ownerId: string
    userRole: string
}

export interface UpdateOrganizationPayload {
    name?: string
    description?: string
}
