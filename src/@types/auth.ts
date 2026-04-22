export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    token: string
    user: {
        userId: string
        userName: string
        authority: string[]
        avatar: string
        email: string
        permissions?: string[]
    }
}

export type SignUpResponse = {
    status: string
    message: string
}

export type SignUpCredential = {
    firstName: string
    lastName: string
    nickname?: string
    email: string
    alternativeEmail?: string
    phoneNumber?: string
    gender: string
    password: string
    confirmPassword?: string
    fgceSet: string
    fgceHouse: string
    city: string
    country: string
    acceptTerms: boolean
    accountType?: 'individual' | 'platform'
    invitationToken?: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    newPassword: string
    confirmPassword: string
    token: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    email?: string | null
    authority?: string[]
    permissions?: string[]
}

export type Token = {
    accessToken: string
    refereshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}
