// User Settings Types

export interface UserProfile {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    nickname: string | null
    gender: string | null
    fgceSet: string | null
    fgceHouse: string | null
    alternativeEmail: string | null
    phone: string | null
    city: string | null
    country: string | null
    avatar: string | null
    accountType: string | null
    platformName: string | null
    createdAt: string
    updatedAt: string
}

export interface UpdateProfileRequest {
    firstName?: string
    lastName?: string
    nickname?: string
    password?: string
    confirmPassword?: string
    phone?: string
    gender?: string
    email?: string
    alternativeEmail?: string
    fgceSet?: string
    fgceHouse?: string
    city?: string
    country?: string
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
    nickname?: string
    password?: string
    confirmPassword?: string
    phone?: string
    gender?: string
    email?: string
    alternativeEmail?: string
    fgceSet?: string
    fgceHouse?: string
    city?: string
    country?: string
}

export interface PasswordValidationErrors {
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
}
