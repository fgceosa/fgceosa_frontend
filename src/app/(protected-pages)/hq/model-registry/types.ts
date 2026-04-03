import type { ReactNode } from 'react'

export type ModelStatus = 'Approved' | 'Experimental' | 'Deprecated'
export type ModelCapability = 'Vision' | 'Reasoning' | 'Long Context' | 'Tools' | 'Image' | 'Audio'
export type AvailabilityScope = 'Global' | 'Enterprise-only' | 'Internal'

export interface RegistryModel {
    id: string
    name: string
    provider: string
    providerSlug: string
    providerId: string
    capabilities: ModelCapability[]
    contextSize: string
    inputPrice: number
    outputPrice: number
    status: ModelStatus
    availability: AvailabilityScope
    lastUpdated: string | number
    description: string
    bestUseCases: string[]
    tokenLimits: {
        rpm: number
        tpm: number
    }
    compliance: {
        piiHandling: boolean
        safetyTags: string[]
        internalNotes: string
    }
    lifecycle: {
        deprecationDate?: string
        statusHistory: {
            status: ModelStatus
            date: string
            changedBy: string
        }[]
    }
}

export interface RegistryProvider {
    id: string
    name: string
    slug: string
    icon?: string
    status: 'Active' | 'Inactive'
}

export interface RegistryAnalytics {
    totalModels: number
    approvedModels: number
    restrictedModels: number
    deprecatedModels: number
    activeProviders: number
}
