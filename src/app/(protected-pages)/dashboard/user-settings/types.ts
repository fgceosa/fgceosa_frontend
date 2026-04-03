// User Settings Types

export interface UserProfile {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    name: string | null
    username: string | null
    phone: string | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    postcode: string | null
    avatar: string | null
    accountType: string | null
    organizationName: string | null
    createdAt: string
    updatedAt: string
}

export interface UpdateProfileRequest {
    firstName?: string
    lastName?: string
    username?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    country?: string
    postcode?: string
}

export interface ChangePasswordRequest {
    currentPassword: string
    newPassword: string
}

export interface UploadAvatarResponse {
    avatarUrl: string
}

export interface ProfileValidationErrors {
    firstName?: string
    lastName?: string
    email?: string
    username?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    country?: string
    postcode?: string
}

export interface PasswordValidationErrors {
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
}
