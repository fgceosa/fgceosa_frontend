import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetOrganizationTeam, apiInviteOrganizationMember, apiUpdateOrganizationMember, apiRemoveOrganizationMember, apiGetOrganizationRoles, apiCreateOrganizationRole, apiUpdateOrganizationRole, apiDeleteOrganizationRole, apiGetOrganizationCreditBalance, apiGetOrganizationCreditTransactions, apiGetOrganizationUsageSummary, apiGetOrganizationActivity, apiGetMyOrganization, apiUpdateOrganization } from '@/services/OrganizationService'
import type { OrganizationMember, OrganizationRole, InviteOrganizationMemberPayload, UpdateOrganizationMemberPayload, UpdateOrganizationPayload } from '@/app/(protected-pages)/organizations/types'

export const fetchOrganizationTeam = createAsyncThunk(
    'organization/fetchTeam',
    async (params: { organizationId: string, page?: number, search?: string }, { rejectWithValue }) => {
        if (!params.organizationId || params.organizationId === 'null' || params.organizationId === 'undefined') {
            return rejectWithValue('Invalid organization ID')
        }
        const response = await apiGetOrganizationTeam(params.organizationId, params.page, params.search)
        // Map backend snake_case to frontend camelCase
        const mappedList = response.list.map((member: any) => ({
            id: member.id,
            organizationId: member.organization_id,
            userId: member.user_id,
            role: member.role,
            name: member.name,
            email: member.email,
            avatar: member.avatar,
            status: member.status,
            joinedAt: member.joined_at,
            workspacesCount: member.workspaces_count
        }))
        return { ...response, list: mappedList }
    }
)

export const inviteOrganizationMember = createAsyncThunk(
    'organization/inviteMember',
    async (payload: InviteOrganizationMemberPayload) => {
        const response = await apiInviteOrganizationMember(payload)
        return response
    }
)

export const updateOrganizationMember = createAsyncThunk(
    'organization/updateMember',
    async (payload: UpdateOrganizationMemberPayload) => {
        const response = await apiUpdateOrganizationMember(payload)
        return response
    }
)

export const removeOrganizationMember = createAsyncThunk(
    'organization/removeMember',
    async (payload: { organizationId: string, memberId: string }) => {
        await apiRemoveOrganizationMember(payload.organizationId, payload.memberId)
        return payload.memberId
    }
)

export const fetchOrganizationRoles = createAsyncThunk(
    'organization/fetchRoles',
    async (organizationId: string) => {
        const response = await apiGetOrganizationRoles(organizationId)
        return response
    }
)

export const createOrganizationRole = createAsyncThunk(
    'organization/createRole',
    async (payload: { organizationId: string, data: any }) => {
        const response = await apiCreateOrganizationRole(payload.organizationId, payload.data)
        return response
    }
)

export const updateOrganizationRole = createAsyncThunk(
    'organization/updateRole',
    async (payload: { organizationId: string, roleId: string, data: any }) => {
        const response = await apiUpdateOrganizationRole(payload.organizationId, payload.roleId, payload.data)
        return response
    }
)

export const deleteOrganizationRole = createAsyncThunk(
    'organization/deleteRole',
    async (payload: { organizationId: string, roleId: string }) => {
        await apiDeleteOrganizationRole(payload.organizationId, payload.roleId)
        return payload.roleId
    }
)

export const fetchOrganizationCreditBalance = createAsyncThunk(
    'organization/fetchCreditBalance',
    async (organizationId: string, { rejectWithValue }) => {
        if (!organizationId || organizationId === 'null' || organizationId === 'undefined') {
            return rejectWithValue('Invalid organization ID')
        }
        const response = await apiGetOrganizationCreditBalance(organizationId)
        return {
            balance: response.balance,
            currency: response.currency,
            monthlyUsage: response.monthly_usage,
            remainingCredits: response.remaining_credits
        }
    }
)

