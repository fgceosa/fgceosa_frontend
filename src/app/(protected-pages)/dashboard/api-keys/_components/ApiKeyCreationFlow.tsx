'use client'

import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, Button, Input, Select } from '@/components/ui'
import { Key, Shield, Zap, AlertTriangle, CheckCircle2, Copy, Sparkles, Database, Clock, X } from 'lucide-react'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import classNames from '@/utils/classNames'
import { createApiKey, selectCreateLoading } from '@/store/slices/apiKeys'
import { CreateApiKeyProps, Step, Environment, ResetPeriod } from '../types'
import {
    RESET_LIMIT_OPTIONS,
    EXPIRATION_OPTIONS,
    ENVIRONMENT_OPTIONS,
} from '../constants'

export default function ApiKeyCreationFlow({
    open,
    onClose,
    onSuccess,
}: CreateApiKeyProps) {
    const dispatch = useDispatch()
    const isCreating = useSelector(selectCreateLoading)

    const [step, setStep] = useState<Step>('form')
    const [generatedKey, setGeneratedKey] = useState('')
    const [copied, setCopied] = useState(false)

    // Form state
    const [name, setName] = useState('')
    const [creditLimit, setCreditLimit] = useState('')
    const [resetLimit, setResetLimit] = useState<ResetPeriod | ''>('')
    const [expiration, setExpiration] = useState('')
    const [environment, setEnvironment] = useState<Environment | ''>('')
    const [allowedIps, setAllowedIps] = useState('')
    const [allowedDomains, setAllowedDomains] = useState('')

    // Validation
    const validation = useMemo(() => {
        const errors: string[] = []

        if (!name.trim()) {
            errors.push('Name is required')
        }

        return {
            isValid: errors.length === 0,
            errors,
        }
    }, [name])

    const handleGenerate = async () => {
        if (!validation.isValid) {
            toast.push(
                <Notification type="danger">
                    {validation.errors[0]}
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        try {
            const result = await dispatch(
                createApiKey({
                    name: name.trim(),
                    creditLimit: creditLimit ? Number(creditLimit) : undefined,
                    resetLimit: resetLimit || undefined,
                    expiration: expiration || undefined,
                    environment: (environment as Environment) || 'development',
                    allowedIps: allowedIps.trim() || undefined,
                    allowedDomains: allowedDomains.trim() || undefined,
                }) as any,
            ).unwrap()

            setGeneratedKey(result.key)
            setStep('generated')

            // Show success notification
            toast.push(
                <Notification type="success" title="API Key Created" duration={4000}>
                    Your API key has been generated successfully. Make sure to copy it now!
                </Notification>,
                { placement: 'top-center' }
            )

            // Call onSuccess callback if provided
            onSuccess?.()
        } catch (error: any) {
            toast.push(
                <Notification type="danger">
                    {error || 'Infrastructure failed to issue key'}
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generatedKey)
        setCopied(true)
        toast.push(
            <Notification type="success">
                API Key copied
            </Notification>,
            { placement: 'top-center' }
        )
        setTimeout(() => setCopied(false), 1500)
    }

    const handleClose = () => {
        // Reset state when closing
        setStep('form')
        setGeneratedKey('')
        setName('')
        setCreditLimit('')
        setResetLimit('')
        setExpiration('')
        setEnvironment('')
        setAllowedIps('')
        setAllowedDomains('')
        setCopied(false)
        onClose()
    }

    return (
        <Dialog
            isOpen={open}
            onClose={handleClose}
            width={680}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
                            {step === 'form' ? (
                                <Key className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            ) : (
                                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                {step === 'form' ? 'Create API Key' : 'Key Generated Successfully'}
                            </h3>
                            <p className="text-[10px] font-black text-gray-400 mt-0.5">
                                {step === 'form' ? 'Securely authorize your applications' : 'Your access token is ready for use'}
                            </p>
                        </div>
                    </div>
                    {!isCreating && (
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group shrink-0"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    )}
                </div>

                {step === 'form' ? (
                    <>
                        <div className="p-5 sm:p-8 space-y-5 sm:space-y-6 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[13px] font-black text-gray-900 dark:text-gray-200 px-1">Key Name</label>
                                    <Input
                                        placeholder="e.g. My Production App"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-14 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-bold text-base"
                                    />
                                </div>


                                <div className="space-y-2">
                                    <label className="text-[13px] font-black text-gray-900 dark:text-gray-200 px-1">Expiration</label>
                                    <Select
                                        placeholder="Set expiration"
                                        className="h-14 bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 rounded-2xl text-base font-bold"
                                        value={EXPIRATION_OPTIONS.find((o) => o.value === expiration) || null}
                                        onChange={(option: any) => setExpiration(option?.value || '')}
                                        options={[...EXPIRATION_OPTIONS]}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-black text-gray-900 dark:text-gray-200 px-1">Usage Limit (₦)</label>
                                    <Input
                                        type="number"
                                        placeholder="No limit"
                                        value={creditLimit}
                                        onChange={(e) => setCreditLimit(e.target.value)}
                                        className="h-14 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-bold text-base"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[13px] font-black text-gray-900 dark:text-gray-200 px-1">Reset Period</label>
                                    <Select
                                        placeholder="Never reset"
                                        className="h-14 bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 rounded-2xl text-base font-bold"
                                        value={RESET_LIMIT_OPTIONS.find((o) => o.value === resetLimit) || null}
                                        onChange={(option: any) => setResetLimit(option?.value as ResetPeriod || '')}
                                        options={[...RESET_LIMIT_OPTIONS]}
                                    />
                                </div>

                                {/* Security Restrictions */}
                                <div className="md:col-span-2 pt-4 border-t border-gray-50 dark:border-gray-800 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-3.5 h-3.5 text-primary" />
                                        <h4 className="text-[10px] font-black text-gray-900 dark:text-white tracking-wider">Security Restrictions</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-black text-gray-900 dark:text-gray-200 px-1">IP Whitelist</label>
                                            <Input
                                                placeholder="e.g. 192.168.1.1, 10.0.0.1"
                                                value={allowedIps}
                                                onChange={(e) => setAllowedIps(e.target.value)}
                                                className="h-12 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-bold text-sm"
                                            />
                                            <p className="text-[9px] text-gray-900 dark:text-gray-200 font-medium px-1 italic">Comma-separated IP addresses</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[13px] font-black text-gray-900 dark:text-gray-200 px-1">Domain Whitelist</label>
                                            <Input
                                                placeholder="e.g. example.com, app.test.io"
                                                value={allowedDomains}
                                                onChange={(e) => setAllowedDomains(e.target.value)}
                                                className="h-12 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-bold text-sm"
                                            />
                                            <p className="text-[9px] text-gray-900 dark:text-gray-200 font-medium px-1 italic">Comma-separated domains for CORS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-5 sm:p-8 bg-gray-50/30 dark:bg-gray-800/10 border-t border-gray-50 dark:border-gray-800 flex flex-col-reverse sm:flex-row items-center gap-3 sm:gap-4">
                            <Button
                                variant="default"
                                onClick={handleClose}
                                disabled={isCreating}
                                className="h-12 sm:h-14 w-full sm:flex-1 rounded-xl sm:rounded-2xl font-black text-[10px] bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-100 dark:border-gray-700 transition-all"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="solid"
                                onClick={handleGenerate}
                                disabled={!validation.isValid || isCreating}
                                loading={isCreating}
                                className="h-12 sm:h-14 w-full sm:flex-[2] rounded-xl sm:rounded-2xl font-black text-[10px] bg-primary hover:bg-primary-deep text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                {isCreating ? 'Generating...' : 'Generate API Key'}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                            {/* Security Warning */}
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
                                <div className="p-2 sm:p-2.5 bg-amber-100 dark:bg-amber-800 rounded-lg sm:rounded-xl shrink-0">
                                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 dark:text-amber-200" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] sm:text-xs font-black text-amber-900 dark:text-amber-200">Important</p>
                                    <p className="text-[11px] sm:text-sm font-bold text-amber-800/80 dark:text-amber-300/60 leading-relaxed italic">
                                        This key will only be shown once. If you lose it, you'll need to create a new one.
                                    </p>
                                </div>
                            </div>

                            {/* Token Area */}
                            <div className="space-y-3">
                                <label className="text-[11px] sm:text-[13px] font-black text-gray-900 dark:text-gray-200 px-1">Your API Key</label>
                                <div className="relative group">
                                    <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-2xl shadow-inner flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                                        <code className="flex-1 font-mono text-xs sm:text-sm font-black text-primary dark:text-emerald-400 break-all select-all leading-tight text-center sm:text-left">
                                            {generatedKey}
                                        </code>
                                        <button
                                            onClick={handleCopy}
                                            className={classNames(
                                                "w-full sm:w-12 h-10 sm:h-12 rounded-xl border transition-all duration-300 flex items-center justify-center shadow-sm shrink-0",
                                                copied
                                                    ? "bg-emerald-500 text-white border-emerald-500"
                                                    : "bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700 hover:text-primary hover:border-primary/30"
                                            )}
                                        >
                                            {copied ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                                            <span className="ml-2 sm:hidden text-xs font-bold">{copied ? 'Copied' : 'Copy'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Success Footer */}
                        <div className="p-5 sm:p-8 bg-gray-50/30 dark:bg-gray-800/10 border-t border-gray-50 dark:border-gray-800">
                            <Button
                                variant="solid"
                                onClick={handleClose}
                                className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black text-[10px] bg-primary hover:bg-primary-deep text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95"
                            >
                                Done
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Dialog>
    )
}
