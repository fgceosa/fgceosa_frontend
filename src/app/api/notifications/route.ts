import { notificationListData } from '@/mock/notificationData'
import { NextResponse } from 'next/server'


export async function GET() {
    try {
        return NextResponse.json(notificationListData) //TODO:REPLACE WITH NORMAL ENDPOINT DATA
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 500 })
    }
}
