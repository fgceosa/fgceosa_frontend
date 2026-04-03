import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetRegistryModels,
    apiGetRegistryAnalytics,
    apiGetRegistryProviders,
    apiUpdateModelRegistry
} from '@/services/modelRegistry/modelRegistryService'
import { SLICE_BASE_NAME } from './constants'
import type { RegistryModel } from '@/app/(protected-pages)/hq/model-registry/types'

export const fetchRegistryModels = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchRegistryModels`,
    async () => {
        const response = await apiGetRegistryModels()
        return response
    }
)

export const fetchRegistryAnalytics = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchRegistryAnalytics`,
    async () => {
        const response = await apiGetRegistryAnalytics()
        return response
    }
)

export const fetchRegistryProviders = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchRegistryProviders`,
    async () => {
        const response = await apiGetRegistryProviders()
        return response
    }
)

export const updateModelRegistry = createAsyncThunk(
    `${SLICE_BASE_NAME}/updateModelRegistry`,
    async ({ id, data }: { id: string; data: Partial<RegistryModel> }) => {
        const response = await apiUpdateModelRegistry(id, data)
        return response
    }
)
