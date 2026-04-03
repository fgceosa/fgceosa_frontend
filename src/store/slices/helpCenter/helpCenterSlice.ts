import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchHelpCenter } from './helpCenterThunk'
import { SLICE_BASE_NAME } from './constants'

export interface HelpArticle {
    id: string
    title: string
    order: number
}

export interface HelpCategory {
    id: string
    title: string
    description: string
    icon: string
    color: string
    bgColor: string
    order: number
    articles: HelpArticle[]
}

export interface FAQ {
    id: string
    question: string
    answer: string
    order: number
}

export interface HelpCenterState {
    categories: HelpCategory[]
    faqs: FAQ[]
    loading: boolean
    error: string | null
}

const initialState: HelpCenterState = {
    categories: [],
    faqs: [],
    loading: false,
    error: null,
}

const helpCenterSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        clearHelpCenterError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHelpCenter.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchHelpCenter.fulfilled, (state, action) => {
                state.loading = false
                state.categories = action.payload.categories.map((cat: any) => ({
                    ...cat,
                    bgColor: cat.bgColor || cat.bg_color
                }))
                state.faqs = action.payload.faqs
            })
            .addCase(fetchHelpCenter.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { clearHelpCenterError } = helpCenterSlice.actions

export default helpCenterSlice.reducer
