import { useState, useEffect } from 'react'
import { Dialog, Spinner, Card } from '@/components/ui'
import { BarChart3, TrendingUp, Users, Wallet, CheckCircle2, History } from 'lucide-react'
import { useAppDispatch } from '@/store'
import { fetchCampaignAnalytics } from '@/store/slices/bulkCredits'
import dayjs from 'dayjs'

export interface CampaignAnalyticsModalProps {
    isOpen: boolean
    onClose: () => void
    campaignId: string
}

export function CampaignAnalyticsModal({ isOpen, onClose, campaignId }: CampaignAnalyticsModalProps) {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        if (isOpen && campaignId) {
            setLoading(true)
            dispatch(fetchCampaignAnalytics(campaignId))
                .unwrap()
                .then((res) => {
                    setData(res)
                    setLoading(false)
                })
                .catch(() => {
                    setLoading(false)
                })
        }
    }, [isOpen, campaignId, dispatch])

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={800}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Program Analytics</h3>
                    <p className="text-[10px] font-black text-gray-400 mt-0.5">Refined performance metrics for {data?.campaign?.name || 'Program'}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-2xl">
                    <BarChart3 className="w-6 h-6 text-primary" />
                </div>
            </div>

            <div className="p-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Spinner size="40px" />
                    </div>
                ) : data ? (
                    <div className="space-y-8">
                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="p-6 border-none bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl space-y-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl w-fit">
                                    <Wallet className="w-4 h-4 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400">Total Spent</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white mt-1">₦{(data.analytics.total_spent || 0).toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1 italic">Of ₦{data.analytics.total_budget.toLocaleString()} budget</p>
                                </div>
                            </Card>

                            <Card className="p-6 border-none bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl space-y-3">
                                <div className="p-2 bg-emerald-500/10 rounded-xl w-fit">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400">Credits Distributed</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{(data.analytics.total_distributed || 0).toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1 italic">{data.analytics.progress}% Progress</p>
                                </div>
                            </Card>

                            <Card className="p-6 border-none bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl space-y-3">
                                <div className="p-2 bg-amber-500/10 rounded-xl w-fit">
                                    <Users className="w-4 h-4 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400">Recipients Reach</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{data.analytics.actual_recipients || 0}</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1 italic">Of {data.analytics.target_recipients || 0} targeted</p>
                                </div>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <History className="w-4 h-4 text-gray-400" />
                                <h4 className="text-[10px] font-black text-gray-400">Recent Program Activity</h4>
                            </div>

                            <div className="border border-gray-50 dark:border-gray-800 rounded-[2rem] overflow-hidden">
                                {data.recent_transactions?.length > 0 ? (
                                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {data.recent_transactions.map((tx: any) => (
                                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/10 rounded-full flex items-center justify-center">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-900 dark:text-white tracking-tight">{tx.description}</p>
                                                        <p className="text-[9px] font-bold text-gray-400 mt-0.5">{dayjs(tx.date).format('MMM D, YYYY • h:mm A')}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-emerald-600 tracking-tight">+{tx.credits} Credits</p>
                                                    <p className="text-[9px] font-bold text-gray-400 mt-0.5">₦{tx.amount.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <p className="text-xs font-bold text-gray-400 italic">No activity recorded for this program yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-rose-500 font-bold text-sm">Failed to load analytics data.</p>
                    </div>
                )}
            </div>

            <div className="p-8 pt-0">
                <button
                    onClick={onClose}
                    className="w-full h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                    Close Report
                </button>
            </div>
        </Dialog>
    )
}
