import { useState } from 'react'
import { Card, Dropdown, Menu, toast, Notification } from '@/components/ui'
import { Users, Target, BarChart3, MoreVertical, Edit3, Trash2, AlertCircle } from 'lucide-react'
import type { Campaign } from '../../../types'
import { CampaignStatusBadge } from './CampaignStatusBadge'
import { useAppDispatch } from '@/store'
import { deleteCampaign, fetchCampaigns } from '@/store/slices/bulkCredits'
import { EditCampaignModal } from './EditCampaignModal'
import { CampaignAnalyticsModal } from './CampaignAnalyticsModal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

export interface CampaignCardProps {
    campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
    const dispatch = useAppDispatch()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = () => {
        setIsDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!campaign.id) return
        setIsDeleting(true)
        try {
            await dispatch(deleteCampaign(campaign.id)).unwrap()
            toast.push(
                <Notification type="success" className="border-none p-0 bg-transparent">
                    <p className="text-sm font-bold">Program deleted successfully</p>
                </Notification>,
                { placement: 'top-center' }
            )
            dispatch(fetchCampaigns({}))
            setIsDeleteDialogOpen(false)
        } catch (error: any) {
            toast.push(
                <Notification type="danger" className="border-none p-0 bg-transparent">
                    <p className="text-sm font-bold">{error || 'Failed to delete program'}</p>
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all hover:translate-y-[-4px] group">
                <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex-1 flex gap-6">
                        <div className="hidden lg:flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-800 group-hover:scale-110 transition-transform">
                                <Target className="w-6 h-6 text-primary" />
                            </div>
                            <div className="w-[2px] h-full bg-gradient-to-b from-gray-100 to-transparent dark:from-gray-800" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{campaign.name}</h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-xs font-black text-primary italic opacity-70">Category:</span>
                                        <span className="text-xs font-black text-primary capitalize">{campaign.type}</span>
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="text-xs font-black text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {campaign.recipients} Recipients
                                        </span>
                                    </div>
                                </div>
                                <CampaignStatusBadge status={campaign.status} />
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 pt-2">
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-gray-600 dark:text-gray-400">Target Budget</p>
                                    <p className="text-lg font-black text-gray-900 dark:text-white tracking-tight">₦{(campaign.amount || 0).toLocaleString()}</p>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-black text-gray-600 dark:text-gray-400">Program Progress</p>
                                        <div className="flex items-center gap-2">
                                            {campaign.progress >= 100 && <AlertCircle className="w-3 h-3 text-emerald-500" />}
                                            <p className="text-xs font-black text-primary tracking-tight">{campaign.progress}%</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]"
                                            style={{ width: `${Math.min(campaign.progress || 0, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pl-0 lg:pl-8 lg:border-l border-gray-100 dark:border-gray-800">
                        <button
                            onClick={() => setIsAnalyticsModalOpen(true)}
                            className="flex-1 lg:flex-none h-12 px-8 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-black text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                        >
                            <BarChart3 className="w-3.5 h-3.5" />
                            Analytics
                        </button>
                        <Dropdown
                            placement="bottom-end"
                            renderTitle={
                                <button className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-deep shadow-lg shadow-primary/20 transition-all hover:scale-110">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            }
                        >
                            <Dropdown.Item
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-3 px-4 py-3 min-w-[160px]"
                            >
                                <Edit3 className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-black text-gray-900 dark:text-gray-100">Edit Details</span>
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={handleDelete}
                                className="flex items-center gap-3 px-4 py-3 min-w-[160px]"
                            >
                                <Trash2 className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-black text-rose-500">Delete Program</span>
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
            </Card>

            <EditCampaignModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                campaign={campaign}
            />

            <CampaignAnalyticsModal
                isOpen={isAnalyticsModalOpen}
                onClose={() => setIsAnalyticsModalOpen(false)}
                campaignId={campaign.id!}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                type="danger"
                title="Delete Program"
                confirmText="Delete Program"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteDialogOpen(false)}
                onClose={() => setIsDeleteDialogOpen(false)}
                confirmButtonProps={{
                    loading: isDeleting,
                    className: 'bg-rose-500 hover:bg-rose-600'
                }}
            >
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete <span className="font-black text-gray-900 dark:text-white">"{campaign.name}"</span>?
                    This action cannot be undone and all associated records will be permanently removed.
                </p>
            </ConfirmDialog>
        </>
    )
}
