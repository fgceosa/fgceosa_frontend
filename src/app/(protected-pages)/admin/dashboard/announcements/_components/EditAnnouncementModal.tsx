'use client'

import React, { useEffect } from 'react'
import { 
    X, 
    Megaphone, 
    Save, 
    Type, 
    Tag as TagIcon, 
    AlertCircle, 
    Image as ImageIcon,
    Flag,
    Calendar,
    Pencil
} from 'lucide-react'
import { Button, Dialog, Input, Select, Upload, Checkbox, Switcher, DatePicker } from '@/components/ui'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller, useWatch } from 'react-hook-form'

interface EditAnnouncementModalProps {
    isOpen: boolean
    onClose: () => void
    onUpdate: (data: any) => void
    announcement: any
}

const CATEGORY_OPTIONS = [
    { value: 'General', label: 'General', color: 'blue' },
    { value: 'Event', label: 'Event', color: 'emerald' },
    { value: 'Important', label: 'Important', color: 'red' },
    { value: 'System', label: 'System Update', color: 'amber' },
]

const PRIORITY_OPTIONS = [
    { value: 'Normal', label: 'Normal' },
    { value: 'High', label: 'High' },
    { value: 'Urgent', label: 'Urgent' },
]

interface AnnouncementForm {
    title: string
    category: { label: string; value: string; color?: string }
    priority: { label: string; value: string }
    content: string
    isImportant: boolean
    isScheduled: boolean
    scheduledDate: Date | null
    scheduledTime: Date | null
    image: string | null
}

const EditAnnouncementModal = ({ isOpen, onClose, onUpdate, announcement }: EditAnnouncementModalProps) => {
    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AnnouncementForm>()

    useEffect(() => {
        if (announcement && isOpen) {
            reset({
                title: announcement.title,
                category: CATEGORY_OPTIONS.find(o => o.value === announcement.category) || CATEGORY_OPTIONS[0],
                priority: PRIORITY_OPTIONS.find(o => o.value === announcement.priority) || PRIORITY_OPTIONS[0],
                content: announcement.content || announcement.preview || '',
                isImportant: announcement.isImportant || false,
                isScheduled: announcement.status === 'Scheduled',
                scheduledDate: announcement.date ? new Date(announcement.date) : null,
                scheduledTime: announcement.date ? new Date(announcement.date) : null,
                image: announcement.image || null
            })
        }
    }, [announcement, isOpen, reset])

    const isScheduled = useWatch({
        control,
        name: 'isScheduled'
    })

    const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: (i + 1).toString().padStart(2, '0') }))
    const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') }))
    const PERIOD_OPTIONS = [
        { value: 'AM', label: 'AM' },
        { value: 'PM', label: 'PM' }
    ]

    const handleTimeChange = (type: 'hour' | 'minute' | 'period', val: any, currentSelection: Date | null, onChange: any) => {
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
        onChange(date)
    }

    const onSubmit = (data: any) => {
        onUpdate({ ...data, id: announcement.id })
        reset()
        onClose()
    }

    const handleClose = () => {
        onClose()
    }

    return (
        <Dialog
            isOpen={isOpen}
            width={850}
            onClose={handleClose}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden max-w-[95vw]"
        >
            <div className="p-6 sm:p-10">
                {/* Header Section */}
                <div className="mb-10 relative flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30 shadow-sm">
                            <Pencil className="w-7 h-7 text-[#8B0000]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Edit Announcement</h2>
                            <p className="text-[11px] font-bold text-gray-400 mt-2 capitalize tracking-tight">Modify the details of your community communication</p>
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
                <div className="space-y-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Announcement Title</label>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: 'Title is required' }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter title..."
                                        className="h-14 bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all rounded-2xl font-bold text-base shadow-inner"
                                        invalid={Boolean(errors.title)}
                                    />
                                )}
                            />
                            {errors.title && <p className="text-xs font-black text-red-500 pl-1">{errors.title.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {/* Category */}
                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Category</label>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={CATEGORY_OPTIONS}
                                            className="rounded-2xl h-14 font-black shadow-inner"
                                            placeholder="Select category"
                                        />
                                    )}
                                />
                            </div>

                            {/* Priority */}
                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Priority Level</label>
                                <Controller
                                    name="priority"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={PRIORITY_OPTIONS}
                                            className="rounded-2xl h-14 font-black shadow-inner"
                                            placeholder="Select priority"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Banner Image */}
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Banner Image (Optional)</label>
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
                                                <img src={field.value} alt="Banner Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-50 dark:border-gray-700 mb-2 group-hover:scale-110 transition-transform">
                                                        <ImageIcon className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <p className="text-[11px] font-bold text-gray-500 tracking-tight capitalize">Drop image or click to upload</p>
                                                </>
                                            )}
                                        </div>
                                    </Upload>
                                )}
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Detailed Content</label>
                            <Controller
                                name="content"
                                control={control}
                                rules={{ required: 'Content is required' }}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="w-full bg-gray-50/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all rounded-2xl p-5 text-sm font-bold min-h-[140px] outline-none shadow-inner"
                                        placeholder="Write your announcement content..."
                                    />
                                )}
                            />
                            {errors.content && <p className="text-xs font-black text-red-500 pl-1">{errors.content.message}</p>}
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-center justify-between p-6 bg-[#8B0000]/[0.02] dark:bg-red-900/10 rounded-2xl border border-[#8B0000]/10 shadow-inner">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#8B0000]/10">
                                        <Flag className="w-5 h-5 text-[#8B0000]" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[12px] font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">Important</p>
                                        <p className="text-[10px] text-gray-400 font-bold capitalize tracking-tight">Highlight post</p>
                                    </div>
                                </div>
                                <Controller
                                    name="isImportant"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            checked={field.value}
                                            className="scale-110 accent-[#8B0000]"
                                            onChange={(checked) => field.onChange(checked)}
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex items-center justify-between p-6 bg-[#8B0000]/[0.02] dark:bg-red-900/10 rounded-2xl border border-[#8B0000]/10 shadow-inner">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#8B0000]/10">
                                        <Calendar className="w-5 h-5 text-[#8B0000]" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[12px] font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">Schedule</p>
                                        <p className="text-[10px] text-gray-400 font-bold capitalize tracking-tight">Post later</p>
                                    </div>
                                </div>
                                <Controller
                                    name="isScheduled"
                                    control={control}
                                    render={({ field }) => (
                                        <Switcher
                                            checked={field.value}
                                            className="accent-[#8B0000]"
                                            onChange={(checked) => field.onChange(checked)}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 flex gap-4">
                            <button 
                                onClick={handleClose} 
                                disabled={isSubmitting}
                                className="flex-1 h-14 rounded-2xl border-none text-[14px] font-bold text-gray-400 dark:text-gray-500 capitalize tracking-tight hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all"
                            >
                                Cancel
                            </button>
                             <button 
                                onClick={handleSubmit(onSubmit)} 
                                disabled={isSubmitting}
                                className="flex-[2] bg-[#8B0000] text-white font-bold capitalize tracking-tight text-[14px] rounded-2xl shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 border-none disabled:opacity-50"
                            >
                                <Save className="w-5 h-5 transition-transform group-hover:scale-110" />
                                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    )
}

export default EditAnnouncementModal
