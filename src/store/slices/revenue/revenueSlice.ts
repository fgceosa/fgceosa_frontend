import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchRevenueData } from './revenueThunk'
import { SLICE_BASE_NAME } from './constants'
import { RevenuePageData } from '@/app/(protected-pages)/revenue/types'

export interface RevenueState {
    data: RevenuePageData | null
    loading: boolean
    error: string | null
    lastFetched: number | null
}

const initialState: RevenueState = {
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
}

const revenueSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        clearRevenueError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRevenueData.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchRevenueData.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
                state.lastFetched = Date.now()
            })
            .addCase(fetchRevenueData.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { clearRevenueError } = revenueSlice.actions
export default revenueSlice.reducer
