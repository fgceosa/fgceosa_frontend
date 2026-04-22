'use client'

import React, { useState } from 'react'
import { 
    Bell, 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Eye, 
    Calendar, 
    Trash2, 
    Pencil, 
    Flag, 
    Pin,
    BarChart3,
    CheckCircle2,
    MessageSquare,
    TrendingUp,
    Image as ImageIcon
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import Dropdown from '@/components/ui/Dropdown'
import Dialog from '@/components/ui/Dialog'
import Tag from '@/components/ui/Tag'
import Upload from '@/components/ui/Upload'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Link from 'next/link'
import { useAppSelector } from '@/store/hook'
import StatCard from '@/components/shared/StatCard'

// Mock Data
const MOCK_ANNOUNCEMENTS = [
    {
        id: '1',
        title: 'Annual Homecoming 2024 - Save the Date!',
        preview: 'We are excited to announce the dates for our next annual homecoming event. Join us for a weekend of networking and nostalgia.',
        content: 'Full content goes here...',
        category: 'Event',
        status: 'Active',
        priority: 'Normal',
        views: 1240,
        engagement: 68,
        date: '2024-03-20',
        image: '/img/others/welcome-bg.png',
        isImportant: false,
        isPinned: true
    },
    {
        id: '2',
        title: 'New Membership Portal Live',
        preview: 'Welcome to the new and improved FGCEOSA member portal. We have added several new features to enhance your experience.',
        content: 'Full content goes here...',
        category: 'General',
        status: 'Active',
        priority: 'Important',
        views: 3500,
        engagement: 92,
        date: '2024-03-15',
        image: null,
        isImportant: true,
        isPinned: false
    },
    {
        id: '3',
        title: 'Constitutional Amendment Vote',
        preview: 'All members are required to review the proposed amendments to our constitution before the upcoming general meeting.',
        content: 'Full content goes here...',
        category: 'Important',
        status: 'Archived',
        priority: 'Urgent',
        views: 890,
        engagement: 45,
        date: '2024-02-28',
        image: null,
        isImportant: true,
        isPinned: false
    }
]

const AnnouncementsPage = () => {
    const { user } = useAppSelector((state) => state.auth.session.session) || {}
    const authority = (user as any)?.authority || []
    const isAdmin = authority.includes('super_admin') || authority.includes('admin')

    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS)

    const handleDelete = (id: string) => {
        setAnnouncements(prev => prev.filter(a => a.id !== id))
        toast.push(
            <Notification title="Deleted" type="success">
                Announcement deleted successfully
            </Notification>
        )
    }

    const handleToggleImportant = (id: string) => {
        setAnnouncements(prev => prev.map(a => 
            a.id === id ? { ...a, isImportant: !a.isImportant } : a
        ))
    }

    const handleTogglePinned = (id: string) => {
        setAnnouncements(prev => prev.map(a => 
            a.id === id ? { ...a, isPinned: !a.isPinned } : a
        ))
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 mt-10">
            {/* 1. PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Announcements</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        {isAdmin ? 'Create, manage, and track communication across members' : 'Stay updated with the latest news and association updates'}
                    </p>
                </div>
                {isAdmin && (
                    <Button 
                        variant="solid" 
                        className="bg-[#8B0000] hover:bg-[#700000] text-white font-black rounded-2xl px-6 py-3 flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all w-max capitalize text-[11px] "
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus className="w-5 h-5" />
                        Create Announcement
                    </Button>
                )}
            </div>

            {/* 2. ANALYTICS CARDS */}
            {isAdmin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { title: 'Total Announcements', value: '24', icon: Bell, color: 'blue' as const, subtext: 'Since launch' },
                        { title: 'Active Posts', value: '12', icon: CheckCircle2, color: 'emerald' as const, subtext: 'Currently live' },
                        { title: 'Total Views', value: '12.4K', icon: Eye, color: 'burgundy' as const, subtext: '+12% this week' },
                        { title: 'Avg. Engagement', value: '72%', icon: TrendingUp, color: 'amber' as const, subtext: 'High interaction' }
                    ].map((stat, i) => (
                        <StatCard 
                            key={i}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            subtext={stat.subtext}
                            isFirst={i === 0}
                        />
                    ))}
                </div>
            )}

            {/* 3. FILTER & CONTROL BAR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 dark:bg-gray-800/30 backdrop-blur-md p-4 rounded-3xl border border-gray-100 dark:border-gray-700/50">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search announcements..." 
                        className="pl-11 rounded-2xl border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 h-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter:</span>
                        <select className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 min-w-[100px]">
                            <option>All</option>
                            <option>Active</option>
                            <option>Archived</option>
                            <option>Important</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort:</span>
                        <select className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 min-w-[120px]">
                            <option>Newest</option>
                            <option>Most Viewed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 4. ANNOUNCEMENTS LIST */}
            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-full mb-4">
                            <Bell className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">No announcements found</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-xs text-center">Create your first announcement to start communicating with members.</p>
                        <Button 
                            variant="solid" 
                            className="mt-6 bg-[#8B0000] text-white font-black rounded-2xl px-6"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Create your first announcement
                        </Button>
                    </div>
                ) : (
                    announcements.map((item) => (
                        <div 
                            key={item.id} 
                            className="group bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row p-6 items-center gap-6">
                                {/* Thumbnail */}
                                <div className="w-full md:w-36 h-28 rounded-2xl bg-gray-50 dark:bg-gray-900 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-700 flex items-center justify-center relative shadow-inner">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 opacity-20">
                                            <Bell className="w-8 h-8 text-gray-400" />
                                            <span className="text-[8px] font-black uppercase tracking-tighter">No Preview</span>
                                        </div>
                                    )}
                                    {item.isPinned && (
                                        <div className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-lg shadow-sm border border-amber-100 border-none">
                                            <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                            item.category === 'Important' ? 'bg-red-50 text-[#8B0000] border border-red-100' :
                                            item.category === 'Event' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            'bg-blue-50 text-blue-600 border border-blue-100'
                                        }`}>
                                            {item.category}
                                        </span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                            item.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {item.status}
                                        </span>
                                        {item.isImportant && (
                                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                                <Flag className="w-2.5 h-2.5 fill-amber-600" /> IMPORTANT
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#8B0000] transition-colors">{item.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-[13px] line-clamp-1 max-w-2xl font-medium">{item.preview}</p>
                                    
                                    <div className="flex items-center gap-5 pt-3">
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-[11px] font-bold tracking-tight">{item.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Eye className="w-3.5 h-3.5" />
                                            <span className="text-[11px] font-bold tracking-tight">{item.views.toLocaleString()} Views</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            <span className="text-[11px] font-black tracking-tight">{item.engagement}% Engagement</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {isAdmin && (
                                    <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                                        <Dropdown 
                                            placement="bottom-end"
                                            renderTitle={
                                                <Button variant="default" size="sm" className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-xl border-none hover:bg-gray-100">
                                                    <MoreVertical className="w-5 h-5 text-gray-500" />
                                                </Button>
                                            }
                                        >
                                            <Dropdown.Item onClick={() => {}} eventKey="edit" className="flex items-center gap-2 p-3 font-bold text-xs">
                                                <Pencil className="w-4 h-4 text-blue-500" /> Edit
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleToggleImportant(item.id)} eventKey="important" className="flex items-center gap-2 p-3 font-bold text-xs">
                                                <Flag className={`w-4 h-4 ${item.isImportant ? 'text-amber-500 fill-amber-500' : ''}`} /> 
                                                {item.isImportant ? 'Unmark Important' : 'Mark as Important'}
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleTogglePinned(item.id)} eventKey="pin" className="flex items-center gap-2 p-3 font-bold text-xs">
                                                <Pin className={`w-4 h-4 ${item.isPinned ? 'text-blue-500 fill-blue-500' : ''}`} /> 
                                                {item.isPinned ? 'Unpin' : 'Pin to Top'}
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleDelete(item.id)} eventKey="delete" className="flex items-center gap-2 p-3 font-bold text-xs text-red-500 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </Dropdown.Item>
                                        </Dropdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 7. CREATE ANNOUNCEMENT MODAL */}
            <Dialog
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onRequestClose={() => setIsCreateModalOpen(false)}
                width={680}
                className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                <div className="p-8 sm:p-10">
                    <div className="mb-10 relative flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                                <Bell className="w-7 h-7 text-[#8B0000]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">News Broadcast</h3>
                                <p className="text-[11px] font-black text-gray-400 mt-2 tracking-[0.2em] uppercase">Communicate with Association Members</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-10 max-h-[60vh] overflow-y-auto no-scrollbar pr-2 -mr-2">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none pl-1">Announcement Headline</label>
                            <Input placeholder="Enter a compelling title..." className="rounded-2xl h-14 bg-gray-50/50 font-bold border-gray-100 shadow-inner px-6" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none pl-1">Broadcast Category</label>
                                <select className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl h-14 px-5 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#8B0000]/10 shadow-inner">
                                    <option>General</option>
                                    <option>Event</option>
                                    <option>Important</option>
                                    <option>System Update</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none pl-1">Severity Priority</label>
                                <select className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl h-14 px-5 text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#8B0000]/10 shadow-inner">
                                    <option>Normal</option>
                                    <option>High</option>
                                    <option>Urgent</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none pl-1">Media Core (Banner Image)</label>
                            <Upload 
                                draggable 
                                uploadLimit={1}
                                className="w-full"
                            >
                                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-[2.5rem] bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer group shadow-inner">
                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-50 mb-4 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Select Narrative Image Assets</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-2">PNG, JPG format up to 5MB</p>
                                </div>
                            </Upload>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none pl-1">Content Narrative</label>
                            <textarea 
                                className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-[2.5rem] p-6 text-[15px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8B0000]/10 min-h-[160px] shadow-inner leading-relaxed"
                                placeholder="Describe the announcement in detail..."
                            />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-red-50/30 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100/50 shadow-inner">
                            <div className="flex items-center gap-5">
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-100">
                                    <Flag className="w-6 h-6 text-[#8B0000]" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none">Secure Priority Broadcast</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Flags this post and triggers ecosystem notifications</p>
                                </div>
                            </div>
                            <input type="checkbox" className="w-6 h-6 accent-[#8B0000] rounded-lg cursor-pointer" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-10">
                        <Button variant="plain" className="flex-1 h-14 font-black text-gray-400 capitalize text-[11px]  border-none" onClick={() => setIsCreateModalOpen(false)}>Discard</Button>
                        <Button variant="solid" className="flex-[2] bg-[#8B0000] hover:bg-[#700000] text-white font-black rounded-2xl px-10 h-14 capitalize text-[11px]  shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] border-none hover:-translate-y-1 transition-all" onClick={() => setIsCreateModalOpen(false)}>Publish Broadcast</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default AnnouncementsPage
