import { useState } from 'react'
import { Dialog, Input, Spinner, toast, Notification, Select } from '@/components/ui'
import { Plus, Zap, Rocket } from 'lucide-react'
import cn from '@/utils/classNames'
import { useAppDispatch, useAppSelector } from '@/store'
import { createCampaign, selectCampaignActionLoading } from '@/store/slices/bulkCredits'
import type { Campaign } from '../../../types'

export interface CreateCampaignModalProps {
    isOpen: boolean
    onClose: () => void
}

export function CreateCampaignModal({ isOpen, onClose }: CreateCampaignModalProps) {
    const dispatch = useAppDispatch()
    const actionLoading = useAppSelector(selectCampaignActionLoading)

    const [newCampaign, setNewCampaign] = useState({
        name: '',
        description: '',
        type: '',
        amount: '',
        recipients: '',
        status: 'active' as Campaign['status'],
    })

    const handleCreateCampaign = async () => {
        if (!newCampaign.name || !newCampaign.type || !newCampaign.amount || !newCampaign.recipients) {
            toast.push(
                <Notification type="warning" className="border-none p-0 bg-transparent">
                    <p className="text-sm font-bold">Please fill in all required fields</p>
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        try {
            await dispatch(createCampaign({
                name: newCampaign.name,
                description: newCampaign.description,
                type: newCampaign.type,
                amount: parseFloat(newCampaign.amount),
                recipients: parseInt(newCampaign.recipients),
                status: newCampaign.status,
                progress: 0,
                badgeType: 'secondary',
            })).unwrap()

            toast.push(
                <Notification type="success" className="border-none p-0 bg-transparent">
                    <p className="text-sm font-bold">Program initiated successfully!</p>
                </Notification>,
                { placement: 'top-center' }
            )

            onClose()
            setNewCampaign({ name: '', description: '', type: '', amount: '', recipients: '', status: 'active' })
        } catch (error: any) {
            toast.push(
                <Notification type="danger" className="border-none p-0 bg-transparent">
                    <p className="text-sm font-bold">{error || 'Failed to start program'}</p>
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={600}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="p-6 sm:p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10">
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Create Program</h3>
                <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-0.5">Set up a new credit allocation event</p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Program Name</label>
                    <Input
                        value={newCampaign.name}
                        onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                        placeholder="e.g. Qorebit Winter Hackathon"
                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Description (Optional)</label>
                    <Input
                        value={newCampaign.description}
                        onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                        placeholder="Purpose of this program..."
                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Program Category</label>
                    <Select
                        options={[
                            { value: 'Bootcamp', label: 'Bootcamp' },
                            { value: 'Hackathon', label: 'Hackathon' },
                            { value: 'Corporate Rewards', label: 'Corporate Rewards' },
                            { value: 'Community Pulse', label: 'Community Pulse' },
                            { value: 'General', label: 'General Distribution' }
                        ]}
                        value={newCampaign.type ? { value: newCampaign.type, label: newCampaign.type } : null}
                        onChange={(option: any) => setNewCampaign({ ...newCampaign, type: option?.value || '' })}
                        placeholder="Select Category"
                        className="rounded-xl"
                        classNames={{
                            control: (state) => cn(
                                'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 h-12 text-sm font-bold rounded-xl',
                                state.isFocused && 'ring-2 ring-primary/20 border-primary'
                            )
                        }}
                        components={{
                            DropdownIndicator: () => <Zap className="w-4 h-4 text-gray-400 mr-4" />
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Total Budget (₦)</label>
                        <Input
                            type="number"
                            value={newCampaign.amount}
                            onChange={(e) => setNewCampaign({ ...newCampaign, amount: e.target.value })}
                            placeholder="100000"
                            className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Target Recipients</label>
                        <Input
                            type="number"
                            value={newCampaign.recipients}
                            onChange={(e) => setNewCampaign({ ...newCampaign, recipients: e.target.value })}
                            placeholder="e.g. 500"
                            className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                        />
                    </div>
                </div>
            </div>

                <div className="p-6 sm:p-8 pt-0 flex flex-row gap-4">
                    <button
                        onClick={onClose}
                        disabled={actionLoading}
                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-sm font-black text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 shadow-sm"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleCreateCampaign}
                        disabled={actionLoading || !newCampaign.name || !newCampaign.type || !newCampaign.amount || !newCampaign.recipients}
                        className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-black text-sm rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                    >
                        {actionLoading ? <Spinner size="20px" customColorClass="text-white" /> : <Rocket className="w-5 h-5" />}
                        <span>{actionLoading ? 'Initiating...' : 'Start Program'}</span>
                    </button>
                </div>
        </Dialog>
    )
}