export const fetchOrganizationCreditTransactions = createAsyncThunk(
    'organization/fetchCreditTransactions',
    async (params: { organizationId: string, page?: number }, { rejectWithValue }) => {
        if (!params.organizationId || params.organizationId === 'null' || params.organizationId === 'undefined') {
            return rejectWithValue('Invalid organization ID')
        }
        const response = await apiGetOrganizationCreditTransactions(params.organizationId, params.page)
        const mappedTransactions = response.transactions.map((tx: any) => ({
            id: tx.id,
            organizationId: tx.organization_id,
            amount: tx.amount,
            balanceAfter: tx.balance_after,
            transactionType: tx.transaction_type,
            description: tx.description,
            workspaceId: tx.workspace_id,
            performedBy: tx.performed_by,
            createdAt: tx.created_at,
            workspaceName: tx.workspace_name,
            userName: tx.user_name
        }))
        return { ...response, transactions: mappedTransactions }
    }
)

export const fetchOrganizationUsageSummary = createAsyncThunk(
    'organization/fetchUsageSummary',
    async (params: { organizationId: string, days?: number }, { rejectWithValue }) => {
        try {
            // Validate organization ID
            if (!params.organizationId || params.organizationId === 'null' || params.organizationId === 'undefined') {
                return rejectWithValue('Invalid organization ID')
            }

            const response = await apiGetOrganizationUsageSummary(params.organizationId, params.days)

            // Handle empty or invalid response
            if (!response || !response.workspaces_usage) {
                return {
                    totalUsage: 0,
                    totalApiCalls: 0,
                    workspacesUsage: [],
                    periodStart: new Date().toISOString(),
                    periodEnd: new Date().toISOString()
                }
            }

            const mappedWorkspaces = response.workspaces_usage.map((ws: any) => ({
                workspaceId: ws.workspace_id,
                workspaceName: ws.workspace_name,
                totalUsage: ws.total_usage,
                monthlyLimit: ws.monthly_limit,
                usagePercentage: ws.usage_percentage,
                breakdown: ws.breakdown
            }))

            return {
                totalUsage: response.total_usage,
                totalApiCalls: response.total_api_calls,
                workspacesUsage: mappedWorkspaces,
                periodStart: response.period_start,
                periodEnd: response.period_end,
                avgLatency: response.avg_latency,
                successRate: response.success_rate,
                dailyUsage: response.daily_usage
            }
        } catch (error: any) {
            console.error('Error fetching organization usage summary:', error)
            return rejectWithValue(error?.response?.data?.detail || error?.message || 'Failed to fetch usage summary')
        }
    }
)

export const fetchOrganizationActivity = createAsyncThunk(
    'organization/fetchActivity',
    async (params: { organizationId: string, page?: number, pageSize?: number }, { rejectWithValue }) => {
        if (!params.organizationId || params.organizationId === 'null' || params.organizationId === 'undefined') {
            return rejectWithValue('Invalid organization ID')
        }
        const response = await apiGetOrganizationActivity(params.organizationId, params.page, params.pageSize)
        // Map backend snake_case to frontend camelCase
        const mappedLogs = response.logs.map((log: any) => ({
            id: log.id,
            timestamp: log.timestamp,
            actorName: log.actorName || log.actor_name,
            actorRole: log.actorRole || log.actor_role,
            actorType: log.actorType || log.actor_type,
            action: log.action,
            targetType: log.targetType || log.target_type,
            targetId: log.targetId || log.target_id,
            ipAddress: log.ipAddress || log.ip_address,
            location: log.location,
            severity: log.severity,
            status: log.status,
            organizationId: log.organizationId || log.organization_id,
            metaData: log.metaData || log.meta_data,
            authMethod: log.authMethod || log.auth_method,
            requestSource: log.requestSource || log.request_source,
            correlationId: log.correlationId || log.correlation_id
        }))
        return { ...response, logs: mappedLogs }
    }
)

export const fetchMyOrganization = createAsyncThunk(
    'organization/fetchMyOrg',
    async () => {
        const response = await apiGetMyOrganization()
        return response
    }
)

export const updateOrganization = createAsyncThunk(
    'organization/update',
    async (payload: UpdateOrganizationPayload) => {
        const response = await apiUpdateOrganization(payload)
        return response
    }
)
