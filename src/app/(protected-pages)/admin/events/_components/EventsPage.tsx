'use client'

import React, { useState } from 'react'
import { 
    Calendar, 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Eye, 
    Clock, 
    MapPin,
    Trash2, 
    Pencil, 
    CheckCircle2,
    BarChart3,
    TrendingUp,
    LayoutGrid,
    List as ListIcon,
    ChevronRight,
    ArrowRight,
    Users
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import Dropdown from '@/components/ui/Dropdown'
import Dialog from '@/components/ui/Dialog'
import Tag from '@/components/ui/Tag'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'
import { useAppSelector } from '@/store/hook'
import CreateEventModal from './CreateEventModal'
import EventDetailsModal from './EventDetailsModal'
import EditEventModal from './EditEventModal'
import EventRegistrantsModal from './EventRegistrantsModal'
import StatCard from '@/components/shared/StatCard'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetEvents, apiCreateEvent, apiUpdateEvent, apiDeleteEvent } from '@/services/admin/eventsService'

const EventsPage = () => {
    const { user } = useAppSelector((state) => state.auth.session.session) || {}
    const authority = (user as any)?.authority || []
    const isAdmin = authority.includes('super_admin') || authority.includes('admin')

    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState('All')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [eventToEdit, setEventToEdit] = useState<any>(null)
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
    const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isRegistrantsModalOpen, setIsRegistrantsModalOpen] = useState(false)

    React.useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        setIsLoading(true)
        try {
            const data = await apiGetEvents()
            setEvents(data)
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" closable>
                    Failed to load events
                </Notification>
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = (id: string) => {
        setEventToDeleteId(id)
        setIsDeleteConfirmationOpen(true)
    }

    const confirmDelete = async () => {
        if (!eventToDeleteId) return
        
        setIsDeleting(true)
        try {
            await apiDeleteEvent(eventToDeleteId)
            setEvents(prev => prev.filter(e => e.id !== eventToDeleteId))
            toast.push(
                <Notification title="Deleted" type="success" closable>
                    Event deleted successfully
                </Notification>
            )
            setIsDeleteConfirmationOpen(false)
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" closable>
                    Failed to delete event
                </Notification>
            )
        } finally {
            setIsDeleting(false)
            setEventToDeleteId(null)
        }
    }

    const handleEdit = (event: any) => {
        setEventToEdit(event)
        setIsEditModalOpen(true)
    }

    const handleUpdateEvent = async (updatedEvent: any) => {
        try {
            const timeStr = updatedEvent.time 
                ? (updatedEvent.time.includes('T') ? new Date(updatedEvent.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : updatedEvent.time)
                : "12:00 PM"
            
            const payload = {
                title: updatedEvent.title,
                description: updatedEvent.description,
                date: updatedEvent.date,
                time: timeStr,
                location: updatedEvent.location,
                capacity: updatedEvent.capacity ? Number(updatedEvent.capacity) : 100,
                category: updatedEvent.category,
                status: updatedEvent.status,
                image: updatedEvent.image,
                total_registered: updatedEvent.totalRegistered || updatedEvent.total_registered,
                is_online: updatedEvent.is_online,
                meeting_link: updatedEvent.meeting_link
            }

            const data = await apiUpdateEvent(updatedEvent.id, payload)
            setEvents(prev => prev.map(e => e.id === data.id ? data : e))
            toast.push(
                <Notification title="Updated" type="success" closable>
                    Event updated successfully
                </Notification>
            )
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" closable>
                    Failed to update event
                </Notification>
            )
        }
    }

    const filteredEvents = events.filter((e) => {
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             e.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesTab = activeTab === 'All' || e.status === activeTab
        return matchesSearch && matchesTab
    })

    const handleCreateEvent = async (data: any) => {
        try {
            const timeString = data.time ? new Date(data.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "12:00 PM"
            const payload = {
                title: data.title,
                description: data.description,
                date: data.date,
                time: timeString,
                location: data.location || "",
                capacity: data.capacity ? Number(data.capacity) : 100,
                category: data.category?.value || 'General',
                status: 'Upcoming',
                image: data.image || null,
                is_online: data.is_online,
                meeting_link: data.meeting_link
            }
            
            const newEvent = await apiCreateEvent(payload)
            setEvents(prev => [newEvent, ...prev])
            toast.push(
                <Notification title="Success" type="success">
                    Event created successfully
                </Notification>
            )
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" closable>
                    Failed to create event
                </Notification>
            )
        }
    }

    const stats = [
        { title: 'Total Events', value: events.length.toString(), icon: Calendar, color: 'burgundy' as const, subtext: 'In database' },
        { title: 'Upcoming Events', value: events.filter(e => e.status === 'Upcoming').length.toString(), icon: Clock, color: 'blue' as const, subtext: 'Next activities' },
        { title: 'Past Events', value: events.filter(e => e.status === 'Past').length.toString(), icon: CheckCircle2, color: 'gray' as const, subtext: 'Completed' },
        { title: 'Active Events', value: events.filter(e => e.status === 'Active').length.toString(), icon: TrendingUp, color: 'emerald' as const, subtext: 'Ongoing' }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 mt-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Events</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                        Create and manage association events and activities
                    </p>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, i) => (
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

            {/* Tabs & View Toggle Section */}
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
                    <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-gray-800 rounded-[1.8rem] w-max border border-gray-100 dark:border-gray-700/50 shadow-sm">
                        {['All', 'Upcoming', 'Active', 'Past'].map((tab) => {
                            const count = events.filter(e => tab === 'All' || e.status === tab).length
                            const isActive = activeTab === tab
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 rounded-[1.2rem] text-[12px] font-black tracking-tight transition-all duration-400 flex items-center gap-2 ${
                                        isActive 
                                            ? 'bg-[#8B0000] text-white shadow-xl shadow-red-900/10' 
                                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                    }`}
                                >
                                    {tab}
                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${
                                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 lg:max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input 
                                placeholder="Search events..." 
                                className="pl-11 rounded-[1.5rem] border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 shadow-sm text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center p-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-[#8B0000]' : 'text-gray-400'}`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-[#8B0000]' : 'text-gray-400'}`}
                                >
                                    <ListIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <select className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-xs font-bold focus:outline-none min-w-[120px] shadow-sm">
                                <option>Newest</option>
                                <option>Closest Date</option>
                            </select>
                        </div>
                    </div>
                </div>
                {isAdmin && (
                    <div className="flex justify-end pt-2">
                        <Button 
                            variant="solid" 
                            className="bg-[#8B0000] hover:bg-[#700000] text-white font-bold rounded-2xl px-8 h-12 flex items-center gap-3 shadow-lg hover:-translate-y-0.5 transition-all text-[13px] tracking-tight"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <Plus className="w-5 h-5" />
                            Create New Event
                        </Button>
                    </div>
                )}
            </div>

            {/* Event Content Section */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Spinner size={40} />
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-full mb-4">
                        <Calendar className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">No events found</h3>
                    <p className="text-gray-500 text-sm mt-1">Create your first event to get started.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <div 
                            key={event.id}
                            className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                            onClick={() => { setSelectedEvent(event); setIsDetailsModalOpen(true); }}
                        >
                            {/* Card Image */}
                            <div className="h-48 bg-gray-50 dark:bg-gray-900 relative overflow-hidden shrink-0 border-b border-gray-100 dark:border-gray-700">
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-20">
                                        <Calendar className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-sm ${
                                        event.status === 'Upcoming' ? 'bg-blue-500 text-white' :
                                        event.status === 'Active' ? 'bg-emerald-500 text-white' :
                                        'bg-gray-400 text-white'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>
                                {isAdmin && (
                                    <div 
                                        className="absolute top-4 right-4 transition-transform duration-300"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Dropdown 
                                            placement="bottom-end"
                                            renderTitle={
                                                <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-900 shadow-lg hover:bg-white transition-colors cursor-pointer">
                                                    <MoreVertical className="w-6 h-6" />
                                                </button>
                                            }
                                        >
                                            <Dropdown.Item onClick={() => { setSelectedEvent(event); setIsRegistrantsModalOpen(true); }} className="flex items-center gap-2 p-3 font-bold text-xs text-emerald-600"><Users className="w-4 h-4" /> View Registrants</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleEdit(event)} className="flex items-center gap-2 p-3 font-bold text-xs"><Pencil className="w-4 h-4 text-blue-500" /> Edit</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleDelete(event.id)} className="flex items-center gap-2 p-3 font-bold text-xs text-red-500"><Trash2 className="w-4 h-4" /> Delete</Dropdown.Item>
                                        </Dropdown>
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex-1 flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <Tag className="bg-red-50 text-[#8B0000] border-none text-[9px] font-black uppercase px-2 py-0.5 mb-2">{event.category}</Tag>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-1 mb-2 group-hover:text-[#8B0000] transition-colors">{event.title}</h3>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100/50">
                                            <Users className="w-3 h-3 text-emerald-600" />
                                            <span className="text-[11px] font-black text-emerald-600">{event.total_registered || 0}</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Registrants</span>
                                    </div>
                                </div>
                                
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">{event.description}</p>

                                <div className="space-y-2 mt-auto">
                                    <div className="flex items-center gap-3 text-gray-400 text-[12px] font-bold">
                                        <Calendar className="w-4 h-4 text-[#8B0000]" />
                                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400 text-[12px] font-bold">
                                        <Clock className="w-4 h-4 text-[#8B0000]" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400 text-[12px] font-bold">
                                        <MapPin className="w-4 h-4 text-[#8B0000]" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 capitalize tracking-tight">Capacity Progress</span>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="w-32 h-1.5 bg-gray-50 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-[#8B0000]" 
                                                    style={{ width: `${Math.min(((event.total_registered || 0) / (event.capacity || 100)) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {event.total_registered || 0} / {event.capacity}
                                            </span>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); setIsDetailsModalOpen(true); }}
                                        variant="plain" 
                                        className="text-[#8B0000] hover:text-[#700000] font-black text-[12px] h-auto p-0 flex items-center gap-1 group/btn"
                                    >
                                        View Details <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-gray-700">
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 capitalize tracking-tight">Event Name</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 capitalize tracking-tight">Date & Time</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 capitalize tracking-tight">Status</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 capitalize tracking-tight">Registration</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 capitalize tracking-tight text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="border-b border-gray-50 dark:border-gray-700 last:border-none group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center shrink-0">
                                                <Calendar className="w-5 h-5 text-gray-300" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{event.title}</p>
                                                <p className="text-[10px] font-bold text-gray-400 capitalize">{event.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">{new Date(event.date).toLocaleDateString()}</p>
                                        <p className="text-[11px] font-bold text-gray-400">{event.time}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-bold capitalize ${
                                            event.status === 'Upcoming' ? 'bg-blue-50 text-blue-500' :
                                            event.status === 'Active' ? 'bg-emerald-50 text-emerald-500' :
                                            'bg-gray-100 text-gray-400'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-[#8B0000]" 
                                                    style={{ width: `${Math.min(((event.total_registered || 0) / (event.capacity || 100)) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400">{Math.round(((event.total_registered || 0) / (event.capacity || 1) * 100))}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="sm" variant="plain" onClick={() => { setSelectedEvent(event); setIsRegistrantsModalOpen(true); }} className="hover:bg-emerald-50 p-2 rounded-lg text-emerald-500" title="View Registrants"><Users className="w-4 h-4" /></Button>
                                            <Button size="sm" variant="plain" onClick={() => handleEdit(event)} className="hover:bg-blue-50 p-2 rounded-lg text-blue-500"><Pencil className="w-4 h-4" /></Button>
                                            <Button size="sm" variant="plain" onClick={() => { setSelectedEvent(event); setIsDetailsModalOpen(true); }} className="hover:bg-gray-100 dark:hover:bg-gray-700/50 p-2 rounded-lg text-gray-500"><Eye className="w-4 h-4" /></Button>
                                            {isAdmin && <Button size="sm" variant="plain" onClick={() => handleDelete(event.id)} className="hover:bg-red-50 p-2 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></Button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals */}
            <CreateEventModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateEvent}
            />

            <EventDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                event={selectedEvent}
            />

            <EditEventModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdateEvent}
                event={eventToEdit}
            />

            <EventRegistrantsModal
                isOpen={isRegistrantsModalOpen}
                onClose={() => setIsRegistrantsModalOpen(false)}
                event={selectedEvent}
            />

            <ConfirmDialog
                isOpen={isDeleteConfirmationOpen}
                type="danger"
                title="Delete Event"
                confirmButtonProps={{ loading: isDeleting }}
                onClose={() => setIsDeleteConfirmationOpen(false)}
                onCancel={() => setIsDeleteConfirmationOpen(false)}
                onConfirm={confirmDelete}
            >
                Are you sure you want to delete this event? This action cannot be undone.
            </ConfirmDialog>
        </div>
    )
}

export default EventsPage
