import type { RootState } from '@/store'
import type { ProjectsState } from './projectsSlice'

// Base selector
const selectProjectsState = (state: RootState): ProjectsState => state.projects

// Projects list selectors
export const selectProjects = (state: RootState) =>
    selectProjectsState(state).projects

export const selectProjectsTotal = (state: RootState) =>
    selectProjectsState(state).total

export const selectProjectsLoading = (state: RootState) =>
    selectProjectsState(state).loading

export const selectProjectsStatus = (state: RootState) =>
    selectProjectsState(state).status

// Current project selectors
export const selectCurrentProject = (state: RootState) =>
    selectProjectsState(state).currentProject

export const selectCurrentProjectUsage = (state: RootState) =>
    selectProjectsState(state).currentProjectUsage

// Error selectors
export const selectProjectsError = (state: RootState) =>
    selectProjectsState(state).error

// Component loading selectors
export const selectListLoading = (state: RootState) =>
    selectProjectsState(state).componentLoading.list

export const selectDetailLoading = (state: RootState) =>
    selectProjectsState(state).componentLoading.detail

export const selectUsageLoading = (state: RootState) =>
    selectProjectsState(state).componentLoading.usage

export const selectCreateLoading = (state: RootState) =>
    selectProjectsState(state).componentLoading.create

export const selectUpdateLoading = (state: RootState) =>
    selectProjectsState(state).componentLoading.update

export const selectDeleteLoading = (state: RootState) =>
    selectProjectsState(state).componentLoading.delete

// Cache selectors
export const selectProjectsLastFetched = (state: RootState) =>
    selectProjectsState(state).lastFetched
