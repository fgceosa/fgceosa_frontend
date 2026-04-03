'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Send, Paperclip, Mic, X } from 'lucide-react'
import classNames from '@/utils/classNames'

export interface ChatInputEnhancedProps {
    value: string
    onChange: (value: string) => void
    onSend: () => void
    onStop?: () => void
    placeholder?: string
    disabled?: boolean
    isLoading?: boolean
    maxLength?: number
    showAttachments?: boolean
    showVoice?: boolean
    modelInfo?: {
        name: string
        provider: string
    }
}

export const ChatInputEnhanced: React.FC<ChatInputEnhancedProps> = ({
    value,
    onChange,
    onSend,
    onStop,
    placeholder = 'Message...',
    disabled = false,
    isLoading = false,
    maxLength = 4000,
    showAttachments = true,
    showVoice = false,
    modelInfo,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [isFocused, setIsFocused] = useState(false)

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()

            // Only submit if not disabled, not loading, and has content
            if (!disabled && !isLoading && value.trim()) {
                onSend()
            }
        }
    }

    // Auto-focus logic can be added here if needed, but usually annoying on mobile

    return (
        <div className="w-full max-w-4xl mx-auto px-4 pb-4">
            <div
                className={classNames(
                    "relative flex items-end gap-2 p-1.5 bg-white dark:bg-gray-800 rounded-3xl border transition-all duration-300 shadow-sm",
                    isFocused ? "border-blue-500/50 shadow-blue-500/10" : "border-gray-200 dark:border-gray-700",
                    disabled && "opacity-60 cursor-not-allowed"
                )}
            >
                {/* Prefix Icons (Attachments) */}
                {showAttachments && (
                    <button
                        className="p-2.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors flex-shrink-0 mb-0.5 ml-1"
                        disabled={disabled || isLoading}
                        type="button"
                    >
                        <Paperclip size={20} strokeWidth={2} />
                    </button>
                )}

                {/* Text Area */}
                <div className="flex-1 min-w-0 py-2.5 px-3">
                    <textarea
                        ref={textareaRef}
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-[15px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 resize-none max-h-[200px] overflow-y-auto scrollbar-hide outline-none leading-relaxed"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => {
                            onChange(e.target.value)
                            const target = e.target
                            target.style.height = 'auto'
                            target.style.height = `${Math.min(target.scrollHeight, 200)}px`
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={disabled || isLoading}
                        rows={1}
                        maxLength={maxLength}
                    />
                </div>

                {/* Suffix Icons (Voice & Send) */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    {showVoice && !value && (
                        <button
                            className="p-2.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
                            disabled={disabled || isLoading}
                            type="button"
                        >
                            <Mic size={20} strokeWidth={2} />
                        </button>
                    )}

                    <button
                        className={classNames(
                            "p-2.5 rounded-full transition-all duration-300 flex items-center justify-center",
                            isLoading 
                                ? "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-95 animate-in fade-in zoom-in duration-300"
                                : value.trim() && !disabled
                                    ? "bg-[#0055BA] text-white shadow-lg shadow-blue-500/30 hover:bg-[#004299] active:scale-95"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        )}
                        disabled={!isLoading && (disabled || !value.trim())}
                        onClick={isLoading ? onStop : onSend}
                        type="button"
                    >
                        {isLoading ? (
                            <svg 
                                className="w-4 h-4" 
                                viewBox="0 0 24 24" 
                                fill="currentColor"
                            >
                                <rect x="6" y="6" width="12" height="12" rx="2" />
                            </svg>
                        ) : (
                            <Send size={18} strokeWidth={2.5} className={value.trim() ? "ml-0.5" : ""} />
                        )}
                    </button>
                </div>

                {/* Character Count (Optional - visible when near limit) */}
                {value.length > maxLength * 0.9 && (
                    <div className="absolute -bottom-6 right-4 text-xs font-medium text-amber-500">
                        {value.length}/{maxLength}
                    </div>
                )}
            </div>

            {modelInfo && (
                <div className="flex justify-start mt-3 mb-1 ml-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-full transition-all duration-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 group">
                        <div className="flex items-center gap-1.5">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </div>
                            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-tight transition-colors group-hover:text-blue-500">
                                Using <span className="text-gray-900 dark:text-white font-black group-hover:text-blue-700 dark:group-hover:text-white">{modelInfo.name}</span>
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center mt-2 pb-2">
                <span className="text-xs text-gray-400/80 dark:text-gray-500/80 font-medium tracking-tight">
                    AI can make mistakes. Check important info.
                </span>
            </div>
        </div>
    )
}
