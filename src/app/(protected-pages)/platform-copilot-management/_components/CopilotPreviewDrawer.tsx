'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
    Drawer,
    Button,
    Badge,
    Card,
    Switcher,
    Notification,
    toast,
    Spinner,
    Tooltip
} from '@/components/ui'
import {
    MessageSquare,
    Bot,
    Send,
    Trash2,
    Settings,
    Shield,
    X,
    Cpu,
    Zap,
    AlertCircle,
    Terminal,
    Eye
} from 'lucide-react'
import classNames from '@/utils/classNames'
import { Copilot } from '../../copilot-hub/types'
import MessageList from '@/components/view/ChatBox/components/MessageList'
import ChatInput from '@/components/view/ChatBox/components/ChatInput'
import {
    apiCreateConversation,
    apiSendCopilotMessage
} from '@/services/CopilotService'

interface CopilotPreviewDrawerProps {
    isOpen: boolean
    onClose: () => void
    copilot: Copilot
}

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    toolCalls?: any[]
}

export default function CopilotPreviewDrawer({ isOpen, onClose, copilot }: CopilotPreviewDrawerProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [showSystemPrompt, setShowSystemPrompt] = useState(false)
    const [showToolCalls, setShowToolCalls] = useState(false)
    const [conversationId, setConversationId] = useState<string | null>(null)
    const scrollRef = useRef<any>(null)

    // Reset chat when closed/opened
    useEffect(() => {
        if (!isOpen) {
            setMessages([])
            setInputValue('')
            setIsTyping(false)
            setConversationId(null)
        }
    }, [isOpen])

    const handleSend = async (content?: string) => {
        const text = content || inputValue
        if (!text.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        try {
            let currentConvId = conversationId
            if (!currentConvId) {
                const conv = await apiCreateConversation(copilot.id, { title: 'Admin Preview Session' })
                currentConvId = conv.id
                setConversationId(currentConvId)
            }

            const response = await apiSendCopilotMessage(copilot.id, {
                conversationId: currentConvId,
                content: text,
                adminPreview: true
            })

            const assistantMessage: Message = {
                id: response.responseId,
                role: 'assistant',
                content: response.content,
                timestamp: new Date(),
                toolCalls: response.toolCalls as any[]
            }
            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error('Preview chat failed:', error)
            toast.push(
                <Notification type="danger" duration={5000}>
                    Failed to get response from copilot.
                </Notification>
            )
        } finally {
            setIsTyping(false)
        }
    }

    const clearConversation = () => {
        setMessages([])
        toast.push(
            <Notification type="success" duration={2000}>
                Conversation cleared
            </Notification>
        )
    }

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            width="40%"
            placement="right"
            closable={true}
            bodyClass="p-0 flex flex-col h-full bg-gray-50 dark:bg-gray-950"
            title={
 <div className="flex items-center gap-4">
                    {/* Premium Icon Container */}
 <div className="relative">
 <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg"></div>
 <div className="relative p-2.5 bg-gradient-to-br from-primary to-blue-600 rounded-2xl shadow-lg border border-white/20">
 <Bot className="w-5 h-5 text-white" />
                        </div>
                    </div>

 <div className="flex flex-col gap-1">
 <div className="flex items-center gap-2.5">
 <h3 className="text-base font-black text-gray-900 dark:text-white leading-none">
                                {copilot.name}
                            </h3>
 <div className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded-md border border-primary/20">
                                Preview Mode
                            </div>
                        </div>

 <div className="flex items-center gap-3">
 <div className="flex items-center gap-1.5">
 <span className="text-[10px] font-black text-gray-400">{copilot.model}</span>
                            </div>
 <div className="w-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
 <div className="flex items-center gap-1.5">
 <div className={classNames(
                                    "w-1.5 h-1.5 rounded-full",
                                    copilot.status === 'active' ? "bg-emerald-500 animate-pulse" :
                                        copilot.status === 'inactive' ? "bg-amber-500" :
                                            copilot.status === 'draft' ? "bg-blue-500" : "bg-red-500"
                                )} />
 <span className="text-[10px] font-black text-gray-500 dark:text-gray-400">
                                    {copilot.status === 'inactive' ? 'Paused' : copilot.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            {/* Warning Banner */}
 <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent px-6 py-2.5 flex items-center gap-3 border-b border-amber-500/10 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-full bg-amber-500/5 rotate-45 translate-x-10 pointer-events-none" />
 <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
 <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 leading-relaxed">
                    Preview Mode — Live Evaluation Environment
                </p>
            </div>

            {/* Preview Scope Section */}
 <div className="px-6 py-4 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
 <div className="flex items-center gap-8">
                    {[
                        { label: 'Tools', value: 'Internal Only', color: 'text-gray-400' },
                        { label: 'Knowledge', value: 'Read-Only', color: 'text-blue-500' },
                        { label: 'Credits', value: 'Infinite', color: 'text-emerald-500' },
                        { label: 'Persistence', value: 'Ephemeral', color: 'text-purple-500' },
                    ].map((item) => (
 <div key={item.label} className="flex flex-col gap-1">
 <span className="text-[8px] font-black text-gray-400 leading-none">{item.label}</span>
 <span className={classNames("text-[10px] font-black", item.color)}>{item.value}</span>
                        </div>
                    ))}
                </div>
 <div className="px-3 py-1 bg-primary/5 rounded-lg border border-primary/10 flex items-center gap-2">
 <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
 <span className="text-[9px] font-black text-primary">Sandbox Active</span>
                </div>
            </div>

            {/* Chat Area */}
 <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900 m-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Chat Controls */}
 <div className="px-6 py-2.5 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/20 dark:bg-gray-800/10">
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setShowSystemPrompt(!showSystemPrompt)}>
                            <Switcher
                                checked={showSystemPrompt}
                                onChange={setShowSystemPrompt}
                            />
 <span className="text-[9px] font-black text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">View Copilot Instructions</span>
                        </div>
                        <Tooltip title={
 <div className="p-2 space-y-1">
 <p className="font-black text-[10px]">Debug Diagnostics</p>
 <ul className="text-[9px] font-medium list-disc pl-3 space-y-0.5 opacity-80">
                                    <li>Raw model responses</li>
                                    <li>Tool execution calls</li>
                                    <li>Processing metadata</li>
                                    <li>Preview-only diagnostics</li>
                                </ul>
                            </div>
                        } placement="bottom">
 <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setShowToolCalls(!showToolCalls)}>
                                <Switcher
                                    checked={showToolCalls}
                                    onChange={setShowToolCalls}
                                />
 <span className="text-[9px] font-black text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">Debug Mode</span>
                            </div>
                        </Tooltip>
                    </div>
                    <Button
                        variant="plain"
                        size="sm"
                        onClick={clearConversation}
 className="text-gray-400 hover:text-red-500 p-0 flex items-center gap-2 transition-colors text-[9px] font-black group"
                    >
 <span className="opacity-0 group-hover:opacity-100 transition-opacity">Reset Preview</span>
 <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>

                {/* System Prompt View (Overlay if toggled) */}
                {showSystemPrompt && (
 <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 animate-in slide-in-from-top duration-300">
 <div className="flex items-center gap-2 mb-3">
 <Eye className="w-3 h-3 text-primary" />
 <span className="text-[9px] font-black text-primary">Active Instructions (Read Only)</span>
                        </div>
 <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic line-clamp-4">
                            {copilot.systemPrompt || "No custom instructions defined."}
                        </p>
                    </div>
                )}

                {/* Message List */}
 <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 ? (
 <div className="h-full flex flex-col items-center justify-center text-center py-20 relative px-10">
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50" />
 <div className="w-16 h-16 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl flex items-center justify-center mb-6 shadow-sm relative z-10 transition-transform hover:scale-110 duration-500">
 <Bot className="w-7 h-7 text-primary" />
                            </div>
 <div className="relative z-10 space-y-3 max-w-sm">
 <h4 className="text-sm font-black text-gray-900 dark:text-gray-100 leading-tight">
                                    Behavioral Evaluation
                                </h4>
 <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
 This sandbox environment allows you to validate behavioral accuracy using the copilot's current <span className="text-primary font-bold">system instructions</span>, <span className="text-primary font-bold">native model capabilities</span>, and indexed <span className="text-primary font-bold">knowledge sources</span> without affecting production registries or credit balances.
                                </p>
 <div className="pt-2">
 <span className="text-[8px] font-black text-gray-300">Initialized & Ready</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
 className={classNames(
                                    "flex flex-col max-w-[85%]",
                                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                                )}
                            >
                                <div
 className={classNames(
                                        "px-5 py-3.5 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700"
                                    )}
                                >
                                    {msg.content}

                                    {/* Tool Calls Display (Assistant Only) */}
                                    {showToolCalls && msg.role === 'assistant' && msg.toolCalls && msg.toolCalls.length > 0 && (
 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
 <div className="flex items-center gap-2 mb-2">
 <Terminal className="w-3 h-3 text-primary" />
 <span className="text-[9px] font-black text-primary">Active Tool Invocation</span>
                                            </div>
 <div className="space-y-2">
                                                {msg.toolCalls.map((call: any, idx: number) => (
 <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-950/50 rounded-xl border border-gray-100 dark:border-gray-800 font-mono text-[10px]">
 <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1.5 font-bold">
 <Cpu className="w-3 h-3" />
                                                            <span>{call.function?.name || call.name || 'Anonymous Tool'}</span>
                                                        </div>
 <pre className="text-gray-500 dark:text-gray-400 whitespace-pre-wrap break-all leading-tight overflow-x-auto">
                                                            {JSON.stringify(call.function?.arguments || call.arguments || {}, null, 2)}
                                                        </pre>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
 <span className="text-[8px] font-black text-gray-400 mt-1.5 opacity-50 px-1">
                                    {msg.role === 'user' ? 'Admin' : copilot.name} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))
                    )
                    }
                    {isTyping && (
 <div className="flex items-center gap-3 text-primary animate-pulse">
 <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
 <Bot className="w-4 h-4" />
                            </div>
 <span className="text-[10px] font-black">Thinking...</span>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* Chat Input */}
 <div className="p-6 border-t border-gray-50 dark:border-gray-800 bg-gray-50/30">
 <div className="relative group">
                        <input
                            type="text"
                            placeholder="Ask a question to test the copilot’s behavior…"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
 className="w-full h-14 pl-6 pr-14 bg-white dark:bg-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium shadow-sm outline-none"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!inputValue.trim() || isTyping}
 className="absolute right-3 top-3 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                        >
 <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}
