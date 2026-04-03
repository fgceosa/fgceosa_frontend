import { useState, useEffect } from 'react'
import { Dialog, Input, Spinner, toast, Notification, Select } from '@/components/ui'
import { Save, Zap, Activity } from 'lucide-react'
import cn from '@/utils/classNames'
import { useAppDispatch, useAppSelector } from '@/store'
import { updateCampaign, selectCampaignActionLoading, fetchCampaigns } from '@/store/slices/bulkCredits'
import type { Campaign } from '../../../types'

export interface EditCampaignModalProps {
    isOpen: boolean
    onClose: () => void
    campaign: Campaign
}

export function EditCampaignModal({ isOpen, onClose, campaign }: EditCampaignModalProps) {
    const dispatch = useAppDispatch()
    const actionLoading = useAppSelector(selectCampaignActionLoading)

    const [formData, setFormData] = useState({
        name: campaign.name,
        description: campaign.description || '',
        type: campaign.type,
        amount: campaign.amount.toString(),
        recipients: campaign.recipients.toString(),
        status: campaign.status,
    })

    useEffect(() => {
        setFormData({
            name: campaign.name,
            description: campaign.description || '',
            type: campaign.type,
            amount: campaign.amount.toString(),
            recipients: campaign.recipients.toString(),
            status: campaign.status,
        })
    }, [campaign])

    const handleUpdate = async () => {
        if (!formData.name || !formData.type || !formData.amount || !formData.recipients) {
            toast.push(
                <Notification type="warning" className="border-none p-0 bg-transparent">
                    <p className="text-sm font-bold">Please fill in all required fields</p>
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        try {
            await dispatch(updateCampaign({
                id: campaign.id!,
                data: {
                    name: formData.name,
                    description: formData.description,
                    type: formData.type,
                    amount: parseFloat(formData.amount),
                    recipients: parseInt(formData.recipients),
                    status: formData.status,
                }
            })).unwrap()

            toast.push(
                <Notification type="success" className="border-none p-0 bg-transparent">
                    <p className="text-sm font-bold">Program updated successfully!</p>
                </Notification>,
                { placement: 'top-center' }
            )

            dispatch(fetchCampaigns({}))
            onClose()
        } catch (error: any) {
            toast.push(
                <Notification type="danger" className="border-none p-0 bg-transparent">
                    <p className="text-sm font-bold">{error || 'Failed to update program'}</p>
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
            <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10">
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Edit Program Details</h3>
                <p className="text-[10px] font-black text-gray-400 mt-0.5">Modify your credit allocation event</p>
            </div>

            <div className="p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 pl-1">Program Name</label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 pl-1">Description (Optional)</label>
                    <Input
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 pl-1">Program Category</label>
                        <Select
                            options={[
                                { value: 'Bootcamp', label: 'Bootcamp' },
                                { value: 'Hackathon', label: 'Hackathon' },
                                { value: 'Corporate Rewards', label: 'Corporate Rewards' },
                                { value: 'Community Pulse', label: 'Community Pulse' },
                                { value: 'General', label: 'General Distribution' }
                            ]}
                            value={formData.type ? { value: formData.type, label: formData.type } : null}
                            onChange={(option: any) => setFormData({ ...formData, type: option?.value || '' })}
                            placeholder="Select Category"
                            className="rounded-xl"
                            classNames={{
                                control: (state) => cn(
                                    'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 h-10 text-xs font-bold rounded-xl',
                                    state.isFocused && 'ring-2 ring-primary/20 border-primary'
                                )
                            }}
                            components={{
                                DropdownIndicator: () => <Zap className="w-3.5 h-3.5 text-gray-400 mr-4" />
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 pl-1">Status</label>
                        <Select
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'paused', label: 'Paused' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' }
                            ]}
                            value={formData.status ? { value: formData.status, label: formData.status.charAt(0).toUpperCase() + formData.status.slice(1) } : null}
                            onChange={(option: any) => setFormData({ ...formData, status: option?.value || 'active' })}
                            placeholder="Select Status"
                            className="rounded-xl"
                            classNames={{
                                control: (state) => cn(
                                    'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 h-10 text-xs font-bold rounded-xl',
                                    state.isFocused && 'ring-2 ring-primary/20 border-primary'
                                )
                            }}
                            components={{
                                DropdownIndicator: () => <Activity className="w-3.5 h-3.5 text-gray-400 mr-4" />
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 pl-1">Total Budget (₦)</label>
                        <Input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 pl-1">Target Recipients</label>
                        <Input
                            type="number"
                            value={formData.recipients}
                            onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
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
                    Cancel
                </button>
                <button
                    onClick={handleUpdate}
                    disabled={actionLoading || !formData.name || !formData.type || !formData.amount || !formData.recipients}
                    className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-black text-sm rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                >
                    {actionLoading ? <Spinner size="20px" customColorClass="text-white" /> : <Save className="w-5 h-5" />}
                    <span>{actionLoading ? 'Saving...' : 'Update Program'}</span>
                </button>
            </div>
        </Dialog>
    )
}
