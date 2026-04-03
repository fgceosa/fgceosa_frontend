import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetProjects,
    apiGetProject,
    apiCreateProject,
    apiUpdateProject,
    apiDeleteProject,
    apiGetProjectUsage,
} from '@/services/projects/projectsService'
import type {
    CreateProjectRequest,
    UpdateProjectRequest,
} from '@/app/(protected-pages)/dashboard/projects/types'
import { SLICE_BASE_NAME } from './constants'

/**
 * Fetch all projects
 */
export const fetchProjects = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchProjects`,
    async (
        params: {
            skip?: number
            limit?: number
            includeOrg?: boolean
        } = {},
        { rejectWithValue }
    ) => {
        try {
            return await apiGetProjects(params)
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch projects'
            )
        }
    }
)

/**
 * Fetch a single project by ID
 */
export const fetchProject = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchProject`,
    async (id: string, { rejectWithValue }) => {
        try {
            return await apiGetProject(id)
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch project'
            )
        }
    }
)

/**
 * Create a new project
 */
export const createProject = createAsyncThunk(
    `${SLICE_BASE_NAME}/createProject`,
    async (data: CreateProjectRequest, { rejectWithValue }) => {
        try {
            return await apiCreateProject(data)
        } catch (error: any) {
            // Log the full error for debugging
            console.error('Create project error:', error?.response?.data || error)

            // Extract error message from various formats
            let errorMessage = 'Failed to create project'

            const detail = error?.response?.data?.detail
            const message = error?.response?.data?.message

            // Handle Pydantic validation errors (array format)
            if (Array.isArray(detail)) {
                errorMessage = detail.map((err: any) => {
                    const location = err.loc ? err.loc.join('.') : ''
                    return `${location}: ${err.msg}`
                }).join(', ')
            }
            // Handle string detail
            else if (typeof detail === 'string') {
                errorMessage = detail
            }
            // Handle message fields
            else if (typeof message === 'string') {
                errorMessage = message
            }
            // Handle generic error response data
            else if (typeof error?.response?.data === 'string') {
                errorMessage = error.response.data
            }
            // Handle generic Axios error message
            else if (error?.message) {
                errorMessage = error.message
            }

            return rejectWithValue(errorMessage)
        }
    }
)

/**
 * Update a project
 */
export const updateProject = createAsyncThunk(
    `${SLICE_BASE_NAME}/updateProject`,
    async (
        { id, data }: { id: string; data: UpdateProjectRequest },
        { rejectWithValue }
    ) => {
        try {
            return await apiUpdateProject(id, data)
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Failed to update project'
            )
        }
    }
)

/**
 * Delete a project
 */
export const deleteProject = createAsyncThunk(
    `${SLICE_BASE_NAME}/deleteProject`,
    async (
        { id, hardDelete = false }: { id: string; hardDelete?: boolean },
        { rejectWithValue }
    ) => {
        try {
            await apiDeleteProject(id, hardDelete)
            return { id }
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Failed to delete project'
            )
        }
    }
)

/**
 * Fetch project usage analytics
 */
export const fetchProjectUsage = createAsyncThunk(
    `${SLICE_BASE_NAME}/fetchProjectUsage`,
    async (
        params: {
            id: string
            startDate?: string
            endDate?: string
            page?: number
            pageSize?: number
        },
        { rejectWithValue }
    ) => {
        try {
            return await apiGetProjectUsage(params.id, {
                startDate: params.startDate,
                endDate: params.endDate,
                page: params.page,
                pageSize: params.pageSize,
            })
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Failed to fetch project usage'
            )
        }
    }
)
