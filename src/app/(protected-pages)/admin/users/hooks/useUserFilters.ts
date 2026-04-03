import { useRouter, useSearchParams } from 'next/navigation'
import { useAppSelector } from '@/store/hook'
import { selectUsersAnalytics, selectUsersTotal } from '@/store/slices/admin/users'

export const useUserFilters = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const analytics = useAppSelector(selectUsersAnalytics)
    const total = useAppSelector(selectUsersTotal)

    const activeTab = searchParams.get('status') || 'all'
    const activeRole = searchParams.get('role') || 'all'
    const activeDate = searchParams.get('date') || 'all'

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search)
        if (value === 'all') {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        params.set('pageIndex', '1')
        router.push(`?${params.toString()}`)
    }

    const handleTabChange = (value: string) => updateFilter('status', value)
    const handleRoleChange = (role: string) => updateFilter('role', role)
    const handleDateChange = (date: string) => updateFilter('date', date)

    const tabs = [
        { label: 'All', value: 'all', count: total || 0 },
        { label: 'Active', value: 'active', count: analytics?.activeUsers || 0 },
        { label: 'Pending', value: 'pending', count: analytics?.pendingInvites || 0 },
        { label: 'Disabled', value: 'disabled', count: 0 }, // Placeholder for now
    ]

    return {
        activeTab,
        activeRole,
        activeDate,
        handleTabChange,
        handleRoleChange,
        handleDateChange,
        tabs,
        analytics,
        total,
    }
}
