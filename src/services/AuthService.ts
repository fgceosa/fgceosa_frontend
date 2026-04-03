import ApiService from './ApiService'

import type {
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignUpResponse,
} from '@/@types/auth'

export async function apiSignUp(data: SignUpCredential) {
    // Transform frontend data to match backend expectations
    const backendData = {
        email: data.email,
        password: data.password,
        full_name: data.userName,
        username: data.userName,
        account_type: data.accountType,
        organization_name: data.organizationName,
        accept_terms: data.acceptTerms,
        invitation_token: data.invitationToken,
    }

    return ApiService.fetchDataWithAxios<SignUpResponse>({
        url: 'users/signup',
        method: 'post',
        data: backendData,
    })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: `password-recovery/${data.email}`,
        method: 'post',
    })
}

export async function apiResetPassword<T>(data: ResetPassword) {
    // Transform frontend data to match backend expectations
    const backendData = {
        token: data.token,
        new_password: data.newPassword,
    }

    return ApiService.fetchDataWithAxios<T>({
        url: 'reset-password',
        method: 'post',
        data: backendData,
    })
}

export async function apiVerifyEmail<T>(token: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `login/verify-email?token=${token}`,
        method: 'post',
    })
}

export async function apiResendVerification<T>(email: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `login/resend-verification/${email}`,
        method: 'post',
    })
}
