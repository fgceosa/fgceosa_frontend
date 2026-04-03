import { useState, useCallback } from 'react'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'

interface UsePaginationOptions {
    initialPage?: number
    initialPageSize?: number
    onPageChange?: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
}

/**
 * Custom hook for managing pagination state and URL params
 */
export function usePagination({
    initialPage = 1,
    initialPageSize = 10,
    onPageChange,
    onPageSizeChange
}: UsePaginationOptions = {}) {
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [pageSize, setPageSize] = useState(initialPageSize)
    const { onAppendQueryParams } = useAppendQueryParams()

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
        onAppendQueryParams({ page: page.toString() })
        onPageChange?.(page)
    }, [onAppendQueryParams, onPageChange])

    const handlePageSizeChange = useCallback((newPageSize: number) => {
        setPageSize(newPageSize)
        setCurrentPage(1) // Reset to first page when changing page size
        onAppendQueryParams({ pageSize: newPageSize.toString(), page: '1' })
        onPageSizeChange?.(newPageSize)
    }, [onAppendQueryParams, onPageSizeChange])

    const resetPagination = useCallback(() => {
        setCurrentPage(initialPage)
        setPageSize(initialPageSize)
    }, [initialPage, initialPageSize])

    return {
        currentPage,
        pageSize,
        handlePageChange,
        handlePageSizeChange,
        resetPagination
    }
}
