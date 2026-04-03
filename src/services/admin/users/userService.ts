import ApiService from '@/services/ApiService'
import type {
    UserMember,
    GetUserListResponse,
} from '@/app/(protected-pages)/admin/users/types'

export interface UsersAnalytics {
    totalUsers: number
    activeUsers: number
    usersUsage: number
    usersUsagePeriod: string
    sharedCredits: number
    sharedCreditsChange: number
    sharedCreditsChangePeriod: string
    pendingInvites: number
    pendingInvitesStatus: string
    totalUsersTrend?: { value: string; isPositive: boolean }
    activeUsersTrend?: { value: string; isPositive: boolean }
    usersUsageTrend?: { value: string; isPositive: boolean }
}

export type UserDetails = UserMember

export interface CreateUserRequest {
    email: string
    role: string
    firstName?: string
    lastName?: string
    username?: string
    phoneNumber?: string
    dialCode?: string
    address?: string
    postcode?: string
    city?: string
    country?: string
}

export interface UpdateUserRequest {
    role?: string
    roles?: string[]
    status?: string
    firstName?: string
    lastName?: string
    username?: string
    phoneNumber?: string
    dialCode?: string
    address?: string
    postcode?: string
    city?: string
    country?: string
}

export interface UserListParams {
    pageIndex?: number
    pageSize?: number
    sortKey?: string
    order?: 'asc' | 'desc'
    query?: string
    status?: string
    role?: string
}

/**
 * Get users list with pagination, sorting, and filtering
 */
export async function apiGetUsers(params?: UserListParams) {
    const queryParams = new URLSearchParams()

    if (params?.pageIndex) {
        queryParams.append('page', params.pageIndex.toString())
    }
    if (params?.pageSize) {
        queryParams.append('page_size', params.pageSize.toString())
    }
    if (params?.sortKey) {
        queryParams.append('sort_by', params.sortKey)
    }
    if (params?.order) {
        queryParams.append('order', params.order)
    }
    if (params?.query) {
        queryParams.append('search', params.query)
    }
    if (params?.status) {
        queryParams.append('status', params.status)
    }
    if (params?.role) {
        queryParams.append('role', params.role)
    }

    const queryString = queryParams.toString()
    const url = queryString ? `/users?${queryString}` : '/users'

    const response = await ApiService.fetchDataWithAxios<any>({
        url,
        method: 'get',
    })

    // Normalize response: Handle { list, total }, { data, count }, or direct array
    const rawList = response?.list || response?.data || (Array.isArray(response) ? response : [])
    const total = response?.total ?? response?.count ?? response?.total_count ?? rawList.length

    const list = rawList.map((user: any) => normalizeUser(user))

    return {
        list,
        total
    } as GetUserListResponse
}

/**
 * Robust user data normalization
 */
