'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { getAdminStats, clearDashboardError } from '@/store/slices/dashboard'
import Loading from '@/components/shared/Loading'
import Alert from '@/components/ui/Alert'
import { Button } from '@/components/ui'
import { Users, CreditCard, Clock, Activity, ShieldCheck, TrendingUp, Bell } from 'lucide-react'
import Link from 'next/link'
import StatCard from '@/components/shared/StatCard'
import Chart from '@/components/shared/Chart'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { apiSendPaymentReminder } from '@/services/admin/paymentsService'
import { toast, Notification } from '@/components/ui'
import { useState } from 'react'

dayjs.extend(relativeTime)

const AdminDashboard = () => {
    const dispatch = useAppDispatch()
    const { adminStats, loading, error } = useAppSelector((state) => state.dashboard)
    const { user } = useAppSelector((state) => state.auth.session.session) || {}
    
    const [sendingReminders, setSendingReminders] = useState(false)
    const [pingingIds, setPingingIds] = useState<string[]>([])

    const userName = (user as any)?.userName || (user as any)?.name || 'Admin'
    const firstName = userName.split(' ')[0]

    useEffect(() => {
        dispatch(getAdminStats())
    }, [dispatch])

    const handleSendBulkReminders = async () => {
        setSendingReminders(true)
        try {
            const resp = await apiSendPaymentReminder({ user_ids: [] }) // Empty array triggers actual bulk logic in backend
            
            toast.push(
                <Notification title="Reminders Sent" type="success">
                    {resp.message || 'Payment reminders have been successfully queued for delivery.'}
                </Notification>
            )
        } catch (err) {
            toast.push(
                <Notification title="Delivery Failed" type="danger">
                    Failed to send bulk payment reminders. Please try again.
                </Notification>
            )
        } finally {
            setSendingReminders(false)
        }
    }

    const handleIndividualPing = async (userId: string) => {
        setPingingIds(prev => [...prev, userId])
        try {
            const resp = await apiSendPaymentReminder({ user_ids: [userId] })
            
            toast.push(
                <Notification title="Reminder Sent" type="success">
                    {resp.message || 'Payment reminder has been sent to the member.'}
                </Notification>
            )
        } catch (err) {
            toast.push(
                <Notification title="Delivery Failed" type="danger">
                    Failed to send payment reminder.
                </Notification>
            )
        } finally {
            setPingingIds(prev => prev.filter(id => id !== userId))
        }
    }

    if (loading && !adminStats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loading loading type="cover" />
            </div>
        )
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Premium Top Hero Section */}
            <div className="relative h-36 md:h-44 rounded-3xl overflow-hidden group shadow-[0_20px_40px_-15px_rgba(139,0,0,0.3)] bg-[#8B0000]">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[3000ms] group-hover:scale-105"
                    style={{ backgroundImage: `url('/img/others/welcome-bg.png')` }}
                />
                {/* Seamless Brand Gradient Overlay */}
                <div 
                    className="absolute inset-0 z-10" 
                    style={{ 
                        background: 'linear-gradient(90deg, rgba(139, 0, 0, 0.85) 0%, rgba(139, 0, 0, 0.45) 60%, rgba(139, 0, 0, 0.15) 100%)' 
                    }} 
                />
                
                <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16">
                    <div className="space-y-2 mt-2">
                        <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-sm w-max">
                            <ShieldCheck className="w-4 h-4 text-white" />
                            <span className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">ADMIN CONTROL CENTER</span>
                        </div>
                        
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
                                Welcome, <span className="text-red-200">{firstName}</span>
                            </h1>
                            <p className="text-white/80 text-[11px] md:text-sm font-semibold max-w-lg leading-relaxed drop-shadow-lg opacity-90">
                                Oversee association activity, manage member records, and track financial collections from your central command center.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <Alert showIcon type="danger" closable onClose={() => dispatch(clearDashboardError())}>
                    {error}
                </Alert>
            )}

            {/* Elegant Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard 
                    title="Total Members"
                    value={adminStats?.totalMembers || 0}
                    icon={Users}
                    color="blue"
                    subtext="Latest Sync"
                    isFirst
                />

                <StatCard 
                    title="Dues Collected"
                    value={`₦${adminStats?.totalDuesCollected?.toLocaleString() || '0.00'}`}
                    icon={CreditCard}
                    color="emerald"
                    subtext="Live Transactions"
                />

                <StatCard 
                    title="Pending Dues"
                    value={adminStats?.pendingPaymentsCount || 0}
                    icon={Clock}
                    color="amber"
                    subtext="Requires Follow-up"
                />

                <StatCard 
                    title="Upcoming Events"
                    value={adminStats?.activeEvents || 0}
                    icon={Bell}
                    color="burgundy"
                    subtext="Scheduled Activities"
                />
            </div>

            {/* Premium Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
                
                {/* Left Column (Transactions & Growth) */}
                <div className="space-y-6 xl:space-y-8">
                    {/* Recent Payments Table */}
                    <div className="p-7 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100/80 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-black text-gray-900 dark:text-white">Recent Transactions</h2>
                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Latest payments from members</p>
                            </div>
                            <Button size="xs" variant="plain" className="text-[#8B0000] text-[10px] font-black capitalize bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl">View All</Button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 dark:border-gray-700/50">
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Member</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/30">
                                    {(adminStats?.recentTransactions || []).map((payment, i) => (
                                        <tr key={i} className="group hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-colors">
                                            <td className="py-4.5">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center font-black text-gray-500 text-[11px] shadow-sm">
                                                        {payment.name[0]}
                                                    </div>
                                                    <span className="text-[13px] font-bold text-gray-900 dark:text-white">{payment.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4.5 text-[12px] font-medium text-gray-500">
                                                {dayjs(payment.date).format('MMM DD, YYYY')}
                                            </td>
                                            <td className="py-4.5 text-[13px] font-black text-gray-900 dark:text-white">
                                                ₦{payment.amount.toLocaleString()}
                                            </td>
                                            <td className="py-4.5 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${payment.status === 'completed' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-500/10' : 'bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-500/10'}`}>
                                                    {payment.status === 'completed' ? 'Paid' : payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!adminStats?.recentTransactions || adminStats.recentTransactions.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="py-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No recent transactions found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Member Overview & Announcements */}
                    <div className="grid grid-cols-1 gap-6 xl:gap-8">
                        <div className="p-7 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100/80 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Announcements</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link href="/admin/dashboard/announcements">
                                        <Button size="xs" variant="plain" className="text-[#8B0000] text-[10px] font-black capitalize bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl">View All</Button>
                                    </Link>
                                    <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl">
                                        <Bell className="w-4 h-4 text-[#8B0000] dark:text-red-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2.5 flex-1">
                                {(adminStats?.announcements || []).map((item, i) => (
                                    <div key={i} className="group relative p-3.5 rounded-2xl bg-gray-50/50 dark:bg-gray-700/10 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-700/30 hover:shadow-sm transition-all cursor-pointer">
                                        <div className="flex gap-3.5">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${item.type === 'General' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : item.type === 'System' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
                                                        {item.type}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-gray-400 shrink-0">{dayjs(item.date).fromNow()}</span>
                                                </div>
                                                <p className="text-[12px] font-black text-gray-900 dark:text-white group-hover:text-[#8B0000] dark:group-hover:text-red-400 transition-colors line-clamp-1">{item.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {(!adminStats?.announcements || adminStats.announcements.length === 0) && (
                                    <div className="py-10 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">No recent announcements</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pending Dues & Quick Actions */}
                <div className="space-y-6 xl:space-y-8">
                    {/* Action Needed Card */}
                    <div className="p-7 bg-white dark:bg-gray-800 rounded-[2rem] border border-amber-100 dark:border-amber-900/30 shadow-[0_12px_40px_-15px_rgba(245,158,11,0.15)]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-base font-black text-gray-900 dark:text-white">Unpaid Follow-ups</h2>
                            <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-3 py-1 rounded-full shadow-inner tracking-widest uppercase">{adminStats?.pendingPaymentsCount || 0} Pending</span>
                        </div>
                        <div className="space-y-3">
                            {(adminStats?.unpaidFollowups || []).map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-700/20 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-600 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-[11px] font-black text-gray-500 shadow-sm border border-gray-100 dark:border-gray-700">
                                            {item.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-bold text-gray-900 dark:text-white">{item.name}</p>
                                            <p className="text-[10px] font-black text-[#8B0000] mt-0.5">₦{item.amount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <Button 
                                        size="xs" 
                                        variant="plain" 
                                        className="text-gray-400 hover:text-[#8B0000] text-[9px] font-black uppercase transition-colors"
                                        onClick={() => handleIndividualPing(item.id)}
                                        loading={pingingIds.includes(item.id)}
                                        disabled={pingingIds.includes(item.id)}
                                    >
                                        Ping
                                    </Button>
                                </div>
                            ))}
                            {(!adminStats?.unpaidFollowups || adminStats.unpaidFollowups.length === 0) && (
                                <div className="py-10 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">No pending follow-ups</div>
                            )}
                        </div>
                        <Button 
                            variant="solid" 
                            className="w-full mt-6 h-12 bg-[#8B0000] text-white hover:text-white dark:hover:text-white font-black rounded-2xl text-[11px] shadow-lg shadow-[#8B0000]/20 hover:-translate-y-0.5 transition-all hover:bg-[#660000] capitalize"
                            onClick={handleSendBulkReminders}
                            loading={sendingReminders}
                            disabled={!adminStats?.unpaidFollowups || adminStats.unpaidFollowups.length === 0}
                        >
                            Send Bulk Reminders
                        </Button>
                    </div>

                    {/* Quick Actions Gradient Card Matching Member Dashboard */}
                    <div className="p-8 bg-gradient-to-br from-[#800000] via-[#8B0000] to-[#500000] rounded-[2rem] text-white overflow-hidden relative shadow-[0_20px_40px_-15px_rgba(139,0,0,0.6)] group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-700"></div>
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl"></div>
                        
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-white/90">Admin Controls</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                                <Button className="bg-white/[0.08] hover:bg-white/[0.15] text-white hover:text-white border-white/10 font-bold h-12 rounded-2xl justify-start px-5 group/btn text-xs transition-all backdrop-blur-md hover:shadow-lg">
                                    <Users className="w-4 h-4 mr-3 group-hover/btn:-translate-y-0.5 transition-transform text-red-200" />
                                    Review Pending Members
                                </Button>
                                <Button className="bg-white/[0.08] hover:bg-white/[0.15] text-white hover:text-white border-white/10 font-bold h-12 rounded-2xl justify-start px-5 group/btn text-xs transition-all backdrop-blur-md hover:shadow-lg">
                                    <Clock className="w-4 h-4 mr-3 group-hover/btn:-translate-y-0.5 transition-transform text-red-200" />
                                    Transaction Reports
                                </Button>
                                <Button className="bg-white/[0.08] hover:bg-white/[0.15] text-white hover:text-white border-white/10 font-bold h-12 rounded-2xl justify-start px-5 group/btn text-xs transition-all backdrop-blur-md hover:shadow-lg">
                                    <CreditCard className="w-4 h-4 mr-3 group-hover/btn:-translate-y-0.5 transition-transform text-red-200" />
                                    Manage Subscription Plans
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
