import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useAppSelector } from '@/store/hook'
import { selectUsersList, selectUsersMembersLoading } from '@/store/slices/admin/users'
import type { UserMember } from '../types'

export const useUserTable = (initialPageIndex = 1, initialPageSize = 10) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const users = useAppSelector(selectUsersList) as UserMember[]
    const isLoading = useAppSelector(selectUsersMembersLoading)

    const pageIndex = parseInt(searchParams.get('pageIndex') || initialPageIndex.toString())
    const pageSize = parseInt(searchParams.get('pageSize') || initialPageSize.toString())

    const pageSizeOptions = useMemo(
        () => [10, 25, 50, 100].map((number) => ({
            value: number,
            label: number.toString(),
        })),
        []
    )

    const handlePaginationChange = (page: number) => {
        const params = new URLSearchParams(window.location.search)
        params.set('pageIndex', page.toString())
        router.push(`?${params.toString()}`)
    }

    const handlePageSizeChange = (size?: number) => {
        const params = new URLSearchParams(window.location.search)
        params.set('pageSize', (size || 10).toString())
        params.set('pageIndex', '1')
        router.push(`?${params.toString()}`)
    }

    const [selectedRows, setSelectedRows] = useState<string[]>([])

    const toggleRow = (id: string) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleAll = (ids: string[]) => {
        setSelectedRows(prev =>
            prev.length === ids.length ? [] : ids
        )
    }

    const clearSelection = () => setSelectedRows([])

    return {
        users,
        isLoading,
        pageIndex,
        pageSize,
        pageSizeOptions,
        handlePaginationChange,
        handlePageSizeChange,
        selectedRows,
        toggleRow,
        toggleAll,
        clearSelection,
    }
}
