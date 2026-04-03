'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/store'
import { useRouter } from 'next/navigation'
import { Card, Badge, Switcher, Button, Tag, toast, Notification, Spinner } from '@/components/ui'
import {
    Cpu,
    Database,
    Activity,
    Zap,
    Box,
    Banknote,
    Maximize,
    Scale,
    Eye,
    Wand2,
    MoreVertical,
    Star
} from 'lucide-react'
import {
    selectOrgModels,
    selectOrgModelFilterCategory,
    selectOrgModelSortBy
} from '@/store/slices/orgModelLibrary/selectors'
import { toggleModelEnabled, setWorkspaceDefault } from '@/store/slices/orgModelLibrary'
import type { OrgLibraryModel } from '@/store/slices/orgModelLibrary/types'
import { NAIRA_TO_USD_RATE, CURRENCY_SYMBOL } from '@/constants/currency.constant'
import classNames from '@/utils/classNames'

// Simplified badge mapping for capability strings
const badgeColors: Record<string, string> = {
    Vision: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100 dark:bg-fuchsia-900/20 dark:border-fuchsia-800/30',
    Tools: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30',
    Reasoning: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/30',
    'Long Context': 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/30',
    Image: 'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-900/20 dark:border-violet-800/30',
    Audio: 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-900/20 dark:border-sky-800/30'
}

const badgeIcons: Record<string, any> = {
    Vision: Eye,
    Tools: Cpu,
    Reasoning: Wand2,
    'Long Context': Maximize,
    Image: Scale,
    Audio: Zap
}

const ModelCard = ({ model }: { model: OrgLibraryModel }) => {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const handleToggle = (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
        // e might be optional depending on Switcher impl
        if (e && e.stopPropagation) {
            e.stopPropagation()
        }

        if (model.isEnabled && model.usageCount > 0) {
            toast.push(
                <Notification type="warning" title="Warning" duration={5000}>
                    This model is used by {model.usageCount} copilots. Disabling it may break functionality.
                </Notification>
            )
        }
        dispatch(toggleModelEnabled(model.id))
    }

    const handleSetDefault = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch(setWorkspaceDefault(model.id))
        toast.push(
            <Notification type="success" title="Default updated" duration={3000}>
                {model.name} is now the workspace default.
            </Notification>
        )
    }

    const handleCardClick = () => {
        router.push(`/organizations/model-library/${model.id}`)
    }

    return (
        <Card
            onClick={handleCardClick}
            className={classNames(
                "group relative overflow-hidden bg-white dark:bg-gray-900 border shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer rounded-[1.5rem] flex flex-col h-full",
                model.isWorkspaceDefault ? "border-primary ring-1 ring-primary/20" : "border-gray-100 dark:border-gray-800 hover:border-primary/30",
                !model.isEnabled && "opacity-75 grayscale-[0.5]"
            )}>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

            <div className="p-6 flex flex-col flex-1 h-full">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-6">
                    <div className={classNames(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 bg-primary/5 text-primary"
                    )}>
                        <div className="bg-white/20 p-2 rounded-xl border border-white/20">
                            {/* Simple heuristic for icon: if capabilities include 'Embedding', use Database, else Cpu */}
                            {/* Assuming text models by default if not specified */}
                            <Cpu className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Default Badge */}
                        {model.isWorkspaceDefault && (
                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-bold bg-primary text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
                                <Star className="w-3 h-3 mr-1" />
                                Default
                            </span>
                        )}

                        {/* Status Toggle */}
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl border border-gray-100 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                            <Switcher
                                checked={model.isEnabled}
                                onChange={handleToggle}
                                className={model.isEnabled ? "bg-emerald-500" : ""}
                            />
                        </div>
                    </div>
                </div>

                {/* Visual Accent */}
                <div className="h-0.5 w-12 bg-primary/20 mb-4 group-hover:w-20 transition-all duration-500 rounded-full" />

                {/* Title & Metadata */}
                <div className="space-y-1.5 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {model.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 text-[8px] font-bold rounded-md border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-500">
                            {model.provider}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                        <span className="text-[8px] font-bold text-gray-400">
                            {model.contextSize} context
                        </span>
                        {/* Usage indicator */}
                        {model.usageCount > 0 && (
                            <>
                                <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                                <span className="inline-flex items-center text-[8px] font-bold text-emerald-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5"></div>
                                    {model.usageCount} active
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {model.capabilities.map((cap) => {
                        const Icon = badgeIcons[cap] || Box
                        const colorClass = badgeColors[cap] || 'bg-gray-50 text-gray-600 border-gray-100'
                        return (
                            <div
                                key={cap}
                                className={classNames(
                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold border border-transparent shadow-sm transition-all hover:scale-105",
                                    colorClass
                                )}
                            >
                                <Icon className="w-2.5 h-2.5" />
                                {cap}
                            </div>
                        )
                    })}
                </div>

                {/* Pricing Box */}
                <div className="mt-auto bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-50 dark:border-gray-800 transition-colors group-hover:bg-white dark:group-hover:bg-gray-800">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-sm" />
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Input (1k)</p>
                            </div>
                            <p className="text-[12px] font-bold text-gray-900 dark:text-white tracking-tight">
                                {CURRENCY_SYMBOL}{(model.inputPrice * NAIRA_TO_USD_RATE).toFixed(2)}
                            </p>
                        </div>
                        <div className="space-y-1 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-sm" />
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Output (1k)</p>
                            </div>
                            <p className="text-[12px] font-bold text-gray-900 dark:text-white tracking-tight">
                                {CURRENCY_SYMBOL}{(model.outputPrice * NAIRA_TO_USD_RATE).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Org Actions Footer */}
                {!model.isWorkspaceDefault && model.isEnabled && (
                    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 animate-in fade-in duration-300">
                        <button
                            onClick={handleSetDefault}
                            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-[10px] font-bold text-gray-500 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group/btn"
                        >
                            <Star className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                            Set as default
                        </button>
                    </div>
                )}
            </div>

            {/* Subtle Hover Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Card>
    )
}

const ModelList = () => {
    const models = useSelector(selectOrgModels)
    const filterCategory = useSelector(selectOrgModelFilterCategory)
    const sortBy = useSelector(selectOrgModelSortBy)


    const filteredModels = models.filter(model => {
        if (filterCategory === 'embeddings') {
            return (model.capabilities as any).includes('Embedding') || model.name.toLowerCase().includes('embedding')
        }
        return !(model.capabilities as any).includes('Embedding') && !model.name.toLowerCase().includes('embedding')
    }).sort((a, b) => {
        if (sortBy === 'cost_asc') {
            return a.inputPrice - b.inputPrice
        }
        if (sortBy === 'popularity') {
            return b.usageCount - a.usageCount
        }
        // Recommended/Default: isDefault first
        if (a.isDefault && !b.isDefault) return -1
        if (!a.isDefault && b.isDefault) return 1
        return 0
    })

    if (filteredModels.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-800/20 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No models found matching your criteria</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredModels.map((model: OrgLibraryModel) => (
                <ModelCard key={model.id} model={model} />
            ))}
        </div>
    )
}

export default ModelList
