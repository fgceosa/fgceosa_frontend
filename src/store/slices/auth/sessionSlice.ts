import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { signInAsync, signUpAsync, signOutAsync } from './authThunks'
import type { User } from 'next-auth'

type Session = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: User & Record<string, any>
    expires: string
}

export interface SessionState {
    signedIn: boolean
    token: string | null
    session: Session | null
    loading: boolean
    error: string | null
}

const initialState: SessionState = {
    signedIn: false,
    token: null,
    session: null,
    loading: false,
    error: null,
}

const sessionSlice = createSlice({
    name: `${SLICE_BASE_NAME}/session`,
    initialState,
    reducers: {
        signInStart(state) {
            state.loading = true
            state.error = null
        },
        signInSuccess(state, action: PayloadAction<{ token?: string; session: Session | null }>) {
            state.signedIn = true
            state.token = action.payload.token || null
            state.session = action.payload.session
            state.loading = false
            state.error = null
        },
        signInFailure(state, action: PayloadAction<string>) {
            state.signedIn = false
            state.token = null
            state.session = null
            state.loading = false
            state.error = action.payload
        },
        signOutStart(state) {
            state.loading = true
            state.error = null
        },
        signOutSuccess(state) {
            state.signedIn = false
            state.token = null
            state.session = null
            state.loading = false
            state.error = null
        },
        signOutFailure(state, action: PayloadAction<string>) {
            state.loading = false
            state.error = action.payload
        },
        setSession(state, action: PayloadAction<Session | null>) {
            state.session = action.payload
            state.signedIn = !!action.payload?.user
        },
        updateUserAvatar(state, action: PayloadAction<string | null>) {
            if (state.session?.user) {
                state.session.user.image = action.payload
            }
        },
        clearError(state) {
            state.error = null
        },
        resetAuthState: () => initialState,
    },
    extraReducers: (builder) => {
        // Sign In
        builder
            .addCase(signInAsync.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signInAsync.fulfilled, (state, action) => {
                state.signedIn = true
                state.session = action.payload.session
                state.loading = false
                state.error = null
            })
            .addCase(signInAsync.rejected, (state, action) => {
                state.signedIn = false
                state.session = null
                state.loading = false
                state.error = action.payload || 'Sign in failed'
            })
        // Sign Up
        builder
            .addCase(signUpAsync.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signUpAsync.fulfilled, (state) => {
                state.loading = false
                state.error = null
            })
            .addCase(signUpAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'Sign up failed'
            })
        // Sign Out
        builder
            .addCase(signOutAsync.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signOutAsync.fulfilled, (state) => {
                state.signedIn = false
                state.session = null
                state.token = null
                state.loading = false
                state.error = null
            })
            .addCase(signOutAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'Sign out failed'
            })
    },
})

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    signOutStart,
    signOutSuccess,
    signOutFailure,
    setSession,
    updateUserAvatar,
    clearError,
    resetAuthState
} = sessionSlice.actions

export default sessionSlice.reducer
export type { Session }
