export interface Workspace {
    id: string
    name: string
    description: string
    avatar?: string
    createdAt: string
    updatedAt: string
    ownerId: string
    creditsBalance: number
    totalMembers: number
    totalProjects: number
    status: 'active' | 'suspended' | 'inactive'
    organizationId?: string | null
    organizationName?: string | null
}

export interface WorkspaceMember {
    id: string
    userId: string
    workspaceId: string
    name: string
    email: string
    avatar?: string
    roles: string[]
    creditsAllocated: number
    status: 'active' | 'suspended'
    joinedAt: string
    lastActive?: string
}

export interface WorkspaceRole {
    id: string
    name: string
    description: string
    workspaceId: string
    isCustom: boolean
    permissions: RolePermissions
    createdAt: string
    updatedAt: string
}

export interface RolePermissions {
    accessAiCredits: boolean
    manageWorkspaces: boolean
    createProjects: boolean
    manageBilling: boolean
    manageIntegrations: boolean
    inviteMembers: boolean
    manageRoles: boolean
    viewReports: boolean
    manageMembers: boolean
    deleteWorkspace: boolean
}

export interface WorkspaceProject {
    id: string
    name: string
    description: string
    workspaceId: string
    createdBy: string
    members: string[]
    status: 'active' | 'archived'
    lastActivity?: string
    createdAt: string
    updatedAt: string
    apiCallsCount: number
    creditsUsed: string  // Decimal field comes as string from backend
}

export interface WorkspaceUsageReport {
    workspaceId: string
    period: string
    totalCreditsConsumed: number
    totalApiCalls: number
    totalTokens: number
    perMemberUsage: MemberUsage[]
    perProjectUsage: ProjectUsage[]
    trends: UsageTrend[]
}

export interface MemberUsage {
    memberId: string
    memberName: string
    memberEmail: string
    creditsUsed: number
    apiCalls: number
    tokens: number
}

export interface ProjectUsage {
    projectId: string
    projectName: string
    creditsUsed: number
    apiCalls: number
    tokens: number
}

export interface UsageTrend {
    date: string
    creditsConsumed: number
    apiCalls: number
    tokens: number
}

export interface WorkspaceIntegration {
    id: string
    name: string
    type: 'github' | 'gitlab' | 'slack' | 'zapier' | 'api_keys'
    status: 'connected' | 'disconnected' | 'error'
    workspaceId: string
    config: Record<string, any>
    connectedAt?: string
    lastSync?: string
}

export interface CreditTransaction {
    id: string
    workspaceId: string
    type: 'purchase' | 'allocation' | 'usage' | 'refund'
    amount: number
    balance: number
    description: string
    recipientId?: string
    recipientName?: string
    createdAt: string
    status: 'completed' | 'pending' | 'failed'
}

export interface WorkspaceDashboardStats {
    creditsBalance: string  // Decimal fields come as strings from backend
    totalMembers: number
    totalProjects: number
    totalApiCalls: number
    creditsUsedToday: string  // Decimal fields come as strings from backend
    creditsUsedThisMonth: string  // Decimal fields come as strings from backend
    tokensUsedToday: number
    tokensUsedThisMonth: number
    creditBurnRate: string  // Decimal fields come as strings from backend
    activeIntegrations: number
    successRate: string  // Decimal fields come as strings from backend
    dailyUsage?: { date: string, tokens: number, requests: number }[]
    recentRequests?: { id: string, description: string, tokens: number, amount: number, created_at: string }[]
}



export interface AddWorkspaceMemberPayload {
    workspaceId: string
    userId: string
    roles: string[]
    credits_to_allocate?: number
}

export interface CreateRolePayload {
    workspaceId: string
    name: string
    description: string
    permissions: RolePermissions
}

export interface CreateProjectPayload {
    workspaceId: string
    name: string
    description: string
    members: string[]
}

export interface AllocateCreditsPayload {
    workspaceId: string
    memberId: string
    amount: number
    message?: string
}

export interface UpdateWorkspacePayload {
    id: string
    name?: string
    description?: string
    avatar?: string
}

export interface ShareCreditsRecipient {
    email?: string
    tag_number?: string
    user_id?: string
    amount?: number
}

export interface ShareCreditsPayload {
    workspaceId: string
    recipients: ShareCreditsRecipient[]
    total_amount?: number
    amount_per_user?: number
    message?: string
    draw_from_organization?: boolean
}

