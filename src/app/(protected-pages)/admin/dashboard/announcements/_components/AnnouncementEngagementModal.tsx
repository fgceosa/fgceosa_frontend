'use client'

import React from 'react'
import { 
    X, 
    BarChart3, 
    TrendingUp, 
    Eye, 
    Users, 
    Clock,
    Calendar,
    Megaphone,
    Flag,
    Pin
} from 'lucide-react'
import { Button, Dialog } from '@/components/ui'
import dayjs from 'dayjs'

interface AnnouncementEngagementModalProps {
    isOpen: boolean
    onClose: () => void
    announcement: any
}

const AnnouncementEngagementModal = ({ isOpen, onClose, announcement }: AnnouncementEngagementModalProps) => {
    if (!announcement) return null

    const views = announcement.views || 0
    const engagement = announcement.engagement || 0
    const createdAt = announcement.created_at || announcement.date
    const daysSinceCreation = createdAt ? dayjs().diff(dayjs(createdAt), 'day') || 1 : 1
    const avgViewsPerDay = Math.round(views / daysSinceCreation)

    const metrics = [
        { label: 'Total Views', value: views.toLocaleString(), icon: Eye },
        { label: 'Engagement', value: `${engagement}%`, icon: TrendingUp },
        { label: 'Avg. Views/Day', value: avgViewsPerDay.toLocaleString(), icon: Users },
        { label: 'Days Live', value: `${daysSinceCreation}d`, icon: Clock }
    ]

    return (
        <Dialog
            isOpen={isOpen}
            width={850}
            onClose={onClose}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
        >
            <div className="flex flex-col h-full">
                {/* Header Section */}
                <div className="p-8 sm:p-10 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30 shadow-sm">
                                <BarChart3 className="w-7 h-7 text-[#8B0000]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Engagement Analytics</h2>
                                <p className="text-[11px] font-bold text-gray-400 mt-2 capitalize tracking-tight line-clamp-1 max-w-md">Performance metrics for: {announcement.title}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                        >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Top Metrics Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {metrics.map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <div className="flex items-center justify-between mb-3 text-gray-400">
                                    <stat.icon className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-10 space-y-10">
                    {/* Announcement Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest px-2">Post Details</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <Megaphone className="w-4 h-4 text-[#8B0000]" />
                                    </div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</p>
                                </div>
                                <p className="text-base font-black text-gray-900 dark:text-white tracking-tight">{announcement.category || 'General'}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <Flag className="w-4 h-4 text-[#8B0000]" />
                                    </div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Priority</p>
                                </div>
                                <p className="text-base font-black text-gray-900 dark:text-white tracking-tight">{announcement.priority || 'Normal'}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <Calendar className="w-4 h-4 text-[#8B0000]" />
                                    </div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Published</p>
                                </div>
                                <p className="text-base font-black text-gray-900 dark:text-white tracking-tight">{announcement.date || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Status Indicators */}
                        <div className="space-y-5">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest px-2">Status</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Status', value: announcement.status || 'Sent', color: announcement.status === 'Sent' ? '#10b981' : announcement.status === 'Scheduled' ? '#3b82f6' : '#6b7280' },
                                    { label: 'Important', value: announcement.isImportant ? 'Yes' : 'No', color: announcement.isImportant ? '#f59e0b' : '#d1d5db' },
                                    { label: 'Pinned', value: announcement.isPinned ? 'Yes' : 'No', color: announcement.isPinned ? '#6366f1' : '#d1d5db' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-[12px] font-black text-gray-900 dark:text-white">{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Performance Insight */}
                        <div className="bg-[#8B0000] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
                            <h3 className="text-xl font-black tracking-tight mb-2 text-white">Performance Summary</h3>
                            <p className="text-sm font-medium text-white/80 leading-relaxed mb-6">
                                {views > 0 
                                    ? `This ${announcement.category || 'General'} announcement has accumulated ${views.toLocaleString()} views with a ${engagement}% engagement rate since being published${createdAt ? ` on ${dayjs(createdAt).format('MMM D, YYYY')}` : ''}.`
                                    : `This announcement has not yet received any views. ${announcement.status === 'Draft' ? 'Publish it to start tracking engagement.' : 'Engagement data will appear as members interact with the post.'}`
                                }
                            </p>
                            {announcement.isPinned && (
                                <div className="flex items-center gap-2 text-white/70 text-xs font-bold mb-4">
                                    <Pin className="w-3.5 h-3.5 fill-white/70" />
                                    Currently pinned to directory
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <Button 
                            variant="solid" 
                            onClick={onClose} 
                            className="bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white px-12 h-14 rounded-2xl font-black capitalize border-none transition-all hover:scale-105"
                        >
                            Got it
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AnnouncementEngagementModal
