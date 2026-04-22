import { createSlice } from '@reduxjs/toolkit'
import { getEvents, registerForEvent, getEventRegistrants } from './eventsThunk'

export interface Event {
    id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    status: 'Upcoming' | 'Past' | 'Ongoing'
    image: string | null
    total_registered: number
    capacity: number
    category: string
    is_online: boolean
    meeting_link: string | null
    is_registered: boolean
    created_at: string
}

export interface EventsState {
    loading: boolean
    registering: boolean
    error: string | null
    eventsList: Event[]
    registrants: any[]
}

const initialState: EventsState = {
    loading: false,
    registering: false,
    error: null,
    eventsList: [],
    registrants: [],
}

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        clearEventsError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEvents.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getEvents.fulfilled, (state, action) => {
                state.loading = false
                state.eventsList = action.payload as Event[]
            })
            .addCase(getEvents.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(registerForEvent.pending, (state) => {
                state.registering = true
            })
            .addCase(registerForEvent.fulfilled, (state, action) => {
                state.registering = false
                // Optional: Update local registration count if needed
            })
            .addCase(registerForEvent.rejected, (state, action) => {
                state.registering = false
                state.error = action.payload as string
            })
            .addCase(getEventRegistrants.pending, (state) => {
                state.loading = true
            })
            .addCase(getEventRegistrants.fulfilled, (state, action) => {
                state.loading = false
                state.registrants = action.payload as any[]
            })
            .addCase(getEventRegistrants.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { clearEventsError } = eventsSlice.actions

export default eventsSlice.reducer
