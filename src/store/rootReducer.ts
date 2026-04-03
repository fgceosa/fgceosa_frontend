import { combineReducers, AnyAction, Reducer } from 'redux'
import auth, { AuthState } from './slices/auth'
import base, { BaseState } from './slices/base'
import theme, { ThemeState } from './slices/theme/themeSlice'
import navigation, { NavigationState } from './slices/navigation'
import adminDashboard, { AdminDashboardState } from './slices/admindashboard'
import chat, { ChatState } from './slices/chat'
import users, { UsersState } from './slices/admin/users'
import sharedCredits, { SharedCreditsState } from './slices/sharedCredits'
import bulkCredits, { BulkCreditsState } from './slices/bulkCredits'
import apiKeys, { ApiKeysState } from './slices/apiKeys'
import projects, { ProjectsState } from './slices/projects'
import userSettings, { UserSettingsState } from './slices/userSettings'
import platformSettings, { PlatformSettingsState } from './slices/platformSettings'
import workspace, { WorkspaceState } from './slices/workspace'
import revenue, { RevenueState } from './slices/revenue'
import aiEngine from './slices/aiEngine'
import modelLibrary, { ModelLibraryState } from './slices/modelLibrary'
import rolesPermissions, { RolesPermissionsState } from './slices/rolesPermissions'
import security, { SecurityState } from './slices/security'
import auditLog, { AuditLogState } from './slices/auditLog'
import platformCopilotManagement, { PlatformCopilotState } from './slices/platformCopilotManagement'
import modelRegistry, { ModelRegistryState } from './slices/modelRegistry'
import orgModelLibrary, { OrgModelLibraryState } from './slices/orgModelLibrary'
import helpCenter, { HelpCenterState } from './slices/helpCenter/helpCenterSlice'
import organization, { OrganizationState } from './slices/organization/organizationSlice'
import platformOrganizations, { PlatformOrganizationsState } from './slices/platformOrganizations'
import RtkQueryService from '@/services/RtkQueryService'
import type { AIEngineState } from '@/@types/aiEngine'

export type RootState = {
    auth: AuthState
    base: BaseState
    theme: ThemeState
    navigation: NavigationState
    adminDashboard: AdminDashboardState
    chat: ChatState
    users: UsersState
    sharedCredits: SharedCreditsState
    bulkCredits: BulkCreditsState
    apiKeys: ApiKeysState
    projects: ProjectsState
    userSettings: UserSettingsState
    platformSettings: PlatformSettingsState
    workspace: WorkspaceState
    revenue: RevenueState
    aiEngine: AIEngineState
    modelLibrary: ModelLibraryState
    rolesPermissions: RolesPermissionsState
    security: SecurityState
    auditLog: AuditLogState
    platformCopilotManagement: PlatformCopilotState
    modelRegistry: ModelRegistryState
    orgModelLibrary: OrgModelLibraryState
    helpCenter: HelpCenterState
    organization: OrganizationState
    platformOrganizations: PlatformOrganizationsState
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
    chat,
    users,
    sharedCredits,
    bulkCredits,
    apiKeys,
    projects,
    userSettings,
    platformSettings,
    workspace,
    revenue,
    aiEngine,
    modelLibrary,
    rolesPermissions,
    security,
    auditLog,
    platformCopilotManagement,
    modelRegistry,
    orgModelLibrary,
    helpCenter,
    organization,
    platformOrganizations,
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
