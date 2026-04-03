import { useState, useEffect } from 'react'
import { Card, Button } from '@/components/ui'
import { Bot, Zap, ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import classNames from '@/utils/classNames'
import { apiListCopilots } from '@/services/CopilotService'
import type { Copilot } from '@/app/(protected-pages)/dashboard/copilot-hub/types'

const getCategoryStyles = (category: string) => {
    switch (category) {
        case 'finance':
            return {
                color: 'text-emerald-500',
                bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
                borderColor: 'border-emerald-100 dark:border-emerald-800/20',
            }
        case 'customer-support':
            return {
                color: 'text-blue-500',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                borderColor: 'border-blue-100 dark:border-blue-800/20',
            }
        case 'sales':
            return {
                color: 'text-orange-500',
                bgColor: 'bg-orange-50 dark:bg-orange-900/20',
                borderColor: 'border-orange-100 dark:border-orange-800/20',
            }
        case 'coding':
            return {
                color: 'text-indigo-500',
                bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
                borderColor: 'border-indigo-100 dark:border-indigo-800/20',
            }
        case 'legal':
            return {
                color: 'text-rose-500',
                bgColor: 'bg-rose-50 dark:bg-rose-900/20',
                borderColor: 'border-rose-100 dark:border-rose-800/20',
            }
        default:
            return {
                color: 'text-violet-500',
                bgColor: 'bg-violet-50 dark:bg-violet-900/20',
                borderColor: 'border-violet-100 dark:border-violet-800/20',
            }
    }
}

const getUsageLabel = (count: number) => {
    if (count > 500) return 'Very High'
    if (count > 100) return 'High'
    if (count > 20) return 'Medium'
    return 'Low'
}

export default function CopilotOperations() {
    const router = useRouter()
    const [copilots, setCopilots] = useState<Copilot[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCopilots = async () => {
            try {
                const response = await apiListCopilots({ limit: 3 })
                setCopilots(response.copilots)
            } catch (error) {
                console.error('Failed to fetch copilots:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCopilots()
    }, [])

    return (
        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 p-8 h-full flex flex-col relative overflow-hidden group/main">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover/main:bg-primary/10 transition-colors duration-500" />

            <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm">
                        <Bot className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Copilots</h3>
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-400">System Ready</p>
                        </div>
                    </div>
                </div>
                <Button
                    variant="plain"
                    size="xs"
                    className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center hover:bg-primary hover:border-primary group transition-all"
                    onClick={() => router.push('/dashboard/copilot-hub')}
                >
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </Button>
            </div>

            <div className="flex-1 space-y-3 relative z-10">
                <div className="px-1 mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-black text-emerald-500">
                            {copilots.length > 0 ? 'Top Performing' : 'Available Systems'}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : copilots.length > 0 ? (
                    copilots.map((cp) => {
                        const style = getCategoryStyles(cp.category)
                        return (
                            <div
                                key={cp.id}
                                className="flex items-center justify-between p-4 rounded-3xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-50 dark:border-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group"
                                onClick={() => router.push(`/dashboard/copilot-hub/${cp.id}/chat`)}
                            >
                                <div className="flex items-center gap-4 text-left">
                                    <div className={classNames(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center border",
                                        style.bgColor,
                                        style.color,
                                        style.borderColor
                                    )}>
                                        <Zap className="w-5 h-5 fill-current opacity-80" />
                                    </div>
                                    <div className="min-w-0 pr-2">
                                        <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1.5 group-hover:text-primary transition-colors truncate">{cp.name}</h4>
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-400 truncate max-w-[140px]">{cp.description || 'Custom Assistant'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 px-1 shrink-0">
                                    <div className={classNames(
                                        "px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider",
                                        cp.usageCount > 100
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30"
                                            : "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/30"
                                    )}>
                                        {getUsageLabel(cp.usageCount)}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                        <Bot className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-xs font-bold text-gray-400">No active copilots found.</p>
                        <Button
                            variant="plain"
                            size="xs"
                            className="text-primary mt-2"
                            onClick={() => router.push('/dashboard/copilot-hub')}
                        >
                            Create One
                        </Button>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 relative z-10">
                <Button
                    variant="solid"
                    className="w-full h-14 bg-primary hover:bg-primary-deep text-white rounded-2xl font-black text-xs shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                    onClick={() => router.push('/dashboard/copilot-hub')}
                >
                    Open Copilot Hub
                    <Sparkles className="w-4 h-4 scale-0 group-hover:scale-100 transition-transform duration-300" />
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </Card>
    )
}
