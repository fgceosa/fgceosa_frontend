import { Dialog, Spinner } from '@/components/ui'
import { CheckCircle2 } from 'lucide-react'
import type { InviteUserFormData } from '../../types'

interface InviteConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isSubmitting: boolean
    pendingInvitation: InviteUserFormData | null
}

export default function InviteConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    isSubmitting,
    pendingInvitation,
}: InviteConfirmationDialogProps) {
    return (
        <Dialog
            isOpen={isOpen}
            width={480}
            onClose={onClose}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="p-8 md:p-10">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-[30px] flex items-center justify-center mb-6 shadow-sm border border-emerald-100 dark:border-emerald-800/30">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
                        CONFIRM INVITATION
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 w-full mb-8">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Inviting:
                        </p>
                        <p className="text-lg text-gray-900 dark:text-white font-black uppercase tracking-tight truncate">
                            {pendingInvitation?.email}
                        </p>
                    </div>

                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isSubmitting}
                            className="flex-[2] h-14 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isSubmitting ? (
                                <Spinner className="text-white" size={20} />
                            ) : (
                                <CheckCircle2 className="w-4 h-4" />
                            )}
                            <span>{isSubmitting ? 'Sending...' : 'Confirm Invite'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
