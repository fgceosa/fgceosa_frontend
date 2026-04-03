'use client'

import { useAppSelector, useAppDispatch } from '@/store/hook'
import { 
    setMode as setModeAction, 
    setDirection as setDirectionAction, 
    setSideNavCollapse as setSideNavCollapseAction, 
    setPanelExpand as setPanelExpandAction, 
    setLayout as setLayoutAction, 
    setThemeSchema as setThemeSchemaAction 
} from '@/store/slices/theme/themeSlice'
import { setTheme as setThemeCookies } from '@/server/actions/theme'
import { MODE_DARK, MODE_LIGHT } from '@/constants/theme.constant'
import presetThemeSchemaConfig from '@/configs/preset-theme-schema.config'
import applyTheme from '@/utils/applyThemeSchema'
import type { Mode, Direction, LayoutType, ControlSize } from '@/@types/theme'

type UseThemeReturnType = {
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
    setSchema: (schema: string) => void
    setMode: (mode: Mode) => void
    setSideNavCollapse: (sideNavCollapse: boolean) => void
    setDirection: (direction: Direction) => void
    setPanelExpand: (panelExpand: boolean) => void
    setLayout: (layout: LayoutType) => void
}

const useTheme = <T>(selector: (state: UseThemeReturnType) => T): T => {
    const dispatch = useAppDispatch()
    const themeState = useAppSelector((state) => state.theme)

    const getThemeState = () => ({
        ...themeState,
        setSchema: async (themeSchema: string) => {
            dispatch(setThemeSchemaAction(themeSchema))
            await setThemeCookies(JSON.stringify({ state: { ...themeState, themeSchema } }))
            applyTheme(themeSchema, themeState.mode, presetThemeSchemaConfig)
        },

        setMode: async (mode: Mode) => {
            dispatch(setModeAction(mode))
            await setThemeCookies(JSON.stringify({ state: { ...themeState, mode } }))
            const root = window.document.documentElement
            const isEnabled = mode === MODE_DARK
            root.classList.remove(isEnabled ? MODE_LIGHT : MODE_DARK)
            root.classList.add(isEnabled ? MODE_DARK : MODE_LIGHT)
        },
        setSideNavCollapse: async (sideNavCollapse: boolean) => {
            dispatch(setSideNavCollapseAction(sideNavCollapse))
            await setThemeCookies(JSON.stringify({ state: { ...themeState, layout: { ...themeState.layout, sideNavCollapse } } }))
        },
        setDirection: async (direction: Direction) => {
            dispatch(setDirectionAction(direction))
            await setThemeCookies(JSON.stringify({ state: { ...themeState, direction } }))
            const root = window.document.documentElement
            root.setAttribute('dir', direction)
        },
        setPanelExpand: async (panelExpand: boolean) => {
            dispatch(setPanelExpandAction(panelExpand))
            await setThemeCookies(JSON.stringify({ state: { ...themeState, panelExpand } }))
        },
        setLayout: async (layout: LayoutType) => {
            dispatch(setLayoutAction(layout))
            await setThemeCookies(JSON.stringify({ state: { ...themeState, layout: { ...themeState.layout, type: layout } } }))
        },
    })

    const computedThemeState = getThemeState()

    return selector(computedThemeState)
}

export default useTheme
