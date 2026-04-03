'use client'

import { useRef, useEffect, useMemo, useState } from 'react'
import ChatBox from '@/components/view/ChatBox'
import type { ScrollBarRef } from '@/components/view/ChatBox'
import { useAppSelector } from '@/store/hook'
import { chatSelectors } from '@/store/slices/chat'

import ChatLandingView from './ChatLandingView'
import SuggestionChips from './SuggestionChips'
import ChatHeader from '../header/ChatHeader'
import ChatMobileNav from '../../layout/ChatMobileNav'
import { useChatInteraction } from '../../../hooks/useChatInteraction'
import { useChatModels } from '../../../hooks/useChatModels'
import useResponsive from '@/utils/hooks/useResponsive'

interface ChatViewProps {
    showSidebar?: boolean
    onToggleSidebar?: () => void
}

export default function ChatView({ showSidebar, onToggleSidebar }: ChatViewProps) {
    const scrollRef = useRef<ScrollBarRef>(null)
    const [inputValue, setInputValue] = useState('')
    const [selectedModel, setSelectedModel] = useState('')
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

    const { smaller } = useResponsive()
    const isMobile = smaller.xl

    // Redux Selectors
    const selectedConversationId = useAppSelector(chatSelectors.selectSelectedConversation)
    const chatHistory = useAppSelector(chatSelectors.selectChatData)
    const isTyping = useAppSelector(chatSelectors.selectIsTyping)
    const { models } = useChatModels(selectedModel, setSelectedModel)

    // Derive current model
    const currentModel = useMemo(() => models.find(m => m.id === selectedModel), [models, selectedModel])

    // Interaction Hook
    const { handleSend, handleStop, handleUpdateMessage } = useChatInteraction(selectedModel)

    // Derive Message List
    const messageList = useMemo(() => {
        const chat = chatHistory?.find((c) => c.id === selectedConversationId)
        return chat?.conversation || []
    }, [selectedConversationId, chatHistory])

    // Scroll to bottom when conversation changes or messages update
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [selectedConversationId, messageList.length])

    useEffect(() => {
        if (!isMobile && isMobileNavOpen) {
            setIsMobileNavOpen(false)
        }
    }, [isMobile, isMobileNavOpen])

    // Handlers
    const handleInputChange = async ({ value }: { value: string }) => {
        setInputValue('')
        handleSend(value)
    }

    const handleChipClick = (label: string) => {
        setInputValue(label)
    }

    const showLanding = !selectedConversationId && !isTyping && !inputValue
    const modelInfo = currentModel ? { name: currentModel.name, provider: currentModel.provider } : undefined

    return (
        <div className="flex-1 h-full relative flex flex-col min-w-0 bg-[#f5f5f5] dark:bg-gray-900">
            <ChatMobileNav
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
            />
            <ChatBox
                ref={scrollRef}
                messageList={messageList}
                placeholder="Enter a prompt here..."
                showMessageList={Boolean(selectedConversationId) || isTyping}
                showAvatar={true}
                avatarGap={true}
                modelInfo={modelInfo}
                header={
                    <ChatHeader
                        selectedModel={selectedModel}
                        onModelChange={setSelectedModel}
                        showSidebar={showSidebar}
                        onToggleSidebar={() => {
                            if (isMobile) {
                                setIsMobileNavOpen(true)
                            } else {
                                onToggleSidebar?.()
                            }
                        }}
                    />
                }
                typing={
                    isTyping
                        ? {
                            id: 'ai',
                            name: 'Chat AI',
                            avatarImageUrl: '/img/thumbs/ai.jpg',
                        }
                        : false
                }
                onInputChange={handleInputChange}
                onStop={handleStop}
                onUpdate={handleUpdateMessage}
                isLoading={isTyping}
                inputValue={inputValue}
                onInputValueChange={setInputValue}
                suggestionChips={null}
            >
                {showLanding && (
                    <ChatLandingView
                        suggestionChips={<SuggestionChips onChipClick={handleChipClick} />}
                    />
                )}
            </ChatBox>
        </div>
    )
}
