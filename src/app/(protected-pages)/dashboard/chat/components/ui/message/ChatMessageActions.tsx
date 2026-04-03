'use client'

import { useState } from 'react'
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Edit2 } from 'lucide-react'
import classNames from '@/utils/classNames'

interface ChatMessageActionsProps {
    content: string
    isUser?: boolean
    onRegenerate?: () => void
    onEdit?: () => void
}

export default function ChatMessageActions({ content, isUser, onRegenerate, onEdit }: ChatMessageActionsProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={classNames(
            "flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
            isUser && "justify-end"
        )}>
            {isUser && onEdit && (
                <button
                    onClick={onEdit}
                    className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    title="Edit message"
                >
                    <Edit2 size={14} />
                </button>
            )}

            <button
                onClick={handleCopy}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Copy message"
            >
                {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>

            {onRegenerate && (
                <button
                    onClick={onRegenerate}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Regenerate response"
                >
                    <RotateCcw size={14} />
                </button>
            )}

            <div className="h-3 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

            <button
                className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
                <ThumbsUp size={14} />
            </button>

            <button
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
                <ThumbsDown size={14} />
            </button>
        </div>
    )
}
