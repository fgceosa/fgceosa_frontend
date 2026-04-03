'use client'

import { useRef, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChatMessage } from '@/app/(protected-pages)/dashboard/chat/components/ui/message/ChatMessage'
import { TypingIndicator } from '@/app/(protected-pages)/dashboard/chat/components/ui/message/TypingIndicator'
import ScrollBar from '@/components/ui/ScrollBar'
import Message from './Message'
import classNames from '@/utils/classNames'
import type { ReactNode, Ref } from 'react'
import type { ScrollBarRef } from '../types'
import type { MessageProps } from './Message'

type List = MessageProps & { fresh?: boolean }

export type MessageListProps = {
    list: List[]
    showAvatar?: boolean
    avatarGap?: boolean
    typing?:
    | {
        id: string
        name: string
        avatarImageUrl?: string
    }
    | false
    customRenderer?: (message: List, index: number) => string | ReactNode
    customAction?: (message: List, index: number) => string | ReactNode
    bubbleClass?: string
    messageListClass?: string
    onUpdate?: (messageId: string, content: string) => void
    ref?: Ref<ScrollBarRef>
}

const MessageList = (props: MessageListProps) => {
    const {
        list = [],
        showAvatar = true,
        typing = false,
        avatarGap,
        customRenderer,
        customAction,
        messageListClass,
        bubbleClass,
        onUpdate,
        ref,
    } = props

    const [showScrollButton, setShowScrollButton] = useState(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
        const container = scrollContainerRef.current
        if (container) {
            const isNearBottom =
                container.scrollHeight - container.scrollTop - container.clientHeight < 100
            setShowScrollButton(!isNearBottom)
        }
    }

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth',
            })
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [list.length, typing])

    // Use new ChatMessage component when no custom renderer is provided
    const useNewDesign = !customRenderer && !customAction

    return (
        <div className={classNames('relative h-full', messageListClass)}>
            <ScrollBar
                autoHide
                className="overflow-y-auto h-full max-w-full chat-scrollbar"
                scrollableNodeProps={{ ref }}
            >
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex flex-col min-h-full py-4"
                >
                    {useNewDesign ? (
                        // New Premium Design (Full-width containers for background colors)
                        <div className="w-full">
                            <AnimatePresence mode="popLayout">
                                {list.map((msg) => (
                                    <ChatMessage
                                        key={msg.id}
                                        message={{
                                            ...msg,
                                            isFresh: msg.fresh,
                                            content:
                                                typeof msg.content === 'string'
                                                    ? msg.content
                                                    : '',
                                            timestamp:
                                                typeof msg.timestamp === 'number'
                                                    ? msg.timestamp
                                                    : msg.timestamp instanceof Date
                                                        ? msg.timestamp.getTime()
                                                        : undefined,
                                        }}
                                        onUpdate={onUpdate}
                                    />
                                ))}
                                {typing && (
                                    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
                                        <TypingIndicator key="typing" />
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        // Legacy Design with custom renderers
                        <div className="flex flex-col gap-4 px-4">
                            {list.map((message, index) => (
                                <Message
                                    key={message.id}
                                    showAvatar={showAvatar}
                                    avatarGap={avatarGap}
                                    bubbleClass={bubbleClass}
                                    {...message}
                                    {...(customRenderer
                                        ? {
                                            customRenderer: () =>
                                                customRenderer(message, index),
                                        }
                                        : {})}
                                    {...(customAction
                                        ? {
                                            customAction: () =>
                                                customAction(message, index),
                                        }
                                        : {})}
                                />
                            ))}
                            {typing && (
                                <Message
                                    id={typing.name + 'typing'}
                                    sender={typing}
                                    type="regular"
                                    showAvatar={showAvatar}
                                    bubbleClass={bubbleClass}
                                    avatarGap={avatarGap}
                                    content={
                                        <span className="flex items-center gap-2">
                                            <span className="size-1.5 rounded-full bg-gray-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-gray-300"></span>
                                            <span className="size-1.5 rounded-full bg-gray-700 motion-safe:animate-[bounce_0.5s_ease-in-out_infinite] dark:bg-gray-300"></span>
                                            <span className="size-1.5 rounded-full bg-gray-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-gray-300"></span>
                                        </span>
                                    }
                                />
                            )}
                        </div>
                    )}
                </div>
            </ScrollBar>

            {/* Scroll to bottom button */}
            {showScrollButton && useNewDesign && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-8 right-8 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 shadow-lg transition-all hover:bg-gray-700 z-10"
                    aria-label="Scroll to bottom"
                >
                    <svg
                        className="h-5 w-5 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </button>
            )}
        </div>
    )
}

export default MessageList
