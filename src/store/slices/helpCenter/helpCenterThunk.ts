import { createAsyncThunk } from '@reduxjs/toolkit'
import { HelpCenterService } from '@/services/helpCenter/HelpCenterService'
import { SLICE_BASE_NAME } from './constants'

export const fetchHelpCenter = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchHelpCenter`,
    async (_, { rejectWithValue }) => {
        try {
            const data = await HelpCenterService.getHelpCenter()
            return data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch help center content')
        }
    }
)
