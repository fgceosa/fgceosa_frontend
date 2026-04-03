'use client'

import ChatContainer from './components/ChatContainer'
import MessageList from './components/MessageList'
import ChatInput from './components/ChatInput'
import type { MessageListProps } from './components/MessageList'
import type { ChatContainerProps } from './components/ChatContainer'
import type { ChatInputProps } from './components/ChatInput'
import type { ReactNode, Ref } from 'react'
import type { ScrollBarRef } from './types'

export type MessageList = MessageListProps['list']

export type ChatBoxProps = {
    messageList: MessageList
    header?: ChatContainerProps['header']
    showMessageList?: boolean
    children?: ReactNode
    containerClass?: string
    ref?: Ref<ScrollBarRef>
    inputValue?: string
    onInputValueChange?: (value: string) => void
    onStop?: () => void
    isLoading?: boolean
    onUpdate?: (messageId: string, content: string) => void
    suggestionChips?: ReactNode
    modelInfo?: {
        name: string
        provider: string
    }
} & Omit<MessageListProps, 'list'> &
    ChatInputProps

const ChatBox = (props: ChatBoxProps) => {
    const {
        messageList,
        showMessageList = true,
        children,
        header,
        placeholder,
        onInputChange,
        onStop,
        onUpdate,
        showAvatar,
        avatarGap,
        customRenderer,
        customAction,
        bubbleClass,
        typing,
        messageListClass,
        containerClass,
        ref,
        inputValue,
        onInputValueChange,
        suggestionChips,
        modelInfo,
        isLoading,
    } = props

    return (
        <ChatContainer
            className={containerClass}
            header={header}
            input={
                <div className="max-w-4xl mx-auto w-full space-y-5">
                    <ChatInput
                        placeholder={placeholder}
                        onInputChange={onInputChange}
                        onStop={onStop}
                        isLoading={isLoading}
                        value={inputValue}
                        onChange={onInputValueChange}
                        modelInfo={modelInfo}
                    />
                    {suggestionChips && <div className="mt-1">{suggestionChips}</div>}
                </div>
            }
        >
            {showMessageList && (
                <MessageList
                    ref={ref}
                    list={messageList}
                    showAvatar={showAvatar}
                    avatarGap={avatarGap}
                    customRenderer={customRenderer}
                    customAction={customAction}
                    typing={typing}
                    messageListClass={messageListClass}
                    bubbleClass={bubbleClass}
                    onUpdate={onUpdate}
                />
            )}
            {children}
        </ChatContainer>
    )
}

export default ChatBox
