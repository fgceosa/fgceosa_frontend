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
                className="h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group w-full lg:w-auto"
            >
                <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Add New User</span>
            </Button>

            {/* Main Invitation Dialog */}
            <Dialog
                isOpen={isDialogOpen}
                width={560}
                onClose={handleCloseDialog}
                closable={false}
                className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
                contentClassName="!shadow-none"
            >
                <div className="relative">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <UserPlus className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">INVITE USER</h3>
                                <p className="text-[10px] font-black text-gray-400 mt-0.5">Add a new person to your team</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCloseDialog}
                            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                        >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="px-8 py-8 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar pb-10">
                        <InviteUserFormFields
                            formMethods={formMethods}
                            onSubmit={handleFormSubmit}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 pb-8 pt-6 flex gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-50 dark:border-gray-800">
                        <button
                            onClick={handleCloseDialog}
                            disabled={isSubmitting}
                            className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={formMethods.handleSubmit(handleFormSubmit)}
                            disabled={isSubmitting}
                            className="flex-[2] h-14 bg-primary hover:bg-primary-deep text-white font-black text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                        >
                            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            <span>{isSubmitting ? 'Sending...' : 'Send Invite'}</span>
                        </button>
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
