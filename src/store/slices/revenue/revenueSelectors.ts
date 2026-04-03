import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/store/rootReducer'
import { RevenueState } from './revenueSlice'

const selectRevenueState = (state: RootState): RevenueState => state.revenue

export const selectRevenueData = createSelector(
    selectRevenueState,
    (state) => state.data
)

export const selectRevenueLoading = createSelector(
    selectRevenueState,
    (state) => state.loading
)

export const selectRevenueError = createSelector(
    selectRevenueState,
    (state) => state.error
)

export const selectRevenueKPI = createSelector(
    selectRevenueData,
    (data) => data?.kpi
)
