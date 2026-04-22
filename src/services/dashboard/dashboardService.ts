import ApiService from '../ApiService'

export interface AdminStats {
    totalMembers: number
    totalDuesCollected: number
    pendingPaymentsCount: number
    activeEvents: number
    recentAnnouncementsCount: number
    recentTransactions: Array<{
        name: string
        date: string
        amount: number
        status: string
    }>
    announcements: Array<{
        title: string
        date: string
        type: string
        priority: string
    }>
    unpaidFollowups: Array<{
        id: string
        name: string
        amount: number
    }>
}

export interface MemberSummary {
    membershipStatus: string
    verified: boolean
    duesStatus: 'paid' | 'overdue'
    totalPaid: number
    upcomingEventsCount: number
    outstandingAmount: number
    outstandingTitle: string | null
    outstandingDueDate: string
    upcomingEvents: Array<{
        id: number
        title: string
        date: string
        location: string
        featured: boolean
        image?: string
    }>
    paymentHistory: Array<{
        id: number
        title: string
        ref: string
        date: string
        amount: number
        status: string
        type: string
    }>
    announcements: Array<{
        title: string
        content: string
        date: string
        type: string
        color: string
    }>
    membershipId: string
}

export async function apiGetAdminStats() {
    try {
        const resp = await ApiService.fetchDataWithAxios<AdminStats>({
            url: '/dashboard/admin/stats',
            method: 'get',
        })
        return resp
    } catch (error) {
        console.warn('Dashboard admin stats not available, returning empty defaults')
        return {
            totalMembers: 0,
            totalDuesCollected: 0,
            pendingPaymentsCount: 0,
            activeEvents: 0,
            recentAnnouncements: 0,
        }
    }
}

export async function apiGetMemberSummary() {
    try {
        const resp = await ApiService.fetchDataWithAxios<MemberSummary>({
            url: '/dashboard/member/summary',
            method: 'get',
        })
        return resp
    } catch (error) {
        console.warn('Dashboard member summary not available, returning empty defaults')
        return {
            memberId: '',
            fullName: '',
            membershipStatus: 'Unknown',
            lastPaymentDate: '',
            paymentHistory: [],
        }
    }
}
