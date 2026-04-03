'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import {
    Users,
    Copy,
    Share2,
    Zap,
    TrendingUp,
    CheckCircle2,
    Clock,
    ArrowRight,
    ArrowLeft,
    Wallet
} from 'lucide-react'
import classNames from '@/utils/classNames'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Mock Data
const referralStats = [
    {
        title: 'Total Referrals',
        value: '24',
        change: '+12%',
        icon: <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
        bgClass: 'bg-blue-50 dark:bg-blue-900/20',
        textClass: 'text-blue-600 dark:text-blue-400'
    },
    {
        title: 'Active Users',
        value: '18',
        change: '+8%',
        icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />,
        bgClass: 'bg-green-50 dark:bg-green-900/20',
        textClass: 'text-green-600 dark:text-green-400'
    },
    {
        title: 'Total Earned',
        value: '1,250 AI Credits',
        change: '+24%',
        icon: <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
        bgClass: 'bg-purple-50 dark:bg-purple-900/20',
        textClass: 'text-purple-600 dark:text-purple-400'
    }
]

const recentReferrals = [
    {
        id: 1,
        name: 'Alex Morgan',
        email: 'alex.m@example.com',
        status: 'Active',
        date: 'Oct 24, 2024',
        earned: '50 AI Credits',
        avatarColor: 'bg-blue-100 text-blue-600'
    },
    {
        id: 2,
        name: 'Sarah Chen',
        email: 'sarah.c@example.com',
        status: 'Pending',
        date: 'Oct 22, 2024',
        earned: '0 AI Credits',
        avatarColor: 'bg-purple-100 text-purple-600'
    },
    {
        id: 3,
        name: 'James Wilson',
        email: 'j.wilson@content.com',
        status: 'Active',
        date: 'Oct 20, 2024',
        earned: '25 AI Credits',
        avatarColor: 'bg-green-100 text-green-600'
    },
    {
        id: 4,
        name: 'Maria Garcia',
        email: 'm.garcia@design.io',
        status: 'Active',
        date: 'Oct 18, 2024',
        earned: '75 AI Credits',
        avatarColor: 'bg-orange-100 text-orange-600'
    }
]

export default function ReferralProgramPage() {
    const router = useRouter()
    const [referralLink] = useState('https://qorebit.com/ref/james-oyanna')
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    return (
        <div className="py-8 px-4 sm:px-6 w-full animate-in fade-in duration-700">
            {/* Enterprise Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="space-y-4 lg:space-y-1">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="text-[10px] font-black text-primary whitespace-nowrap">Growth & Ecosystem</span>
                        <div className="h-px w-12 bg-primary/20" />
                        <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">Referral Center</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="plain"
                            onClick={() => router.push('/user-settings')}
                            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl h-9 w-9 p-0 flex items-center justify-center transition-all active:scale-95 shadow-sm shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 text-gray-500" />
                        </Button>
                        <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-none">
                            Referral Program
                        </h1>
                    </div>
                    <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-[104px] font-medium max-w-2xl leading-relaxed">
                        Invite friends, colleagues, and businesses to Qorebit. Earn free AI credits for every successful referral.
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <Button
                        variant="solid"
                        className="h-12 sm:h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] sm:text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group w-full sm:w-auto"
                    >
                        <Wallet className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Redeem Credits</span>
                    </Button>
                </div>
            </div>


            {/* Hero Section - Share Link */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <Card className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden rounded-[2rem] group">
                        <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full space-y-5">
                            <div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 text-xs font-black mb-4">
                                    Earn 20% Commission
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black mb-2 leading-tight text-gray-900 dark:text-white">
                                    Invite Friends, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Earn Together</span>
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-lg text-lg leading-relaxed">
                                    Share your unique link. Earn AI credits instantly when they subscribe. No limits on earnings.
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-2 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-2">
                                <div className="flex-1 flex items-center px-4 h-12 sm:h-auto overflow-hidden">
                                    <span className="text-gray-600 dark:text-gray-300 font-mono text-sm truncate font-bold">{referralLink}</span>
                                </div>
                                <Button
                                    className="bg-primary hover:bg-primary-deep text-white hover:text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-95 shrink-0"
                                    onClick={handleCopy}
                                >
                                    {isCopied ? (
                                        <span className="flex items-center gap-2"><CheckCircle2 size={18} /> Copied</span>
                                    ) : (
                                        <span className="flex items-center gap-2"><Copy size={18} /> Copy Link</span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    {/* How it works Card */}
                    <Card className="h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none p-6">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">How it works</h3>
                        <div className="space-y-6 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100 dark:bg-gray-800 border-l border-dashed border-gray-300 dark:border-gray-700"></div>

                            {[
                                { title: 'Send Invitation', desc: 'Share your link with your network.', color: 'bg-blue-500' },
                                { title: 'They Subscribe', desc: 'User signs up and buys credits.', color: 'bg-indigo-500' },
                                { title: 'Earn Rewards', desc: 'Get 20% back in AI credits.', color: 'bg-emerald-500' }
                            ].map((step, idx) => (
                                <div key={idx} className="relative flex gap-5 group">
                                    <div className={classNames(
                                        "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 z-10 shadow-lg text-white transition-transform group-hover:scale-110 duration-300",
                                        step.color
                                    )}>
                                        {idx + 1}
                                    </div>
                                    <div className="pt-0.5">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{step.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {referralStats.map((stat, index) => (
                    <Card key={index} className="p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300 group cursor-default bg-white dark:bg-gray-900">
                        <div className="flex justify-between items-start mb-4">
                            <div className={classNames("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6", stat.bgClass)}>
                                {stat.icon}
                            </div>
                            <span className={classNames(
                                "px-2.5 py-1 rounded-full text-xs font-bold",
                                stat.change.startsWith('+') ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600'
                            )}>
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 mb-1 group-hover:text-primary transition-colors">{stat.title}</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Referrals Table */}
            <Card className="rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden p-0 bg-white dark:bg-gray-900">
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Recent Referrals</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage and track your latest referral activity</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400">User</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400">Status</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400">Date</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400">Earnings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {recentReferrals.map((referral) => (
                                <tr key={referral.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={classNames("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-105", referral.avatarColor)}>
                                                {referral.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white text-sm">{referral.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{referral.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={classNames(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize",
                                            referral.status === 'Active'
                                                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-800'
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-100 dark:border-amber-800'
                                        )}>
                                            <div className={classNames(
                                                "w-1.5 h-1.5 rounded-full mr-1.5",
                                                referral.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'
                                            )}></div>
                                            {referral.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                            <Clock size={14} className="text-gray-400" />
                                            {referral.date}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-black text-gray-900 dark:text-white">{referral.earned}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
