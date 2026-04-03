import ApiService from '../ApiService'
import type {
    Model,
    Provider,
} from '@/app/(protected-pages)/dashboard/model-library/types'
import { mockModels, mockProviders } from '@/mock/models'

export interface GetModelsResponse {
    models: Model[]
    total: number
}

export interface GetProvidersResponse {
    providers: Provider[]
    total: number
}

export interface ModelLibraryStats {
    totalModels: number
    totalProviders: number
    textModels: number
    embeddingModels: number
    approvedModels: number
}

// Backend response type (matches AIModelPublic from backend)
interface BackendModel {
    id: string
    name: string
    slug: string
    providerId: string
    provider?: string
    providerSlug?: string
    description?: string
    contextSize?: string
    inputPrice: number
    outputPrice: number
    capabilities: string[]
    status: string
    availability: string
    category: 'Text' | 'Embedding'
    lastUpdated: string
}

interface BackendModelsResponse {
    models: BackendModel[]
    total: number
}

interface BackendProvider {
    id: string
    name: string
    slug: string
    is_active: boolean
}

interface BackendProvidersResponse {
    providers: BackendProvider[]
    total: number
}

/**
 * Transform backend model to frontend format
 */
function transformModel(backendModel: BackendModel): Model {
    return {
        id: backendModel.id,
        name: backendModel.name,
        provider: backendModel.provider || 'Unknown',
        providerId: backendModel.providerId,
        context: backendModel.contextSize || 'Unknown',
        inputPrice: `$${(backendModel.inputPrice * 1).toFixed(4)}`, // Basic $ formatting
        outputPrice: `$${(backendModel.outputPrice * 1).toFixed(4)}`,
        badges: (backendModel.capabilities || []) as any[],
        category: backendModel.category,
        status: backendModel.status as any,
    }
}

/**
 * Transform backend provider to frontend format
 */
function transformProvider(backendProvider: BackendProvider): Provider {
    return {
        id: backendProvider.id,
        name: backendProvider.name,
        status: backendProvider.is_active ? 'active' : 'inactive',
        health: 'healthy',
        models: [],
        requests: '0',
        cost: '₦0',
        uptime: 100,
        markup: '0%',
    }
}

/**
 * Get all models
 */
export async function apiGetModels() {
    try {
        const response = await ApiService.fetchDataWithAxios<BackendModelsResponse>({
            url: '/registry/models',
            method: 'get',
        })

        return {
            models: response.models.map(transformModel),
            total: response.total,
        }
    } catch (error) {
        console.warn('Failed to fetch models, using mock data:', error)
        return {
            models: mockModels,
            total: mockModels.length
        }
    }
}

/**
 * Get all providers
 */
export async function apiGetProviders() {
    try {
        const response = await ApiService.fetchDataWithAxios<BackendProvidersResponse>({
            url: '/registry/providers',
            method: 'get',
        })

        return {
            providers: response.providers.map(transformProvider),
            total: response.total,
        }
    } catch (error) {
        console.warn('Failed to fetch providers, using mock data:', error)
        return {
            providers: mockProviders.map(p => ({
                ...p,
                status: 'active',
                health: 'healthy',
                requests: '0',
                cost: '₦0',
                uptime: 100,
                markup: '0%',
                models: []
            })),
            total: mockProviders.length
        }
    }
}

/**
 * Get model library statistics
 * Calculate stats from the models list
 */
export async function apiGetModelLibraryStats() {
    const response = await apiGetModels()

    const stats: ModelLibraryStats = {
        totalModels: response.total,
        totalProviders: mockProviders.length,
        textModels: response.models.filter(m => m.category === 'Text').length,
        embeddingModels: response.models.filter(m => m.category === 'Embedding').length,
        approvedModels: response.models.filter(m => m.status === 'Approved').length,
    }

    return stats
}

/**
 * Get a single model by ID
 */
export async function apiGetModelById(id: string) {
    try {
        const response = await ApiService.fetchDataWithAxios<BackendModel>({
            url: `/registry/models/${id}`,
            method: 'get',
        })

        return transformModel(response)
    } catch (error) {
        return mockModels.find(m => m.id === id) || mockModels[0]
    }
}

/**
 * Get a single provider by ID
 */
export async function apiGetProviderById(id: string) {
    try {
        const response = await ApiService.fetchDataWithAxios<BackendProvider>({
            url: `/registry/providers/${id}`,
            method: 'get',
        })

        return transformProvider(response)
    } catch (error) {
        const provider = mockProviders.find(p => p.id === id) || mockProviders[0]
        return {
            ...provider,
            status: 'active',
            health: 'healthy',
            requests: '0',
            cost: '₦0',
            uptime: 100,
            markup: '0%',
            models: []
        }
    }
}
