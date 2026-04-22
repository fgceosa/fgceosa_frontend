'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, Button, Input, Select, Upload, DatePicker } from '@/components/ui'
import { CheckCircle2, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { apiGetDues } from '@/services/DuesService'
import { apiSubmitPaymentProof } from '@/services/admin/paymentsService'

interface DueOption {
    value: string
    label: string
}

export default function PaymentProofModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [step, setStep] = useState<'form' | 'success'>('form')
    const [submitting, setSubmitting] = useState(false)
    const [duesOptions, setDuesOptions] = useState<DueOption[]>([])
    const router = useRouter()

    // Form state
    const [purpose, setPurpose] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [paymentDate, setPaymentDate] = useState<Date | null>(null)
    const [receiptFile, setReceiptFile] = useState<File | null>(null)

    // Fetch active dues for the dropdown
    useEffect(() => {
        if (isOpen) {
            apiGetDues().then((dues) => {
                const activeDues = (dues || []).filter((d: any) => d.is_active)
                const options = activeDues.map((d: any) => ({
                    value: d.title,
                    label: `${d.title} — ₦${Number(d.amount).toLocaleString()}`,
                }))
                options.push({ value: 'Other', label: 'Other' })
                setDuesOptions(options)
            }).catch(() => {
                setDuesOptions([{ value: 'Other', label: 'Other' }])
            })
        }
    }, [isOpen])

    const handleSubmit = async () => {
        if (!purpose) {
            toast.push(<Notification title="Validation" type="warning">Please select a payment purpose.</Notification>)
            return
        }
        if (!amount || Number(amount) <= 0) {
            toast.push(<Notification title="Validation" type="warning">Please enter a valid amount.</Notification>)
            return
        }
        if (!paymentDate) {
            toast.push(<Notification title="Validation" type="warning">Please select the payment date.</Notification>)
            return
        }

        setSubmitting(true)
        try {
            await apiSubmitPaymentProof({
                purpose,
                amount: Number(amount),
                payment_date: paymentDate.toISOString().split('T')[0],
                receipt_url: receiptFile ? receiptFile.name : undefined,
            })
            setStep('success')
            toast.push(<Notification title="Success" type="success">Payment proof submitted successfully!</Notification>)
        } catch (err: any) {
            toast.push(
                <Notification title="Error" type="danger">
                    {err?.response?.data?.detail || 'Failed to submit payment proof. Please try again.'}
                </Notification>
            )
        } finally {
            setSubmitting(false)
        }
    }

    const reset = () => {
        setStep('form')
        setPurpose('')
        setAmount('')
        setPaymentDate(null)
        setReceiptFile(null)
        onClose()
    }

    const handleFileUpload = (files: File[]) => {
        if (files.length > 0) {
            setReceiptFile(files[0])
        }
        return ''
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={reset}
            width={600}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
        >
            {step === 'form' ? (
                <div className="p-8 sm:p-10">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-5 border border-gray-100 dark:border-gray-700">
                            <UploadCloud className="w-6 h-6 text-gray-900 dark:text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Submit Payment Proof</h2>
                        <p className="text-[13px] font-medium text-gray-500 mt-2">Upload your receipt. The financial secretary will review and update your status.</p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-[11px] font-black text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-2">Payment Purpose</label>
                            <Select
                                placeholder="Select Purpose"
                                options={duesOptions}
                                value={duesOptions.find(o => o.value === purpose) || null}
                                onChange={(option: any) => setPurpose(option?.value || '')}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-black text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-2">Amount Paid (₦)</label>
                                <Input 
                                    placeholder="e.g. 50000" 
                                    type="number" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-2">Payment Date</label>
                                <DatePicker 
                                    placeholder="Select date" 
                                    value={paymentDate}
                                    onChange={(date) => setPaymentDate(date as Date)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-gray-900 dark:text-gray-300 capitalize tracking-tight mb-2">Upload Receipt</label>
                            <Upload 
                                draggable 
                                className="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 py-10 text-center hover:bg-gray-100 transition-colors cursor-pointer group"
                                beforeUpload={handleFileUpload as any}
                                showList={false}
                            >
                                <div className="flex flex-col items-center justify-center pointer-events-none">
                                    <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-5 h-5 text-gray-400" />
                                    </div>
                                    {receiptFile ? (
                                        <>
                                            <p className="text-[13px] font-black text-emerald-600 mb-1.5">{receiptFile.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {(receiptFile.size / 1024).toFixed(1)} KB — Click to change
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[13px] font-black text-gray-900 dark:text-white mb-1.5"><span className="text-[#8B0000]">Click to upload</span> or drag and drop</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SVG, PNG, JPG or PDF (max. 5MB)</p>
                                        </>
                                    )}
                                </div>
                            </Upload>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4">
                        <Button variant="plain" onClick={onClose} className="flex-1 h-14 rounded-2xl font-black capitalize text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</Button>
                        <Button 
                            variant="solid" 
                            onClick={handleSubmit}
                            loading={submitting}
                            className="flex-1 bg-[#8B0000] text-white hover:bg-[#700000] hover:text-white h-14 rounded-2xl font-black capitalize shadow-xl px-8 border-none"
                        >
                            {submitting ? 'Submitting...' : 'Submit Proof'}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-2">Review in Progress!</h2>
                    <p className="text-[13px] font-medium text-gray-500 max-w-xs mb-8">
                        We've received your payment proof. Our administrators are currently reviewing your transaction. Your status will be updated automatically once the verification is complete.
                    </p>
                    <div className="flex gap-4 w-full">
                        <Button 
                            variant="plain" 
                            block 
                            onClick={() => { setStep('form'); setPurpose(''); setAmount(''); setPaymentDate(null); setReceiptFile(null); onClose(); router.push('/dashboard/payments'); }} 
                            className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-white font-black rounded-2xl h-14 text-[11px] capitalize hover:bg-gray-100 transition-all shadow-none border-none"
                        >
                            View Payment History
                        </Button>
                        <Button 
                            variant="solid" 
                            block 
                            onClick={() => { reset(); router.push('/dashboard'); }} 
                            className="flex-1 bg-[#8B0000] text-white hover:bg-[#700000] hover:text-white h-14 rounded-2xl font-black capitalize shadow-xl border-none transition-all"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            )}
        </Dialog>
    )
}
