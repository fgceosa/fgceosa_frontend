import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetRevenueData } from '@/services/revenue/revenueService'
import { RevenuePeriod } from '@/app/(protected-pages)/revenue/types'
import { SLICE_BASE_NAME } from './constants'

export const fetchRevenueData = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchRevenueData`,
    async (period: RevenuePeriod = 'monthly', { rejectWithValue }) => {
        try {
            const response = await apiGetRevenueData(period)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch revenue data'
            )
        }
    }
)
