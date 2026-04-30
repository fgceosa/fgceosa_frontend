'use client'

import React from 'react'
import { 
    X, 
    Calendar, 
    Clock, 
    MapPin, 
    Type, 
    Users, 
    Tag as TagIcon,
    Plus,
    UploadCloud,
    Video,
    Globe
} from 'lucide-react'
import { Button, Dialog, Input, Select, Checkbox, DatePicker, Upload } from '@/components/ui'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller, useWatch } from 'react-hook-form'

interface CreateEventModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (data: any) => void
}

const CATEGORY_OPTIONS = [
    { value: 'Social', label: 'Social', color: 'emerald' },
    { value: 'Professional', label: 'Professional', color: 'blue' },
    { value: 'Charity', label: 'Charity', color: 'red' },
    { value: 'Meeting', label: 'Meeting', color: 'amber' },
]

const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: (i + 1).toString().padStart(2, '0') }))
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }))
const PERIOD_OPTIONS = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' }
]

const CreateEventModal = ({ isOpen, onClose, onCreate }: CreateEventModalProps) => {
    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            category: CATEGORY_OPTIONS[0],
            date: '',
            time: '',
            location: '',
            capacity: 0,
            hasRegistration: true,
            is_online: false,
            meeting_link: '',
            image: ''
        }
    })

    const isOnline = useWatch({ control, name: 'is_online' })

    const handleTimeChange = (type: 'hour' | 'minute' | 'period', val: any, currentSelection: any, onChange: any) => {
        const date = currentSelection ? new Date(currentSelection) : new Date()
        if (type === 'hour') {
            let hours = val.value
            const currentPeriod = date.getHours() >= 12 ? 'PM' : 'AM'
            if (currentPeriod === 'PM' && hours < 12) hours += 12
            if (currentPeriod === 'AM' && hours === 12) hours = 0
            date.setHours(hours)
        } else if (type === 'minute') {
            date.setMinutes(val.value)
        } else if (type === 'period') {
            let hours = date.getHours() % 12
            if (val.value === 'PM') hours += 12
            date.setHours(hours)
        }
        onChange(date.toISOString())
    }

    const onSubmit = (data: any) => {
        onCreate(data)
        reset()
        onClose()
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Dialog
            isOpen={isOpen}
            width={750}
            onClose={handleClose}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Header */}
                <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                            <Calendar className="w-7 h-7 text-[#8B0000]" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Create Event</h3>
                            <p className="text-[11px] font-black text-gray-400 mt-2 tracking-[0.2em] uppercase">Post New Activity</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="px-10 py-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar pb-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Image Upload */}
                        <div className="space-y-3">
                            <label className="text-[12px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-1.5 pl-1">Event Photo</label>
                            <Controller
                                name="image"
                                control={control}
                                render={({ field }) => (
                                    <Upload
                                        showList={false}
                                        uploadLimit={1}
                                        onChange={(files) => {
                                            if (files.length > 0) {
                                                const file = files[0]
                                                const reader = new FileReader()
                                                reader.onloadend = () => {
                                                    field.onChange(reader.result as string)
                                                }
                                                reader.readAsDataURL(file)
                                            }
                                        }}
                                        className="w-full"
                                    >
                                        <div className="w-full h-36 rounded-2xl bg-gray-50/50 dark:bg-gray-800/10 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all flex flex-col items-center justify-center group overflow-hidden relative cursor-pointer shadow-inner">
                                            {field.value ? (
                                                <img src={field.value} alt="Event Cover" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                        <UploadCloud className="w-6 h-6 text-[#8B0000]" />
                                                    </div>
                                                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Upload Cover Photo</p>
                                                    <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">JPEG/PNG/WEBP Format</p>
                                                </>
                                            )}
                                        </div>
                                    </Upload>
                                )}
                            />
                        </div>

                        {/* Title */}
                        <div className="space-y-3">
                            <label className="text-[12px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-1.5 pl-1">Event Title</label>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: 'Title is required' }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Event Name / Title"
                                        className="h-14 bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all rounded-2xl font-bold text-base px-6 shadow-inner"
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            {/* Category */}
                            <div className="space-y-3">
                                <label className="text-[12px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-1.5 pl-1">Category</label>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={CATEGORY_OPTIONS}
                                            className="rounded-2xl font-black text-sm h-14 shadow-inner"
                                            placeholder="Select Type"
                                        />
                                    )}
                                />
                            </div>

                            {/* Capacity */}
                            <div className="space-y-3">
                                <label className="text-[12px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-1.5 pl-1">Capacity</label>
                                <Controller
                                    name="capacity"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            className="h-14 bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 rounded-2xl font-black px-6 shadow-inner"
                                            placeholder="0 for unlimited"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Schedule Matrix */}
                        <div className="grid grid-cols-2 gap-8">
                            {/* Date */}
                            <div className="space-y-3">
                                <label className="text-[12px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-1.5 pl-1">Select Date</label>
                                <Controller
                                    name="date"
                                    control={control}
                                    rules={{ required: 'Date is required' }}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B0000] z-10" />
                                            <DatePicker 
                                                {...field}
                                                placeholder="Select Schedule"
                                                minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                                value={field.value ? new Date(field.value) : null}
                                                className="h-14 bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 pl-16 rounded-2xl font-black text-xs shadow-inner"
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Time */}
                            <div className="space-y-3">
                                <label className="text-[12px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-1.5 pl-1">Select Time</label>
                                <Controller
                                    name="time"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid grid-cols-3 gap-2">
                                            <Select
                                                placeholder="HH"
                                                options={HOUR_OPTIONS}
                                                menuPosition="fixed"
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                                value={field.value ? HOUR_OPTIONS.find(o => o.value === (new Date(field.value).getHours() % 12 || 12)) : null}
                                                onChange={(val) => handleTimeChange('hour', val, field.value, field.onChange)}
                                                className="rounded-2xl font-black text-xs h-14 shadow-inner"
                                            />
                                            <Select
                                                placeholder="MM"
                                                options={MINUTE_OPTIONS}
                                                menuPosition="fixed"
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                                value={field.value ? MINUTE_OPTIONS.find(o => o.value === new Date(field.value).getMinutes()) : null}
                                                onChange={(val) => handleTimeChange('minute', val, field.value, field.onChange)}
                                                className="rounded-2xl font-black text-xs h-14 shadow-inner"
                                            />
                                            <Select
                                                placeholder="AM/PM"
                                                options={PERIOD_OPTIONS}
                                                menuPosition="fixed"
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                                value={field.value ? PERIOD_OPTIONS.find(o => o.value === (new Date(field.value).getHours() >= 12 ? 'PM' : 'AM')) : PERIOD_OPTIONS[0]}
                                                onChange={(val) => handleTimeChange('period', val, field.value, field.onChange)}
                                                className="rounded-2xl font-black text-xs h-14 shadow-inner"
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Event Type Toggle */}
                        <div className="flex items-center justify-between p-6 bg-[#8B0000]/[0.02] dark:bg-red-900/10 rounded-2xl border border-[#8B0000]/10 shadow-inner">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-md border border-[#8B0000]/5">
                                    {isOnline ? <Video className="w-5 h-5 text-[#8B0000]" /> : <Globe className="w-5 h-5 text-[#8B0000]" />}
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-gray-900 dark:text-white leading-none mb-1.5">Event Hosting Type</p>
                                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{isOnline ? 'Virtual / Online Meeting' : 'Physical / On-site Gathering'}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2 min-w-[100px]">
                                <Controller
                                    name="is_online"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            checked={field.value}
                                            onChange={(val) => field.onChange(val)}
                                            className="h-7 w-7 rounded-xl accent-[#8B0000] shadow-sm"
                                        />
                                    )}
                                />
                                <span className="text-[11px] font-black text-[#8B0000] dark:text-red-400 select-none whitespace-nowrap tracking-wide leading-none">Online Event</span>
                            </div>
                        </div>

                        {/* Meeting Link (Only shown if online) */}
                        {isOnline && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-[12px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-1.5 pl-1">Meeting Link (Zoom, Meet, etc)</label>
                                <Controller
                                    name="meeting_link"
                                    control={control}
                                    rules={{ required: isOnline ? 'Meeting link is required for online events' : false }}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <Video className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B0000] z-10" />
                                            <Input
                                                {...field}
                                                placeholder="https://zoom.us/j/..."
                                                className="h-14 bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all rounded-2xl font-bold px-16 shadow-inner"
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        )}

                        {/* Venue Block */}
                        <div className="space-y-3">
                            <label className="text-[12px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-1.5 pl-1">{isOnline ? 'Online Platform / Note' : 'Event Location'}</label>
                            <Controller
                                name="location"
                                control={control}
                                render={({ field }) => (
                                    <div className="relative">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B0000]" />
                                        <Input
                                            {...field}
                                            placeholder={isOnline ? "e.g. Google Meet" : "Venue Address"}
                                            className="h-14 bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 pl-16 rounded-2xl font-bold px-6 shadow-inner"
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <label className="text-[12px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-1.5 pl-1">Description</label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: 'Description is required' }}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="w-full bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all rounded-[1.8rem] p-6 text-sm font-medium min-h-[120px] outline-none shadow-inner leading-relaxed"
                                        placeholder="Detailed explanation of the event scope..."
                                    />
                                )}
                            />
                        </div>
                    </form>
                </div>

                {/* Footer Controls */}
                <div className="px-10 pb-10 pt-6 flex gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800/50">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[14px] font-bold text-gray-500 dark:text-gray-400 capitalize hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="flex-[2] h-14 bg-[#8B0000] text-white font-bold capitalize text-[14px] rounded-2xl shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 border-none group disabled:opacity-50"
                    >
                        <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span>{isSubmitting ? 'Syncing...' : 'Create Event'}</span>
                    </button>
                </div>
            </div>
        </Dialog>
    )
}

export default CreateEventModal
