import { config } from '@/configs/env'

/**
 * Helper to get full avatar URL from a relative path or full URL
 * @param avatarPath - The path or URL of the avatar
 * @returns The full URL or null
 */
export const getAvatarUrl = (avatarPath: string | null | undefined): string | null => {
    if (!avatarPath) return null
    
    // If it's already a full URL, return it
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath
    }
    
    // Normalize base URL (remove trailing slashes and /api/v1)
    const baseUrl = (config.apiUrl || 'http://localhost:8000')
        .replace(/\/$/, '')
        .replace(/\/api\/v1$/, '')
    
    // Return full URL
    return `${baseUrl}${avatarPath.startsWith('/') ? '' : '/'}${avatarPath}`
}
