'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { getMemberSummary, clearDashboardError } from '@/store/slices/dashboard'
import Loading from '@/components/shared/Loading'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Landmark, Calendar, Megaphone, UserCheck, CreditCard, Clock, Activity, ArrowRight, User, ShieldCheck, X, AlertCircle, Bell } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import useSystemSettings from '@/utils/hooks/useSystemSettings'
import PaymentModal from '../payments/_components/PaymentModal'
import EventRegistrationModal from './EventRegistrationModal'
import StatCard from '@/components/shared/StatCard'
import { apiRecordAnnouncementView } from '@/services/admin/announcementsService'

interface Announcement {
    id?: string
    title: string
    date: string
    type: string
    color: string
    content?: string
    image?: string | null
    views?: number
}

const DashboardClient = () => {
    const dispatch = useAppDispatch()
    const { memberSummary, loading, error } = useAppSelector((state) => state.dashboard)
    const { user } = useAppSelector((state) => state.auth.session.session) || {}
    
    const { settings } = useSystemSettings()
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<{ id: string; title: string; date: string; location: string; featured: boolean } | null>(null)

    const userName = (user as any)?.userName || (user as any)?.name || 'Member'
    const firstName = userName.split(' ')[0]

    useEffect(() => {
        dispatch(getMemberSummary())
    }, [dispatch])

    const handleViewAnnouncement = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement)
        setIsDetailsOpen(true)

        if (announcement.id) {
            apiRecordAnnouncementView(announcement.id).catch(() => {})
        }
    }

    if (loading && !memberSummary) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loading loading type="cover" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            <PaymentModal 
                isOpen={isPaymentModalOpen} 
                onClose={() => setIsPaymentModalOpen(false)} 
                amount={memberSummary?.outstandingAmount || 0}
                unpaidDues={memberSummary?.unpaidDues}
            />
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
                            <span className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">{settings.associationName} ALUMNI PORTAL</span>
                        </div>
                        
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
                                Welcome back, <span className="text-red-200">{firstName}</span>
                            </h1>
                            <p className="text-white/80 text-[11px] md:text-sm font-semibold max-w-lg leading-relaxed drop-shadow-lg opacity-90">
                                This is your personal dashboard. Stay connected with the association, manage your dues, and stay updated.
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

            {/* Elegant Summary Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard 
                    title="Membership Status"
                    value={memberSummary?.membershipStatus || 'Active'}
                    subtext={memberSummary?.verified ? "Verified Member" : "Awaiting Verification"}
                    icon={<UserCheck className="w-5 h-5" />}
                    color="blue"
                    isFirst
                />

                <StatCard 
                    title="Dues Status"
                    value={memberSummary?.duesStatus === 'overdue' ? 'Pending' : 'Paid'}
                    subtext={memberSummary?.duesStatus === 'overdue' ? 'Action Recommended' : 'Up to date'}
                    icon={<Clock className="w-5 h-5" />}
                    color={memberSummary?.duesStatus === 'overdue' ? 'amber' : 'emerald'}
                />

                <StatCard 
                    title="Total Paid"
                    value={`₦${memberSummary?.totalPaid?.toLocaleString() || '0'}`}
                    subtext="Lifetime Contributions"
                    icon={<CreditCard className="w-5 h-5" />}
                    color="emerald"
                />

                <StatCard 
                    title="Upcoming Events"
                    value={memberSummary?.upcomingEventsCount?.toString() || '0'}
                    subtext="Scheduled Activities"
                    icon={<Activity className="w-5 h-5 text-[#8B0000]" />}
                    color="burgundy"
                />
            </div>

            {/* Premium Two-Column Layout (Top Section) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8 mb-6 xl:mb-8">
                
                {/* LEFT SECTION (FINANCIALS & ACTIONS) */}
                <div className="space-y-6 flex flex-col">
                    {/* Priority Outstanding Card */}
                    {memberSummary?.duesStatus === 'overdue' ? (
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-[2rem] border border-red-100/60 dark:border-red-900/30 shadow-[0_15px_40px_-15px_rgba(220,38,38,0.15)] relative overflow-hidden group flex flex-col">
                            {/* Decorative Premium Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 dark:bg-red-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <div className="relative z-10 flex items-start justify-between mb-5">
                                <div className="flex gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/30 dark:to-red-900/10 border border-red-100 dark:border-red-800/30 text-red-600 shadow-[0_4px_12px_rgba(220,38,38,0.1)]">
                                        <Landmark className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-[15px] font-black text-gray-900 dark:text-white leading-tight">Action Required</h2>
                                        <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-widest">{memberSummary.outstandingTitle || 'Outstanding Dues'}</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-red-50 text-red-700 shadow-sm border border-red-100 dark:border-red-800/30 dark:bg-red-900/20">
                                    Overdue
                                </span>
                            </div>
                            
                            <div className="relative z-10 flex-1 flex flex-col justify-between mt-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Total Outstanding Balance</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">₦{memberSummary.outstandingAmount?.toLocaleString()}</p>
                                    
                                    <div className="inline-flex items-center gap-2 mt-3 text-[11px] font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl border border-red-100/50 dark:border-red-800/30">
                                        <Clock className="w-3.5 h-3.5" /> 
                                        Due: {memberSummary.outstandingDueDate}
                                    </div>
                                </div>
                                
                                {settings.paymentEnabled ? (
                                    <Button 
                                        className="w-[70%] sm:w-[60%] mx-auto mt-8 h-14 bg-[#8B0000] text-white hover:text-white hover:bg-[#660000] font-black rounded-[1.25rem] shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] transition-all hover:-translate-y-1 text-[11px]  capitalize flex items-center justify-center gap-3 group/btn border-none"
                                        onClick={() => setIsPaymentModalOpen(true)}
                                    >
                                        Pay Now
                                        <ArrowRight className="w-5 h-5 opacity-80 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                ) : (
                                    <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-600 flex flex-col items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-gray-400" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Online payments are currently disabled</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-[2rem] border border-emerald-100/60 dark:border-emerald-900/30 shadow-[0_15px_40px_-15px_rgba(16,185,129,0.15)] relative overflow-hidden group flex flex-col h-full">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                            
                            <div className="relative z-10 flex items-start justify-between mb-5">
                                <div className="flex gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 text-emerald-600 shadow-sm">
                                        <UserCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-[15px] font-black text-gray-900 dark:text-white leading-tight">Account Standing</h2>
                                        <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-widest">Financial Status</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100 dark:border-emerald-800/30">
                                    Good Standing
                                </span>
                            </div>

                            <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center space-y-4 py-6">
                                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-gray-900 dark:text-white">All Dues Paid</p>
                                    <p className="text-xs font-medium text-gray-500 px-6">Your financial contributions to the association are up to date. Thank you for your support!</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT SECTION (EVENTS) */}
                <div className="space-y-6 flex flex-col">
                    {/* Upcoming Events List */}
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100/80 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-[15px] font-black text-gray-900 dark:text-white leading-tight">Upcoming Events</h2>
                                <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-widest">Scheduled Activities</p>
                            </div>
                            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600/50 text-gray-500 shadow-sm">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-start gap-4">
                            {memberSummary?.upcomingEvents && memberSummary.upcomingEvents.length > 0 ? (
                                memberSummary.upcomingEvents.map((item, i) => (
                                    <div key={i} className="group p-4 bg-gray-50/50 dark:bg-gray-700/10 rounded-2xl border border-transparent hover:border-[#8B0000]/10 hover:bg-white dark:hover:bg-gray-700/30 transition-all duration-500">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-pulse"></div>
                                                    <span className="text-[9px] font-black text-[#8B0000] dark:text-red-400 uppercase tracking-widest">{item.date}</span>
                                                </div>
                                                <h3 className="text-[13px] font-black text-gray-900 dark:text-white leading-tight line-clamp-1 group-hover:text-[#8B0000] transition-colors">{item.title}</h3>
                                                <div className="flex items-center gap-2 mt-1 opacity-60">
                                                    <Clock className="w-3 h-3" />
                                                    <p className="text-[10px] font-semibold text-gray-500 truncate">{item.location}</p>
                                                </div>
                                            </div>
                                            {item.is_registered ? (
                                                <Button 
                                                    size="sm"
                                                    disabled
                                                    className="h-11 px-6 text-[10px] font-black capitalize rounded-xl transition-all flex items-center gap-2 shrink-0 border border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 shadow-sm cursor-not-allowed opacity-100"
                                                >
                                                    Registered
                                                </Button>
                                            ) : (
                                                <Button 
                                                    size="sm"
                                                    className={`h-11 px-6 text-[10px] font-black capitalize rounded-xl transition-all flex items-center gap-2 shrink-0 border-none ${item.featured ? 'bg-[#8B0000] text-white hover:text-white hover:bg-[#660000] shadow-lg shadow-red-900/10 hover:-translate-y-0.5' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700'} `}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedEvent(item as any)
                                                    }}
                                                >
                                                    {item.featured ? 'Register' : 'View'}
                                                    <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                                    <Calendar className="w-10 h-10 mb-2" />
                                    <p className="text-xs font-black uppercase tracking-widest">No Events Found</p>
                                </div>
                            )}
                        </div>
                        <Link href="/dashboard/events" className="block w-full">
                            <Button variant="solid" className="w-full mt-6 h-13 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 font-black rounded-2xl text-[10px] hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:-translate-y-1 transition-all capitalize  group flex items-center justify-center gap-2">
                                Browse All Events
                                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Track Grid: Recent Payments & Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8 mt-10 lg:mt-12">
                {/* Recent Payments Miniature */}
                <div className="p-7 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100/80 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Recent Payments</h2>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50 dark:border-gray-700/50">
                                    <th className="pb-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                                    <th className="pb-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="pb-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/30">
                                {memberSummary?.paymentHistory && memberSummary.paymentHistory.length > 0 ? (
                                    memberSummary.paymentHistory.map((payment: any, i: number) => (
                                        <tr key={payment.id || i} className="group hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-colors">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3.5">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${
                                                        payment.type === 'donation' ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800' 
                                                        : payment.type === 'event' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800' 
                                                        : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800'
                                                    }`}>
                                                        <CreditCard className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-tight">{payment.title || 'Payment'}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{payment.ref || 'REF-N/A'}</span>
                                                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                                            <span className="text-[10px] font-medium text-gray-500">{payment.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className="text-[13px] font-black text-gray-900 dark:text-white">₦{payment.amount?.toLocaleString()}</span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${payment.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-500/10' : 'bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-500/10'}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-10 text-center opacity-40">
                                            <p className="text-xs font-black uppercase tracking-widest">No Recent Payments</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Link href="/dashboard/payments" className="block w-full">
                        <Button variant="solid" className="w-full mt-6 h-13 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 font-black rounded-2xl text-[10px] hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:-translate-y-1 transition-all capitalize  group flex items-center justify-center gap-2">
                            View Payment Ledger
                            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Button>
                    </Link>
                </div>

                {/* Premium Announcements Component */}
                <div className="p-7 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100/80 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Announcements</h2>
                        </div>
                        <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl">
                            <Megaphone className="w-4 h-4 text-[#8B0000] dark:text-red-400" />
                        </div>
                    </div>
                    
                    <div className="space-y-2.5 flex-1 mt-1">
                        {memberSummary?.announcements && memberSummary.announcements.length > 0 ? (
                            memberSummary.announcements.map((item, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => handleViewAnnouncement(item)}
                                    className="group relative p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-700/10 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-700/30 hover:shadow-sm transition-all cursor-pointer"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${item.color === 'emerald' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : item.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <span className="text-[9px] font-bold text-gray-400 shrink-0">{item.date}</span>
                                            </div>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[12px] font-black text-gray-900 dark:text-white group-hover:text-[#8B0000] dark:group-hover:text-red-400 transition-colors line-clamp-1">{item.title}</p>
                                                    <Button 
                                                        size="xs" 
                                                        className="text-[8px] font-black capitalize bg-red-50 dark:bg-red-900/20 text-[#8B0000] px-3 py-1.5 rounded-xl border-none hover:bg-[#8B0000] hover:text-white transition-all shrink-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleViewAnnouncement(item)
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                        </div>
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                        <ArrowRight className="w-4 h-4 text-[#8B0000] dark:text-red-400" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-40">
                                <Megaphone className="w-10 h-10 mb-2" />
                                <p className="text-xs font-black uppercase tracking-widest text-center">No Announcements</p>
                            </div>
                        )}
                    </div>
                    <Link href="/dashboard/announcements" className="block w-full">
                        <Button variant="solid" className="w-full mt-6 h-13 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 font-black rounded-2xl text-[10px] hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:-translate-y-1 transition-all capitalize  group flex items-center justify-center gap-2">
                            View All Announcements
                            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Announcement Details Modal */}
            <Dialog
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                closable={true}
                width={900}
                className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            >
                {selectedAnnouncement && (
                    <div className="flex flex-col">
                        {/* Header with Brand Gradient */}
                        <div className="relative h-64 bg-[#8B0000] flex items-end px-12 pb-10 overflow-hidden">
                            {selectedAnnouncement.image ? (
                                <div className="absolute inset-0">
                                    <img src={selectedAnnouncement.image} alt={selectedAnnouncement.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#8B0000]/90 via-[#8B0000]/40 to-transparent" />
                                </div>
                            ) : (
                                <div className="absolute inset-0 bg-[url('/img/others/welcome-bg.png')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
                            )}
                            
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
                                        <Megaphone className="w-3.5 h-3.5 text-white" />
                                        <span className="text-white text-[9px] font-black uppercase tracking-widest">{selectedAnnouncement.type} ANNOUNCEMENT</span>
                                    </div>
                                    <button 
                                        onClick={() => setIsDetailsOpen(false)}
                                        className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-all border border-white/10"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight max-w-2xl">{selectedAnnouncement.title}</h2>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="px-12 py-12 bg-gray-50/30 dark:bg-gray-900/50">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <Calendar className="w-3.5 h-3.5 text-[#8B0000]" />
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Posted {selectedAnnouncement.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <Activity className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{(selectedAnnouncement.views || 0).toLocaleString()} Views</span>
                                </div>
                            </div>

                            <div className="prose prose-red max-w-none">
                                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed font-semibold whitespace-pre-wrap">
                                    {selectedAnnouncement.content}
                                </p>
                            </div>

                            <div className="mt-12 p-6 bg-white dark:bg-gray-800/80 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#8B0000]/5 flex items-center justify-center border border-[#8B0000]/10 shrink-0">
                                        <ShieldCheck className="w-6 h-6 text-[#8B0000]" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Official Secretariat Notice</p>
                                        <p className="text-[10px] font-bold text-gray-500 italic mt-0.5">FGCEOSA Digital Communications Terminal</p>
                                    </div>
                                </div>
                                <Button 
                                    size="lg" 
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white px-12 font-black text-[11px] h-14 rounded-2xl uppercase tracking-widest transition-all hover:-translate-y-1 shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] border-none w-full md:w-auto"
                                >
                                    Got it
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
            <EventRegistrationModal
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                event={selectedEvent}
            />
        </div>
    )
}

export default DashboardClient

