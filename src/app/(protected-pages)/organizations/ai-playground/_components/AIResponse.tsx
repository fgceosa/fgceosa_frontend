'use client'

import { useState } from 'react'
import { Bot, Copy, Download } from 'lucide-react'
import { Card } from '@/components/ui'
import Loading from '@/components/shared/Loading'
import classNames from '@/utils/classNames'

interface AIResponseProps {
    response: string
    isLoading: boolean
    selectedModelName?: string
    maxTokens?: number
}

export default function AIResponse({
    response,
    isLoading,
    selectedModelName,
    maxTokens,
}: AIResponseProps) {
    const [copied, setCopied] = useState(false)

    const responseTokens = response ? Math.max(1, Math.ceil(response.length / 4)) : 0
    const displayedTokens = maxTokens ? Math.min(responseTokens, maxTokens) : responseTokens
    const costPerToken = 0.02 // placeholder cost per token in ₦
    const estimatedCost = (displayedTokens * costPerToken).toFixed(2)

    const handleCopy = () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(response)
            } else {
                // fallback for older browsers
                const textarea = document.createElement('textarea')
                textarea.value = response
                document.body.appendChild(textarea)
                textarea.select()
                document.execCommand('copy')
                document.body.removeChild(textarea)
            }
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Copy failed', err)
        }
    }

    const handleSave = () => {
        try {
            const blob = new Blob([response], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'ai-response.txt'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Save failed', err)
        }
    }

    return (
        <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50">
                            <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight uppercase">AI Response</h3>
                            {selectedModelName ? (
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Created by {selectedModelName}</p>
                            ) : (
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Waiting for your message</p>
                            )}
                        </div>
                    </div>

                    {!isLoading && response && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="p-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 transition-all group/btn"
                                title="Copy Response"
                            >
                                <Copy className={classNames("w-4 h-4 transition-colors", copied ? "text-emerald-500" : "text-gray-500 group-hover/btn:text-gray-900 dark:group-hover/btn:text-white")} />
                            </button>
                            <button
                                onClick={handleSave}
                                className="p-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 transition-all group/btn"
                                title="Download"
                            >
                                <Download className="w-4 h-4 text-gray-500 group-hover/btn:text-gray-900 dark:group-hover/btn:text-white transition-colors" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50/10 dark:bg-gray-900/10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                        <Loading loading={isLoading} className="relative z-10 text-primary" />
                    </div>
                    <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">
                        Generating your response...
                    </p>
                </div>
            ) : response ? (
                <div className="p-6 space-y-6">
                    <div className="p-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-inner">
                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-medium">
                            {response}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-full border border-indigo-100 dark:border-indigo-800/50">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Size:</span>
                                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-300 uppercase">{displayedTokens} Units</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Cost:</span>
                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-300 uppercase">₦{estimatedCost}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-full border border-amber-100 dark:border-amber-800/50">
                                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Speed:</span>
                                <span className="text-[10px] font-black text-amber-600 dark:text-amber-300 uppercase">1.8s</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Success</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-700 shadow-inner">
                        <Bot className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h4 className="text-gray-900 dark:text-white font-black uppercase tracking-tight mb-2">Ready to Start</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px] font-medium leading-relaxed">
                        Type a message and pick an AI model to see what it can do!
                    </p>
                </div>
            )}
        </Card>
    )
}
