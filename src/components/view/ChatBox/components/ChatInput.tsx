'use client'

import React from 'react'
import { ChatInputEnhanced } from '@/app/(protected-pages)/dashboard/chat/components/ui/input/ChatInputEnhanced'
import type { Ref } from 'react'

export type ChatInputProps = {
    placeholder?: string
    onInputChange?: (payload: { value: string; attachments: File[] }) => void
    ref?: Ref<HTMLInputElement>
    value?: string
    onChange?: (value: string) => void
    onStop?: () => void
    isLoading?: boolean
    modelInfo?: {
        name: string
        provider: string
    }
}

const ChatInput = (props: ChatInputProps) => {
    const { 
        placeholder = 'Enter a prompt here', 
        onInputChange, 
        value = '', 
        onChange, 
        onStop, 
        isLoading = false,
        modelInfo 
    } = props

    const handleSend = () => {
        if (value.trim()) {
            onInputChange?.({
                value: value,
                attachments: [],
            })
        }
    }

    const handleChange = (newValue: string) => {
        onChange?.(newValue)
    }

    return (
        <ChatInputEnhanced
            value={value}
            onChange={handleChange}
            onSend={handleSend}
            onStop={onStop}
            placeholder={placeholder}
            maxLength={4000}
            modelInfo={modelInfo}
            disabled={false}
            isLoading={isLoading}
            showAttachments={false}
            showVoice={false}
        />
    )
}

export default ChatInput
