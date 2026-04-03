'use client'

import { Card, Switcher } from '@/components/ui'
import { Bot, Sparkles } from 'lucide-react'

export default function CopilotManagementSettings() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Copilot Availability</h3>
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Enable Copilots</h4>
                            <p className="text-xs text-gray-500">Allow members to create and use AI Copilots within this workspace.</p>
                        </div>
                        <Switcher defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Public Marketplace Access</h4>
                            <p className="text-xs text-gray-500">Allow members to install Copilots from the public Qorebit marketplace.</p>
                        </div>
                        <Switcher defaultChecked />
                    </div>
                </div>
            </Card>

            <Card className="p-0 border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">AI Model Defaults</h3>
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Allow GPT-4 Use</span>
                        <Switcher defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Allow Claude 3.5 Use</span>
                        <Switcher defaultChecked />
                    </div>
                </div>
            </Card>
        </div>
    )
}
