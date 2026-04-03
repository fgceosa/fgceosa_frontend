'use client'

import { useEffect, useState, useCallback } from 'react'
import Card from '@/components/ui/Card/Card'
import { Building2, Copy, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import { AIEngineService } from '@/services/AIEngineService'

interface BankAccount {
    accountNumber: string
    bankName: string
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

interface BankTransferModalProps {
    isOpen: boolean
    onClose: () => void
    amount: number // Amount in Naira
    organizationId?: string
    workspaceId?: string
}

export default function BankTransferModal({
    isOpen,
    onClose,
    amount,
    organizationId,
    workspaceId,
}: BankTransferModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [topUpData, setTopUpData] = useState<TopUpData | null>(null)
    const [copiedField, setCopiedField] = useState<string | null>(null)
    const [isPolling, setIsPolling] = useState(false)
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

    // Initialize top-up when modal opens
    useEffect(() => {
        if (isOpen && amount > 0) {
            initiateTopUp()
        }
        return () => {
            // Cleanup polling on unmount
            if (pollingInterval) {
                clearInterval(pollingInterval)
            }
        }
    }, [isOpen, amount])

    const initiateTopUp = async () => {
        setIsLoading(true)
        try {
            const response = await AIEngineService.initiateTopUp({
                amount,
                paymentMethod: 'bank_transfer',
                organizationId,
                workspaceId,
            })
            setTopUpData(response)
            // Start polling for payment status
            startPolling(response.id)
        } catch (error: any) {
            toast.push(
                <Notification type="danger" title="Error">
                    {error.message || 'Failed to start your payment'}
                </Notification>,
            )
            onClose()
        } finally {
            setIsLoading(false)
        }
    }

    const startPolling = useCallback((topUpId: string) => {
        setIsPolling(true)
        // Poll every 10 seconds
        const interval = setInterval(async () => {
            try {
                const status = await AIEngineService.checkTopUpStatus(topUpId)

                if (status.status === 'COMPLETED') {
                    setIsPolling(false)
                    if (pollingInterval) clearInterval(pollingInterval)
                    toast.push(
                        <Notification type="success" title="Payment Received!">
                            {status.ai_credits} AI credits have been added to your account
                        </Notification>,
                    )
                    // Refresh balance and close after delay
                    setTimeout(() => {
                        window.location.reload() // Or use a state management solution
                    }, 2000)
                } else if (status.status === 'FAILED' || status.status === 'EXPIRED') {
                    setIsPolling(false)
                    if (pollingInterval) clearInterval(pollingInterval)
                    toast.push(
                        <Notification type="danger" title="Payment Failed">
                            {status.status === 'EXPIRED'
                                ? 'Payment reference has expired. Please try again.'
                                : 'Payment failed. Please contact support.'}
                        </Notification>,
                    )
                }
            } catch (error) {
                console.error('Error polling status:', error)
            }
        }, 10000) // 10 seconds

        setPollingInterval(interval)
    }, [pollingInterval])

    const handleCopy = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedField(field)
            setTimeout(() => setCopiedField(null), 2000)
            toast.push(
                <Notification type="success" title="Copied!">
                    {field} copied to clipboard
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to copy to clipboard
                </Notification>,
            )
        }
    }

    const formatExpiryTime = (expiresAt: string) => {
        const expiry = new Date(expiresAt)
        const now = new Date()
        const diff = expiry.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        if (diff < 0) return 'Expired'
        if (hours > 0) return `${hours}h ${minutes}m remaining`
        return `${minutes}m remaining`
    }

    const resetAndClose = () => {
        if (pollingInterval) {
            clearInterval(pollingInterval)
        }
        setTopUpData(null)
        setIsPolling(false)
        onClose()
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={resetAndClose}
            closable={!isLoading}
            width={600}
            height="auto"
            className="max-w-[95vw] sm:max-w-[600px]"
        >
            <div className="max-h-[85vh] overflow-y-auto px-4 py-5">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p className="text-gray-600">Setting up payment...</p>
                    </div>
                ) : topUpData ? (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                <Building2 className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <h3 className="text-2xl font-semibold">
                                    Pay with Bank Transfer
                                </h3>
                                {topUpData.provider && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 capitalize">
                                        {topUpData.provider}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600">
                                Transfer the exact amount to the account details below
                            </p>
                        </div>

                        {/* Alert */}
                        <Card className="bg-blue-50 border-blue-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-900 space-y-1">
                                    <p className="font-semibold">Important:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>A special account just for this payment</li>
                                        <li>Send the exact amount shown above</li>
                                        <li>Wait! We'll confirm your payment automatically</li>
                                        <li>This payment code lasts for 24 hours</li>
                                    </ul>
                                </div>
                            </div>
                        </Card>

                        {/* Amount to Pay */}
                        <Card bordered className="bg-gradient-to-br from-primary/5 to-primary/10">
                            <div className="text-center py-4">
                                <p className="text-gray-600 mb-2">Total to Send</p>
                                <h2 className="text-4xl font-bold text-primary">
                                    ₦{topUpData.amount_naira.toLocaleString()}
                                </h2>
                                <p className="text-gray-600 mt-2">
                                    ≈ {topUpData.ai_credits.toLocaleString()} AI Credits
                                </p>
                            </div>
                        </Card>

                        {/* Bank Details */}
                        <Card bordered header={{
                            content: <h4 className="font-semibold">Where to send money</h4>
                        }}>
                            <div className="space-y-4">
                                {/* Account Number */}
                                <div>
                                    <label className="text-sm text-gray-600 block mb-2">
                                        Account Number
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <span className="text-lg font-mono font-semibold">
                                                {topUpData.account_number || 'Loading...'}
                                            </span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            onClick={() =>
                                                handleCopy(
                                                    topUpData.account_number || '',
                                                    'Account Number',
                                                )
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            {copiedField === 'Account Number' ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Bank Name */}
                                <div>
                                    <label className="text-sm text-gray-600 block mb-2">
                                        Bank Name
                                    </label>
                                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <span className="font-semibold">
                                            {topUpData.bank_name || 'Loading...'}
                                        </span>
                                    </div>
                                </div>

                                {/* Account Name */}
                                <div>
                                    <label className="text-sm text-gray-600 block mb-2">
                                        Account Name
                                    </label>
                                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <span className="font-semibold">
                                            {topUpData.account_name || 'Qorebit'}
                                        </span>
                                    </div>
                                </div>

                                {/* Reference */}
                                <div>
                                    <label className="text-sm text-gray-600 block mb-2">
                                        Payment Code / Note
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <span className="text-sm font-mono break-all">
                                                {topUpData.payment_reference}
                                            </span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            onClick={() =>
                                                handleCopy(
                                                    topUpData.payment_reference,
                                                    'Payment Code',
                                                )
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            {copiedField === 'Payment Code' ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Status */}
                        {isPolling && (
                            <Card className="bg-yellow-50 border-yellow-200">
                                <div className="flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-yellow-600" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-yellow-900">
                                            Waiting for payment...
                                        </p>
                                        <p className="text-sm text-yellow-700">
                                            We'll notify you as soon as payment is received
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Expiry Warning */}
                        <div className="text-center text-sm text-gray-600">
                            <p>
                                Payment code expires in:{' '}
                                <span className="font-semibold text-orange-600">
                                    {formatExpiryTime(topUpData.expires_at)}
                                </span>
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-center pt-4">
                            <Button
                                variant="solid"
                                onClick={resetAndClose}
                                className="px-8"
                            >
                                I've Sent the Money
                            </Button>
                        </div>
                    </div>
                ) : null}
            </div>
        </Dialog>
    )
}
