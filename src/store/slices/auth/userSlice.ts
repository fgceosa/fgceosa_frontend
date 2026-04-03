import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { signOutAsync } from './authThunks'

export type UserState = {
    avatar?: string
    userName?: string
    email?: string
    authority?: string[]
    permissions?: string[]
}

const initialState: UserState = {
    avatar: '',
    userName: '',
    email: '',
    authority: [],
    permissions: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.avatar = action.payload?.avatar
            state.email = action.payload?.email
            state.userName = action.payload?.userName
            state.authority = action.payload?.authority
            state.permissions = action.payload?.permissions
        },
    },
    extraReducers: (builder) => {
        builder.addCase(signOutAsync.fulfilled, () => initialState)
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
