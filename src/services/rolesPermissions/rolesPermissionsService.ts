import ApiService from '../ApiService'
import { Role, Permission, PermissionGroup } from '@/app/(protected-pages)/admin/roles-permissions/types'

export async function apiGetRoles() {
    return ApiService.fetchDataWithAxios<Role[]>({
        url: 'roles',
        method: 'get',
    })
}

export async function apiGetRoleById(id: string) {
    return ApiService.fetchDataWithAxios<Role>({
        url: `roles/${id}`,
        method: 'get',
    })
}

export async function apiCreateRole(data: Partial<Role>) {
    // Extract permission IDs from the nested structure
    const permissionIds: string[] = []
    if (data.permissions) {
        data.permissions.forEach(group => {
            group.permissions.forEach(perm => {
                if (perm.enabled) {
                    permissionIds.push(perm.id)
                }
            })
        })
    }

    // Send to backend with flat permission IDs array
    const payload = {
        name: data.name,
        description: data.description,
        icon: data.icon,
        permissions: permissionIds
    }

    return ApiService.fetchDataWithAxios<Role>({
        url: 'roles',
        method: 'post',
        data: payload
    })
}

export async function apiUpdateRole(id: string, data: Partial<Role>) {
    // Extract permission IDs from the nested structure
    const permissionIds: string[] = []
    if (data.permissions) {
        data.permissions.forEach(group => {
            group.permissions.forEach(perm => {
                if (perm.enabled) {
                    permissionIds.push(perm.id)
                }
            })
        })
    }

    // Send to backend with flat permission IDs array
    const payload = {
        name: data.name,
        description: data.description,
        icon: data.icon,
        permissions: permissionIds
    }

    return ApiService.fetchDataWithAxios<Role>({
        url: `roles/${id}`,
        method: 'put',
        data: payload
    })
}

export async function apiDeleteRole(id: string) {
    return ApiService.fetchDataWithAxios<void>({
        url: `roles/${id}`,
        method: 'delete'
    })
}

export async function apiGetAllPermissions() {
    return ApiService.fetchDataWithAxios<PermissionGroup[]>({
        url: 'roles/permissions/all',
        method: 'get',
    })
}

export async function apiCreatePermission(data: { name: string; description: string }) {
    return ApiService.fetchDataWithAxios<Permission>({
        url: 'roles/permissions',
        method: 'post',
        data
    })
}
