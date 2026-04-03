import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiAdminListCopilots } from '@/services/CopilotService'
import { SLICE_BASE_NAME } from './constants'

export const compAdminGetCopilots = createAsyncThunk(
    `${SLICE_BASE_NAME}/getAdminCopilots`,
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await apiAdminListCopilots(params)
            return response
        } catch (error: any) {
            const errorMessage = (error as any)?.response?.data?.detail
                || (error as any)?.response?.data?.message
                || (error instanceof Error ? error.message : 'Failed to fetch copilots')
            return rejectWithValue(errorMessage)
        }
    }
)
