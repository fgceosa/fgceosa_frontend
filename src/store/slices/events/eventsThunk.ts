import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetEvents, apiRegisterForEvent, apiGetEventRegistrants } from '@/services/admin/eventsService'

export const getEvents = createAsyncThunk(
    'events/getEvents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiGetEvents()
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch events')
        }
    }
)

export const registerForEvent = createAsyncThunk(
    'events/registerForEvent',
    async ({ eventId, notes }: { eventId: string; notes?: string }, { rejectWithValue }) => {
        try {
            const response = await apiRegisterForEvent(eventId, { notes })
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Registration failed')
        }
    }
)

export const getEventRegistrants = createAsyncThunk(
    'events/getEventRegistrants',
    async (eventId: string, { rejectWithValue }) => {
        try {
            const response = await apiGetEventRegistrants(eventId)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch registrants')
        }
    }
)
