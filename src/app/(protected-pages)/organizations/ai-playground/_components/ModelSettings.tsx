'use client'

import { Bot } from 'lucide-react'
import { Card, Select, Slider } from '@/components/ui'
import classNames from '@/utils/classNames'
import type { Model } from '../types'

interface ModelSettingsProps {
    models: Model[]
    selectedModel: string
    setSelectedModel: (value: string) => void
    temperature: number
    setTemperature: (value: number) => void
    maxTokens: number
    setMaxTokens: (value: number) => void
}

export default function ModelSettings({
    models,
    selectedModel,
    setSelectedModel,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
}: ModelSettingsProps) {
    const selectedModelData = models.find((m) => m.id === selectedModel)

    // Sort models: free models first, then by name
    const sortedModels = [...models].sort((a, b) => {
        if (a.is_free && !b.is_free) return -1
        if (!a.is_free && b.is_free) return 1
        return a.name.localeCompare(b.name)
    })

    const modelOptions = sortedModels.map((m) => ({
        value: m.id,
        label: `${m.name} — ${m.cost}`,
    }))

    return (
        <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 h-fit">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 shadow-inner">
                        <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">AI Settings</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Adjust how the AI works</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Model Selection */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Pick an AI Model</label>
                    <Select
                        options={modelOptions}
                        value={modelOptions.find((o) => o.value === selectedModel)}
                        onChange={(option) => {
                            if (option) setSelectedModel(option.value)
                        }}
                    />
                </div>

                {selectedModelData && (
                    <div className="space-y-4">
                        {selectedModelData.is_free && (
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl">
                                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    This AI is Free to Use
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-primary/20">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Provider</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white truncate">{selectedModelData.provider}</p>
                            </div>
                            <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-primary/20">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Speed</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white">{selectedModelData.speed}</p>
                            </div>
                            <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-primary/20">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Quality</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white">{selectedModelData.quality}</p>
                            </div>
                            <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all hover:border-primary/20">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                                <p className={classNames(
                                    "text-sm font-black truncate",
                                    selectedModelData.is_free ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                                )}>
                                    {selectedModelData.cost}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                    {/* Temperature Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Creativity Level</label>
                            <span className="text-xs font-black text-primary px-2 py-0.5 bg-primary/5 rounded border border-primary/10">
                                {temperature}
                            </span>
                        </div>
                        <Slider
                            value={temperature}
                            onChange={setTemperature}
                            max={1}
                            min={0}
                            step={0.1}
                        />
                    </div>

                    {/* Max Tokens Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Response Length</label>
                            <span className="text-xs font-black text-primary px-2 py-0.5 bg-primary/5 rounded border border-primary/10">
                                {maxTokens}
                            </span>
                        </div>
                        <Slider
                            value={maxTokens}
                            onChange={setMaxTokens}
                            max={4096}
                            min={300}
                            step={1}
                        />
                    </div>
                </div>

                {/* Estimated Stats */}
                <div className="p-5 bg-gradient-to-br from-[#0055BA] to-[#003d85] rounded-2xl shadow-xl shadow-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <Bot className="w-16 h-16 text-white" />
                    </div>
                    <div className="space-y-3 relative z-10">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Estimated Cost</span>
                            <span className="text-sm font-black text-white uppercase tracking-tight">₦24.00</span>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest text-transform: uppercase;">Max Response</span>
                            <span className="text-xs font-bold text-white/80">{maxTokens} Units</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
