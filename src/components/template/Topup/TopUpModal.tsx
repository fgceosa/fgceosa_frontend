'use client'

import { useEffect, useState, useCallback } from 'react'
import { Copy, Zap, Star, Check, Loader2, AlertCircle, Coins, CreditCard, X, Banknote } from 'lucide-react'
import { Button, Dialog, Input, Notification, toast } from '@/components/ui'
import { TbCheck } from 'react-icons/tb'
import { AIEngineService } from '@/services/AIEngineService'
import BuyAICreditModal, { PaymentMethod } from './BuyAICreditModal'
import classNames from '@/utils/classNames'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { selectPlatformSettingsData } from '@/store/slices/platformSettings'
import { fetchPublicPlatformSettings } from '@/store/slices/platformSettings/platformSettingsThunk'
import { creditPlans as globalCreditPlans } from '@/mock/billing'
import { NAIRA_TO_USD_RATE } from '@/constants/currency.constant'

import { selectCurrentOrganizationId } from '@/store/slices/organization/organizationSelectors'
import { selectCurrentWorkspace } from '@/store/slices/workspace/workspaceSelectors'
import { triggerWalletRefresh } from '@/hooks/useWalletRedux'
import { useUserAuthorities } from '@/utils/hooks/useAuthorization'

interface TopUpModalProps {
    isOpen: boolean
    onClose: () => void
    initialStep?: 'select' | 'payment-method' | 'payment' | 'confirm'
    presetAmount?: number
    presetPlanId?: string
    workspaceId?: string
    organizationId?: string
}

interface TopUpData {
    id: string
    amount_naira: number
    ai_credits: number
    status: string
    payment_reference: string
    account_number: string
    bank_name: string
    account_name: string
    expires_at: string
    provider: string
    message: string
}

const creditPlans = globalCreditPlans

