'use client'

import { useState, useEffect } from 'react'
import { Button, Spinner, Notification, toast } from '@/components/ui'
import {
    Folder,
    FileText,
    ChevronRight,
    Home,
    Download,
    RefreshCw,
    CheckCircle2,
} from 'lucide-react'
import {
    apiListGoogleDriveFiles,
    apiImportGoogleDriveFile,
    type GoogleDriveFile,
} from '@/services/GoogleDriveService'

interface GoogleDriveFileBrowserProps {
    copilotId: string
    onImportSuccess?: () => void
}

interface BreadcrumbItem {
    id: string | null
    name: string
}

export default function GoogleDriveFileBrowser({
    copilotId,
    onImportSuccess,
}: GoogleDriveFileBrowserProps) {
    const [files, setFiles] = useState<GoogleDriveFile[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: null, name: 'My Drive' }])
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
    const [isImporting, setIsImporting] = useState(false)

    const currentFolderId = breadcrumbs[breadcrumbs.length - 1]?.id

    // Load files
    const loadFiles = async (folderId?: string) => {
        setIsLoading(true)

        // If we are changing folders, clear the previous list
        const folderChanging = folderId !== currentFolderId
        if (folderChanging) {
            setFiles([])
        }

        try {
            const result = await apiListGoogleDriveFiles(folderId || undefined)
            setFiles(result.files)
        } catch (error: any) {
            console.error('Failed to load Google Drive files:', error)

            // Determine the specific error type
            let errorMessage = 'Failed to load files'
            let errorTitle = 'Google Drive Error'

            // Check for response errors first (500, 401, 403, 404, etc.)
            if (error.response?.status === 500) {
                const detail = error.response.data?.detail || 'Internal server error'
                errorMessage = `Server error: ${detail}`
                errorTitle = 'Server Error'
            } else if (error.response?.status === 401) {
                errorMessage = 'Your Google Drive session has expired. Please disconnect and reconnect your account.'
                errorTitle = 'Authentication Expired'
            } else if (error.response?.status === 403) {
                errorMessage = 'Permission denied. Please reconnect your Google Drive and ensure you grant full access permissions.'
                errorTitle = 'Permission Denied'
            } else if (error.response?.status === 404) {
                errorMessage = 'No Google Drive connection found. Please connect your Google Drive account first.'
                errorTitle = 'Not Connected'
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail
            } else if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
                // This is usually a CORS or connectivity issue (no response at all)
                errorMessage = 'Could not reach the server. Please check your internet connection and ensure the backend is running.'
                errorTitle = 'Connection Error'
            } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                errorMessage = 'Request timed out. Google Drive is taking too long to respond. Please try again.'
                errorTitle = 'Timeout Error'
            }

            toast.push(
                <Notification type="danger" duration={8000} title={errorTitle}>
                    {errorMessage}
                </Notification>
            )
        } finally {
            setIsLoading(false)
        }
    }





    // Initial load
    useEffect(() => {
        loadFiles()
    }, [])

    // Navigate to folder
    const navigateToFolder = (file: GoogleDriveFile) => {
        if (!file.isFolder) return

        setBreadcrumbs([...breadcrumbs, { id: file.id, name: file.name }])
        setSelectedFiles(new Set())
        loadFiles(file.id)
    }

    // Navigate breadcrumb
    const navigateToBreadcrumb = (index: number) => {
        const newBreadcrumbs = breadcrumbs.slice(0, index + 1)
        setBreadcrumbs(newBreadcrumbs)
        setSelectedFiles(new Set())
        loadFiles(newBreadcrumbs[index].id || undefined)
    }

    // Toggle file selection
    const toggleFileSelection = (fileId: string) => {
        const newSelection = new Set(selectedFiles)
        if (newSelection.has(fileId)) {
            newSelection.delete(fileId)
        } else {
            newSelection.add(fileId)
        }
        setSelectedFiles(newSelection)
    }

    // Import selected files
    const importSelectedFiles = async () => {
        if (selectedFiles.size === 0) return

        setIsImporting(true)
        try {
            const importPromises = Array.from(selectedFiles).map((fileId) =>
                apiImportGoogleDriveFile({ fileId, copilotId })
            )

            await Promise.all(importPromises)

            toast.push(
                <Notification type="success" duration={3000}>
                    {selectedFiles.size} file(s) imported successfully
                </Notification>
            )

            setSelectedFiles(new Set())
            onImportSuccess?.()
        } catch (error: any) {
            console.error('Failed to import files:', error)

            let errorMessage = 'Failed to import files from Google Drive'
            let errorTitle = 'Import Failed'

            if (error.response?.status === 500) {
                const detail = error.response.data?.detail || 'Internal server error'
                errorMessage = `Server error: ${detail}`
                errorTitle = 'Server Error'
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail
            }

            toast.push(
                <Notification type="danger" duration={5000} title={errorTitle}>
                    {errorMessage}
                </Notification>
            )
        } finally {
            setIsImporting(false)
        }
    }

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <div className="space-y-4">
            {/* Header with breadcrumbs */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                            <button
                                onClick={() => navigateToBreadcrumb(index)}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${index === breadcrumbs.length - 1
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                    }`}
                            >
                                {index === 0 ? (
                                    <Home className="w-4 h-4" />
                                ) : (
                                    <Folder className="w-4 h-4" />
                                )}
                                {crumb.name}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {selectedFiles.size > 0 && (
                        <Button
                            size="sm"
                            variant="solid"
                            icon={<Download className="w-4 h-4" />}
                            loading={isImporting}
                            onClick={importSelectedFiles}
                        >
                            Import ({selectedFiles.size})
                        </Button>
                    )}
                    <button
                        onClick={() => loadFiles(currentFolderId || undefined)}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Files list */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Spinner size={32} />
                </div>
            ) : files.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                    <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 mb-2">Drive appears empty</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                        We couldn't find any files in your {breadcrumbs[breadcrumbs.length - 1].name}.
                        Note: We currently only list files directly in this folder. Shared files must be added to your Drive to appear here.
                    </p>
                    <Button
                        variant="plain"
                        size="sm"
                        className="mt-6"
                        onClick={() => loadFiles(currentFolderId || undefined)}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Check Again
                    </Button>
                </div>

            ) : (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className={`flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700 last:border-0 transition-colors ${file.isFolder
                                    ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                    : selectedFiles.has(file.id) && file.canImport
                                        ? 'bg-[#0055BA]/5 border-l-4 border-l-[#0055BA]'
                                        : file.canImport
                                            ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer'
                                            : 'opacity-60'
                                    }`}
                                onClick={() => {
                                    if (file.isFolder) {
                                        navigateToFolder(file)
                                    } else if (file.canImport) {
                                        toggleFileSelection(file.id)
                                    }
                                }}
                            >
                                {/* Icon */}
                                <div className="shrink-0">
                                    {file.isFolder ? (
                                        <Folder className="w-5 h-5 text-blue-500" />
                                    ) : file.iconUrl ? (
                                        <img src={file.iconUrl} alt="" className="w-5 h-5" />
                                    ) : (
                                        <FileText className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>

                                {/* File info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {file.name}
                                    </p>
                                    {!file.isFolder && (
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(file.size)}
                                            {!file.isSupported && (
                                                <span className="ml-2 text-amber-600">• Unsupported format</span>
                                            )}
                                        </p>
                                    )}
                                </div>

                                {/* Selection indicator */}
                                {!file.isFolder && file.canImport && selectedFiles.has(file.id) && (
                                    <CheckCircle2 className="w-5 h-5 text-[#0055BA] shrink-0" />
                                )}

                                {/* Folder indicator */}
                                {file.isFolder && (
                                    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Help text */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Click folders to navigate. Click files to select for import. Supported formats: PDF, DOCX, XLSX, TXT, CSV, MD, and Google Docs/Sheets.
            </p>
        </div>
    )
}
