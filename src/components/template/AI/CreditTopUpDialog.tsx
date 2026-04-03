'use client'

/**
 * Credit Top-Up Dialog with Bank Transfer Support
 *
 * Handles the complete top-up flow:
 * 1. Select amount
 * 2. Choose payment method (Bank Transfer focus)
 * 3. Show transfer instructions
 * 4. Track payment status
 * 5. Confirm and update credits
 */

import { useState } from 'react'
import { Dialog, Button, Input, Card, Alert, Badge, Progress } from '@/components/ui'
import { useCreditTopUp } from '@/hooks/useAIEngine'
import type { CreditTopUpRequest, PendingTopUp } from '@/@types/aiEngine'
import { FiCheck, FiCopy, FiAlertCircle, FiClock, FiDollarSign } from 'react-icons/fi'

interface CreditTopUpDialogProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

const EXCHANGE_RATE = 25 // ₦25 = 1 AI Credit

const PRESET_AMOUNTS = [
    { naira: 500, bonus: 0 },
    { naira: 1000, bonus: 50 },
    { naira: 2500, bonus: 150 },
    { naira: 5000, bonus: 500 },
    { naira: 10000, bonus: 1200 },
]

const BANK_DETAILS = {
    bankName: 'Providus Bank',
    accountName: 'Qorebit Technologies',
    accountNumber: '1234567890',
}

type Step = 'amount' | 'payment' | 'instructions' | 'tracking'

