import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetPlatformOrgAnalytics,
    apiGetPlatformOrganizations
} from '@/services/PlatformOrganizationService'
import { SLICE_BASE_NAME } from './constants'

export const getPlatformOrgAnalytics = createAsyncThunk(
    `${SLICE_BASE_NAME}/getAnalytics`,
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetPlatformOrgAnalytics()
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || error.message)
        }
    }
)

export const getPlatformOrganizations = createAsyncThunk(
    `${SLICE_BASE_NAME}/getOrganizations`,
    async (params: {
        page: number
        page_size: number
        search?: string
        status?: string
    }, { rejectWithValue }) => {
        try {
            const response = await apiGetPlatformOrganizations({
                ...params,
                status: params.status === 'all' ? undefined : params.status
            })
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || error.message)
        }
    }
)
