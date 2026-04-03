import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { themeConfig } from '@/configs/theme.config'
import type {
    LayoutType,
    Mode,
    Direction,
    ControlSize,
} from '@/@types/theme'

export type ThemeState = {
    themeSchema?: string
    direction: Direction
    mode: Mode
    panelExpand: boolean
    controlSize: ControlSize
    layout: {
        type: LayoutType
        sideNavCollapse: boolean
        previousType?: LayoutType
    }
}

const initialState: ThemeState = {
    themeSchema: themeConfig.themeSchema,
    direction: themeConfig.direction,
    mode: themeConfig.mode,
    panelExpand: themeConfig.panelExpand,
    controlSize: themeConfig.controlSize,
    layout: {
        type: themeConfig.layout.type,
        sideNavCollapse: themeConfig.layout.sideNavCollapse,
        ...(themeConfig.layout.previousType && {
            previousType: themeConfig.layout.previousType as LayoutType
        })
    },
}


export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setDirection: (state, action: PayloadAction<Direction>) => {
            state.direction = action.payload
        },
        setMode: (state, action: PayloadAction<Mode>) => {
            state.mode = action.payload
        },
        setLayout: (state, action: PayloadAction<LayoutType>) => {
            state.layout = {
                ...state.layout,
                type: action.payload,
            }
        },
        setPreviousLayout: (state, action: PayloadAction<LayoutType>) => {
            state.layout.previousType = action.payload
        },
        setSideNavCollapse: (state, action: PayloadAction<boolean>) => {
            state.layout = {
                ...state.layout,
                sideNavCollapse: action.payload,
            }
        },
        setPanelExpand: (state, action: PayloadAction<boolean>) => {
            state.panelExpand = action.payload
        },
        setControlSize: (state, action: PayloadAction<ControlSize>) => {
            state.controlSize = action.payload
        },
        setThemeSchema: (state, action: PayloadAction<string>) => {
            state.themeSchema = action.payload
        },
        setThemeAll: (state, action: PayloadAction<Partial<ThemeState>>) => {
            return { ...state, ...action.payload }
        },
    },
})

export const {
    setDirection,
    setMode,
    setLayout,
    setSideNavCollapse,
    setPanelExpand,
    setControlSize,
    setThemeSchema,
    setThemeAll,
    setPreviousLayout,
} = themeSlice.actions

export default themeSlice.reducer
