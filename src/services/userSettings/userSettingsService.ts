import ApiService from '../ApiService'
import type {
    UserProfile,
    UpdateProfileRequest,
    ChangePasswordRequest,
    UploadAvatarResponse,
} from '@/app/(protected-pages)/dashboard/user-settings/types'

/**
 * Get current user profile
 */
export async function apiGetUserProfile() {
    return ApiService.fetchDataWithAxios<UserProfile>({
        url: 'users/me',
        method: 'get',
    })
}

/**
 * Update user profile
 */
export async function apiUpdateUserProfile(data: UpdateProfileRequest) {
    return ApiService.fetchDataWithAxios<UserProfile>({
        url: 'users/me',
        method: 'patch',
        data: data as Record<string, unknown>,
    })
}

/**
 * Change user password
 */
export async function apiChangePassword(data: ChangePasswordRequest) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: 'users/me/password',
        method: 'patch',
        data: {
            current_password: data.currentPassword,
            new_password: data.newPassword,
        },
    })
}

/**
 * Upload user avatar
 */
export async function apiUploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    return ApiService.fetchDataWithAxios<UserProfile>({
        url: 'users/me/avatar',
        method: 'post',
        data: formData as unknown as Record<string, unknown>,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

/**
 * Delete user avatar
 */
export async function apiDeleteAvatar() {
    return ApiService.fetchDataWithAxios<UserProfile>({
        url: 'users/me/avatar',
        method: 'delete',
    })
}

