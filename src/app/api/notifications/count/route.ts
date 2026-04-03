import { notificationListData } from '@/mock/notificationData'
import { NextResponse } from 'next/server'


export async function GET() {
    try {
        const unreadNotification = notificationListData.filter( //TODO:REPLACE WITH NORMAL ENDPOINT DATA
            (notification) => !notification.readed,
        )
        return NextResponse.json({ count: unreadNotification.length })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }
}
