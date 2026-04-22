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
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
            <div className="p-8 sm:p-10">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner border border-emerald-100 dark:border-emerald-800/30">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    
                    <div className="space-y-2 mb-10">
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                            Authorize Invitation
                        </h4>
                        <p className="text-[11px] font-black text-gray-400 tracking-[0.2em] uppercase">Security Clearance Required</p>
                    </div>

                    <div className="bg-gray-50/50 dark:bg-gray-800/20 px-8 py-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 w-full mb-10 shadow-inner">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 leading-none">
                            Identity Vector:
                        </p>
                        <p className="text-base text-gray-900 dark:text-white font-black uppercase tracking-tight truncate leading-none pt-1">
                            {pendingInvitation?.email}
                        </p>
                    </div>

                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl border-none text-[11px] font-black text-gray-400 dark:text-gray-500 capitalize tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all font-mono"
                        >
                            Back
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isSubmitting}
                            className="flex-[2] h-14 bg-[#8B0000] text-white font-black capitalize tracking-[0.2em] text-[11px] rounded-2xl shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 border-none px-6"
                        >
                            {isSubmitting ? (
                                <Spinner className="text-white" size={20} />
                            ) : (
                                <CheckCircle2 className="w-5 h-5" />
                            )}
                            <span className="whitespace-nowrap">{isSubmitting ? 'Processing...' : 'Commit Invitation'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
