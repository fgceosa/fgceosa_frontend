import type {
    PlatformOrgAnalytics,
    PlatformOrgListItem
} from '@/app/(protected-pages)/platform/organizations/types'

export type PlatformOrganizationsState = {
    loading: boolean
    analyticsLoading: boolean
    organizations: PlatformOrgListItem[]
    analytics?: PlatformOrgAnalytics
    total: number
    filter: {
        page: number
        page_size: number
        search: string
        status: string
    }
}

export const initialFilterState = {
    page: 1,
    page_size: 10,
    search: '',
    status: 'all'
}
