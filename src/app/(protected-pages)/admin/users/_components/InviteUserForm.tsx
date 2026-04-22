'use client'

import { UserPlus, Send, X } from 'lucide-react'
import { Button, Dialog } from '@/components/ui'
import Alert from '@/components/ui/Alert'
import { useAppDispatch } from '@/store/hook'
import { fetchUsers, fetchUsersAnalytics } from '@/store/slices/admin/users'
import { useInviteUser } from '../hooks/useInviteUser'
import InviteUserFormFields from './InviteUser/InviteUserFormFields'
import InviteConfirmationDialog from './InviteUser/InviteConfirmationDialog'

const InviteUserForm = () => {
    const dispatch = useAppDispatch()

    const {
        formMethods,
        isSubmitting,
        isDialogOpen,
        setIsDialogOpen,
        isConfirmDialogOpen,
        setIsConfirmDialogOpen,
        isErrorDialogOpen,
        setIsErrorDialogOpen,
        errorMessage,

        pendingInvitation,
        handleFormSubmit,
        handleConfirmInvitation,
        handleCloseDialog
    } = useInviteUser(() => {
        // Refresh data after successful invite
        dispatch(fetchUsers())
        dispatch(fetchUsersAnalytics())
    })

    return (
        <>
            {/* Trigger Button */}
            <Button
                variant="solid"
                onClick={() => setIsDialogOpen(true)}
                style={{ backgroundColor: '#8B0000' }}
                className="h-14 px-8 text-white hover:opacity-90 font-black text-[11px] rounded-2xl shadow-xl shadow-[#8B0000]/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group w-full lg:w-auto border-none"
            >
                <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Add New Member</span>
            </Button>

            {/* Main Invitation Dialog */}
            <Dialog
                isOpen={isDialogOpen}
                width={650}
                onClose={handleCloseDialog}
                closable={false}
                className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                <div className="p-8 sm:p-10">
                    {/* Header Section */}
                    <div className="mb-10 relative flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                                <UserPlus className="w-7 h-7 text-[#8B0000]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Invite Member</h2>
                                <p className="text-[11px] font-black text-gray-400 mt-2 tracking-[0.2em]">Add New Member to Association</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCloseDialog}
                            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                        >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    <div className="space-y-10">
                        <InviteUserFormFields
                            formMethods={formMethods}
                            onSubmit={handleFormSubmit}
                        />

                        {/* Control Layer */}
                        <div className="pt-4 flex gap-4">
                            <button
                                onClick={handleCloseDialog}
                                disabled={isSubmitting}
                                className="flex-1 h-14 rounded-2xl border-none text-[11px] font-black text-gray-400 dark:text-gray-500 capitalize tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all font-mono"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={formMethods.handleSubmit(handleFormSubmit)}
                                disabled={isSubmitting}
                                className="flex-[2] h-14 bg-[#8B0000] text-white font-black capitalize tracking-[0.2em] text-[11px] rounded-2xl shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 border-none disabled:opacity-50 group"
                            >
                                <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                <span>{isSubmitting ? 'Syncing...' : 'Send Invite'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Confirmation Dialog */}
            <InviteConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleConfirmInvitation}
                isSubmitting={isSubmitting}
                pendingInvitation={pendingInvitation}
            />

            {/* Error Dialog/Alert */}
            <Dialog
                isOpen={isErrorDialogOpen}
                width={480}
                onClose={() => setIsErrorDialogOpen(false)}
                closable={false}
                className="p-0 border-none bg-transparent shadow-none"
                contentClassName="!shadow-none !bg-transparent"
            >
                <Alert
                    type="danger"
                    title="Invitation Failed"
                    showIcon
                    closable
                    onClose={() => setIsErrorDialogOpen(false)}
                >
                    {errorMessage}
                </Alert>
            </Dialog>


        </>
    )
}

export default InviteUserForm
