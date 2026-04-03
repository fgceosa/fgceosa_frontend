'use client'

import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { User } from 'lucide-react'
import classNames from '@/utils/classNames'
import CodeBlock from './CodeBlock'
import ChatMessageActions from './ChatMessageActions'
import type { Conversation as MessageType } from '../../../types'
import { useTypewriter } from '../../../hooks/useTypewriter'

interface ChatMessageProps {
    message: Omit<MessageType, 'timestamp'> & { timestamp?: number | string; isFresh?: boolean }
    onRegenerate?: () => void
    onUpdate?: (messageId: string, content: string) => void
}

export const ChatMessage = ({ message, onRegenerate, onUpdate }: ChatMessageProps) => {
    const [isEditing, setIsEditing] = React.useState(false)
    const [editContent, setEditContent] = React.useState(message.content || '')

    const isUser = message.isMyMessage || message.sender?.id === 'user' || (message.sender?.id !== 'ai' && message.sender?.id !== 'gpt-4' && !message.sender?.avatarImageUrl?.includes('ai.jpg'))
    const content = message.content || ''

    // Typewriter effect for fresh AI messages
    const shouldType = !isUser && message.isFresh
    const { displayedText, isTyping } = useTypewriter(content, 3, shouldType)

    const finalContent = shouldType ? displayedText : content

    const handleSave = () => {
        if (editContent.trim() && editContent !== content) {
            onUpdate?.(message.id, editContent)
        }
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditContent(content)
        setIsEditing(false)
    }

    return (
        <div
            className={classNames(
                "group w-full py-8 transition-colors duration-300",
                isUser ? "bg-transparent" : "bg-gray-50/50 dark:bg-gray-900/10"
            )}
        >
            <div className={classNames(
                "max-w-4xl mx-auto px-4 md:px-6 flex gap-4 md:gap-6",
                isUser && "flex-row-reverse"
            )}>
                {/* Minimal Avatar */}
                <div className="flex-shrink-0">
                    {isUser ? (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
                            {message.sender?.avatarImageUrl ? (
                                <img src={message.sender.avatarImageUrl} alt="User" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <User className="w-4 h-4 text-gray-500" />
                            )}
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#0055BA] flex items-center justify-center shadow-lg shadow-blue-500/10">
                            <div className="text-white font-black text-sm">Q</div>
                        </div>
                    )}
                </div>

                {/* Content Body */}
                <div className={classNames(
                    "flex-1 min-w-0 space-y-2",
                    isUser && "flex flex-col items-end"
                )}>
                    {/* Message Bubble - Transparent/Flat style like OpenAI */}
                    <div className={classNames(
                        "text-[15px] leading-7 prose dark:prose-invert max-w-none break-words",
                        isUser ? "text-gray-700 dark:text-gray-300 text-right" : "text-gray-900 dark:text-gray-100"
                    )}>
                        {isEditing ? (
                            <div className="w-full space-y-3 mt-1">
                                <textarea
                                    className="w-full p-3 text-[15px] bg-white dark:bg-gray-800 border-2 border-blue-500/50 rounded-xl focus:border-blue-500 outline-none transition-all resize-none min-h-[100px]"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={!editContent.trim()}
                                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#0055BA] rounded-lg hover:bg-[#004299] transition-all disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : isUser ? (
                            <div className="whitespace-pre-wrap">{finalContent}</div>
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    a: (props) => (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline break-all"
                                            {...props}
                                        />
                                    ),
                                    code({ node, inline, className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return !inline && match ? (
                                            <CodeBlock
                                                language={match[1]}
                                                value={String(children).replace(/\n$/, '')}
                                            />
                                        ) : (
                                            <code className="bg-gray-100 dark:bg-gray-800 rounded px-1.5 py-0.5 text-sm font-mono text-pink-500 dark:text-pink-400" {...props}>
                                                {children}
                                            </code>
                                        )
                                    },
                                    pre: ({ children }) => <>{children}</>,
                                    table: ({ children }) => (
                                        <div className="overflow-x-auto my-6 border border-gray-200 dark:border-gray-800 rounded-xl">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                                                {children}
                                            </table>
                                        </div>
                                    ),
                                    thead: ({ children }) => <thead className="bg-gray-50/50 dark:bg-gray-900/50">{children}</thead>,
                                    th: ({ children }) => (
                                        <th className="px-4 py-3 text-left font-bold text-gray-500 text-[10px]">
                                            {children}
                                        </th>
                                    ),
                                    td: ({ children }) => (
                                        <td className="px-4 py-3 whitespace-normal border-t border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400">
                                            {children}
                                        </td>
                                    ),
                                    p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                                }}
                            >
                                {finalContent}
                            </ReactMarkdown>
                        )}
                        {/* Cursor indicator during typing */}
                        {isTyping && (
                            <span className="inline-block w-2 h-4 bg-[#0055BA] ml-1 animate-pulse align-middle" />
                        )}
                    </div>

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {message.attachments.map((att, i) => (
                                <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm transition-transform hover:scale-[1.02]">
                                    {att.type === 'image' && (
                                        <img src={att.mediaUrl} alt="Attachment" className="max-h-64 object-cover" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    {!isTyping && !isEditing && (
                        <ChatMessageActions 
                            content={content} 
                            isUser={isUser}
                            onRegenerate={!isUser ? onRegenerate : undefined}
                            onEdit={isUser ? () => setIsEditing(true) : undefined}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
