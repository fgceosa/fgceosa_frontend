import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetAdminStats, apiGetMemberSummary } from '@/services/dashboard/dashboardService'

export const getAdminStats = createAsyncThunk(
    'dashboard/getAdminStats',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiGetAdminStats()
            return data
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch admin stats'
            return rejectWithValue(errorMessage)
        }
    }
)

export const getMemberSummary = createAsyncThunk(
    'dashboard/getMemberSummary',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiGetMemberSummary()
            return data
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch member summary'
            return rejectWithValue(errorMessage)
        }
    }
)