export default function CreditTopUpDialog({
    isOpen,
    onClose,
    onSuccess,
}: CreditTopUpDialogProps) {
    const { initiateTopUp, pendingTopUps, isInitiating } = useCreditTopUp()
    const [step, setStep] = useState<Step>('amount')
    const [selectedAmount, setSelectedAmount] = useState<number>(1000)
    const [customAmount, setCustomAmount] = useState<string>('')
    const [paymentMethod, setPaymentMethod] = useState<'bank_transfer'>('bank_transfer')
    const [currentTopUp, setCurrentTopUp] = useState<PendingTopUp | null>(null)
    const [copied, setCopied] = useState(false)

    const calculatedCredits = Math.floor(selectedAmount / EXCHANGE_RATE)
    const bonus =
        PRESET_AMOUNTS.find((p) => p.naira === selectedAmount)?.bonus || 0
    const totalCredits = calculatedCredits + bonus

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount)
        setCustomAmount('')
    }

    const handleCustomAmountChange = (value: string) => {
        const numValue = parseInt(value) || 0
        setCustomAmount(value)
        setSelectedAmount(numValue)
    }

    const handleNext = () => {
        if (step === 'amount') {
            setStep('payment')
        } else if (step === 'payment') {
            handleInitiateTopUp()
        }
    }

    const handleInitiateTopUp = async () => {
        try {
            const request: CreditTopUpRequest = {
                amount: selectedAmount,
                paymentMethod,
            }

            const result = await initiateTopUp(request)
            setCurrentTopUp({
                id: result.id,
                amount: result.amount_naira,
                aiCreditsEquivalent: result.ai_credits,
                status: result.status.toUpperCase() as any,
                reference: result.payment_reference,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                paymentMethod: paymentMethod,
                accountNumber: result.account_number,
                bankName: result.bank_name,
                accountName: result.account_name,
                expiresAt: result.expires_at,
            })
            setStep('instructions')
        } catch (error: any) {
            console.error('Failed to initiate top-up:', error)
        }
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleClose = () => {
        setStep('amount')
        setSelectedAmount(1000)
        setCustomAmount('')
        setCurrentTopUp(null)
        onClose()
    }

    const renderAmountStep = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">How many credits do you need?</h3>
                <p className="text-sm text-gray-500">
                    Choose a pack below or enter your own amount
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {PRESET_AMOUNTS.map((preset) => {
                    const credits = Math.floor(preset.naira / EXCHANGE_RATE)
                    const total = credits + preset.bonus
                    const isSelected = selectedAmount === preset.naira

                    return (
                        <button
                            key={preset.naira}
                            onClick={() => handleAmountSelect(preset.naira)}
                            className={`
                                p-4 rounded-lg border-2 transition-all text-left
                                ${isSelected ? 'border-primary bg-primary-subtle' : 'border-gray-200 hover:border-primary-mild'}
                            `}
                        >
                            <div className="font-semibold text-lg">
                                ₦{preset.naira.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                                {total} AI Credits
                            </div>
                            {preset.bonus > 0 && (
                                <Badge
                                    className="mt-2"
                                    content={`+${preset.bonus} bonus`}
                                />
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="relative">
                <Input
                    type="number"
                    placeholder="Enter your own amount (₦)"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    prefix={<FiDollarSign />}
                    min={100}
                    step={100}
                />
            </div>

            {selectedAmount > 0 && (
                <Card className="bg-primary-subtle p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Amount:</span>
                        <span className="font-semibold">
                            ₦{selectedAmount.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">AI Credits:</span>
                        <span className="font-semibold">{calculatedCredits}</span>
                    </div>
                    {bonus > 0 && (
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">Bonus:</span>
                            <span className="font-semibold text-success">
                                +{bonus}
                            </span>
                        </div>
                    )}
                    <div className="border-t border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Total Credits:</span>
                            <span className="font-bold text-lg text-primary">
                                {totalCredits}
                            </span>
                        </div>
                    </div>
                </Card>
            )}

            <div className="flex gap-3">
                <Button onClick={handleClose} variant="plain" className="flex-1">
                    Cancel
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={selectedAmount < 100}
                    className="flex-1"
                >
                    Continue
                </Button>
            </div>
        </div>
    )

    const renderPaymentStep = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                <p className="text-sm text-gray-500">
                    Pick how to pay
                </p>
            </div>

            <div className="space-y-3">
                <button
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`
                        w-full p-4 rounded-lg border-2 transition-all text-left
                        ${paymentMethod === 'bank_transfer' ? 'border-primary bg-primary-subtle' : 'border-gray-200'}
                    `}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <FiDollarSign className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold">Bank Transfer</div>
                            <div className="text-sm text-gray-600">
                                Simple transfer from your bank app
                            </div>
                        </div>
                        {paymentMethod === 'bank_transfer' && (
                            <FiCheck className="text-primary" />
                        )}
                    </div>
                </button>
            </div>

            <div className="flex gap-3">
                <Button onClick={() => setStep('amount')} variant="plain" className="flex-1">
                    Back
                </Button>
                <Button onClick={handleNext} loading={isInitiating} className="flex-1">
                    {isInitiating ? 'Just a moment...' : 'Proceed'}
                </Button>
            </div>
        </div>
    )

    const renderInstructionsStep = () => (
        <div className="space-y-6">
            <Alert
                showIcon
                type="warning"
                title="Almost there! Complete your payment"
                className="mb-4"
            >
                Transfer the exact amount to the account below. Your credits will be
                added automatically once payment is confirmed.
            </Alert>

            <Card className="p-4 space-y-4">
                <div>
                    <div className="text-sm text-gray-500 mb-1">Bank Name</div>
                    <div className="flex justify-between items-center">
                        <div className="font-semibold">{BANK_DETAILS.bankName}</div>
                        <Button
                            size="xs"
                            variant="plain"
                            onClick={() => handleCopy(BANK_DETAILS.bankName)}
                            icon={<FiCopy />}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                </div>

                <div>
                    <div className="text-sm text-gray-500 mb-1">Account Name</div>
                    <div className="flex justify-between items-center">
                        <div className="font-semibold">{BANK_DETAILS.accountName}</div>
                        <Button
                            size="xs"
                            variant="plain"
                            onClick={() => handleCopy(BANK_DETAILS.accountName)}
                            icon={<FiCopy />}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                </div>

                <div>
                    <div className="text-sm text-gray-500 mb-1">Account Number</div>
                    <div className="flex justify-between items-center">
                        <div className="font-semibold text-lg">
                            {BANK_DETAILS.accountNumber}
                        </div>
                        <Button
                            size="xs"
                            variant="plain"
                            onClick={() => handleCopy(BANK_DETAILS.accountNumber)}
                            icon={<FiCopy />}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                </div>

                <div className="border-t border-gray-300 pt-4 mt-4">
                    <div className="text-sm text-gray-500 mb-1">Amount to Transfer</div>
                    <div className="font-bold text-2xl text-primary">
                        ₦{selectedAmount.toLocaleString()}
                    </div>
                </div>

                {currentTopUp && (
                    <div className="border-t border-gray-300 pt-4 mt-4">
                        <div className="text-sm text-gray-500 mb-1">
                            Payment Code / Note
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="font-mono text-sm">
                                {currentTopUp.reference}
                            </div>
                            <Button
                                size="xs"
                                variant="plain"
                                onClick={() => handleCopy(currentTopUp.reference)}
                                icon={<FiCopy />}
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            <Button onClick={() => setStep('tracking')} className="w-full">
                I've Sent the Money
            </Button>
        </div>
    )

    const renderTrackingStep = () => {
        const status = currentTopUp?.status || 'PENDING'

        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div
                        className={`
                        w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center
                        ${status === 'COMPLETED' ? 'bg-success-subtle' : 'bg-warning-subtle'}
                    `}
                    >
                        {status === 'COMPLETED' ? (
                            <FiCheck className="w-8 h-8 text-success" />
                        ) : (
                            <FiClock className="w-8 h-8 text-warning" />
                        )}
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                        {status === 'COMPLETED'
                            ? 'Payment Confirmed!'
                            : status === 'FAILED'
                                ? 'Payment Failed'
                                : 'Checking your payment...'}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {status === 'COMPLETED'
                            ? 'Your credits have been added to your account'
                            : status === 'FAILED'
                                ? 'Please try again or contact support'
                                : 'We are verifying your bank transfer. This usually takes 2-5 minutes.'}
                    </p>
                </div>

                {status === 'PENDING' && (
                    <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                            We're confirming your payment...
                        </div>
                        <Progress percent={45} showInfo={false} />
                    </div>
                )}

                {currentTopUp && (
                    <Card className="p-4 bg-gray-50">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Amount:</span>
                                <span className="font-semibold">
                                    ₦{currentTopUp.amount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">AI Credits:</span>
                                <span className="font-semibold">
                                    {currentTopUp.aiCreditsEquivalent}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Code:</span>
                                <span className="font-mono text-xs">
                                    {currentTopUp.reference}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <Badge
                                    content={status}
                                    className={
                                        status === 'COMPLETED'
                                            ? 'bg-success-subtle text-success'
                                            : status === 'FAILED'
                                                ? 'bg-error-subtle text-error'
                                                : 'bg-warning-subtle text-warning'
                                    }
                                />
                            </div>
                        </div>
                    </Card>
                )}

                {status === 'PENDING' && (
                    <Alert
                        showIcon
                        type="info"
                        title="What's Next?"
                    >
                        Keep this window open or check back later. You'll receive a
                        notification once your payment is confirmed.
                    </Alert>
                )}

                <div className="flex gap-3">
                    {status === 'COMPLETED' ? (
                        <Button
                            onClick={() => {
                                handleClose()
                                onSuccess?.()
                            }}
                            className="w-full"
                        >
                            Done
                        </Button>
                    ) : status === 'FAILED' ? (
                        <>
                            <Button onClick={handleClose} variant="plain" className="flex-1">
                                Cancel
                            </Button>
                            <Button
                                onClick={() => setStep('amount')}
                                className="flex-1"
                            >
                                Try Again
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleClose} variant="plain" className="w-full">
                            Close
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} width={480}>
            <div className="p-6">
                {step === 'amount' && renderAmountStep()}
                {step === 'payment' && renderPaymentStep()}
                {step === 'instructions' && renderInstructionsStep()}
                {step === 'tracking' && renderTrackingStep()}
            </div>
        </Dialog>
    )
}
