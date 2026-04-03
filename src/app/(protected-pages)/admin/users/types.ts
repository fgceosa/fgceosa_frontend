// ============================================
// Permission Types
// ============================================

/**
 * All available permission keys in the system
 */
export type PermissionKey =
    | 'manageUsers'
    | 'manageRoles'
    | 'manageSettings'
    | 'viewAnalytics'
    | 'manageBilling'
    | 'manageCredits'
    | 'deleteContent'
    | 'exportData'

/**
 * Role with permissions
 */
export type RoleWithPermissions = {
    id: string
    name: string
    description: string
    isCustom?: boolean
    permissions: Record<PermissionKey, boolean>
}

/**
 * Basic role information (for dropdowns, cards, etc.)
 */
export type BasicRole = {
    value: string
    label: string
    description: string
}

// ============================================
// Team Member Types
// ============================================

type PersonalInfo = {
    location: string
    title: string
    birthday: string
    phoneNumber: string
    dialCode: string
    address: string
    postcode: string
    city: string
    country: string
    facebook: string
    twitter: string
    pinterest: string
    linkedIn: string
}

type OrderHistory = {
    id: string
    item: string
    status: string
    amount: number
    date: number
}

type PaymentMethod = {
    cardHolderName: string
    cardType: string
    expMonth: string
    expYear: string
    last4Number: string
    primary: boolean
}

type Subscription = {
    plan: string
    status: string
    billing: string
    nextPaymentDate: number
    amount: number
}

/**
 * User entity
 */
export type UserMember = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    username?: string
    phoneNumber?: string
    address?: string
    postcode?: string
    city?: string
    country?: string
    avatar?: string
    phone?: string
    // Legacy/Dummy fields
    img?: string
    role: string
    lastOnline: number
    status: string
    personalInfo: PersonalInfo
    orderHistory: OrderHistory[]
    paymentMethod: PaymentMethod[]
    subscription: Subscription[]
    totalSpending: number
    credits?: string | number
    orgCredits?: number
    authProvider?: string
    botsCount?: number
    projectsCount?: number
    tag?: string
    tagNumber?: string
    timezone?: string
    createdAt?: string | number
    organization?: {
        id: string
        name: string
    }
    roles?: string[]
    isVerified?: boolean
}

/**
 * Simplified user (for avatars, lists, etc.)
 */
export type SimpleUser = {
    name: string
    img: string
}

/**
 * User with ID
 */
export type UserWithId = SimpleUser & { id: string }

// ============================================
// API Response Types
// ============================================

export type GetUserListResponse = {
    list: UserMember[]
    total: number
}

// ============================================
// Form Types
// ============================================

export type UserListOption = {
    value: string
    label: string
    img?: string
}

export type InviteUserFormData = {
    email: string
    role: BasicRole
    name: string
}

export type RoleFormData = {
    name: string
    description: string
    permissions: Record<PermissionKey, boolean>
}