import ApiService from './ApiService'

export interface GoogleDriveAuthURL {
    url: string
}

export interface GoogleDriveCallback {
    code: string
    state?: string
}

export interface GoogleDriveConnection {
    id: string
    email: string
    connected_at: string
    status: 'active' | 'expired'
}

export interface GoogleDriveFile {
    id: string
    name: string
    mime_type: string
    size?: number
    modified_time: string
    icon_link?: string
}

export interface GoogleDriveFilesList {
    files: GoogleDriveFile[]
    next_page_token?: string
}

export interface ImportFileRequest {
    file_id: string
    workspace_id: string
    project_id?: string
}

/**
 * Get the Google Drive OAuth authorization URL
 */
export async function apiGetGoogleDriveAuthUrl() {
    return ApiService.fetchDataWithAxios<GoogleDriveAuthURL>({
        url: 'google-drive/auth/url',
        method: 'get',
    })
}

/**
 * Handle the Google Drive OAuth callback
 */
export async function apiGoogleDriveCallback(data: GoogleDriveCallback) {
    return ApiService.fetchDataWithAxios({
        url: 'google-drive/auth/callback',
        method: 'post',
        data,
    })
}

/**
 * Get existing Google Drive connection
 */
export async function apiGetGoogleDriveConnection() {
    return ApiService.fetchDataWithAxios<GoogleDriveConnection | null>({
        url: 'google-drive/connection',
        method: 'get',
    })
}

/**
 * Disconnect Google Drive
 */
export async function apiDisconnectGoogleDrive() {
    return ApiService.fetchDataWithAxios({
        url: 'google-drive/connection',
        method: 'delete',
    })
}

/**
 * List files from Google Drive
 */
export async function apiListGoogleDriveFiles(folderId?: string, pageToken?: string) {
    return ApiService.fetchDataWithAxios<GoogleDriveFilesList>({
        url: 'google-drive/files',
        method: 'get',
        params: {
            folder_id: folderId,
            page_token: pageToken,
        },
    })
}

/**
 * Import a file from Google Drive
 */
export async function apiImportGoogleDriveFile(data: ImportFileRequest) {
    return ApiService.fetchDataWithAxios({
        url: 'google-drive/import',
        method: 'post',
        data,
    })
}
