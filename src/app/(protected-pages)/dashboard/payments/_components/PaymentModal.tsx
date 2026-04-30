'use client'

import React, { useState, useEffect } from 'react'
import { Dialog, Button, Input, Card, Alert, Badge, Tag, Checkbox } from '@/components/ui'
import { 
    FiCheckCircle, 
    FiCopy, 
    FiShield, 
    FiCreditCard, 
    FiTrendingUp,
    FiX,
    FiArrowRight,
    FiCheck,
    FiInfo
} from 'react-icons/fi'
import { Landmark, ShieldCheck, CheckCircle2 } from 'lucide-react'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import useSystemSettings from '@/utils/hooks/useSystemSettings'

import { 
    apiInitializePayment, 
    apiVerifyPayment 
} from '@/services/PaymentService'
import { useAppSelector } from '@/store/hook'

declare const PaystackPop: any;

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    amount: number
    unpaidDues?: Array<{ id: string, title: string, amount: number }>
    onSuccess?: () => void
    onViewInvoice?: () => void
}

type PaymentStep = 'summary' | 'method' | 'paystack' | 'bank' | 'processing' | 'success'

const PaymentModal = ({ isOpen, onClose, amount, unpaidDues = [], onSuccess, onViewInvoice }: PaymentModalProps) => {
    const { settings } = useSystemSettings()
    const { user } = useAppSelector((state) => state.auth.session.session) || {}
    const [step, setStep] = useState<PaymentStep>('summary')
    const [isCopied, setIsCopied] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<'paystack' | 'bank'>('paystack')
    const [loading, setLoading] = useState(false)
    const [selectedDues, setSelectedDues] = useState<string[]>([])

    useEffect(() => {
        if (isOpen && unpaidDues.length > 0) {
            setSelectedDues(unpaidDues.map(d => d.id))
        }
    }, [isOpen, unpaidDues])

    const currentTotalAmount = unpaidDues.length > 0 
        ? unpaidDues.filter(d => selectedDues.includes(d.id)).reduce((sum, d) => sum + d.amount, 0)
        : amount

    const toggleDue = (id: string) => {
        setSelectedDues(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    const toggleAll = () => {
        if (selectedDues.length === unpaidDues.length) {
            setSelectedDues([])
        } else {
            setSelectedDues(unpaidDues.map(d => d.id))
        }
    }

    const bankDetails = React.useMemo(() => ({
        bankName: settings.bank_name || 'Providus Bank',
        accountName: settings.account_name || 'FGCEOSA Secretariat',
        accountNumber: settings.account_number || '1092837465',
        reference: `PAY-MEM-${Math.floor(1000 + Math.random() * 9000)}`,
    }), [settings])

    const [activeTransactionRef, setActiveTransactionRef] = useState<string>('')
    const [paymentUrl, setPaymentUrl] = useState<string>('')

    useEffect(() => {
        if (isOpen) {
            setStep('summary')
        }
    }, [isOpen])

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
        toast.push(
            <Notification title="Copied" type="success" duration={2000}>
                {text} copied to clipboard
            </Notification>
        )
    }

    const handleProceedToPayment = () => {
        if (selectedMethod === 'paystack') {
            setStep('paystack')
        } else {
            setStep('bank')
        }
    }

    const handlePaystackCheckout = async () => {
        if (!user?.email) {
            toast.push(
                <Notification title="Error" type="danger">
                    User email not found. Please relogin.
                </Notification>
            )
            return
        }

        setLoading(true)
        try {
            // 1. Initialize payment on backend
            const selectedItems = unpaidDues.filter(d => selectedDues.includes(d.id))
            const initResponse = await apiInitializePayment({
                amount: currentTotalAmount,
                description: selectedItems.length > 0 
                    ? `Dues: ${selectedItems.map(d => d.title).join(', ')}`
                    : 'Annual Dues Payment',
                callback_url: window.location.href
            })

            if (initResponse.status !== 'success') {
                throw new Error('Could not initialize payment')
            }

            const paystackKey = (settings.paystack_public_key && settings.paystack_public_key.trim()) || process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
            
            if (!paystackKey) {
                throw new Error('Payment configuration missing. Please contact administrator.')
            }

            // Store ref and URL for UI fallback
            setActiveTransactionRef(initResponse.transaction_reference)
            setPaymentUrl(initResponse.payment_url)

            // 2. Open Paystack Popup
            if (typeof PaystackPop === 'undefined') {
                throw new Error('Paystack library not loaded. Please refresh the page.')
            }

            const paystack = new PaystackPop();
            paystack.newTransaction({
                key: paystackKey,
                email: user.email,
                amount: currentTotalAmount * 100, // Paystack expects kobo
                ref: initResponse.transaction_reference,
                onSuccess: async (transaction: any) => {
                    setStep('processing')
                    try {
                        // 3. Verify on backend
                        await apiVerifyPayment(transaction.reference)
                        setStep('success')
                        onSuccess?.()
                    } catch (verifyError) {
                        console.error('Verification failed:', verifyError)
                        toast.push(
                            <Notification title="Verification Pending" type="warning">
                                Payment was successful but verification failed. It will be updated shortly.
                            </Notification>
                        )
                        onClose()
                    }
                },
                onCancel: () => {
                    setLoading(false)
                }
            });

            // Fallback: If after 3 seconds the step is still 'paystack' and not 'processing', 
            // the popup might have been blocked. We'll show a manual link in the UI.
            setTimeout(() => {
                setLoading(false)
            }, 3000)

        } catch (error: any) {
            console.error('Payment Error:', error)
            toast.push(
                <Notification title="Payment Error" type="danger">
                    {error.message || 'Something went wrong. Please try again.'}
                </Notification>
            )
            setLoading(false)
        }
    }
    const renderSummaryStep = () => (
        <div className="p-8 sm:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
            <div>
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-5 border border-gray-100 dark:border-gray-700">
                    <Landmark className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Review Dues</h2>
                <p className="text-[13px] font-medium text-gray-500 mt-2">
                    Details for {unpaidDues.length > 0 ? new Date().getFullYear() : 'Active Dues'}
                </p>
            </div>

            <div className="p-6 rounded-[1.5rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-4">
                {unpaidDues.length > 0 ? (
                    <>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Dues to Pay</span>
                            <button 
                                onClick={toggleAll}
                                className="text-[10px] font-black text-[#8B0000] uppercase tracking-widest hover:underline"
                            >
                                {selectedDues.length === unpaidDues.length ? 'Unselect All' : 'Select All'}
                            </button>
                        </div>
                        {unpaidDues.map((due) => (
                            <div key={due.id} className="flex justify-between items-center group cursor-pointer" onClick={() => toggleDue(due.id)}>
                                <div className="flex items-center gap-3">
                                    <Checkbox 
                                        checked={selectedDues.includes(due.id)} 
                                        onChange={() => toggleDue(due.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className={`font-bold text-[12px] capitalize tracking-tight transition-colors ${selectedDues.includes(due.id) ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                        {due.title}
                                    </span>
                                </div>
                                <span className={`font-black text-[13px] transition-colors ${selectedDues.includes(due.id) ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                    ₦{due.amount.toLocaleString()}.00
                                </span>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold text-[12px] capitalize tracking-tight">Outstanding Balance</span>
                        <span className="font-black text-gray-900 dark:text-white text-[13px]">₦{amount.toLocaleString()}.00</span>
                    </div>
                )}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Total amount</span>
                        <span className="text-lg font-black text-[#8B0000]">₦{currentTotalAmount.toLocaleString()}.00</span>
                    </div>
                </div>
            </div>

            <Alert showIcon className="bg-blue-50/50 border-blue-100 text-blue-800 rounded-3xl border flex items-center p-6">
                <div className="mr-3">
                    <FiInfo className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-[11px] font-bold leading-relaxed px-2">
                    Paying your dues on time ensures you remain an active member with full voting rights and access to the FGCEOSA alumni portal.
                </p>
            </Alert>

            <div className="mt-auto pt-6">
                <Button 
                    block 
                    disabled={currentTotalAmount <= 0}
                    className="bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white font-black h-14 rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 capitalize text-[14px] border-none disabled:opacity-50 disabled:hover:translate-y-0"
                    onClick={() => setStep('method')}
                >
                    Continue to Payment
                    <FiArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
    const renderMethodStep = () => (
        <div className="p-8 sm:p-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Payment Method</h2>
                <p className="text-[13px] font-medium text-gray-500 mt-2">Select your preferred secure payment channel.</p>
            </div>

            <div className="grid gap-4">
                <button 
                    onClick={() => setSelectedMethod('paystack')}
                    className={`p-5 rounded-3xl border-3 flex items-center gap-5 transition-all text-left group ${
                        selectedMethod === 'paystack' 
                        ? 'border-[#8B0000] bg-red-50/50 dark:bg-red-900/10' 
                        : 'border-gray-100 hover:border-gray-200 dark:border-gray-700'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedMethod === 'paystack' ? 'bg-[#8B0000] text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                        <FiCreditCard className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-[13px] text-gray-900 dark:text-white capitalize tracking-tight">Card / USSD Checkout</span>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 rounded-full text-[8px] font-bold capitalize">Suggested</Badge>
                        </div>
                        <p className="text-[11px] text-gray-500 font-bold mt-1 tracking-tight">Pay instantly with Card, USSD, or Bank App</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMethod === 'paystack' ? 'border-[#8B0000]' : 'border-gray-200'
                    }`}>
                        {selectedMethod === 'paystack' && <FiCheck className="text-[#8B0000] w-4 h-4" />}
                    </div>
                </button>

                <button 
                    onClick={() => setSelectedMethod('bank')}
                    className={`p-5 rounded-3xl border-3 flex items-center gap-5 transition-all text-left group ${
                        selectedMethod === 'bank' 
                        ? 'border-[#8B0000] bg-red-50/50 dark:bg-red-900/10' 
                        : 'border-gray-100 hover:border-gray-200 dark:border-gray-700'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedMethod === 'bank' ? 'bg-[#8B0000] text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                        <Landmark className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-[13px] text-gray-900 dark:text-white capitalize tracking-tight">Bank transfer</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-bold mt-1 tracking-tight">Manual transfer to secretariat account</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMethod === 'bank' ? 'border-[#8B0000]' : 'border-gray-200'
                    }`}>
                        {selectedMethod === 'bank' && <FiCheck className="text-[#8B0000] w-4 h-4" />}
                    </div>
                </button>
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="plain" className="flex-1 font-black text-[11px] capitalize  hover:bg-gray-100" onClick={() => setStep('summary')}>Back</Button>
                <Button 
                    className="flex-3 bg-[#8B0000] hover:bg-white hover:text-[#8B0000] text-white font-bold h-14 rounded-2xl shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-3 capitalize px-8 text-[14px]"
                    onClick={handleProceedToPayment}
                >
                    Proceed to {selectedMethod === 'paystack' ? 'Checkout' : 'Instructions'}
                    <FiArrowRight />
                </Button>
            </div>
        </div>
    )

    const renderPaystackStep = () => (
        <div className="p-8 sm:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-4">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center relative border border-gray-100 dark:border-gray-700">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Paystack_Logo.png" alt="Paystack" className="w-12 h-auto opacity-90" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Secure Checkout</h2>
                    <p className="text-[12px] text-gray-500 font-bold max-w-xs mx-auto leading-relaxed mt-2 opacity-70">
                        Proceed to Paystack to complete your transaction of <span className="text-[#8B0000]">₦{currentTotalAmount.toLocaleString()}.00</span>
                    </p>
                </div>
            </div>

            <Card className="p-6 bg-[#8B0000] rounded-3xl text-white relative overflow-hidden group shadow-2xl shadow-[#8B0000]/30 transition-transform hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <h4 className="text-[10px] font-bold capitalize tracking-tight text-white/60 mb-2">Transaction ID</h4>
                    <span className="font-mono text-sm font-black tracking-tight mb-8">{activeTransactionRef || bankDetails.reference}</span>
                    
                    <div className="w-full space-y-3">
                        <Button 
                            block 
                            className="bg-white text-[#8B0000] hover:bg-red-50 border-none font-black h-14 rounded-2xl flex items-center justify-center gap-3 text-sm tracking-tight transition-all active:scale-95"
                            onClick={handlePaystackCheckout}
                            loading={loading}
                        >
                            Pay ₦{currentTotalAmount.toLocaleString()} now
                        </Button>

                        {/* Redirect Fallback if popup fails */}
                        {paymentUrl && (
                            <a 
                                href={paymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-center text-[10px] font-black text-white/70 hover:text-white underline uppercase tracking-widest mt-2"
                            >
                                Payment window didn't open? Click here
                            </a>
                        )}
                    </div>
                </div>
            </Card>

            <div className="flex flex-col items-center gap-4 text-gray-400">
                 <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-gray-200"></div>
                    <div className="p-1 px-3 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[9px] font-bold capitalize tracking-tight">Secure server</span>
                    </div>
                    <div className="h-px w-8 bg-gray-200"></div>
                 </div>
                 <Button variant="plain" onClick={() => setStep('method')} className="text-[10px] uppercase font-black tracking-widest opacity-60 hover:opacity-100">Cancel and change method</Button>
            </div>
        </div>
    )

    const renderBankStep = () => (
        <div className="p-8 sm:p-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Bank Transfer</h2>
                <p className="text-[13px] font-medium text-gray-500 mt-2">Transfer exact amount to the account below.</p>
            </div>

            <Card className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl space-y-8">
                <div className="grid gap-6">
                    <div className="space-y-1 cursor-pointer group" onClick={() => handleCopy(bankDetails.accountNumber)}>
                        <h4 className="text-[10px] font-bold text-gray-400 capitalize tracking-tight flex items-center gap-1">Account number <FiCopy className="opacity-0 group-hover:opacity-100 transition-opacity" /></h4>
                        <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
                            {bankDetails.accountNumber}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-gray-400 capitalize tracking-tight">Bank name</h4>
                            <p className="text-sm font-black text-gray-900 dark:text-white">{bankDetails.bankName}</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-bold text-gray-400 capitalize tracking-tight">Amount</h4>
                            <p className="text-sm font-black text-[#8B0000]">₦{currentTotalAmount.toLocaleString()}.00</p>
                        </div>
                    </div>
                    <div className="space-y-1 cursor-pointer group" onClick={() => handleCopy(bankDetails.reference)}>
                        <h4 className="text-[10px] font-bold text-gray-400 capitalize tracking-tight flex items-center gap-1">Payment Reference <FiCopy className="opacity-0 group-hover:opacity-100 transition-opacity" /></h4>
                        <code className="text-[13px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2.5 rounded-2xl block border border-blue-100/50">
                            {bankDetails.reference}
                        </code>
                        <p className="text-[9px] font-bold text-gray-400 mt-2 capitalize tracking-tight italic">Include this reference in your transfer narration</p>
                    </div>
                </div>
            </Card>

            <Alert showIcon className="bg-amber-50/50 border-amber-100 text-amber-800 rounded-3xl border flex items-center p-5">
                <p className="text-[10px] font-bold leading-relaxed px-2">
                    <span className="block font-bold capitalize text-amber-900 mb-1">Important:</span> 
                    Manual transfers may take up to 48 hours for verification. Please upload receipt or contact secretariat if dues status does not update.
                </p>
            </Alert>

            <div className="flex gap-4">
                <Button variant="plain" block className="rounded-2xl h-14 font-bold capitalize text-[14px]" onClick={() => setStep('method')}>Back</Button>
                <Button 
                    variant="solid" 
                    block 
                    className="bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white rounded-2xl h-14 font-bold capitalize text-[14px] border-none shadow-lg"
                    onClick={() => {
                        toast.push(
                            <Notification title="Confirmed" type="info">
                                We will verify your transfer shortly.
                            </Notification>
                        )
                        onClose()
                    }}
                >
                    I have transferred
                </Button>
            </div>
        </div>
    )

    const renderProcessingStep = () => (
        <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-[#0055BA]/10 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-24 h-24 border-4 border-[#0055BA] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">Processing payment</h3>
                <p className="text-sm text-gray-500 font-bold max-w-xs mx-auto animate-pulse opacity-70">Securing your payment via Paystack tunnel. Please do not close this window.</p>
            </div>
        </div>
    )

    const renderSuccessStep = () => (
        <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-full flex items-center justify-center relative">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Payment Successful!</h2>
                <p className="text-[13px] font-medium text-gray-500 mt-2 max-w-xs mx-auto">Your dues have been reconciled. Receipts will be sent shortly.</p>
            </div>
            <Card className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl w-full border border-emerald-100 dark:border-emerald-800/30 shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] font-bold text-emerald-700/60 capitalize tracking-tight">Status Update</p>
                    <p className="text-xs font-black text-gray-900 dark:text-white">Account Status: ACTIVE</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 py-1 text-[9px] font-black uppercase">PAID</Badge>
            </Card>
            <div className="flex gap-4 w-full pt-4">
                <Button block variant="plain" className="flex-1 rounded-2xl h-14 font-black text-[11px] capitalize  text-emerald-700 bg-emerald-50 hover:bg-emerald-100" onClick={onViewInvoice}>View Invoice</Button>
                <Button block className="flex-1 bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white rounded-2xl h-14 font-black text-[11px] capitalize  shadow-xl border-none transition-all" onClick={() => { onClose(); window.location.reload(); }}>Go to dashboard</Button>
            </div>
        </div>
    )

    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose} 
            width={580}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
            <div className="relative overflow-x-hidden min-h-[550px] flex flex-col">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-20 group"
                >
                    <FiX className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </button>

                <div className="flex-1 flex flex-col justify-center">
                    {step === 'summary' && renderSummaryStep()}
                    {step === 'method' && renderMethodStep()}
                    {step === 'paystack' && renderPaystackStep()}
                    {step === 'bank' && renderBankStep()}
                    {step === 'processing' && renderProcessingStep()}
                    {step === 'success' && renderSuccessStep()}
                </div>
            </div>
        </Dialog>
    )
}

export default PaymentModal
