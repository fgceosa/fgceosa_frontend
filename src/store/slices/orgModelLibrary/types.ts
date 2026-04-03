import type { RegistryModel } from '@/app/(protected-pages)/hq/model-registry/types'

export interface OrgLibraryModel extends RegistryModel {
    isEnabled: boolean
    isDefault: boolean
    usageCount: number // e.g. number of copilots using it
    isWorkspaceDefault?: boolean
}

export interface OrgModelLibraryState {
    models: OrgLibraryModel[]
    analytics: {
        totalSpend: number
        spendChangePercentage: number
        enabledCount: number
        activeCount: number
        mostPopularModelName: string
    } | null
    loading: boolean
    searchQuery: string
    filterProvider: string | null
    filterCapability: string | null
    filterStatus: string | null
    filterCategory: 'text' | 'embeddings'
    sortBy: 'recommended' | 'cost_asc' | 'popularity'
}
