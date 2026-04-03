import { createSlice } from '@reduxjs/toolkit'
import {
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    fetchProjectUsage,
} from './projectsThunk'
import { SLICE_BASE_NAME, PROJECTS_STATUS } from './constants'
import type { Project, ProjectUsage } from '@/app/(protected-pages)/dashboard/projects/types'
import type { ProjectsStatus } from './constants'

// Define the state interface
export interface ProjectsState {
    // Projects list
    projects: Project[]
    total: number

    // Current project (for detail view)
    currentProject: Project | null
    currentProjectUsage: ProjectUsage | null

    // Loading states
    loading: boolean
    status: ProjectsStatus

    // Error handling
    error: string | null

    // Cache management
    lastFetched: number | null

    // Individual component loading states
    componentLoading: {
        list: boolean
        detail: boolean
        usage: boolean
        create: boolean
        update: boolean
        delete: boolean
    }
}

// Initial state
const initialState: ProjectsState = {
    projects: [],
    total: 0,
    currentProject: null,
    currentProjectUsage: null,
    loading: false,
    status: PROJECTS_STATUS.IDLE,
    error: null,
    lastFetched: null,
    componentLoading: {
        list: false,
        detail: false,
        usage: false,
        create: false,
        update: false,
        delete: false,
    },
}

// Create the slice
const projectsSlice = createSlice({
    name: SLICE_BASE_NAME,
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null
            if (state.status === PROJECTS_STATUS.FAILED) {
                state.status = PROJECTS_STATUS.IDLE
            }
        },

        // Reset state
        resetProjectsState: () => initialState,

        // Clear current project
        clearCurrentProject: (state) => {
            state.currentProject = null
            state.currentProjectUsage = null
        },
    },
    extraReducers: (builder) => {
        // Handle fetchProjects
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.componentLoading.list = true
                state.loading = true
                state.status = PROJECTS_STATUS.LOADING
                state.error = null
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.componentLoading.list = false
                state.loading = false
                state.status = PROJECTS_STATUS.SUCCEEDED
                state.projects = action.payload.projects
                state.total = action.payload.total
                state.lastFetched = Date.now()
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.componentLoading.list = false
                state.loading = false
                state.status = PROJECTS_STATUS.FAILED
                state.error = action.payload as string
            })

        // Handle fetchProject
        builder
            .addCase(fetchProject.pending, (state) => {
                state.componentLoading.detail = true
                state.error = null
            })
            .addCase(fetchProject.fulfilled, (state, action) => {
                state.componentLoading.detail = false
                state.currentProject = action.payload
            })
            .addCase(fetchProject.rejected, (state, action) => {
                state.componentLoading.detail = false
                state.error = action.payload as string
                state.status = PROJECTS_STATUS.FAILED
            })

        // Handle createProject
        builder
            .addCase(createProject.pending, (state) => {
                state.componentLoading.create = true
                state.error = null
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.componentLoading.create = false
                // Add new project to list
                state.projects.unshift(action.payload)
                state.total += 1
                state.lastFetched = Date.now()
            })
            .addCase(createProject.rejected, (state, action) => {
                state.componentLoading.create = false
                state.error = action.payload as string
                state.status = PROJECTS_STATUS.FAILED
            })

        // Handle updateProject
        builder
            .addCase(updateProject.pending, (state) => {
                state.componentLoading.update = true
                state.error = null
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.componentLoading.update = false
                // Update project in list
                const index = state.projects.findIndex(
                    (p) => p.id === action.payload.id
                )
                if (index !== -1) {
                    state.projects[index] = action.payload
                }
                // Update current project if it's the same
                if (state.currentProject?.id === action.payload.id) {
                    state.currentProject = action.payload
                }
                state.lastFetched = Date.now()
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.componentLoading.update = false
                state.error = action.payload as string
                state.status = PROJECTS_STATUS.FAILED
            })

        // Handle deleteProject
        builder
            .addCase(deleteProject.pending, (state) => {
                state.componentLoading.delete = true
                state.error = null
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.componentLoading.delete = false
                // Remove project from list
                state.projects = state.projects.filter(
                    (p) => p.id !== action.payload.id
                )
                state.total = Math.max(0, state.total - 1)
                state.lastFetched = Date.now()
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.componentLoading.delete = false
                state.error = action.payload as string
                state.status = PROJECTS_STATUS.FAILED
            })

        // Handle fetchProjectUsage
        builder
            .addCase(fetchProjectUsage.pending, (state) => {
                state.componentLoading.usage = true
                state.error = null
            })
            .addCase(fetchProjectUsage.fulfilled, (state, action) => {
                state.componentLoading.usage = false
                state.currentProjectUsage = action.payload
            })
            .addCase(fetchProjectUsage.rejected, (state, action) => {
                state.componentLoading.usage = false
                state.error = action.payload as string
                state.status = PROJECTS_STATUS.FAILED
            })
    },
})

// Export actions
export const { clearError, resetProjectsState, clearCurrentProject } =
    projectsSlice.actions

// Export reducer
export default projectsSlice.reducer

// Export the slice for testing purposes
export { projectsSlice }
