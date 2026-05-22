import React, { useState } from 'react'
import { Dialog, Button } from '@/components/ui'
import { AlertTriangle, X } from 'lucide-react'
import { apiRejectPayment } from '@/services/admin/paymentsService'
import { toast } from '@/components/ui'

interface RejectReasonModalProps {
    isOpen: boolean
    onClose: () => void
    paymentId: string | null
    memberName: string
    onSuccess: () => void
}

export default function RejectReasonModal({ isOpen, onClose, paymentId, memberName, onSuccess }: RejectReasonModalProps) {
    const [reason, setReason] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!paymentId) return
        if (!reason.trim()) {
            return toast.error('Please enter a rejection reason')
        }

        setIsSubmitting(true)
        try {
            await apiRejectPayment(paymentId, reason)
            toast.success(`Payment proof rejected successfully`)
            setReason('')
            onSuccess()
            onClose()
        } catch (error: any) {
            const errorMsg = error?.response?.data?.detail 
                ? (typeof error.response.data.detail === 'string' ? error.response.data.detail : 'Failed to reject payment')
                : 'Failed to reject payment'
            toast.error(errorMsg)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={500}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
            <div className="p-8 sm:p-10">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/10 rounded-2xl flex items-center justify-center border border-rose-100 dark:border-rose-900/30">
                            <AlertTriangle className="w-6 h-6 text-rose-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Reject Payment Proof</h2>
                            <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-tight">For {memberName}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-gray-900 dark:text-gray-300 capitalize tracking-tight leading-none pl-1">
                            Reason for Rejection
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please provide a clear explanation for rejecting this transfer receipt. The member will see this message on their payments screen."
                            rows={4}
                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none transition-all"
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-4">
                        <Button
                            variant="plain"
                            className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl px-4 py-2.5 text-[11px] font-bold capitalize hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-800"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="plain"
                            className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-2.5 text-[11px] font-bold capitalize transition-all"
                            onClick={handleSubmit}
                            loading={isSubmitting}
                        >
                            Confirm Rejection
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
