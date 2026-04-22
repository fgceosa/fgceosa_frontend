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
    Image as ImageIcon,
    ShieldCheck,
    Megaphone,
    X,
    ArrowRight
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import Dropdown from '@/components/ui/Dropdown'
import Tag from '@/components/ui/Tag'
import Notification from '@/components/ui/Notification'
import Dialog from '@/components/ui/Dialog'
import toast from '@/components/ui/toast'
import Link from 'next/link'
import { useAppSelector } from '@/store/hook'
import CreateAnnouncementModal from './CreateAnnouncementModal'
import EditAnnouncementModal from './EditAnnouncementModal'
import AnnouncementEngagementModal from './AnnouncementEngagementModal'
import DeleteAnnouncementModal from './DeleteAnnouncementModal'
import StatCard from '@/components/shared/StatCard'
import { 
    apiGetAnnouncements, 
    apiCreateAnnouncement, 
    apiUpdateAnnouncement, 
    apiDeleteAnnouncement,
    apiRecordAnnouncementView
} from '@/services/admin/announcementsService'
import dayjs from 'dayjs'



const AnnouncementsPage = () => {
    const { user } = useAppSelector((state) => state.auth.session.session) || {}
    const authority = (user as any)?.authority || []
    const isAdmin = authority.includes('super_admin') || authority.includes('admin')

    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('All')
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isEngagementModalOpen, setIsEngagementModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedStat, setSelectedStat] = useState(0)
    const [sortBy, setSortBy] = useState('Newest')

    const fetchAnnouncements = async () => {
        setIsLoading(true)
        try {
            const resp = await apiGetAnnouncements<any[], any>()
            // Map backend fields to frontend format
            const mapped = resp.map(a => ({
                ...a,
                isImportant: a.is_important,
                isPinned: a.is_pinned,
                date: dayjs(a.created_at).format('YYYY-MM-DD'),
                preview: a.content.substring(0, 150) + (a.content.length > 150 ? '...' : '')
            }))
            setAnnouncements(mapped)
        } catch (error) {
            // Error handling silenced as per requirement
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        fetchAnnouncements()
    }, [])

    const handleViewAnnouncement = (announcement: any) => {
        setSelectedAnnouncement(announcement)
        setIsDetailsOpen(true)
        
        // Record view if it's a valid ID
        if (announcement.id) {
            apiRecordAnnouncementView(announcement.id).catch(() => {})
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await apiDeleteAnnouncement(id)
            setAnnouncements(prev => prev.filter(a => a.id !== id))
            setIsDeleteModalOpen(false)
            setSelectedAnnouncement(null)
            toast.push(
                <Notification title="Deleted" type="success">
                    Announcement deleted successfully
                </Notification>
            )
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to delete announcement
                </Notification>
            )
        }
    }

    const handleToggleImportant = async (id: string) => {
        const announcement = announcements.find(a => a.id === id)
        if (!announcement) return

        try {
            const updated = await apiUpdateAnnouncement<any, any>(id, { is_important: !announcement.isImportant })
            setAnnouncements(prev => prev.map(a => 
                a.id === id ? { ...a, isImportant: updated.is_important } : a
            ))
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Failed to update priority</Notification>)
        }
    }

    const handleTogglePinned = async (id: string) => {
        const announcement = announcements.find(a => a.id === id)
        if (!announcement) return

        try {
            const updated = await apiUpdateAnnouncement<any, any>(id, { is_pinned: !announcement.isPinned })
            setAnnouncements(prev => prev.map(a => 
                a.id === id ? { ...a, isPinned: updated.is_pinned } : a
            ))
        } catch (error) {
            toast.push(<Notification title="Error" type="danger">Failed to pin post</Notification>)
        }
    }

    const handleCreateAnnouncement = async (data: any) => {
        try {
            const payload = {
                title: data.title,
                content: data.content,
                category: data.category.value,
                priority: data.priority.value,
                image: data.image || null,
                is_important: data.isImportant,
                is_pinned: false,
                status: data.isScheduled ? 'Scheduled' : 'Sent',
                scheduled_at: data.isScheduled && data.scheduledDate ? new Date(data.scheduledDate).toISOString() : null
            }

            const resp = await apiCreateAnnouncement<any, any>(payload)
            const mapped = {
                ...resp,
                isImportant: resp.is_important,
                isPinned: resp.is_pinned,
                date: dayjs(resp.created_at).format('YYYY-MM-DD'),
                preview: resp.content.substring(0, 150) + (resp.content.length > 150 ? '...' : '')
            }
            
            setAnnouncements(prev => [mapped, ...prev])
            toast.push(
                <Notification title="Success" type="success">
                    Announcement published successfully
                </Notification>
            )
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to publish announcement
                </Notification>
            )
        }
    }

    const handleUpdateAnnouncement = async (data: any) => {
        try {
            const payload = {
                title: data.title,
                content: data.content,
                category: data.category.value,
                priority: data.priority.value,
                image: data.image || null,
                is_important: data.isImportant,
                status: data.isScheduled ? 'Scheduled' : 'Sent',
                scheduled_at: data.isScheduled && data.scheduledDate ? new Date(data.scheduledDate).toISOString() : null
            }

            const resp = await apiUpdateAnnouncement<any, any>(data.id, payload)
            const mapped = {
                ...resp,
                isImportant: resp.is_important,
                isPinned: resp.is_pinned,
                date: dayjs(resp.created_at).format('YYYY-MM-DD'),
                preview: resp.content.substring(0, 150) + (resp.content.length > 150 ? '...' : '')
            }

            setAnnouncements(prev => prev.map(a => a.id === data.id ? mapped : a))

            toast.push(
                <Notification title="Updated" type="success">
                    Announcement updated successfully
                </Notification>
            )
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to update announcement
                </Notification>
            )
        }
    }

    const filteredAnnouncements = announcements
        .filter((a) => {
            const matchesSearch =
                a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.preview.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesTab = activeTab === 'All' || a.status === activeTab
            return matchesSearch && matchesTab
        })
        .sort((a, b) => {
            if (sortBy === 'Newest') {
                // If pinned is used, we still keep pinned at top but within categories sort by date
                if (a.isPinned !== b.isPinned) {
                    return a.isPinned ? -1 : 1
                }
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            }
            if (sortBy === 'Most Viewed') {
                return (b.views || 0) - (a.views || 0)
            }
            return 0
        })

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
                {/* Admin action placeholder - moved button below filters */}
                <div className="hidden md:block w-40"></div>
            </div>

            {/* 2. ANALYTICS CARDS */}
            {isAdmin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Total Announcements', value: announcements.length.toString(), icon: Bell, color: 'burgundy', subtext: 'Since launch' },
                        { title: 'Active Posts', value: announcements.filter(a => a.is_active).length.toString(), icon: CheckCircle2, color: 'emerald', subtext: 'Currently live' },
                        { title: 'Total Views', value: announcements.reduce((sum, a) => sum + (a.views || 0), 0).toLocaleString(), icon: Eye, color: 'blue', subtext: 'Lifetime reach' },
                        { title: 'Avg. Engagement', value: announcements.length > 0 ? `${Math.round(announcements.reduce((sum, a) => sum + (a.engagement || 0), 0) / announcements.length)}%` : '0%', icon: TrendingUp, color: 'amber', subtext: 'Interaction rate' }
                    ].map((stat, i) => (
                        <StatCard 
                            key={i} 
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color as any}
                            subtext={stat.subtext}
                            isFirst={i === 0}
                        />
                    ))}
                </div>
            )}

            {/* 3. TABS & FILTER BAR */}
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
                    {/* Status Tabs */}
                    {isAdmin && (
                        <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-3xl w-max border border-gray-100 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
                            {['All', 'Sent', 'Scheduled', 'Draft'].map((tab) => {
                                const count = announcements.filter(a => tab === 'All' || a.status === tab).length
                                const isActive = activeTab === tab
                                
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-2.5 rounded-2xl text-[12px] font-black tracking-tight transition-all duration-400 flex items-center gap-2.5 group relative ${
                                            isActive 
                                                ? 'bg-[#8B0000] text-white shadow-lg shadow-red-900/10' 
                                                : 'text-gray-900 hover:text-[#8B0000] dark:hover:text-gray-200'
                                        }`}
                                    >
                                        {tab}
                                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black transition-colors ${
                                            isActive ? 'bg-white/20 text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-900 group-hover:bg-[#8B0000]/10 group-hover:text-[#8B0000]'
                                        }`}>
                                            {count}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    <div className={`flex flex-col md:flex-row md:items-center gap-4 flex-1 ${isAdmin ? 'lg:max-w-xl' : ''}`}>
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input 
                                placeholder="Search announcements..." 
                                className="pl-11 rounded-[1.5rem] border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 shadow-sm text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-black text-gray-900 tracking-tight">Sort:</span>
                                <select 
                                    className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]/20 min-w-[120px] shadow-sm"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="Newest">Newest</option>
                                    <option value="Most Viewed">Most Viewed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Action Row - Relocated for better accessibility */}
                {isAdmin && (
                    <div className="flex justify-end pt-2 pb-1">
                        <Button 
                            variant="solid" 
                            className="bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white font-black rounded-[1.25rem] h-14 px-10 flex items-center gap-3 shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] hover:-translate-y-1 transition-all w-full md:w-max text-[11px] capitalize border-none"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <Plus className="w-5 h-5" />
                            New Announcement
                        </Button>
                    </div>
                )}
            </div>

            {/* 4. ANNOUNCEMENTS LIST */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-[2rem] border border-gray-100 dark:border-gray-700">
                        <div className="w-12 h-12 border-4 border-[#8B0000]/10 border-t-[#8B0000] rounded-full animate-spin mb-4" />
                        <p className="text-[12px] font-black text-[#8B0000] uppercase tracking-widest animate-pulse">Syncing Announcements...</p>
                    </div>
                ) : filteredAnnouncements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-full mb-4">
                            <Bell className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">No announcements found</h3>
                        {isAdmin && (
                            <>
                                <p className="text-gray-500 text-sm mt-1 max-w-xs text-center">Create your first announcement to start communicating with members.</p>
                                <Button 
                                    variant="solid" 
                                    className="mt-6 bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white font-black rounded-[1.25rem] h-14 px-10 text-[11px]  capitalize shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 border-none"
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    <Plus className="w-5 h-5" />
                                    Create your first announcement
                                </Button>
                            </>
                        )}
                    </div>
                ) : (
                    filteredAnnouncements.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => handleViewAnnouncement(item)}
                            className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-[2rem] border border-gray-100/80 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_25px_60px_-15px_rgba(139,0,0,0.1)] transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-1"
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
                                            item.status === 'Sent' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                            item.status === 'Scheduled' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                            'bg-gray-100 text-gray-500 border border-gray-200'
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
                                    
                                    <div className="flex items-center justify-between pt-3">
                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-[10px] sm:text-[11px] font-bold tracking-tight">{item.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Eye className="w-3.5 h-3.5" />
                                                <span className="text-[10px] sm:text-[11px] font-bold tracking-tight">{item.views.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[#8B0000] dark:text-red-400/80 bg-[#8B0000]/5 px-2.5 py-1 rounded-lg">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                <span className="text-[10px] sm:text-[11px] font-black tracking-tight">{item.engagement}% Engagement</span>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="solid"
                                            size="sm" 
                                            className="bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white font-black rounded-[1.25rem] px-8 h-14 text-[11px] capitalize  flex items-center gap-3 shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] hover:-translate-y-1 transition-all outline-none border-none"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleViewAnnouncement(item)
                                            }}
                                        >
                                            <Eye className="w-4 h-4 text-white" />
                                            View Details
                                        </Button>
                                    </div>
                                </div>

                                {/* Actions */}
                                {isAdmin && (
                                    <div 
                                        className="flex items-center gap-2 shrink-0 self-start md:self-center" 
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Dropdown 
                                            placement="bottom-end"
                                            renderTitle={
                                                <Button variant="default" size="sm" className="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-xl border-none hover:bg-gray-100">
                                                    <MoreVertical className="w-5 h-5 text-gray-500" />
                                                </Button>
                                            }
                                        >
                                            <Dropdown.Item 
                                                onClick={() => {
                                                    setSelectedAnnouncement(item)
                                                    setIsEditModalOpen(true)
                                                }} 
                                                eventKey="edit" 
                                                className="flex items-center gap-2 p-3 font-bold text-xs"
                                            >
                                                <Pencil className="w-4 h-4 text-blue-500 transition-transform group-hover:scale-110" /> 
                                                Edit Announcement
                                            </Dropdown.Item>
                                            <Dropdown.Item 
                                                onClick={() => {
                                                    setSelectedAnnouncement(item)
                                                    setIsEngagementModalOpen(true)
                                                }} 
                                                eventKey="analytics" 
                                                className="flex items-center gap-2 p-3 font-bold text-xs"
                                            >
                                                <BarChart3 className="w-4 h-4 text-emerald-500" /> 
                                                View Engagement
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleToggleImportant(item.id)} eventKey="important" className="flex items-center gap-2 p-3 font-bold text-xs">
                                                <Flag className={`w-4 h-4 ${item.isImportant ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} /> 
                                                {item.isImportant ? 'Unmark Important' : 'Prioritize Post'}
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleTogglePinned(item.id)} eventKey="pin" className="flex items-center gap-2 p-3 font-bold text-xs">
                                                <Pin className={`w-4 h-4 ${item.isPinned ? 'text-indigo-500 fill-indigo-500' : 'text-gray-400'}`} /> 
                                                {item.isPinned ? 'Unpin from Top' : 'Pin to Directory'}
                                            </Dropdown.Item>
                                            <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2" />
                                            <Dropdown.Item 
                                                onClick={() => {
                                                    setSelectedAnnouncement(item)
                                                    setIsDeleteModalOpen(true)
                                                }} 
                                                eventKey="delete" 
                                                className="flex items-center gap-2 p-3 font-bold text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete Post
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
            <CreateAnnouncementModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateAnnouncement}
            />

            <EditAnnouncementModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdateAnnouncement}
                announcement={selectedAnnouncement}
            />

            <AnnouncementEngagementModal
                isOpen={isEngagementModalOpen}
                onClose={() => setIsEngagementModalOpen(false)}
                announcement={selectedAnnouncement}
            />

            <DeleteAnnouncementModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => selectedAnnouncement && handleDelete(selectedAnnouncement.id)}
                title={selectedAnnouncement?.title || ''}
            />

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
                        <div className="relative h-56 bg-[#8B0000] flex items-end px-12 pb-8 overflow-hidden">
                            {selectedAnnouncement.image ? (
                                <div className="absolute inset-0">
                                    <img src={selectedAnnouncement.image} alt={selectedAnnouncement.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#8B0000]/80 via-[#8B0000]/30 to-transparent" />
                                </div>
                            ) : (
                                <div className="absolute inset-0 bg-[url('/img/others/welcome-bg.png')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
                            )}
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-3">
                                    <Megaphone className="w-3 h-3 text-white" />
                                    <span className="text-white text-[8px] font-black uppercase tracking-widest">{selectedAnnouncement.category} ANNOUNCEMENT</span>
                                </div>
                                <h2 className="text-xl font-black text-white leading-tight">{selectedAnnouncement.title}</h2>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="px-12 py-10 bg-gray-50/30 dark:bg-gray-900/50">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Posted {selectedAnnouncement.date}</span>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">•</span>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{selectedAnnouncement.views.toLocaleString()} Views</span>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed font-semibold whitespace-pre-wrap">
                                {selectedAnnouncement.content === 'Full content goes here...' 
                                    ? selectedAnnouncement.preview + '\n\n' + selectedAnnouncement.content 
                                    : selectedAnnouncement.content}
                            </p>

                            <div className="mt-10 p-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-[#8B0000]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Association Official</p>
                                        <p className="text-[9px] font-bold text-gray-500 italic">FGCEOSA Secretariat</p>
                                    </div>
                                </div>
                                <Button 
                                    size="sm" 
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white px-10 font-black text-[11px] h-14 rounded-[1.25rem] uppercase tracking-widest transition-all hover:-translate-y-1 shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] border-none"
                                >
                                    Got it
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    )
}

export default AnnouncementsPage
