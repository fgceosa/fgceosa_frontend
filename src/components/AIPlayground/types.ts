import type { AIModel } from '@/@types/aiEngine'

export interface Model {
    id: string
    name: string
    cost: string
    speed: string
    quality: string
    is_free?: boolean
    provider?: string
    pricing?: {
        input: number
        output: number
    }
}

// Re-export AIModel for use in playground
export type { AIModel }