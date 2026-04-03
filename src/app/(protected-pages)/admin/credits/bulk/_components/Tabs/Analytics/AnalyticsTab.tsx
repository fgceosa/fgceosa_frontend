import { useState, useEffect } from 'react'
import { Card, Spinner } from '@/components/ui'
import QorebitLoading from '@/components/shared/QorebitLoading'
import { BarChart3, TrendingUp, Users, Wallet, Target, PieChart, Info } from 'lucide-react'
import { useAppDispatch } from '@/store'
import { fetchAggregatedAnalytics } from '@/store/slices/bulkCredits'
import classNames from '@/utils/classNames'

interface AggregatedAnalytics {
    summary: {
        total_programs: number
        total_budget: number
        total_spent: number
        total_distributed: number
        total_recipients: number
        target_recipients: number
        overall_progress: number
    }
    categories: Array<{
        name: string
        count: number
        budget: number
        spent: number
        progress: number
    }>
    programs: Array<{
        id: string
        name: string
        type: string
        status: string
        progress: number
        spent: number
        budget: number
        actual_recipients: number
        target_recipients: number
    }>
}
interface AnalyticsTabProps {
    organizationId?: string
}

export default function AnalyticsTab({ organizationId }: AnalyticsTabProps) {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<AggregatedAnalytics | null>(null)

    useEffect(() => {
        setLoading(true)
        dispatch(fetchAggregatedAnalytics(organizationId))
            .unwrap()
            .then((res: AggregatedAnalytics) => {
                setData(res)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [dispatch, organizationId])

    if (loading) {
        return <QorebitLoading />
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
                    <Info className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-xs font-bold text-gray-500 mt-2 px-10">Start by creating programs and distributing credits to see insights here.</p>
            </div>
        )
    }

    const { summary, categories, programs } = data

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* KPI Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-8 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Wallet className="w-16 h-16 text-primary" />
                    </div>
                    <div className="p-3 bg-primary/10 rounded-2xl w-fit">
                        <Wallet className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-900 dark:text-gray-100">Total Spend</p>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1 tracking-tight">₦{Math.round(summary.total_spent).toLocaleString()}</h3>
                        <p className="text-xs font-bold text-gray-500 mt-2">Across {summary.total_programs} active programs</p>
                    </div>
                </Card>

                <Card className="p-8 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-16 h-16 text-emerald-500" />
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-900 dark:text-gray-100">Credits Issued</p>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1 tracking-tight">{Math.round(summary.total_distributed).toLocaleString()}</h3>
                        <p className="text-xs font-bold text-gray-500 mt-2 italic">{summary.overall_progress}% Global progress</p>
                    </div>
                </Card>

                <Card className="p-8 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Users className="w-16 h-16 text-blue-500" />
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-2xl w-fit">
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-900 dark:text-gray-100">Total Reach</p>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1 tracking-tight">{summary.total_recipients.toLocaleString()}</h3>
                        <p className="text-xs font-bold text-gray-500 mt-2">Active Impact (Target: {summary.target_recipients.toLocaleString()})</p>
                    </div>
                </Card>

                <Card className="p-8 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <Target className="w-16 h-16 text-amber-500" />
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-2xl w-fit">
                        <Target className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-900 dark:text-gray-100">Budget Utilization</p>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1 tracking-tight">₦{Math.round(summary.total_budget).toLocaleString()}</h3>
                        <p className="text-xs font-bold text-gray-500 mt-2">Total organizational capacity</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Category Breakdown */}
                <Card className="lg:col-span-1 p-8 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <PieChart className="w-5 h-5 text-gray-400" />
                        </div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white">Spend by Category</h4>
                    </div>

                    <div className="space-y-6">
                        {categories.map((cat) => (
                            <div key={cat.name} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs font-black text-gray-900 dark:text-white">{cat.name}</p>
                                        <p className="text-xs font-bold text-gray-500 mt-0.5">{cat.count} Programs</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-primary">₦{Math.round(cat.spent).toLocaleString()}</p>
                                        <p className="text-[10px] font-black text-gray-500">{cat.progress}%</p>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000"
                                        style={{ width: `${cat.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Program Performance Table */}
                <Card className="lg:col-span-2 p-8 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <BarChart3 className="w-5 h-5 text-gray-400" />
                        </div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white">Program Performance</h4>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50 dark:border-gray-800">
                                    <th className="text-left py-4 text-xs font-black text-gray-900 dark:text-gray-100">Program Name</th>
                                    <th className="text-right py-4 text-xs font-black text-gray-900 dark:text-gray-100">Spent</th>
                                    <th className="text-right py-4 text-xs font-black text-gray-900 dark:text-gray-100">Budget</th>
                                    <th className="text-right py-4 text-xs font-black text-gray-900 dark:text-gray-100">Actual Reach</th>
                                    <th className="text-right py-4 text-xs font-black text-gray-900 dark:text-gray-100">Status / Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {programs.map((p) => (
                                    <tr key={p.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all">
                                        <td className="py-5">
                                            <p className="text-xs font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{p.name}</p>
                                            <p className="text-[10px] font-black text-gray-500 mt-1 italic">{p.type}</p>
                                        </td>
                                        <td className="py-5 text-right">
                                            <p className="text-xs font-black text-gray-900 dark:text-white">₦{Math.round(p.spent).toLocaleString()}</p>
                                        </td>
                                        <td className="py-5 text-right">
                                            <p className="text-xs font-black text-gray-500">₦{Math.round(p.budget).toLocaleString()}</p>
                                        </td>
                                        <td className="py-5 text-right">
                                            <p className="text-xs font-black text-primary">{p.actual_recipients}</p>
                                            <p className="text-[10px] font-bold text-gray-500">of {p.target_recipients}</p>
                                        </td>
                                        <td className="py-5">
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={classNames(
                                                    "px-2 py-0.5 rounded-full text-[10px] font-black border",
                                                    p.status === 'active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-500 border-gray-100"
                                                )}>
                                                    {p.status}
                                                </span>
                                                <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full"
                                                        style={{ width: `${p.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
