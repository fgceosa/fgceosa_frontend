import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetDashboardData,
    apiGetDashboardMetrics,
    apiGetWeeklyTrends,
    apiGetModelUsage,
    apiGetCreditBalance,
    apiGetActiveProjects,
    apiGetCreditHistory,
    apiGetRecentRequests,
} from '@/services/admindashboard/dashboardService'

// Async thunk for fetching complete dashboard data
export const fetchDashboardData = createAsyncThunk(
    'adminDashboard/fetchDashboardData',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiGetDashboardData()
            return data
        } catch (error) {
            // console.error('fetchDashboardData error:', error)
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to fetch dashboard data'
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for fetching dashboard metrics by period
export const fetchDashboardMetrics = createAsyncThunk(
    'adminDashboard/fetchDashboardMetrics',
    async (period: 'week' | 'month' | 'year' = 'week', { rejectWithValue }) => {
        try {
            const data = await apiGetDashboardMetrics(period)
            return data
        } catch (error) {
            console.error('fetchDashboardMetrics error:', error)
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to fetch dashboard metrics'
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for fetching weekly usage trends
export const fetchWeeklyTrends = createAsyncThunk(
    'adminDashboard/fetchWeeklyTrends',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiGetWeeklyTrends()
            return data
        } catch (error) {
            console.error('fetchWeeklyTrends error:', error)
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to fetch weekly trends'
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for fetching model usage distribution
export const fetchModelUsage = createAsyncThunk(
    'adminDashboard/fetchModelUsage',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiGetModelUsage()
            return data
        } catch (error) {
            console.error('fetchModelUsage error:', error)
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to fetch model usage'
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for fetching credit balance
export const fetchCreditBalance = createAsyncThunk(
    'adminDashboard/fetchCreditBalance',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiGetCreditBalance()
            return data
        } catch (error) {
            console.error('fetchCreditBalance error:', error)
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to fetch credit balance'
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for fetching active projects
export const fetchActiveProjects = createAsyncThunk(
    'adminDashboard/fetchActiveProjects',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiGetActiveProjects()
            return data
        } catch (error) {
            console.error('fetchActiveProjects error:', error)
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to fetch active projects'
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for fetching credit history
export const fetchCreditHistory = createAsyncThunk(
    'adminDashboard/fetchCreditHistory',
    async (limit: number = 10, { rejectWithValue }) => {
        try {
            const data = await apiGetCreditHistory(limit)
            return data
        } catch (error) {
            console.error('fetchCreditHistory error:', error)
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to fetch credit history'
            return rejectWithValue(errorMessage)
        }
    }
)

// Async thunk for fetching recent API requests
export const fetchRecentRequests = createAsyncThunk(
    'adminDashboard/fetchRecentRequests',
    async (limit: number = 20, { rejectWithValue }) => {
        try {
            const data = await apiGetRecentRequests(limit)
            return data
        } catch (error) {
            console.error('fetchRecentRequests error:', error)
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Failed to fetch recent requests'
            return rejectWithValue(errorMessage)
        }
    }
)

// Export all thunks
export const adminDashboardThunks = {
    fetchDashboardData,
    fetchDashboardMetrics,
    fetchWeeklyTrends,
    fetchModelUsage,
    fetchCreditBalance,
    fetchActiveProjects,
    fetchCreditHistory,
    fetchRecentRequests,
}

export default adminDashboardThunks
