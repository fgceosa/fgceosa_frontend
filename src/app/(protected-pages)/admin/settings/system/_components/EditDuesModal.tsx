import React, { useEffect } from 'react'
import { Dialog, Input, Select, Button, toast, DatePicker } from '@/components/ui'
import { Wallet, Calendar, DollarSign, X, Check, ArrowRight, Settings2 } from 'lucide-react'
import dayjs from 'dayjs'

interface EditDuesModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (due: any) => void
    data: any
}

export default function EditDuesModal({ isOpen, onClose, onConfirm, data }: EditDuesModalProps) {
    const [editDue, setEditDue] = React.useState({
        title: '',
        amount: '',
        dueDate: '',
        description: '',
        isActive: true
    })

    useEffect(() => {
        if (data) {
            setEditDue(data)
        }
    }, [data])

    const handleConfirm = () => {
        if (!editDue.title || !editDue.amount || !editDue.dueDate) {
            toast.error('Please fill in all required fields')
            return
        }
        onConfirm(editDue)
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={700}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
            <div className="p-8 sm:p-10">
                {/* Header Section */}
                <div className="mb-10 relative flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                            <Settings2 className="w-7 h-7 text-[#8B0000]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Edit Dues Details</h2>
                            <p className="text-sm font-bold text-gray-400 mt-2 tracking-tight capitalize">Update parameters for {data?.title}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Primary Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Dues Title</label>
                            <Input 
                                placeholder="e.g. Annual Dues 2026" 
                                value={editDue.title}
                                onChange={(e) => setEditDue({ ...editDue, title: e.target.value })}
                                className="bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 h-14 rounded-2xl font-bold shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Amount (₦)</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-sm font-black text-[#8B0000]">₦</span>
                                <Input 
                                    placeholder="0.00" 
                                    type="number"
                                    value={editDue.amount}
                                    onChange={(e) => setEditDue({ ...editDue, amount: e.target.value })}
                                    className="bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 h-14 pl-12 rounded-2xl font-black shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Due Date</label>
                            <div className="relative">
                                <DatePicker 
                                    placeholder="Pick a date"
                                    value={editDue.dueDate ? new Date(editDue.dueDate) : null}
                                    onChange={(date) => setEditDue({ ...editDue, dueDate: date ? dayjs(date).format('YYYY-MM-DD') : '' })}
                                    inputClassName="bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 h-14 pl-5 rounded-2xl font-black shadow-inner"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Assign To</label>
                            <Select 
                                placeholder="All Registered Members"
                                isDisabled
                                className="rounded-2xl h-14 font-black shadow-inner"
                                options={[{ value: 'all', label: 'All Registered Members' }]}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">Description</label>
                        <Input 
                            placeholder="Provide details about this payment..." 
                            value={editDue.description}
                            onChange={(e) => setEditDue({ ...editDue, description: e.target.value })}
                            className="bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 h-14 rounded-2xl font-bold shadow-inner"
                        />
                    </div>

                    <div className="p-6 bg-[#8B0000]/[0.02] dark:bg-red-900/10 border border-[#8B0000]/10 rounded-[2rem]">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                                <ArrowRight className="w-5 h-5 text-[#8B0000] rotate-[-45deg]" />
                            </div>
                            <div>
                                <h4 className="text-[13px] font-black text-[#8B0000] dark:text-red-400 capitalize mb-1">Impact Analysis</h4>
                                <p className="text-[11px] font-medium text-red-900/70 dark:text-red-400/70 leading-relaxed">
                                    Updating these parameters will instantly update the dues requirements for all active members.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Controls */}
                    <div className="pt-4 flex gap-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl border-none text-[11px] font-black text-gray-400 dark:text-gray-500 capitalize tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all font-mono"
                        >
                            Abort
                        </button>
                        <button 
                            type="button"
                            onClick={handleConfirm}
                            className="flex-[2] bg-[#8B0000] text-white font-black capitalize tracking-widest text-[11px] rounded-2xl shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 border-none"
                        >
                            <Check className="w-5 h-5" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
