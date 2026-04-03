import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { NavigationTree } from '@/@types/navigation'

export type NavigationState = {
    navigationTree: NavigationTree[]
}

const initialState: NavigationState = {
    navigationTree: [],
}

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        setNavigationTree: (state, action: PayloadAction<NavigationTree[]>) => {
            state.navigationTree = action.payload
        },
    },
})

export const { setNavigationTree } = navigationSlice.actions

export default navigationSlice.reducer
