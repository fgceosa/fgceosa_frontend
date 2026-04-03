export type NotificationRemote = {
    id: string
    userId: string
    title: string
    description: string
    type: string
    isRead: boolean
    createdAt: string
    metadata: Record<string, any> | null
}

export type NotificationsResponse = {
    data: NotificationRemote[]
    count: number
    unreadCount: number
}
