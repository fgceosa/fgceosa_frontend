'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FaDiscord, FaSlack } from 'react-icons/fa'
import { Share2, Users, Copy, Check } from 'lucide-react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useSelector } from 'react-redux'
import { selectUserProfile } from '@/store/slices/userSettings'

import Link from 'next/link'

export default function CommunityAndReferral() {
    const userProfile = useSelector(selectUserProfile)
    const referralLink = `https://qorebit.com/register?ref=${userProfile?.username || userProfile?.id || 'user'}`

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink)
        toast.push(
            <Notification type="success" duration={2000}>
                Referral link copied to clipboard
            </Notification>,
            { placement: 'top-center' }
        )
    }
    return (
        <div className="space-y-8">
            {/* Community & Support */}
            <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                <div className="p-5 sm:p-8">
                    <div className="mb-6 sm:mb-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Community & Support</h3>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 font-medium">
                            Join our community channels for support and updates
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Discord Card */}
                        <a href="#" className="flex items-center gap-5 p-6 bg-[#F5F7FF] dark:bg-[#5865F2]/10 rounded-3xl border border-blue-50 dark:border-[#5865F2]/20 hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-none transition-all group">
                            <div className="min-w-[56px] h-14 bg-white dark:bg-[#5865F2] rounded-2xl flex items-center justify-center shadow-sm text-[#5865F2] dark:text-white group-hover:scale-110 transition-transform duration-300">
                                <FaDiscord size={28} />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 dark:text-white text-lg">Discord Community</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold mt-1 opacity-80">Join our Discord server</p>
                            </div>
                        </a>

                        {/* Slack Card */}
                        <a href="#" className="flex items-center gap-5 p-6 bg-[#F0F9FF] dark:bg-[#007a5a]/10 rounded-3xl border border-cyan-50 dark:border-[#007a5a]/20 hover:shadow-lg hover:shadow-cyan-100/50 dark:hover:shadow-none transition-all group">
                            <div className="min-w-[56px] h-14 bg-white dark:bg-[#007a5a] rounded-2xl flex items-center justify-center shadow-sm text-[#007a5a] dark:text-white group-hover:scale-110 transition-transform duration-300">
                                <FaSlack size={26} />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 dark:text-white text-lg">Slack Community</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold mt-1 opacity-80">Connect on Slack</p>
                            </div>
                        </a>
                    </div>
                </div>
            </Card>

            {/* Referral Program */}
            <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
                <div className="p-5 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">

                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Referral Program</h3>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 font-medium">
                                Invite others to join Qorebit and earn rewards
                            </p>
                        </div>
                        <Link href="/referral-program" className="w-full sm:w-auto">
                            <Button size="sm" variant="plain" className="w-full sm:w-auto h-12 sm:h-10 font-bold text-gray-500 hover:text-primary border border-gray-200 dark:border-gray-700 hover:border-primary/50 rounded-xl px-4">
                                View Details
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {/* Referral Link Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                            <div className="flex items-center gap-4 sm:gap-5">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shrink-0">
                                    <Share2 className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[2.5px]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Your Referral Link</h4>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Share this link with others to start earning rewards</p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="solid"
                                onClick={handleCopyLink}
                                className="w-full sm:w-auto bg-primary hover:bg-primary-deep text-white font-black text-sm sm:text-xs rounded-xl shadow-lg shadow-primary/20 shrink-0 h-12 sm:h-10 px-6 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                                Copy Link
                            </Button>
                        </div>

                        {/* Referral Stats Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950/30 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                            <div className="flex items-center gap-4 sm:gap-5">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                    <Users className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[2.5px]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Referral Stats</h4>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">0 referrals, 0 AI Credits earned</p>
                                </div>
                            </div>
                            <Link href="/referral-program" className="w-full sm:w-auto mt-2 sm:mt-0">
                                <Button size="sm" variant="plain" className="w-full sm:w-auto font-black text-primary hover:text-primary-deep shrink-0 h-12 sm:h-10 px-6 active:scale-95 transition-all text-sm sm:text-xs bg-primary/5 sm:bg-transparent">
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
