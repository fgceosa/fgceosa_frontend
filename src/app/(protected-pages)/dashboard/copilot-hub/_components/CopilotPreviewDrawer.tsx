'use client'

import { useState, useEffect, useRef } from 'react'
import { Drawer, Button, ScrollBar } from '@/components/ui'
import { X, Send, Bot, Sparkles, Trash2, Info, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatBox from '@/components/view/ChatBox'
import type { ScrollBarRef } from '@/components/view/ChatBox'
import { apiCreateConversation, apiSendCopilotMessage } from '@/services/CopilotService'
import type { Copilot } from '../types'
import classNames from '@/utils/classNames'

interface CopilotPreviewDrawerProps {
    isOpen: boolean
    onClose: () => void
    copilot: Copilot
}

export default function CopilotPreviewDrawer({
    isOpen,
    onClose,
    copilot,
}: CopilotPreviewDrawerProps) {
    const [messages, setMessages] = useState<any[]>([])
    const [inputValue, setInputValue] = useState('')
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [isTyping, setIsTyping] = useState(false)
    const [isStarting, setIsStarting] = useState(true)
    const scrollRef = useRef<ScrollBarRef>(null)

    // Initialize conversation
    useEffect(() => {
        if (isOpen && !conversationId) {
            handleStartConversation()
        }
    }, [isOpen, conversationId])

    const handleStartConversation = async () => {
        setIsStarting(true)
        try {
            const conv = await apiCreateConversation(copilot.id, {
                title: `Preview: ${copilot.name}`,
            })
            setConversationId(conv.id)

            if (copilot.welcomeMessage) {
                setMessages([
                    {
                        id: 'welcome',
                        content: copilot.welcomeMessage,
                        role: 'assistant',
                        createdAt: new Date().toISOString(),
                    },
                ])
            } else {
                setMessages([])
            }
        } catch (error) {
            console.error('Failed to start conversation:', error)
        } finally {
            setIsStarting(false)
        }
    }

    const handleClearChat = () => {
        setMessages([])
        setConversationId(null)
        setInputValue('')
        handleStartConversation()
    }

    const handleSendMessage = async (content: string) => {
        if (!content.trim() || !conversationId || isTyping) return

        const userMessage = {
            id: Date.now().toString(),
            content,
            role: 'user',
            createdAt: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        try {
            const response = await apiSendCopilotMessage(copilot.id, {
                conversationId,
                content,
                adminPreview: true,
            })

            const assistantMessage = {
                id: response.messageId || Date.now().toString() + '-ai',
                content: response.content,
                role: 'assistant',
                createdAt: new Date().toISOString(),
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            console.error('Failed to send message:', error)
            setMessages((prev) => [
                ...prev,
                {
                    id: 'error-' + Date.now(),
                    content: 'An error occurred while communicating with the copilot. Please verify your configuration.',
                    role: 'assistant',
                    isError: true,
                },
            ])
        } finally {
            setIsTyping(false)
        }
    }

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages.length, isTyping])

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            placement="right"
            width={580}
            closable={true}
            className="p-0 border-l border-gray-100 dark:border-gray-800 bg-[#fbfbfb] dark:bg-gray-950 shadow-2xl"
        >
            <div className="flex flex-col h-full relative overflow-hidden">
                {/* Premium Header */}
                <div className="relative px-6 py-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-10 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/5">
                                    <Bot className="w-6 h-6 text-primary" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                                    <Sparkles className="w-2.5 h-2.5 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                                    {copilot.name}
                                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[9px] font-black rounded-full border border-amber-500/20 uppercase tracking-wider">
                                        Test Mode
                                    </span>
                                </h3>
                                <p className="text-[10px] font-bold text-gray-400 mt-0.5 flex items-center gap-1.5">
                                    <Info className="w-3 h-3" />
                                    Bypassing visibility restrictions for owner testing
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleClearChat}
                                title="Clear Test Chat"
                                className="w-10 h-10 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 hover:text-rose-500 transition-all flex items-center justify-center active:scale-90"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center group active:scale-90"
                            >
                                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    <ChatBox
                        ref={scrollRef}
                        messageList={messages}
                        placeholder="Test your copilot..."
                        showMessageList={messages.length > 0 || isTyping}
                        showAvatar={true}
                        avatarGap={true}
                        inputValue={inputValue}
                        onInputValueChange={setInputValue}
                        onInputChange={({ value }) => handleSendMessage(value)}
                        typing={isTyping ? {
                            id: 'ai',
                            name: copilot.name,
                            avatarImageUrl: ''
                        } : false}
                        containerClass="h-full !bg-transparent"
                        messageListClass="px-6 py-8"
                    >
                        {messages.length === 0 && !isTyping && !isStarting && (
                            <div className="h-full flex flex-col items-center justify-center p-8 overflow-y-auto custom-scrollbar">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full max-w-md space-y-10"
                                >
                                    <div className="text-center space-y-4">
                                        <div className="w-20 h-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-primary/10 shadow-inner group relative">
                                            <Bot className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] animate-ping opacity-20" />
                                        </div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                                            Experience your <span className="text-primary">Copilot</span>
                                        </h2>
                                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                            Review permissions, knowledge base depth, and system instructions in a safe sandbox before publishing.
                                        </p>
                                    </div>

                                    {copilot.suggestedPrompts && copilot.suggestedPrompts.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 px-1">
                                                <Sparkles className="w-4 h-4 text-amber-500" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recommended Tests</span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                {copilot.suggestedPrompts.map((prompt, idx) => (
                                                    <motion.button
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        onClick={() => handleSendMessage(prompt)}
                                                        className="group p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all flex items-center justify-between text-left"
                                                    >
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors line-clamp-2">
                                                            {prompt}
                                                        </span>
                                                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                            <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        )}
                    </ChatBox>
                </div>

                {/* Footer Status */}
                <div className="px-6 py-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Engine: {copilot.model}</span>
                        </div>
                        <div className="w-px h-3 bg-gray-100 dark:bg-gray-800" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Temp: {copilot.temperature}</span>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}
