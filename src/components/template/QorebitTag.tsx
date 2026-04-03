'use client'

import React, { useState } from 'react'
import { Copy, Check, Hash } from 'lucide-react'
import { useAppSelector } from '@/store/hook'
import { Tooltip } from '@/components/ui'

const QorebitTag = () => {
    // Get user tag from Redux store
    const session = useAppSelector((state) => state.auth.session.session)

    // Get tag_number from backend (with @ prefix if not already present)
    const tagNumber = session?.user?.tag_number || session?.user?.tagNumber
    const tag = tagNumber
        ? (tagNumber.startsWith('@') ? tagNumber : `@${tagNumber}`)
        : '@qore888brd' // Fallback

    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(tag)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    return (
        <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/10 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all">
            <div className="flex items-center gap-1.5 md:pr-2.5 md:border-r border-gray-300/50 dark:border-gray-600/50">
                <div className="w-7 h-7 rounded-lg bg-[#0055BA]/10 dark:bg-blue-900/30 flex items-center justify-center text-[#0055BA] dark:text-blue-400 shadow-sm shrink-0">
                    <Hash className="w-4 h-4" />
                </div>
                <span className="hidden md:block text-[12px] font-black text-gray-900 dark:text-gray-100 whitespace-nowrap">
                    Qorebit Tag
                </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 ml-0.5 md:ml-0">
                <span className="text-[13px] md:text-[15px] font-bold text-gray-900 dark:text-gray-100 font-mono tracking-tight whitespace-nowrap">
                    {tag}
                </span>
                <Tooltip title={copied ? 'Copied!' : 'Copy Tag'}>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all duration-200 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm"
                    >
                        {copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                            <Copy className="w-3.5 h-3.5" />
                        )}
                    </button>
                </Tooltip>
            </div>
        </div>
    )
}

export default QorebitTag
