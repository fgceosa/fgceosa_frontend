'use client'

import { useAppDispatch, useAppSelector } from '@/store'
import { setInsufficientCreditsDialog, selectInsufficientCreditsDialog } from '@/store/slices/chat'
import { selectCurrentUserRole } from '@/store/slices/organization/organizationSelectors'
import { Dialog, Button } from '@/components/ui'
import { useRouter } from 'next/navigation'
import { CreditCard, AlertCircle } from 'lucide-react'

export default function ChatInsufficientCreditsDialog() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const insufficientCreditsDialog = useAppSelector(selectInsufficientCreditsDialog)
    const userRole = useAppSelector(selectCurrentUserRole)

    if (!insufficientCreditsDialog) {
        return null
    }

    const { open, message, currentBalance, model } = insufficientCreditsDialog
    const isOrgMember = userRole === 'org_member'

    const handleClose = () => {
        dispatch(setInsufficientCreditsDialog({ open: false }))
    }

    const handleTopUp = () => {
        handleClose()
        router.push('/dashboard/billing')
    }

    return (
        <Dialog
            isOpen={open}
            onClose={handleClose}
            width={550}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden"
        >
            <div className="p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-800/30">
                        <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                            Insufficient Credits
                        </h2>
                        <p className="text-[10px] text-gray-400 font-black mt-1">
                            {isOrgMember ? 'Contact administrator' : 'Top up to continue'}
                        </p>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <div className="p-5 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800/20">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                            {isOrgMember
                                ? 'Insufficient credits to use this model. Please contact your administrator to allocate more credits to your account.'
                                : (message || 'You don\'t have enough credits to use this model.')}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="text-[10px] font-black text-gray-400 mb-2">
                                Current Balance
                            </div>
                            <div className="text-2xl font-black text-gray-900 dark:text-white">
                                {isOrgMember ? `${currentBalance.toFixed(2)} Credits` : `₦${currentBalance.toFixed(2)}`}
                            </div>
                        </div>
                        {model && (
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-[10px] font-black text-gray-400 mb-2">
                                    Selected Model
                                </div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                    {model}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/20">
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                            <span className="font-black">💡 Tip:</span> You can still use free models without credits.
                            Paid models require {isOrgMember ? 'allocated credits' : 'a minimum balance of ₦0.01'}.
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    {isOrgMember ? (
                        <Button
                            variant="solid"
                            onClick={handleClose}
                            className="h-14 px-12 bg-[#0055BA] hover:bg-[#004299] text-white font-black text-[11px] rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            Got it
                        </Button>
                    ) : (
                        <>
                            <button
                                onClick={handleClose}
                                className="h-12 px-6 font-black text-[10px] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <Button
                                variant="solid"
                                onClick={handleTopUp}
                                className="h-14 px-8 bg-[#0055BA] hover:bg-[#004299] text-white font-black text-[11px] rounded-2xl shadow-xl shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                            >
                                <CreditCard className="w-4 h-4" />
                                Top Up Credits
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Dialog>
    )
}