function normalizeUser(raw: any): UserMember {
    // Handle array responses (sometimes single item lists)
    let source = raw
    if (Array.isArray(raw) && raw.length > 0) {
        source = raw[0]
    } else if (raw?.data && Array.isArray(raw.data) && raw.data.length > 0) {
        source = raw.data[0]
    } else if (raw?.results && Array.isArray(raw.results) && raw.results.length > 0) {
        source = raw.results[0]
    }

    // Handle various wrappers like { data: { ... } } or { user: { ... } }
    const data = source?.user || source?.data || source?.profile || source?.attributes || source?.user_metadata || source?.personal_info || source?.personal || source?.metadata || source?.result || source?.item || source || {}

    // Deep search helper for nested profiles
    const depth = data.profile || data.personal_info || data.user_metadata || data.metadata || data.personal || data.attributes || data.user_profile || {}

    // Extract ID
    const id = (data.id || data._id || data.user_id || data.uuid || depth.id || depth.user_id || depth.uuid || '').toString()

    // Names - extremely aggressive search
    let firstName = data.firstName || data.first_name || data.first_name_canonical || data.given_name || data.first || depth.firstName || depth.first_name || depth.given_name || depth.first || ''
    let lastName = data.lastName || data.last_name || data.last_name_canonical || data.family_name || data.last || depth.lastName || depth.last_name || depth.family_name || depth.last || ''
    const name = data.name || data.display_name || data.full_name || depth.name || depth.display_name || depth.full_name || `${firstName} ${lastName}`.trim() || 'User'

    // Smart name split if first/last are missing but name exists
    if ((!firstName || !lastName) && name && name !== 'User') {
        const parts = name.split(' ')
        if (parts.length > 1) {
            if (!firstName) firstName = parts[0]
            if (!lastName) lastName = parts.slice(1).join(' ')
        } else if (!firstName) {
            firstName = name
        }
    }

    // Contact Info - extremely aggressive search
    const phoneNumber = data.phoneNumber || data.phone_number || data.phone || data.contact_number || data.mobile || data.cell || data.telephone || data.tele || data.contact || data.phone_no || data.mobile_number || depth.phoneNumber || depth.phone_number || depth.phone || depth.mobile || depth.contact || ''
    const email = data.email || data.email_address || data.user_email || data.primary_email || depth.email || depth.email_address || ''

    // Location + deep search
    const city = data.city || data.city_province || data.state || data.region || depth.city || depth.city_province || depth.state || ''
    const country = data.country || data.country_base || data.nation || depth.country || depth.nation || ''
    const address = data.address || data.street_address || data.location || data.home_address || depth.address || depth.street_address || ''
    const postcode = data.postcode || data.postal_code || data.zip_code || data.zip || depth.postcode || depth.postal_code || ''

    return {
        ...data,
        id,
        name,
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        postcode,
        city,
        country,
        role: data.role || data.access_level || data.member_role || depth.role || depth.access_level || 'Member',
        status: data.status || data.account_status || data.user_status || (data.is_active || depth.is_active ? 'active' : 'inactive'),
        credits: data.credits ?? data.ai_credits ?? data.balance ?? data.available_credits ?? depth.credits ?? depth.balance ?? 0,
        totalSpending: data.totalSpending ?? data.total_spending ?? data.amount ?? data.total_expenditure ?? data.usage ?? depth.total_spending ?? depth.usage ?? 0,
        botsCount: data.botsCount ?? 0,
        projectsCount: data.projectsCount ?? 0,
        tag: data.tagNumber || data.tag || depth.tagNumber || '',
        tagNumber: data.tagNumber || depth.tagNumber || '',
        lastOnline: new Date(data.lastOnline ?? data.last_heartbeat ?? data.last_active ?? data.updated_at ?? depth.updated_at ?? depth.last_active ?? Date.now()).getTime(),
        createdAt: data.createdAt || data.created_at || depth.created_at || Date.now(),
        timezone: data.timezone || depth.timezone || '',
        // Ensure personalInfo structure exists and is populated
        personalInfo: {
            ...((data.personalInfo || depth.personalInfo || {})),
            location: city && country ? `${city}, ${country}` : (city || country || ''),
            title: data.title || data.job_title || depth.title || depth.job_title || '',
            birthday: data.birthday || depth.birthday || '',
            phoneNumber: phoneNumber,
            dialCode: data.dialCode || data.dial_code || depth.dialCode || '',
            address: address,
            postcode: postcode,
            city: city,
            country: country,
            facebook: data.facebook || depth.facebook || '',
            twitter: data.twitter || depth.twitter || '',
            pinterest: data.pinterest || depth.pinterest || '',
            linkedIn: data.linkedin || data.linkedIn || depth.linkedin || '',
        }
    } as UserMember
}

/**
 * Get users analytics/stats
 */
export async function apiGetUsersAnalytics() {
    return ApiService.fetchDataWithAxios<UsersAnalytics>({
        url: '/users/analytics',
        method: 'get',
    })
}

/**
 * Get user details by ID
 */
export async function apiGetUserDetails(id: string) {
    const response = await ApiService.fetchDataWithAxios<any>({
        url: `/users/${id}`,
        method: 'get',
    })

    return normalizeUser(response)
}

/**
 * Create/invite a new user
 */
export async function apiCreateUser(data: CreateUserRequest) {
    return ApiService.fetchDataWithAxios<UserMember>({
        url: '/users',
        method: 'post',
        data: data as unknown as Record<string, unknown>,
    })
}

/**
 * Update user
 */
export async function apiUpdateUser(
    id: string,
    data: UpdateUserRequest,
) {
    return ApiService.fetchDataWithAxios<UserMember>({
        url: `/users/${id}`,
        method: 'patch',
        data: data as unknown as Record<string, unknown>,
    })
}

/**
 * Delete/remove user
 */
export async function apiDeleteUser(id: string, force = false) {
    const url = force ? `/users/${id}?force=true` : `/users/${id}`
    return ApiService.fetchDataWithAxios<{ success: boolean; message: string }>(
        {
            url: url,
            method: 'delete',
        },
    )
}

/**
 * Resend invitation to pending user
 */
export async function apiResendUserInvitation(id: string) {
    return ApiService.fetchDataWithAxios<{ success: boolean; message: string }>(
        {
            url: `/users/${id}/resend-invitation`,
            method: 'post',
        },
    )
}
/**
 * Update user identity role
 */
export async function apiUpdateUserIdentityRole(id: string, identityRole: string) {
    return ApiService.fetchDataWithAxios<UserMember>({
        url: `/users/${id}/identity-role`,
        method: 'patch',
        data: { identityRole },
    })
}

/**
 * Allocate user credits
 */
export async function apiAllocateUserCredits(userId: string, data: {
    adjustment_type: 'add' | 'deduct'
    amount: number
    reason_category: string
    reason_description: string
    notify_user: boolean
}) {
    return ApiService.fetchDataWithAxios<any>({
        url: `/users/${userId}/credits/allocate`,
        method: 'post',
        data,
    })
}

/**
 * Manually verify user email (Platform Super Admin only)
 */
export async function apiVerifyUserEmail(userId: string) {
    return ApiService.fetchDataWithAxios<UserMember>({
        url: `/users/${userId}/verify-email`,
        method: 'post',
    })
}
