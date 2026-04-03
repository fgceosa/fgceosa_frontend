'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Badge, Dropdown } from '@/components/ui'
import {
    Copy,
    Eye,
    Cpu,
    Zap,
    Database,
    ChevronDown,
    Wand2,
    Box,
    Banknote,
    Maximize,
    Scale,
    MoreVertical,
    Activity,
    Info,
    ExternalLink
} from 'lucide-react'
import type { Model, ModelBadgeType } from '../types'
import classNames from '@/utils/classNames'

interface ModelCardProps {
    model: Model
}

const badgeColors: Record<ModelBadgeType, string> = {
    Vision: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100 dark:bg-fuchsia-900/20 dark:border-fuchsia-800/30',
    Tools: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30',
    Caching: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/30',
    Reasoning: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/30',
    New: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/30',
    Fast: 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-900/20 dark:border-sky-800/30',
    Cheap: 'bg-lime-50 text-lime-600 border-lime-100 dark:bg-lime-900/20 dark:border-lime-800/30',
    'Long Context': 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/30',
    Large: 'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-900/20 dark:border-violet-800/30'
}

const badgeIcons: Record<ModelBadgeType, any> = {
    Vision: Eye,
    Tools: Cpu,
    Caching: Database,
    Reasoning: Wand2,
    New: Zap,
    Fast: Zap,
    Cheap: Banknote,
    'Long Context': Maximize,
    Large: Scale
}

export default function ModelCard({ model }: ModelCardProps) {
    const router = useRouter()
    const [copied, setCopied] = useState(false)
    const [copyingVariant, setCopyingVariant] = useState<string | null>(null)
    const [showVariants, setShowVariants] = useState(false)

    const handleCopy = (e: any) => {
        e.stopPropagation()
        navigator.clipboard.writeText(model.name)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDetails = () => {
        router.push(`/dashboard/model-library/${model.id}`)
    }

    const handleCopyVariant = (e: any, variant: string) => {
        e.stopPropagation()
        navigator.clipboard.writeText(variant)
        setCopyingVariant(variant)
        setTimeout(() => setCopyingVariant(null), 2000)
    }

    const toggleVariants = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowVariants(!showVariants)
    }

    const dropdownItems = [
        { key: 'copy', label: 'Copy Model ID', icon: <Copy className="w-4 h-4" />, onClick: handleCopy },
        { key: 'details', label: 'View Details', icon: <Info className="w-4 h-4" />, onClick: handleDetails },
        { key: 'provider', label: 'Provider Docs', icon: <ExternalLink className="w-4 h-4" />, onClick: () => { } },
    ]

    return (
        <Card
            className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer rounded-[2rem] flex flex-col h-full"
            onClick={handleDetails}
        >
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

            <div className="p-6 flex flex-col flex-1 h-full">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-6">
                    <div className={classNames(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 bg-primary/5 text-primary"
                    )}>
                        <div className="bg-white/20 p-2 rounded-xl border border-white/20">
                            {model.category === 'Text' ? <Cpu className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                        </div>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            {copied && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] font-black rounded-md shadow-xl animate-in fade-in slide-in-from-bottom-1 duration-200 pointer-events-none whitespace-nowrap z-50">
                                    Copied!
                                    <div className="absolute top-[90%] left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
                                </div>
                            )}
                        </div>
                        <Dropdown
                            placement="bottom-end"
                            renderTitle={
                                <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                    <MoreVertical className="w-6 h-6" strokeWidth={3} />
                                </button>
                            }
                        >
                            {dropdownItems.map((item) => (
                                <Dropdown.Item
                                    key={item.key}
                                    eventKey={item.key}
                                    onClick={item.onClick}
                                    className="font-bold text-sm p-4"
                                >
                                    <span className="w-4 h-4 flex items-center justify-center mr-2 opacity-70">
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                    </div>
                </div>

                {/* Visual Accent */}
                <div className="h-0.5 w-12 bg-primary/20 mb-4 group-hover:w-20 transition-all duration-500 rounded-full" />

                {/* Title & Metadata */}
                <div className="space-y-1.5 mb-4">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                        {model.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 text-[8px] font-black rounded-md border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-500">
                            {model.provider}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                        <span className="text-[8px] font-black text-gray-400">
                            {model.context} ctx
                        </span>
                        {model.status === 'Approved' && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <Activity className="w-2 h-2 mr-1" />
                                Stable
                            </span>
                        )}
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {model.badges.map((badge) => {
                        const Icon = badgeIcons[badge] || Box
                        const colorClass = badgeColors[badge] || 'bg-gray-50 text-gray-600 border-gray-100'
                        return (
                            <div
                                key={badge}
                                className={classNames(
                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black border border-transparent shadow-sm transition-all hover:scale-105",
                                    colorClass
                                )}
                            >
                                <Icon className="w-2.5 h-2.5" />
                                {badge}
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
                                <p className="text-[8px] font-black text-gray-400">Input (1M)</p>
                            </div>
                            <p className="text-[12px] font-black text-gray-900 dark:text-white">{model.inputPrice}</p>
                        </div>
                        <div className="space-y-1 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-sm" />
                                <p className="text-[8px] font-black text-gray-400">Output (1M)</p>
                            </div>
                            <p className="text-[12px] font-black text-gray-900 dark:text-white">{model.outputPrice}</p>
                        </div>
                    </div>
                </div>

                {/* Variants toggle */}
                {model.variants && (
                    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                        <button
                            onClick={toggleVariants}
                            className="flex items-center gap-2 text-[9px] font-black text-gray-400 hover:text-primary transition-all w-full justify-between group/variants"
                        >
                            <span>{showVariants ? 'Hide Variants' : `${model.variants}`}</span>
                            <ChevronDown className={classNames("w-3 h-3 transition-transform duration-300", showVariants ? "rotate-180 text-primary" : "group-hover:text-primary")} />
                        </button>

                        {showVariants && model.variantList && (
                            <div className="mt-3 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                {model.variantList.map((variant) => (
                                    <div
                                        key={variant}
                                        className="flex items-center justify-between p-2 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-transparent hover:border-primary/10 hover:bg-white dark:hover:bg-gray-800 transition-all group/variant"
                                        onClick={(e) => handleCopyVariant(e, variant)}
                                    >
                                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 truncate pr-4">
                                            {variant}
                                        </span>
                                        <div className="relative">
                                            {copyingVariant === variant && (
                                                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-[9px] font-black rounded-md shadow-lg z-50">
                                                    Copied!
                                                </div>
                                            )}
                                            <Copy className="w-3 h-3 text-gray-300 group-hover/variant:text-primary transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Subtle Hover Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Card>
    )
}
