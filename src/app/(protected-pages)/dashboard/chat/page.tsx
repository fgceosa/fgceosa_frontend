import ChatProvider from './components/providers/ChatProvider'
import ChatPageLayout from './components/layout/ChatPageLayout'
import AllDialogs from './components/ui/dialogs/AllDialogs'
import getChatHistory from '@/server/actions/getChatHistory'
import type { ChatHistories } from './types'

export default async function Page() {
    const chatHistory = await getChatHistory()
    return (
        <ChatProvider chatHistory={chatHistory as ChatHistories}>
            <ChatPageLayout />
            <AllDialogs />
        </ChatProvider>
    )
}
