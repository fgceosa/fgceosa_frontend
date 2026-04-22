'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { getEvents, clearEventsError } from '@/store/slices/events'
import Loading from '@/components/shared/Loading'
import Alert from '@/components/ui/Alert'
import { 
    Calendar, 
    Search, 
    Clock, 
    MapPin,
    ChevronRight,
    ArrowRight,
    Activity,
    Users,
    Video,
    ExternalLink,
    CheckCircle2
} from 'lucide-react'
import { Card, Button, Input, Dialog } from '@/components/ui'
import EventRegistrationModal from '../../_components/EventRegistrationModal'

const MemberEvents = () => {
    const dispatch = useAppDispatch()
    const { eventsList, loading, error } = useAppSelector((state) => state.events)
    
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming')
    const [selectedEvent, setSelectedEvent] = useState<any>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)

    useEffect(() => {
        dispatch(getEvents())
    }, [dispatch])

    const filteredEvents = eventsList.filter((e) => {
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             e.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesTab = e.status === activeTab
        return matchesSearch && matchesTab
    })

    const handleViewDetails = (event: any) => {
        setSelectedEvent(event)
        setIsDetailsOpen(true)
    }

    const featuredEvent = eventsList.find(e => e.status === 'Upcoming') || eventsList[0]

    if (loading && eventsList.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loading loading type="cover" />
            </div>
        )
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 pt-10">
            {error && (
                <Alert showIcon type="danger" closable onClose={() => dispatch(clearEventsError())}>
                    {error}
                </Alert>
            )}

            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 sm:px-4">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8B0000]/5 rounded-full border border-[#8B0000]/10 mb-1">
                        <Calendar className="w-3 h-3 text-[#8B0000]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8B0000]">Community Calendar</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">Association Events</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-[13px] max-w-md">
                        Join your fellow alumni in global events, workshops, and galas.
                    </p>
                </div>
            </div>

            {activeTab === 'Upcoming' && featuredEvent && (
                <Card 
                    className="p-5 md:p-6 bg-white dark:bg-gray-900 rounded-[2rem] border border-[#8B0000]/10 dark:border-[#8B0000]/20 shadow-xl shadow-[#8B0000]/5 relative overflow-hidden group cursor-pointer"
                    onClick={() => handleViewDetails(featuredEvent)}
                >
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8B0000] rounded-full blur-[80px] opacity-[0.04] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-10 items-center">
                        {/* Event Banner Container */}
                        <div className="w-full lg:w-[35%] shrink-0 h-40 sm:h-48 lg:h-[220px] rounded-[1.5rem] overflow-hidden shadow-lg relative">
                            {featuredEvent.image ? (
                                <img 
                                    src={featuredEvent.image} 
                                    className="w-full h-full object-cover" 
                                    alt={featuredEvent.title}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                    <Calendar className="w-10 h-10 text-gray-200" />
                                </div>
                            )}
                            <div className="absolute top-3 left-3">
                                <div className="bg-[#8B0000] text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                                    <Activity className="w-3 h-3" />
                                    Featured
                                </div>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-5 flex-1 w-full text-center lg:text-left">
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-center lg:justify-start gap-2">
                                    <span className="bg-[#8B0000]/5 dark:bg-[#8B0000]/10 text-[#8B0000] dark:text-red-400 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.1em] border border-[#8B0000]/10">
                                        {featuredEvent.category}
                                    </span>
                                    {featuredEvent.is_online && (
                                        <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.1em] border border-blue-100 dark:border-blue-800/30 flex items-center gap-1.5">
                                            <Video className="w-2.5 h-2.5" />
                                            Online
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                                    {featuredEvent.title}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-[13px] font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                                    {featuredEvent.description.substring(0, 140)}...
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 font-bold text-xs bg-gray-50/50 dark:bg-gray-800/30 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center text-[#8B0000] shrink-0">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[8px] uppercase font-black text-gray-400 tracking-widest mb-0.5">Date & Time</p>
                                        <p className="font-black text-[11px]">{new Date(featuredEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {featuredEvent.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 font-bold text-xs bg-gray-50/50 dark:bg-gray-800/30 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center text-[#8B0000] shrink-0">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[8px] uppercase font-black text-gray-400 tracking-widest mb-0.5">Location</p>
                                        <p className="font-black text-[11px] line-clamp-1">{featuredEvent.location}</p>
                                    </div>
                                </div>
                            </div>

                            {featuredEvent.is_registered ? (
                                <div className="w-full sm:w-auto bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-black h-11 px-8 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-[10px] flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Already Registered
                                </div>
                            ) : (
                                <Button 
                                    className="w-full sm:w-auto bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white font-black h-11 px-8 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all capitalize  text-[10px] flex items-center justify-center gap-2 border-none"
                                    onClick={(e) => { e.stopPropagation(); handleViewDetails(featuredEvent); }}
                                >
                                    Get Tickets
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {/* 3. Filter & Tabs Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 sm:px-4">
                <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-gray-900 rounded-2xl w-max border border-gray-100 dark:border-gray-700/50 shadow-sm">
                    {(['Upcoming', 'Past'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-7 py-2.5 rounded-xl text-[11px] font-black tracking-tight transition-all duration-400 flex items-center gap-2 group relative ${
                                activeTab === tab 
                                    ? 'bg-[#8B0000] text-white shadow-md' 
                                    : 'text-gray-400 hover:text-[#8B0000] dark:hover:text-gray-200'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search for an event..." 
                        className="pl-11 rounded-[1.5rem] border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 h-12 shadow-sm text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* 4. Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-2 sm:px-4">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <Card 
                            key={event.id} 
                            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1 relative"
                            onClick={() => handleViewDetails(event)}
                        >
                            {/* Card Media */}
                            <div className="h-48 bg-gray-50 dark:bg-gray-900 relative overflow-hidden shrink-0 border-b border-gray-100/50">
                                {event.image ? (
                                    <img 
                                        src={event.image} 
                                        alt={event.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-30">
                                        <Activity className="w-12 h-12 text-gray-200 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <div className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md border border-white/10 text-white ${
                                        event.status === 'Upcoming' ? 'bg-blue-600/90' : 
                                        event.status === 'Ongoing' ? 'bg-emerald-600/90' : 
                                        'bg-gray-800/90'
                                    }`}>
                                        {event.status}
                                    </div>
                                </div>
                                {event.is_online && (
                                    <div className="absolute top-4 right-4 animate-in zoom-in-50 duration-500">
                                        <div className="bg-[#8B0000] text-white w-9 h-9 rounded-xl shadow-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                            <Video className="w-4 h-4" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex-1 flex flex-col gap-5">
                                <div className="space-y-3">
                                     <span className="bg-[#8B0000]/5 dark:bg-[#8B0000]/10 text-[#8B0000] dark:text-red-400 px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.1em] border border-[#8B0000]/10 w-max">
                                        {event.category}
                                    </span>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-[#8B0000] transition-colors tracking-tight">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-[12px] font-medium leading-relaxed line-clamp-2">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="space-y-2.5 bg-gray-50/50 dark:bg-gray-900/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-inner">
                                    <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 text-[11px] font-black">
                                        <Calendar className="w-3.5 h-3.5 text-[#8B0000]" />
                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 text-[11px] font-black">
                                        <Clock className="w-3.5 h-3.5 text-[#8B0000]" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-gray-700 dark:text-gray-300 text-[11px] font-black">
                                        <MapPin className="w-3.5 h-3.5 text-[#8B0000]" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-black pt-1.5 border-t border-gray-100 dark:border-gray-800">
                                        <Users className="w-3.5 h-3.5" />
                                        <span>{event.total_registered || 0} Registered members</span>
                                    </div>
                                </div>

                                <div className="pt-1">
                                    {event.is_registered ? (
                                        <div className="w-full h-11 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-black rounded-xl border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center gap-2 text-[10px] capitalize">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Registered
                                        </div>
                                    ) : (
                                        <Button 
                                            variant="plain" 
                                            className="w-full h-11 bg-[#8B0000]/[0.02] dark:bg-gray-700/50 text-[#8B0000] dark:text-red-400 hover:bg-[#8B0000] hover:text-white dark:hover:bg-[#8B0000] font-black rounded-xl border border-[#8B0000]/10 dark:border-gray-600 flex items-center justify-center gap-2 text-[10px] capitalize  transition-all shadow-sm"
                                            onClick={(e) => { e.stopPropagation(); handleViewDetails(event); }}
                                        >
                                            View Details
                                            <ChevronRight className="w-3 h-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))

                ) : (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900 flex items-center justify-center shadow-inner mb-6">
                            <Activity className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black text-gray-500">No events found</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Be the first to know about association updates</p>
                    </div>
                )}
            </div>

            {/* 5. Detailed View Modal */}
            <Dialog
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                closable={true}
                width={650}
                className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            >
                {selectedEvent && (
                    <div className="p-8 sm:p-10">
                        {/* Header path */}
                        <div className="mb-8 relative">
                            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-5 border border-red-100 dark:border-red-900/30">
                                <Calendar className="w-6 h-6 text-[#8B0000]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">{selectedEvent.title}</h2>
                                <p className="text-[13px] font-medium text-gray-500 mt-2 uppercase tracking-widest">
                                    {selectedEvent.category} • {(selectedEvent.total_registered || 0)} / {selectedEvent.capacity} REGISTRANTS
                                </p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            {/* Descriptive Section */}
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pb-8 border-b border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-[#8B0000] border border-gray-100 dark:border-gray-800 shadow-inner shrink-0">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Date</p>
                                            <p className="text-[12px] font-black text-gray-900 dark:text-white leading-none">
                                                {new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-[#8B0000] border border-gray-100 dark:border-gray-800 shadow-inner shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Time</p>
                                            <p className="text-[12px] font-black text-gray-900 dark:text-white leading-none">{selectedEvent.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 col-span-2 md:col-span-1">
                                        <div className="w-11 h-11 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-[#8B0000] border border-gray-100 dark:border-gray-800 shadow-inner shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Location</p>
                                            <p className="text-[12px] font-black text-gray-900 dark:text-white leading-none">{selectedEvent.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest">About This Event</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-[14px] leading-relaxed font-semibold">
                                        {selectedEvent.description}
                                    </p>
                                </div>

                                {/* Online Link for Members */}
                                {selectedEvent.is_online && (
                                    <div className="p-6 bg-blue-50/20 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-inner">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-md border border-blue-100/50">
                                                <Video className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-none mb-1.5">Virtual Meeting Link</p>
                                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest italic leading-tight">Accessible to registered members</p>
                                            </div>
                                        </div>
                                        <Button 
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-black h-12 px-6 rounded-xl flex items-center gap-2 border-none shadow-lg shadow-blue-900/10 text-[11px]"
                                            onClick={() => window.open(selectedEvent.meeting_link, '_blank')}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Join Meeting
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {selectedEvent.is_registered ? (
                                    <div className="flex-[2] h-14 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-black rounded-2xl text-[13px] capitalize flex items-center justify-center gap-3 border border-emerald-200 dark:border-emerald-800/50">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Already Registered
                                    </div>
                                ) : (
                                    <Button 
                                        className="flex-[2] bg-[#8B0000] text-white hover:bg-[#700000] hover:text-white font-black rounded-2xl h-14 text-[13px] capitalize shadow-xl border-none"
                                        onClick={() => setIsRegistrationModalOpen(true)}
                                    >
                                        Register
                                    </Button>
                                )}
                                <Button 
                                    variant="plain" 
                                    className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-white font-black rounded-2xl h-14 text-[11px] capitalize  hover:bg-gray-100 transition-all shadow-none border-none"
                                    onClick={() => setIsDetailsOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>

            <EventRegistrationModal
                isOpen={isRegistrationModalOpen}
                onClose={() => setIsRegistrationModalOpen(false)}
                event={selectedEvent ? { id: selectedEvent.id, title: selectedEvent.title, date: selectedEvent.date, location: selectedEvent.location, featured: selectedEvent.category === 'Social' } : null}
            />
        </div>
    )
}

export default MemberEvents
