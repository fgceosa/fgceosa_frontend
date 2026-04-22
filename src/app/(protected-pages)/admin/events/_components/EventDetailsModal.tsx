'use client'

import React from 'react'
import { 
    X, 
    Calendar, 
    Clock, 
    MapPin, 
    Users, 
    Share2,
    CalendarCheck,
    CalendarClock,
    CalendarDays,
    Pencil,
    Video,
    ExternalLink
} from 'lucide-react'
import { Dialog, Button } from '@/components/ui'

interface EventDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    event: any
    onEdit?: (event: any) => void
}

const EventDetailsModal = ({ isOpen, onClose, event }: EventDetailsModalProps) => {
    if (!event) return null

    return (
        <Dialog
            isOpen={isOpen}
            width={750}
            onClose={onClose}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
            contentClassName="!shadow-none"
        >
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 dark:border-gray-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center border border-red-100/50">
                        <CalendarDays className="w-4 h-4 text-[#8B0000]" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">Event details</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </button>
            </div>

            <div className="p-8 sm:p-10 max-h-[80vh] overflow-y-auto no-scrollbar">
                {/* Visual Identity Layer */}
                <div className="relative mb-8 group w-full">
                    <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 shadow-inner">
                        {event.image ? (
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-10">
                                <CalendarCheck className="w-24 h-24 text-gray-500" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <div className="absolute -bottom-5 left-10 px-6 py-2.5 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                            event.status === 'Upcoming' ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]' :
                            event.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' :
                            'bg-gray-400'
                        }`} />
                        <span className={`text-[12px] font-bold capitalize tracking-wide ${
                            event.status === 'Upcoming' ? 'text-blue-600' :
                            event.status === 'Active' ? 'text-emerald-600' :
                            'text-gray-500'
                        }`}>
                            {event.status}
                        </span>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center border border-red-100/50">
                                <TagIcon className="w-4 h-4 text-[#8B0000]" />
                            </div>
                            <span className="text-[12px] font-bold text-[#8B0000] capitalize tracking-wide">{event.category}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight capitalize">{event.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    {/* Operational Matrix Grid */}
                    <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-gray-100 dark:border-gray-800 shadow-inner w-full">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm border border-gray-50 dark:border-gray-700">
                                    <CalendarClock className="w-4 h-4 text-[#8B0000]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium text-gray-400 capitalize tracking-wide mb-1">Date</p>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white capitalize">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm border border-gray-50 dark:border-gray-700">
                                    <Clock className="w-4 h-4 text-[#8B0000]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium text-gray-400 capitalize tracking-wide mb-1">Time</p>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white capitalize">{event.time}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center border-l border-gray-200 dark:border-gray-700/50 pl-6">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm border border-gray-50 dark:border-gray-700">
                                    <MapPin className="w-4 h-4 text-[#8B0000]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium text-gray-400 capitalize tracking-wide mb-1">Location</p>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white capitalize truncate max-w-[200px]">{event.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Online Meeting Status */}
                    {event.is_online && (
                        <div className="p-6 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-md border border-blue-100/50">
                                    <Video className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-none mb-1.5">Virtual Meeting Link</p>
                                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Join via Zoom, Meet or Teams</p>
                                </div>
                            </div>
                            <Button 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2 border-none shadow-lg shadow-blue-900/20"
                                onClick={() => window.open(event.meeting_link, '_blank')}
                            >
                                <ExternalLink className="w-4 h-4" />
                                Join Now
                            </Button>
                        </div>
                    )}

                    {/* Enrollment Engagement Layer */}
                    <div className="flex items-center justify-between p-7 bg-[#8B0000]/[0.03] dark:bg-red-900/10 rounded-xl border border-[#8B0000]/10 shadow-inner w-full">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg border border-[#8B0000]/5">
                                <Users className="w-6 h-6 text-[#8B0000]" />
                            </div>
                            <div>
                                <p className="text-[12px] font-medium text-gray-400 capitalize tracking-wide mb-1.5">Capacity Engagement</p>
                                <p className="text-base font-bold text-gray-900 dark:text-white capitalize">
                                    {(event.total_registered || 0)} Registered members / {event.capacity} Total Slots
                                </p>
                            </div>
                        </div>
                        <div className="w-32 h-2.5 bg-gray-200/50 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className="h-full bg-[#8B0000] shadow-[0_0_12px_rgba(139,0,0,0.4)] transition-all duration-1000" 
                                style={{ width: `${Math.min(((event.total_registered || 0) / (event.capacity || 100)) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default EventDetailsModal
