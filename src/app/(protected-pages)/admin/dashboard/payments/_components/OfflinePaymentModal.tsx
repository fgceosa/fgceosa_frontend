import React, { useState, useEffect } from 'react'
import { Dialog, Input, Select, Button, FormItem, Checkbox, DatePicker } from '@/components/ui'
import { Search, User, CreditCard, Calendar as CalendarIcon, X } from 'lucide-react'
import { apiRecordOfflinePayment } from '@/services/admin/paymentsService'
import { toast } from '@/components/ui'
import dayjs from 'dayjs'

export default function OfflinePaymentModal({ isOpen, onClose, onSuccess, initialData }: { 
    isOpen: boolean
    onClose: () => void 
    onSuccess?: () => void
    initialData?: any
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        memberId: '',
        memberName: '',
        amount: '',
        date: new Date(),
        method: 'transfer',
        category: 'annual',
        description: '',
        sendReceipt: true
    })

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                memberId: initialData.id || '',
                memberName: initialData.member || '',
                amount: initialData.amount?.replace(/[^0-9.]/g, '') || '', // Clean currency formatting
            }))
        }
    }, [initialData, isOpen])
    
    const handleSubmit = async () => {
        if (!formData.memberId && !formData.memberName) return toast.error('Please select a member')
        
        const cleanAmount = Number(formData.amount.toString().replace(/[^0-9.]/g, ''))
        if (!cleanAmount || isNaN(cleanAmount)) return toast.error('Please enter a valid amount')
        
        setIsSubmitting(true)
        try {
            const methodPayload = typeof formData.method === 'object' && formData.method !== null 
                ? (formData.method as any).value 
                : formData.method;
                
            const categoryPayload = typeof formData.category === 'object' && formData.category !== null 
                ? (formData.category as any).value 
                : formData.category;

            await apiRecordOfflinePayment({
                memberId: formData.memberId || 'manual-entry', // In a real app, we'd have a member selection dropdown
                amount: cleanAmount,
                date: dayjs(formData.date).format('YYYY-MM-DD'),
                paymentMethod: methodPayload,
                category: categoryPayload,
                description: formData.description,
                sendReceipt: formData.sendReceipt
            })
            toast.success('Payment recorded successfully')
            onSuccess?.()
            onClose()
        } catch (error: any) {
            const errorMsg = error?.response?.data?.detail 
                ? (typeof error.response.data.detail === 'string' ? error.response.data.detail : 'Invalid data format provided.')
                : 'Failed to record payment'
            toast.error(errorMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={650}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
            <div className="p-8 sm:p-10">
                {/* Header Section */}
                <div className="mb-10 relative flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                            <CreditCard className="w-7 h-7 text-[#8B0000]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">Record Payment</h2>
                            <p className="text-[11px] font-bold text-gray-400 mt-2 capitalize tracking-tight">Log offline or manual transactions</p>
                        </div>
                    </div>

                </div>

                <div className="space-y-10">
                    {/* Member Selection Block */}
                    <div className="space-y-3">
                        <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Member Name</label>
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input 
                                placeholder="Search for a member..." 
                                className="bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 h-14 pl-14 rounded-2xl font-bold shadow-inner"
                                value={formData.memberName}
                                onChange={(e) => setFormData({...formData, memberName: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Financial & Time Grid */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Amount (₦)</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-black text-[#8B0000]">₦</span>
                                <Input 
                                    placeholder="Enter amount" 
                                    type="number"
                                    className="bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 h-14 pl-12 rounded-2xl font-black shadow-inner"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Select Date</label>
                             <DatePicker 
                                 placeholder="Select Date"
                                 inputPrefix={<CalendarIcon className="w-5 h-5 text-[#8B0000]" />}
                                 className="bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 h-14 rounded-2xl font-bold shadow-inner pt-0"
                                 value={formData.date}
                                 onChange={(val) => setFormData({...formData, date: val as Date})}
                             />
                        </div>
                    </div>

                    {/* Logic Parameters Grid */}
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Payment Method</label>
                             <Select 
                                 className="rounded-2xl h-14 font-black shadow-inner"
                                 options={[
                                     { value: 'transfer', label: 'Bank Transfer' },
                                     { value: 'cash', label: 'Cash' },
                                     { value: 'cheque', label: 'Cheque' },
                                     { value: 'other', label: 'Other' },
                                 ]}
                                 placeholder="Select method"
                                 value={formData.method}
                                 onChange={(val) => setFormData({...formData, method: val ?? ''})}
                             />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Category</label>
                             <Select 
                                 className="rounded-2xl h-14 font-black shadow-inner"
                                 options={[
                                     { value: 'annual', label: 'Annual Dues' },
                                     { value: 'donation', label: 'Donation' },
                                     { value: 'event', label: 'Event Entry' },
                                 ]}
                                 placeholder="Select category"
                                 value={formData.category}
                                 onChange={(val) => setFormData({...formData, category: val ?? ''})}
                             />
                        </div>
                    </div>

                    {/* Narrative Block */}
                    <div className="space-y-3">
                        <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Description / Reference</label>
                         <Input 
                             placeholder="Enter reference or notes..." 
                             className="bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 h-14 rounded-2xl font-bold shadow-inner"
                             value={formData.description}
                             onChange={(e) => setFormData({...formData, description: e.target.value})}
                         />
                    </div>

                    {/* Automation Layer */}
                    <div className="p-6 bg-[#8B0000]/[0.02] dark:bg-red-900/10 rounded-[2rem] border border-[#8B0000]/10 shadow-inner">
                         <Checkbox 
                             checked={formData.sendReceipt} 
                             onChange={(val) => setFormData({...formData, sendReceipt: val})}
                             className="items-center"
                         >
                            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 ml-3 capitalize tracking-tight leading-none">
                                Send receipt to member's email
                            </span>
                        </Checkbox>
                    </div>

                    {/* Action Controls */}
                    <div className="pt-4 flex gap-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl border-none text-[14px] font-bold text-gray-400 dark:text-gray-500 capitalize tracking-tight hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-[2] bg-[#8B0000] text-white font-bold capitalize tracking-tight text-[14px] rounded-2xl shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 border-none disabled:opacity-50"
                        >
                            <CreditCard className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <span>{isSubmitting ? 'Saving...' : 'Save Payment'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
