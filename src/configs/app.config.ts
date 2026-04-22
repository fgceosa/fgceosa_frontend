export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    adminEntryPath: string
    userEntryPath: string
    platformAdminEntryPath: string
    unAuthenticatedEntryPath: string
}

const appConfig: AppConfig = {
    apiPrefix: `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '').replace(/\/api\/v1$/, '')}/api/v1/`,
    authenticatedEntryPath: '/dashboard',
    adminEntryPath: '/admin/dashboard',
    platformAdminEntryPath: '/admin/dashboard',
    userEntryPath: '/dashboard',
    unAuthenticatedEntryPath: '/sign-in',
}

export default appConfig
