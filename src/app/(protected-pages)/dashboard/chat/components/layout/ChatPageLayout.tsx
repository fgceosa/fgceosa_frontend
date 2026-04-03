'use client'

import { useState } from 'react'
import ChatSideNav from './ChatSideNav'
import ChatView from '../ui/chat-view/ChatView'

interface ChatPageLayoutProps {
}

export default function ChatPageLayout({ }: ChatPageLayoutProps) {
    const [showSidebar, setShowSidebar] = useState(true)

    return (
        <div className="flex h-[calc(100vh-64px)] bg-[#f5f5f5] dark:bg-gray-900 overflow-hidden relative">
            {/* Sidebar Desktop - Always visible */}
            <div
                className="flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 hidden xl:flex flex-col h-full w-[280px]"
            >
                <ChatSideNav
                    showOnMobile={false}
                    className="w-[280px]"
                    onClose={() => { }}
                />
            </div>

            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <ChatView
                    showSidebar={showSidebar}
                    onToggleSidebar={() => setShowSidebar(!showSidebar)}
                />
            </div>
        </div>
    )
}
