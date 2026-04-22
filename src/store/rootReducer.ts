import { combineReducers, AnyAction, Reducer } from 'redux'
import auth, { AuthState } from './slices/auth'
import base, { BaseState } from './slices/base'
import theme, { ThemeState } from './slices/theme/themeSlice'
import navigation, { NavigationState } from './slices/navigation'
import adminDashboard, { AdminDashboardState } from './slices/admindashboard'
import users, { UsersState } from './slices/admin/users'
import userSettings, { UserSettingsState } from './slices/userSettings'
import rolesPermissions, { RolesPermissionsState } from './slices/rolesPermissions'
import dashboard, { DashboardState } from './slices/dashboard/dashboardSlice'
import events, { EventsState } from './slices/events'
import RtkQueryService from '@/services/RtkQueryService'

export type RootState = {
    auth: AuthState
    base: BaseState
    theme: ThemeState
    navigation: NavigationState
    adminDashboard: AdminDashboardState
    users: UsersState
    userSettings: UserSettingsState
    rolesPermissions: RolesPermissionsState
    dashboard: DashboardState
    events: EventsState
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [RtkQueryService.reducerPath]: any
}

export interface AsyncReducers {
    [key: string]: Reducer<any, AnyAction>
}

const staticReducers = {
    auth,
    base,
    theme,
    navigation,
    adminDashboard,
    users,
    userSettings,
    rolesPermissions,
    dashboard,
    events,
    [RtkQueryService.reducerPath]: RtkQueryService.reducer,
}


const rootReducer =
    (asyncReducers?: AsyncReducers) =>
        (state: RootState | undefined, action: AnyAction) => {
            const combinedReducer = combineReducers({
                ...staticReducers,
                ...asyncReducers,
            })

            // Handle global state reset on logout
            if (
                action.type === 'auth/signOut/fulfilled' ||
                action.type === 'auth/session/resetAuthState' ||
                action.type === 'auth/resetAuthState'
            ) {
                const themeState = state?.theme
                const baseState = state?.base

                // Reset state to initial for all slices
                const initialState = combinedReducer(undefined, action)

                // Restore theme and base if they existed
                return {
                    ...initialState,
                    theme: themeState || initialState.theme,
                    base: baseState || initialState.base
                }
            }

            return combinedReducer(state, action)
        }

export default rootReducer
