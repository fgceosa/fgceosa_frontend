import type { ReactNode } from 'react'

export interface Provider {
    id: string
    name: string
    status: string
    health: string
    models: string[]
    requests: string
    cost: string
    uptime: number
    markup: string
}

export type ModelBadgeType = 'Vision' | 'Tools' | 'Caching' | 'Reasoning' | 'New' | 'Fast' | 'Cheap' | 'Long Context' | 'Large'

export interface Model {
    id: string
    name: string
    provider: string
    providerId: string
    context: string
    inputPrice: string
    outputPrice: string
    badges: ModelBadgeType[]
    category: 'Text' | 'Embedding'
    status: 'Approved' | 'Pending' | 'All'
    variants?: string
    variantList?: string[]
}

export interface AnalyticsCardProps {
    title: string
    value: string | number
    label: string
    icon?: ReactNode
}