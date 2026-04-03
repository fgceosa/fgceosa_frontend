'use client'

import { Key, Shield, Zap } from 'lucide-react'
import { Card } from '@/components/ui'

interface ApiKeysHeaderProps {
    onKeyCreated?: () => void
}

export default function ApiKeysHeader({ onKeyCreated }: ApiKeysHeaderProps) {
    const handleSuccess = () => {
        onKeyCreated?.()
    }

    return (
        <div className="mb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-primary mb-1">
                        <Key className="w-4 h-4" />
                        <span className="text-[10px]">Authentication Hub</span>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                        API Keys
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-base font-medium max-w-2xl">
                        Securely manage authentication keys for your applications. Monitor usage, set rate limits, and control access to your Qorebit AI services.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[10px] font-black text-gray-400">Security Status</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-xs font-bold text-gray-900 dark:text-white">All Systems Secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
