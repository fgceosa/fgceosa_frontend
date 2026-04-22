'use client'

import React, { useEffect, useState } from 'react'
import { 
    X, 
    Users, 
    User as UserIcon,
    Calendar,
    Clock,
    Download,
    Search,
    Mail,
    Phone
} from 'lucide-react'
import { Dialog, Button, Input, Spinner } from '@/components/ui'
import { apiGetEventRegistrants } from '@/services/admin/eventsService'
import Tag from '@/components/ui/Tag'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

interface EventRegistrantsModalProps {
    isOpen: boolean
    onClose: () => void
    event: any
}

const EventRegistrantsModal = ({
    isOpen,
    onClose,
    event,
}: EventRegistrantsModalProps) => {
    const [registrants, setRegistrants] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        if (isOpen && event?.id) {
            fetchRegistrants()
        }
    }, [isOpen, event])

    const fetchRegistrants = async () => {
        setIsLoading(true)
        try {
            const data = await apiGetEventRegistrants(event.id)
            setRegistrants(data)
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" closable>
                    Failed to load registrants
                </Notification>
            )
        } finally {
            setIsLoading(false)
        }
    }

    const filteredRegistrants = registrants.filter((reg) => {
        const user = reg.user || {}
        const name = (user.name || '').toLowerCase()
        const email = (user.email || '').toLowerCase()
        return (
            name.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase())
        )
    })

    const handleExport = () => {
        const headers = ['Name', 'Email', 'Phone', 'Registration Date', 'Notes']
        const rows = registrants.map((reg) => [
            reg.user?.name || 'N/A',
            reg.user?.email || 'N/A',
            reg.user?.phone || 'N/A',
            new Date(reg.registration_date).toLocaleDateString(),
            reg.notes || '',
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute(
            'download',
            `${event?.title || 'event'}_registrants.csv`
        )
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (!event) return null

    return (
        <Dialog
            isOpen={isOpen}
            width={850}
            onClose={onClose}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
            {/* Premium Header */}
            <div className="relative px-10 py-8 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-800/20">
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Users className="w-7 h-7 text-emerald-600 relative z-10" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                                Event Registrants
                            </h2>
                            <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {event.title}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            size="sm"
                            variant="plain"
                            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl h-11 px-6 font-bold shadow-sm transition-all hover:-translate-y-0.5"
                            onClick={handleExport}
                            disabled={registrants.length === 0}
                        >
                            <Download className="w-4 h-4 mr-2 text-[#8B0000]" />
                            Export CSV
                        </Button>
                        <button
                            onClick={onClose}
                            className="w-11 h-11 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm transition-all group"
                        >
                            <X className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-10 py-8">
                {/* Search Bar */}
                <div className="mb-8 relative max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-12 rounded-[1.25rem] h-13 bg-gray-50/50 border-gray-100 focus:bg-white dark:bg-gray-800/50 dark:border-gray-700 transition-all font-medium text-sm shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* List Content */}
                <div className="max-h-[55vh] overflow-y-auto pr-3 no-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-5">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center">
                                <Spinner size={28} />
                            </div>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                Fetching attendee records...
                            </p>
                        </div>
                    ) : filteredRegistrants.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
                            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
                                <Users className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                                No attendees found
                            </h3>
                            <p className="text-gray-400 text-xs font-medium mt-1">
                                {searchTerm
                                    ? 'Try a different search term'
                                    : 'Registration is currently empty'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredRegistrants.map((reg, index) => (
                                <div
                                    key={reg.id}
                                    className="p-5 bg-white dark:bg-gray-800/50 rounded-[1.8rem] border border-gray-100 dark:border-gray-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-[#8B0000]/20 hover:shadow-xl hover:shadow-gray-900/5 transition-all duration-500 group relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                                            {reg.user?.avatar ? (
                                                <img
                                                    src={reg.user.avatar}
                                                    alt={reg.user.name}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center">
                                                    <UserIcon className="w-6 h-6 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-black text-gray-900 dark:text-white capitalize leading-tight group-hover:text-[#8B0000] transition-colors">
                                                {reg.user?.name ||
                                                    'Unknown Member'}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-1.5">
                                                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 tracking-tight">
                                                    <Mail className="w-3.5 h-3.5 text-[#8B0000] opacity-70" />
                                                    {reg.user?.email}
                                                </div>
                                                {reg.user?.phone && (
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 tracking-tight">
                                                        <Phone className="w-3.5 h-3.5 text-[#8B0000] opacity-70" />
                                                        {reg.user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 min-w-[120px] relative z-10">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                            Registered On
                                        </p>
                                        <p className="text-xs font-black text-gray-900 dark:text-white tracking-tight">
                                            {new Date(
                                                reg.registration_date
                                            ).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    {/* Decorative subtle background icon for hover */}
                                    <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="px-10 py-8 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-50 dark:border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Current Status
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100/50 text-[11px] font-black flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                {registrants.length} Total Attendees
                            </div>
                            <Tag className="bg-gray-100 dark:bg-gray-700 text-gray-500 border-none font-black text-[10px] px-3">
                                {event.capacity} Capacity
                            </Tag>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                        variant="solid"
                        className="bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white border-none rounded-2xl px-12 h-14 font-black text-[13px] tracking-tight transition-all hover:-translate-y-1 active:scale-95 shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] w-full sm:w-auto capitalize"
                        onClick={onClose}
                    >
                        Close View
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default EventRegistrantsModal