export default function TopUpModal({
    isOpen,
    onClose,
    initialStep,
    presetAmount,
    presetPlanId,
    workspaceId: propWorkspaceId,
    organizationId: propOrganizationId,
}: TopUpModalProps) {
    const dispatch = useAppDispatch()

    const combinedAuthorities = useUserAuthorities()
    const isOrgSuperAdmin = combinedAuthorities.includes('org_super_admin') || combinedAuthorities.includes('platform_super_admin')

    // Fallback to current context from bridge/store if not directly passed as props
    const currentOrgId = useAppSelector(selectCurrentOrganizationId)
    const currentOrg = useAppSelector((state: any) => state.organization?.currentOrganization)
    const currentWorkspace = useAppSelector(selectCurrentWorkspace)

    // Robust ID resolution: ensure we have a valid string or undefined (NEVER null which Axios sends)
    const getSafeId = (val: any) => (val && val !== 'null' ? String(val) : undefined)

    const organizationId = getSafeId(propOrganizationId || currentOrgId || currentOrg?.id)
    const workspaceId = isOrgSuperAdmin ? undefined : getSafeId(propWorkspaceId || currentWorkspace?.id)

    const [step, setStep] = useState<'select' | 'payment-method' | 'payment' | 'confirm'>(
        initialStep ?? 'select',
    )
    const [selectedPlan, setSelectedPlan] = useState<string>('')
    const [customAmount, setCustomAmount] = useState<string>('')
    const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false)

    // Monnify bank transfer state
    const [isLoading, setIsLoading] = useState(false)
    const [topUpData, setTopUpData] = useState<TopUpData | null>(null)
    const [copiedField, setCopiedField] = useState<string | null>(null)
    const [isPolling, setIsPolling] = useState(false)
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (isOpen) {
            setStep(initialStep ?? 'select')
            setSelectedPlan(presetPlanId ?? '')
            setCustomAmount(presetAmount ? String(presetAmount) : '')
            setShowPaymentMethodModal(false)
            dispatch(fetchPublicPlatformSettings())
        }
    }, [isOpen, initialStep, presetPlanId, presetAmount, dispatch])

    const handlePlanSelect = (planId: string) => {
        setSelectedPlan(planId)
        setCustomAmount('')
    }

    const handleCustomAmountChange = (value: string) => {
        setCustomAmount(value)
        setSelectedPlan('')
    }


    // Poll for payment status
    const startPolling = useCallback((topUpId: string) => {
        setIsPolling(true)

        const interval = setInterval(async () => {
            try {
                const status = await AIEngineService.checkTopUpStatus(topUpId)

                if (status.status === 'COMPLETED') {
                    clearInterval(interval)
                    setPollingInterval(null)
                    setIsPolling(false)
                    setStep('confirm')

                    // Trigger global refresh so sidebar/topbar update immediately
                    triggerWalletRefresh()

                    toast.push(
                        <Notification title="Payment Successful" type="success">
                            {status.ai_credits} AI credits have been added to your account
                        </Notification>
                    )
                } else if (status.status === 'FAILED' || status.status === 'EXPIRED') {
                    clearInterval(interval)
                    setPollingInterval(null)
                    setIsPolling(false)

                    toast.push(
                        <Notification title="Payment Failed" type="danger">
                            {status.status === 'EXPIRED'
                                ? 'Payment expired. Please try again.'
                                : 'Payment failed. Please try again.'}
                        </Notification>
                    )
                }
            } catch (error) {
                console.error('Failed to check payment status:', error)
            }
        }, 10000) // Poll every 10 seconds

        setPollingInterval(interval)
    }, [])

    const platformSettings = useAppSelector(selectPlatformSettingsData)
    const minAmount = platformSettings?.payments?.minCreditAmount || 1000
    const exchangeRate = platformSettings?.payments?.nairaToCreditRate || NAIRA_TO_USD_RATE

    const selectedPlanData = creditPlans.find(
        (plan) =>
            plan.id === (selectedPlan || presetPlanId) ||
            plan.name === (selectedPlan || presetPlanId),
    )

    const customCredits = customAmount
        ? Math.floor((Number(customAmount) / exchangeRate) * 100) / 100
        : 0
    const displayCredits = selectedPlanData
        ? selectedPlanData.credits + selectedPlanData.bonus
        : customCredits

    // Initiate top-up with Monnify
    const initiateTopUp = useCallback(async () => {
        const amount = presetAmount || selectedPlanData?.amount || Number(customAmount)

        if (!amount || amount <= 0) {
            toast.push(
                <Notification title="Error" type="danger">
                    Please select a valid amount
                </Notification>
            )
            return
        }

        if (amount < minAmount) {
            toast.push(
                <Notification title="Min. Purchase" type="danger">
                    Minimum purchase amount is ₦{minAmount.toLocaleString()}
                </Notification>
            )
            return
        }

        try {
            setIsLoading(true)
            console.log(`[TopUp] Initiating top-up. OrgID: ${organizationId}, WSID: ${workspaceId}, Amount: ${amount}`)
            const response = await AIEngineService.initiateTopUp({
                amount,
                paymentMethod: 'bank_transfer',
                workspaceId,
                organizationId,
            })

            setTopUpData(response)
            startPolling(response.id)

            toast.push(
                <Notification title="Success" type="success">
                    Bank transfer details generated
                </Notification>
            )
        } catch (error: any) {
            console.error('Failed to initiate top-up:', error)
            toast.push(
                <Notification title="Error" type="danger">
                    {error?.response?.data?.detail || 'Failed to generate bank transfer details'}
                </Notification>
            )
        } finally {
            setIsLoading(false)
        }
    }, [selectedPlanData, presetAmount, customAmount, startPolling, minAmount, workspaceId, organizationId])

    // Auto-initiate top-up when opening directly to payment step with preset values
    useEffect(() => {
        if (isOpen && initialStep === 'payment' && !topUpData && !isLoading) {
            if (presetPlanId || presetAmount) {
                initiateTopUp()
            }
        }
    }, [isOpen, initialStep, presetPlanId, presetAmount, topUpData, isLoading, initiateTopUp])

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval)
            }
        }
    }, [pollingInterval])

    // Copy to clipboard
    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)

        toast.push(
            <Notification title="Copied" type="success">
                {field} copied to clipboard
            </Notification>
        )
    }

    const proceedToPayment = () => {
        const amount = presetAmount || selectedPlanData?.amount || Number(customAmount)

        if (amount < minAmount) {
            toast.push(
                <Notification title="Min. Purchase" type="danger">
                    Minimum purchase amount is ₦{minAmount.toLocaleString()}
                </Notification>
            )
            return
        }

        if (selectedPlan || customAmount || presetPlanId || presetAmount) {
            setShowPaymentMethodModal(true)
        }
    }

    const handlePaymentMethodSelect = async (method: PaymentMethod) => {
        setShowPaymentMethodModal(false)
        if (method === 'bank_transfer') {
            setStep('payment')
            await initiateTopUp()
        }
        // Future: Handle card and crypto payment methods
    }

    const resetModal = () => {
        const isSuccess = step === 'confirm'
        setStep('select')
        setSelectedPlan('')
        setCustomAmount('')
        setTopUpData(null)
        setIsLoading(false)
        setIsPolling(false)
        setShowPaymentMethodModal(false)
        if (pollingInterval) {
            clearInterval(pollingInterval)
            setPollingInterval(null)
        }
        onClose()
    }

    // Calculate amount and credits for the payment method modal
    const currentAmount = presetAmount || selectedPlanData?.amount || Number(customAmount) || 0
    const currentCredits = selectedPlanData
        ? selectedPlanData.credits + selectedPlanData.bonus
        : customCredits
    return (
        <Dialog
            isOpen={isOpen}
            onClose={resetModal}
            width={720}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative flex flex-col min-h-[500px]">
                {/* Header Information - Dynamic based on step */}
                <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10 shrink-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm border border-primary/20 shrink-0">
                            {step === 'select' && <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                            {step === 'payment' && <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                            {step === 'confirm' && <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />}
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                {step === 'select' && 'Add Credits'}
                                {step === 'payment' && 'Pay with Bank Transfer'}
                                {step === 'confirm' && 'Payment Successful'}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={classNames(
                                    "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                                    (organizationId || isOrgSuperAdmin)
                                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                        : "bg-primary/5 text-primary border-primary/10"
                                )}>
                                    {(organizationId || isOrgSuperAdmin) ? 'Organization Account' : 'Personal Account'}
                                </span>
                                <span className="text-[10px] font-black text-gray-400">
                                    {isOrgSuperAdmin && !organizationId ? (
                                        <span className="text-amber-500 animate-pulse">Loading Organization context...</span>
                                    ) : (
                                        <>
                                            {step === 'select' && 'Get credits immediately'}
                                            {step === 'payment' && 'Follow the instructions below'}
                                            {step === 'confirm' && 'Credits added to your account'}
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    {!isLoading && !isPolling && (
                        <button
                            onClick={resetModal}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group shrink-0"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    )}
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto max-h-[60vh] custom-scrollbar px-5 sm:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6">
                    {step === 'select' && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pl-1">
                                    <Zap className="w-3.5 h-3.5 text-primary" />
                                    <h4 className="text-[10px] font-black text-gray-900 dark:text-gray-100">Choose a Credit Pack</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {creditPlans.filter(p => p.amount >= minAmount).map((plan) => (
                                        <button
                                            key={plan.id}
                                            onClick={() => handlePlanSelect(plan.id)}
                                            className={classNames(
                                                "relative flex flex-col p-5 rounded-2xl transition-all duration-300 text-left border overflow-hidden",
                                                selectedPlan === plan.id
                                                    ? "bg-primary/5 border-primary shadow-lg shadow-primary/10"
                                                    : "bg-gray-50/50 hover:bg-gray-50 border-gray-100 dark:bg-gray-800/40 dark:border-gray-800"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-black text-gray-900 dark:text-white tracking-tight">
                                                    {plan.name}
                                                </span>
                                                {plan.popular && (
                                                    <span className="flex items-center gap-1 bg-primary px-2 py-0.5 rounded-full text-[8px] font-black text-white">
                                                        <Star className="w-2.5 h-2.5 fill-white" />
                                                        Most Popular
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-baseline gap-2 mb-2">
                                                <span className="text-2xl font-black text-primary">
                                                    ₦{plan.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                                                {plan.description}
                                            </p>
                                                <div className="flex items-center gap-2 mt-auto">
                                                    <div className="px-2 py-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 text-[10px] font-black text-gray-900 dark:text-white">
                                                        {plan.credits + plan.bonus} Credits
                                                    </div>
                                                    {plan.bonus > 0 && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[9px] font-black text-emerald-500">
                                                                +{plan.bonus} Bonus
                                                            </span>
                                                            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-[8px] font-black tracking-tighter">
                                                                {Math.round((plan.bonus / plan.credits) * 100)}% EXTRA
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            {selectedPlan === plan.id && (
                                                <div className="absolute top-4 right-4 text-primary">
                                                    <TbCheck className="w-5 h-5" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pl-1">
                                    <Banknote className="w-3.5 h-3.5 text-primary" />
                                    <h4 className="text-[10px] font-black text-gray-900 dark:text-gray-100">Or enter a custom amount</h4>
                                </div>
                                <div className="grid md:grid-cols-5 gap-4">
                                    <div className="md:col-span-3 space-y-2">
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                placeholder={`Min. ₦${minAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                                value={customAmount}
                                                onChange={(e) => handleCustomAmountChange(e.target.value)}
                                                className={classNames(
                                                    "text-base sm:text-lg font-black h-14 sm:h-16 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl sm:rounded-2xl border-none focus:ring-4 transition-all pl-4 sm:pl-6 pr-14 sm:pr-16 placeholder:text-[13px] sm:placeholder:text-sm shadow-inner",
                                                    customAmount && Number(customAmount) < minAmount
                                                        ? "focus:ring-rose-500/10 text-rose-500"
                                                        : "focus:ring-primary/5"
                                                )}
                                            />
                                            <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 font-black text-[10px] sm:text-xs text-gray-400 pointer-events-none">NGN</span>
                                        </div>
                                        {customAmount && Number(customAmount) < minAmount && (
                                            <p className="text-[10px] font-bold text-rose-500 pl-2">
                                                Minimum amount required is ₦{minAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl sm:rounded-2xl border border-primary/10 flex flex-col justify-center gap-1 transition-all h-full min-h-[56px] sm:min-h-[64px]">
                                        <span className="text-[9px] font-black text-primary">Selected Credits</span>
                                        <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-none">
                                            {displayCredits > 0 ? displayCredits.toLocaleString() : '0'} <span className="text-[10px] sm:text-xs text-gray-400">Credits</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'payment' && (
                        <div className="space-y-6">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <CreditCard className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-gray-900 dark:text-white">Setting up your payment...</p>
                                </div>
                            ) : topUpData && topUpData.account_number ? (
                                <div className="space-y-6">
                                    <div className="p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl space-y-3">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-amber-600" />
                                            <span className="text-[10px] font-black text-amber-600 italic">Important Notice</span>
                                        </div>
                                        <p className="text-xs font-bold text-amber-800 dark:text-amber-400 leading-relaxed">
                                            Please transfer exactly <span className="text-sm font-black underline decoration-2 underline-offset-4">₦{topUpData.amount_naira.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> to the bank account details shown below.
                                            Your credits will be added to your account automatically once the payment is confirmed.
                                        </p>
                                    </div>

                                    <div className="grid gap-3">
                                        <div className="flex items-center gap-2 pl-1 mb-1">
                                            <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                                            <h4 className="text-[10px] font-black text-gray-900 dark:text-gray-100">Bank Account Details</h4>
                                        </div>

                                        {[
                                            { label: 'Bank Name', value: topUpData.bank_name, field: 'bank' },
                                            { label: 'Account Name', value: topUpData.account_name, field: 'account_name' },
                                            { label: 'Account Number', value: topUpData.account_number, field: 'account', primary: true },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 group hover:bg-white dark:hover:bg-gray-800 transition-all">
                                                <div>
                                                    <span className="text-[9px] font-black text-gray-400">{item.label}</span>
                                                    <p className={classNames(
                                                        "font-black tracking-tight",
                                                        item.primary ? "text-xl text-primary" : "text-sm text-gray-900 dark:text-white"
                                                    )}>{item.value}</p>
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(item.value || '', item.field)}
                                                    className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                                >
                                                    {copiedField === item.field ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {isPolling && (
                                        <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/20">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-gray-900 dark:text-white">Waiting for your payment...</p>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full mt-2 overflow-hidden">
                                                    <div className="bg-primary h-full animate-shimmer" style={{ width: '40%' }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                                    <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center">
                                        <AlertCircle className="w-8 h-8 text-rose-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 dark:text-white">Something went wrong</h4>
                                        <p className="text-xs text-gray-500 mt-1">We couldn't set up the payment. Please try again.</p>
                                    </div>
                                    <Button variant="solid" onClick={() => setStep('select')} className="h-11 px-8 rounded-xl font-black text-[10px] mt-4">
                                        Try Again
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'confirm' && (
                        <div className="flex flex-col items-center justify-center py-10 gap-8 text-center">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                                        <Check className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 w-10 h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
                                    <Zap className="w-6 h-6 text-emerald-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight italic">Credits received!</h4>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 max-w-sm">
                                    Payment confirmed! Your account has been updated with your new AI credits.
                                </p>
                            </div>

                            <div className="w-full bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                <span className="text-[10px] font-black text-gray-400">Total Credits Added</span>
                                <div className="text-4xl font-black text-primary mt-2 flex items-center justify-center gap-3">
                                    {selectedPlanData
                                        ? selectedPlanData.credits + selectedPlanData.bonus
                                        : customCredits}
                                    <span className="text-xs text-gray-400 font-bold mt-1">Credits</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="px-5 sm:px-8 pb-5 sm:pb-8 pt-4 sm:pt-6 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 shrink-0 mt-auto bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800">
                    <Button
                        variant="plain"
                        onClick={step === 'payment' ? () => setStep('select') : resetModal}
                        disabled={isLoading || (isPolling && step === 'payment')}
                        className="w-full sm:flex-1 h-14 sm:h-16 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800 text-sm sm:text-base font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shrink-0"
                    >
                        {step === 'payment' ? 'Back' : 'Cancel'}
                    </Button>

                    <div className="flex flex-col gap-3 sm:gap-4 w-full sm:flex-[2.5]">
                        {step === 'select' && (
                            <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-full border border-gray-100 dark:border-gray-800 w-fit mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <Zap className="w-3 h-3 text-primary" />
                                <span className="text-[9px] font-black text-gray-400">
                                    Conversion: <span className="text-gray-900 dark:text-white">1 AI Credit = ₦{exchangeRate.toLocaleString()}</span>
                                </span>
                            </div>
                        )}

                        {step !== 'confirm' ? (
                            <Button
                                variant="solid"
                                onClick={step === 'select' ? proceedToPayment : resetModal}
                                disabled={(step === 'select' && !selectedPlan && !customAmount && !presetPlanId && !presetAmount) || (isOrgSuperAdmin && !organizationId)}
                                loading={isLoading}
                                className="w-full h-16 sm:h-20 bg-primary hover:bg-primary-deep text-white font-black text-lg sm:text-xl rounded-xl sm:rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 sm:gap-4 group disabled:opacity-50"
                            >
                                {step === 'select' ? (
                                    <>
                                        <span>Continue To Payment</span>
                                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-125 group-hover:rotate-12" />
                                    </>
                                ) : (
                                    <>
                                        <span>{isPolling ? 'Checking...' : "I've sent the money"}</span>
                                        <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                variant="solid"
                                onClick={resetModal}
                                className="w-full h-16 sm:h-20 bg-[#0055BA] hover:bg-[#004494] text-white font-black text-lg sm:text-xl rounded-xl sm:rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                Return to Dashboard
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <BuyAICreditModal
                isOpen={showPaymentMethodModal}
                onClose={() => setShowPaymentMethodModal(false)}
                onSelectMethod={handlePaymentMethodSelect}
                amount={currentAmount}
                credits={currentCredits}
            />
        </Dialog>
    )
}
