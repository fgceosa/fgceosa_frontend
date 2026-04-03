'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
    bulkDistribution,
    sendCredits,
    fetchCampaigns,
    fetchBulkCreditsStats,
    fetchBulkTransactions,
    selectBulkDistributionLoading,
    selectBulkCreditsStats,
    selectActiveCampaigns,
} from '@/store/slices/bulkCredits'
import { useAppDispatch, useAppSelector } from '@/store'
import { useEffect } from 'react'
import { Card, Input, Select, Spinner, Badge, Dialog, Switcher } from '@/components/ui'
import {
    GraduationCap, Building2, Gift, Send, Upload, Settings, Target, ShieldCheck,
    FileSpreadsheet, Info, User, Users, CheckCircle, AlertTriangle, ArrowRight,
    ArrowLeft, Wallet, X, Search, Zap, UserPlus, Heart, Star, Award, Rocket, Plus
} from 'lucide-react'
import cn from '@/utils/classNames'
import type { DistributionType, BulkDistributionTabProps, RecipientOption } from '../../../types'
import { apiResolveTag } from '@/services/sharedCredits/sharedCreditsService'
import { toast, Notification, Button, Avatar } from '@/components/ui'
import { DistributionTemplateCard } from './DistributionTemplateCard'
import { useBulkDistributionForm } from './useBulkDistributionForm'
import { RECIPIENT_OPTIONS } from '../../../types'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { NAIRA_TO_USD_RATE } from '@/constants/currency.constant'

const ICON_MAP: Record<string, any> = {
    GraduationCap, Building2, Gift, Settings, Rocket, Zap, ShieldCheck, Target, Heart, Star, Award, Users, User, Info
}

const DEFAULT_USE_CASES = [
    {
        id: 'bootcamp',
        title: 'Bootcamp',
        description: 'Equal split for events.',
        stats: 'Equal',
        badgeText: 'Popular',
        badgeType: 'success' as const,
        amount: '100,000',
        purpose: 'Event Allocation',
        groupName: 'Bootcamp_Distribution',
        distributionType: 'equal' as DistributionType,
        iconName: 'GraduationCap'
    },
    {
        id: 'corporate',
        title: 'Corporate',
        description: 'Departmental specific.',
        stats: 'Custom',
        badgeText: 'Enterprise',
        badgeType: 'primary' as const,
        amount: '1,000,000',
        purpose: 'Dept Allocation',
        groupName: 'Corp_Allocation',
        distributionType: 'custom' as DistributionType,
        iconName: 'Building2'
    },
    {
        id: 'community',
        title: 'Rewards',
        description: 'Incentives & Bonuses.',
        stats: 'Variable',
        badgeText: 'Dynamic',
        badgeType: 'secondary' as const,
        amount: '50,000',
        purpose: 'Rewards',
        groupName: 'Rewards_Batch',
        distributionType: 'equal' as DistributionType,
        iconName: 'Gift'
    }
]

import { selectWalletBalance, selectOrganizationCredits } from '@/store/slices/wallet'

export default function BulkDistributionTab({ treasuryType = 'platform', organizationId }: BulkDistributionTabProps) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const loading = useAppSelector(selectBulkDistributionLoading)
    const stats = useAppSelector(selectBulkCreditsStats)
    const personalWallet = useAppSelector(selectWalletBalance)
    const orgWallet = useAppSelector(selectOrganizationCredits)
    const [step, setStep] = useState(1)
    const [isProcessing, setIsProcessing] = useState(false)
    const [mode, setMode] = useState<'single' | 'bulk' | null>(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const {
        totalAmount,
        setTotalAmount,
        distributionType,
        setDistributionType,
        uploadedFile,
        handleFileUpload,
        template,
        setTemplate,
        groupName,
        setGroupName,
        purpose,
        setPurpose,
        recipient,
        setRecipient,
        message,
        setMessage,
        quickRecipients,
        setQuickRecipients,
        parsedRecipients,
        parsedTotalAmount,
        resetForm
    } = useBulkDistributionForm()

    const [tagInput, setTagInput] = useState('')
    const [isResolving, setIsResolving] = useState(false)

    // Use real balance from primary wallet state (Naira) for consistency with Sidebar/Topbar
    const AVAILABLE_BALANCE = useMemo(() => {
        if (organizationId) {
            return orgWallet?.balance || 0
        }
        return personalWallet.naira_equivalent || 0
    }, [organizationId, orgWallet?.balance, personalWallet.naira_equivalent])

    const LIMITS = {
        singleMax: 5000000,
        bulkMax: 50000000,
        approvalThreshold: 1000000
    }

    const [linkToProgram, setLinkToProgram] = useState(false)
    const activeCampaigns = useAppSelector(selectActiveCampaigns)

    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [deletingUseCaseId, setDeletingUseCaseId] = useState<string | null>(null)

    useEffect(() => {
        dispatch(fetchCampaigns({ status: 'active' }))
    }, [dispatch])

    // Dynamic Use Cases logic
    const [useCases, setUseCases] = useState<any[]>([])
    const [isUseCaseModalOpen, setIsUseCaseModalOpen] = useState(false)
    const [editingUseCase, setEditingUseCase] = useState<any>(null)
    const [useCaseForm, setUseCaseForm] = useState({
        title: '',
        description: '',
        amount: '',
        purpose: '',
        groupName: '',
        distributionType: 'equal' as DistributionType,
        iconName: 'Zap',
        badgeText: 'Custom',
        badgeType: 'secondary' as const,
        stats: 'Flexible'
    })

    useEffect(() => {
        const saved = localStorage.getItem('qorebit_use_cases')
        if (saved) {
            try {
                setUseCases(JSON.parse(saved))
            } catch (e) {
                setUseCases(DEFAULT_USE_CASES)
            }
        } else {
            setUseCases(DEFAULT_USE_CASES)
        }
    }, [])

    const saveUseCases = (updated: any[]) => {
        setUseCases(updated)
        localStorage.setItem('qorebit_use_cases', JSON.stringify(updated))
    }

    const handleAddUseCase = () => {
        setEditingUseCase(null)
        setUseCaseForm({
            title: '',
            description: '',
            amount: '',
            purpose: '',
            groupName: '',
            distributionType: 'equal',
            iconName: 'Zap',
            badgeText: 'Standard',
            badgeType: 'secondary',
            stats: 'Flexible'
        })
        setIsUseCaseModalOpen(true)
    }

    const handleEditUseCase = (uc: any) => {
        setEditingUseCase(uc)
        setUseCaseForm({ ...uc })
        setIsUseCaseModalOpen(true)
    }

    const handleDeleteUseCase = (id: string) => {
        setDeletingUseCaseId(id)
        setIsDeleteConfirmOpen(true)
    }

    const handleConfirmDeleteUseCase = () => {
        if (!deletingUseCaseId) return
        const id = deletingUseCaseId
        const deletedUc = useCases.find(u => u.id === id)
        const updated = useCases.filter(u => u.id !== id)
        saveUseCases(updated)
        if (template === id) setTemplate(null)

        toast.push(
            <Notification type="success" className="border-none p-0 bg-transparent">
                <p className="text-sm font-bold">Template "{deletedUc?.title}" removed</p>
            </Notification>,
            { placement: 'top-center' }
        )
        setIsDeleteConfirmOpen(false)
        setDeletingUseCaseId(null)
    }

    const handleUseCaseSubmit = () => {
        if (!useCaseForm.title) return

        let updated: any[]
        if (editingUseCase) {
            updated = useCases.map(u => u.id === editingUseCase.id ? { ...useCaseForm, id: u.id } : u)
        } else {
            updated = [...useCases, { ...useCaseForm, id: `uc_${Date.now()}` }]
        }

        saveUseCases(updated)
        setIsUseCaseModalOpen(false)

        toast.push(
            <Notification type="success" className="border-none p-0 bg-transparent">
                <p className="text-sm font-bold">Template "{useCaseForm.title}" {editingUseCase ? 'updated' : 'initiated'}</p>
            </Notification>,
            { placement: 'top-center' }
        )
    }

    // Step 1: Mode Selection Mock Data
    const SCENARIOS = [
        {
            id: 'single',
            title: 'Quick Transfer',
            description: 'Send to an individual or small group (up to 10) instantly.',
            icon: User,
            mode: 'single',
            badge: 'Instant'
        },
        {
            id: 'bulk_csv',
            title: 'Multiple Recipients (CSV)',
            description: 'Upload a CSV file to credit hundreds of users at once.',
            icon: Users,
            mode: 'bulk',
            badge: 'Batch'
        }
    ]

    // Pre-flight summary calculation
    const summary = useMemo(() => {
        let amt = parseFloat(totalAmount.replace(/,/g, '') || '0')

        // If Single Mode, input is in Credits/Dollars, convert to Naira
        if (mode === 'single') {
            amt = amt * NAIRA_TO_USD_RATE
        }

        const count = mode === 'single' ? quickRecipients.length : (parsedRecipients?.length || 0)

        // If bulk custom, total amount is parsedTotalAmount (if we want to enforce it, though hook sets totalAmount)
        // Hook already sets totalAmount to parsedTotalAmount if custom.

        const remaining = AVAILABLE_BALANCE - (mode === 'single' ? (amt * count) : amt)

        return {
            totalAmount: mode === 'single' ? (amt * count) : amt,
            totalRecipients: count,
            remainingBalance: remaining,
            requiresApproval: (mode === 'single' ? (amt * count) : amt) > LIMITS.approvalThreshold
        }
    }, [totalAmount, quickRecipients, parsedRecipients, mode, AVAILABLE_BALANCE])

    // Validation
    const canProceedToStep2 = () => {
        if (mode === 'single') return true
        if (mode === 'bulk') return !!template // Must select template for bulk logic preference
        return false
    }

    const canProceedToStep3 = () => {
        let amount = parseFloat(totalAmount.replace(/,/g, ''))

        // If Single Mode, input is in Credits, convert to Naira for validation
        if (mode === 'single') {
            amount = amount * NAIRA_TO_USD_RATE
        }

        if (!amount || amount <= 0) return false

        if (amount > AVAILABLE_BALANCE) return false

        // Mandatory program selection if toggled
        if (linkToProgram && !groupName) return false

        if (mode === 'bulk') {
            return !!uploadedFile && amount <= LIMITS.bulkMax && amount <= AVAILABLE_BALANCE
        }
        if (mode === 'single') {
            return quickRecipients.length > 0 && (amount * quickRecipients.length) <= LIMITS.singleMax && (amount * quickRecipients.length) <= AVAILABLE_BALANCE
        }
        return false
    }

    const handleConfirm = async () => {
        setIsProcessing(true)
        try {
            let amountVal = parseFloat(totalAmount.replace(/,/g, ''))

            // If Single Mode, input is in Credits, convert to Naira
            if (mode === 'single') {
                amountVal = amountVal * NAIRA_TO_USD_RATE
            }

            if (mode === 'single') {
                // Send to each recipient
                let successCount = 0
                let failCount = 0

                for (const r of quickRecipients) {
                    try {
                        await dispatch(sendCredits({
                            recipientType: 'individual',
                            amount: amountVal,
                            recipient: r.tagNumber ? `@${r.tagNumber}` : r.email,
                            message: message,
                            groupName: linkToProgram ? groupName : undefined,
                            organizationId: organizationId
                        })).unwrap()
                        successCount++
                    } catch (err) {
                        failCount++
                        console.error(`Failed to send to ${r.email}:`, err)
                    }
                }

                setIsProcessing(false)
                setShowConfirmModal(false)

                if (successCount > 0) {
                    toast.push(
                        <Notification type="success" className="border-none p-0 bg-transparent">
                            <div className="flex flex-col gap-1">
                                <p className="font-black text-[10px] text-emerald-600">Transfer Complete</p>
                                <p className="text-sm font-bold">
                                    Successfully sent ₦{(amountVal * successCount).toLocaleString()} to {successCount} recipient{successCount > 1 ? 's' : ''}
                                </p>
                            </div>
                        </Notification>,
                        { placement: 'top-center' }
                    )
                }

                if (failCount > 0) {
                    toast.push(
                        <Notification type="danger" className="border-none p-0 bg-transparent">
                            <p className="text-sm font-bold">Failed to send to {failCount} recipient{failCount > 1 ? 's' : ''}</p>
                        </Notification>,
                        { placement: 'top-center' }
                    )
                }

                // Reset form after successful transfer
                if (successCount > 0) {
                    resetForm()
                    setQuickRecipients([])
                    setStep(1)
                    setMode(null)
                    dispatch(fetchBulkCreditsStats())
                    dispatch(fetchBulkTransactions({ pageIndex: 0, pageSize: 10 }))
                    window.dispatchEvent(new CustomEvent('wallet-updated'))
                }
            } else {
                // Bulk Logic
                const finalRecipients = parsedRecipients.map((row: any) => {
                    // Find Identifier
                    const possibleKeys = Object.keys(row).filter(k =>
                        ['email', 'tag', 'identifier', 'user', 'username', 'recipient'].includes(k.toLowerCase())
                    );
                    let identifier = possibleKeys.length > 0 ? row[possibleKeys[0]] : Object.values(row)[0];

                    // Find Amount
                    let rAmount = 0;
                    if (distributionType === 'equal') {
                        rAmount = amountVal / (parsedRecipients.length || 1);
                    } else {
                        const amtKey = Object.keys(row).find(k => k.toLowerCase() === 'amount' || k.toLowerCase().includes('amount'));
                        if (amtKey && row[amtKey]) {
                            rAmount = parseFloat(String(row[amtKey]).replace(/,/g, ''));
                        }
                    }

                    return {
                        identifier: String(identifier || 'unknown'),
                        amount: rAmount
                    };
                });

                const result = await dispatch(bulkDistribution({
                    totalAmount: amountVal,
                    distributionType: distributionType,
                    recipients: finalRecipients,
                    groupName: groupName,
                    purpose: purpose,
                    organizationId: organizationId
                })).unwrap()

                setIsProcessing(false)
                setShowConfirmModal(false)

                const allFailed = result.successfulRecipients === 0;
                const someSucceeded = result.successfulRecipients > 0;

                toast.push(
                    <Notification type={allFailed ? "danger" : "success"} className="border-none p-0 bg-transparent">
                        <div className="flex flex-col gap-1">
                            <p className={cn("font-black text-[10px]", allFailed ? "text-rose-600" : "text-emerald-600")}>
                                {allFailed ? 'Distribution Failed' : 'Distribution Complete'}
                            </p>
                            <div className="text-sm font-bold">
                                {someSucceeded && <p>Successfully sent to {result.successfulRecipients} recipients.</p>}
                                {result.failedRecipients > 0 && (
                                    <p className={cn("text-xs mt-1", someSucceeded ? "text-rose-500" : "text-gray-900 dark:text-gray-200")}>
                                        {allFailed
                                            ? `Failed: ${result.failures?.[0]?.error || 'Please check if recipients are registered users.'}`
                                            : `(${result.failedRecipients} failed)`
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    </Notification>,
                    { placement: 'top-center' }
                )

                // Reset form
                resetForm()
                setStep(1)
                setMode(null)
                dispatch(fetchBulkCreditsStats())
                dispatch(fetchBulkTransactions({ pageIndex: 0, pageSize: 10 }))
                window.dispatchEvent(new CustomEvent('wallet-updated'))
            }
        } catch (error: any) {
            console.error('Distribution failed', error)
            setIsProcessing(false)
            setShowConfirmModal(false)
            toast.push(
                <Notification type="danger" className="border-none p-0 bg-transparent">
                    <div className="flex flex-col gap-1">
                        <p className="font-black text-[10px] text-rose-600">Transfer Failed</p>
                        <p className="text-sm font-bold">{typeof error === 'string' ? error : (error?.message || 'Please try again')}</p>
                    </div>
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    const handleResolveTag = async () => {
        if (!tagInput.trim()) return

        let processedTag = tagInput.trim()
        if (!processedTag.startsWith('@')) {
            processedTag = `@${processedTag}`
        }

        setIsResolving(true)
        try {
            const user = await apiResolveTag(processedTag)

            if (!user) {
                toast.push(
                    <Notification type="danger" className="border-none p-0 bg-transparent">
                        <p className="text-sm font-bold">User not found. Check Tag.</p>
                    </Notification>
                )
                return
            }

            if (quickRecipients.some(r => r.id === user.id)) {
                toast.push(
                    <Notification type="warning" className="border-none p-0 bg-transparent">
                        <p className="text-sm font-bold">Recipient already added.</p>
                    </Notification>
                )
            } else {
                setQuickRecipients(prev => [...prev, user])
                setTagInput('')
                toast.push(
                    <Notification type="success" className="border-none p-0 bg-transparent">
                        <p className="text-sm font-bold">Added {user.firstName || user.email}</p>
                    </Notification>
                )
            }
        } catch (error: any) {
            console.error('Resolution failed', error)
            toast.push(
                <Notification type="danger" className="border-none p-0 bg-transparent">
                    <p className="text-sm font-bold">Error resolving tag. Please try again.</p>
                </Notification>
            )
        } finally {
            setIsResolving(false)
        }
    }

    const removeRecipient = (id: string) => {
        setQuickRecipients(prev => prev.filter(r => r.id !== id))
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Wizard Steps Indicator */}
            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-4">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all border-2
                                ${step === s ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30' :
                                    step > s ? 'bg-emerald-500 border-emerald-500 text-white' :
                                        'bg-transparent border-gray-200 dark:border-gray-800 text-gray-400'}
                            `}>
                                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                            </div>
                            {s < 3 && <div className={`w-12 h-0.5 transition-colors ${step > s ? 'bg-emerald-500' : 'bg-gray-100 dark:bg-gray-800'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* STEP 1: SCENARIO SELECTION */}
            {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Select Distribution Mode</h3>
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Choose how you want to allocate credits</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {SCENARIOS.map((scenario) => (
                            <div
                                key={scenario.id}
                                onClick={() => {
                                    setMode(scenario.mode as 'single' | 'bulk')
                                    if (scenario.mode === 'single') {
                                        setTemplate(null) // Reset template
                                    }
                                }}
                                className={`
                                    p-8 rounded-[2rem] border-2 cursor-pointer transition-all group relative overflow-hidden
                                    ${mode === scenario.mode
                                        ? 'border-primary bg-primary/[0.02] shadow-xl shadow-primary/10'
                                        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-primary/30 hover:scale-[1.02]'}
                                `}
                            >
                                <div className="absolute top-6 right-6">
                                    <Badge content={scenario.badge} className={mode === scenario.mode ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'} />
                                </div>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${mode === scenario.mode ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 group-hover:text-primary group-hover:bg-primary/10'}`}>
                                    <scenario.icon className="w-7 h-7" />
                                </div>
                                <h4 className="text-lg font-black text-gray-900 dark:text-white mb-2">{scenario.title}</h4>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed">{scenario.description}</p>
                            </div>
                        ))}
                    </div>

                    {mode === 'bulk' && (
                        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" />
                                    <h4 className="text-xs font-black text-gray-900 dark:text-white">Select Use Case</h4>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 italic">Templates help pre-fill distribution settings</p>
                            </div>
                            <div className="grid gap-6 md:grid-cols-4">
                                <DistributionTemplateCard
                                    icon={Settings}
                                    title="Custom"
                                    description="Start from scratch."
                                    stats="Flexible"
                                    badgeText="Manual"
                                    badgeType="secondary"
                                    isActive={template === 'custom'}
                                    amount="-"
                                    onClick={() => {
                                        setTemplate('custom');
                                        setPurpose('');
                                        setGroupName('');
                                        setDistributionType('equal');
                                        setTotalAmount('');
                                    }}
                                />
                                {useCases.map((uc) => (
                                    <DistributionTemplateCard
                                        key={uc.id}
                                        icon={ICON_MAP[uc.iconName] || Zap}
                                        title={uc.title}
                                        description={uc.description}
                                        stats={uc.stats}
                                        badgeText={uc.badgeText}
                                        badgeType={uc.badgeType}
                                        isActive={template === uc.id}
                                        amount={uc.amount ? `₦${uc.amount.toLocaleString()}` : undefined}
                                        onClick={() => {
                                            setTemplate(uc.id);
                                            setPurpose(uc.purpose);
                                            setGroupName(uc.groupName);
                                            setDistributionType(uc.distributionType);
                                            setTotalAmount(uc.amount);
                                        }}
                                        onEdit={() => handleEditUseCase(uc)}
                                        onDelete={() => handleDeleteUseCase(uc.id)}
                                    />
                                ))}
                                <button
                                    onClick={handleAddUseCase}
                                    className="group p-6 bg-gray-50/50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700 rounded-[1.8rem] transition-all hover:bg-primary/[0.02] hover:border-primary/50 flex flex-col items-center justify-center gap-3 min-h-[220px]"
                                >
                                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-700 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-sm">
                                        <Plus className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-black text-gray-900 dark:text-white">Create New</p>
                                        <p className="text-[10px] font-medium text-gray-500 mt-1">Add custom template</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* STEP 2: INPUT DETAILS */}
            {step === 2 && mode === 'single' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    {/* Identity Search */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Search className="w-4 h-4 text-primary" />
                            <h4 className="text-xs font-black text-gray-900 dark:text-white">Add Recipients</h4>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Search by Qorebit Tag (e.g. @qor123)"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleResolveTag()}
                                    className="h-14 pl-4 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 rounded-2xl text-base font-bold w-full"
                                    disabled={isResolving}
                                />
                            </div>
                            <Button
                                variant="solid"
                                onClick={handleResolveTag}
                                loading={isResolving}
                                disabled={!tagInput.trim()}
                                className="h-14 w-auto px-8 rounded-2xl bg-primary hover:bg-primary-deep text-white font-black text-sm shadow-xl shadow-primary/20 shrink-0 flex items-center justify-center"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add
                            </Button>
                        </div>

                        {/* Recipient Queue Grid */}
                        {quickRecipients.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 max-h-60 overflow-y-auto">
                                {quickRecipients.map((recipient) => (
                                    <div key={recipient.id} className="flex items-center justify-between bg-white dark:bg-gray-900 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm animate-in zoom-in duration-300">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar size={32} alt={recipient.firstName || recipient.email} className="ring-2 ring-gray-50 dark:ring-gray-800 text-[10px] font-black">
                                                {(recipient.firstName || recipient.email || 'U').charAt(0).toUpperCase()}
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-black text-gray-900 dark:text-white truncate">{recipient.firstName || 'User'}</span>
                                                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 truncate">{recipient.tagNumber ? `@${recipient.tagNumber}` : recipient.email}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => removeRecipient(recipient.id)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all shrink-0">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {quickRecipients.length === 0 && (
                            <div className="p-8 text-center bg-gray-50/30 border border-dashed border-gray-200 rounded-2xl">
                                <p className="text-xs font-bold text-gray-400">No recipients added yet. Search by tag to begin.</p>
                            </div>
                        )}
                    </div>

                    {/* Amount & Memo */}
                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                        <Card className="p-8 bg-white dark:bg-gray-800 border-none shadow-xl rounded-[2.5rem] space-y-6 md:col-span-2">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Amount Per Person (Credits)</label>
                                        {(parseFloat(totalAmount.replace(/,/g, '')) * NAIRA_TO_USD_RATE) > LIMITS.singleMax && (
                                            <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" /> Exceeds Limit
                                            </span>
                                        )}
                                    </div>
                                    <Input
                                        value={totalAmount}
                                        onChange={(e) => setTotalAmount(e.target.value)}
                                        placeholder="0"
                                        className={`rounded-xl h-14 font-bold font-mono text-lg ${(parseFloat(String(totalAmount).replace(/,/g, '')) * NAIRA_TO_USD_RATE) > LIMITS.singleMax ? 'border-rose-500 focus:ring-rose-500' : ''}`}
                                    />
                                    <div className="flex justify-between items-center text-[10px] text-gray-400 pl-1 mt-1">
                                        <span>Max limit: ₦{LIMITS.singleMax.toLocaleString()}</span>
                                        <span className="font-bold text-primary">
                                            ≈ ₦{(parseFloat(totalAmount.replace(/,/g, '') || '0') * NAIRA_TO_USD_RATE).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Memo (Optional)</label>
                                    <Input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Reason for transfer..."
                                        textArea
                                        className="rounded-xl font-bold h-14 pt-3.5"
                                    />
                                </div>
                            </div>

                            {/* Program Linking for Single Mode */}
                            <div className={cn(
                                "p-6 rounded-[1.8rem] transition-all duration-300",
                                linkToProgram ? "bg-primary/[0.03] border border-primary/10" : "bg-gray-50/50 dark:bg-gray-900/50 border border-transparent"
                            )}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                            linkToProgram ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                                        )}>
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-900 dark:text-white">Program Link</p>
                                            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 italic">Link to a program.</p>
                                        </div>
                                    </div>
                                    <Switcher
                                        checked={linkToProgram}
                                        onChange={(val) => setLinkToProgram(val)}
                                    />
                                </div>

                                {linkToProgram && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <Select
                                            options={activeCampaigns.map(c => ({ value: c.name, label: c.name }))}
                                            value={activeCampaigns.find(c => c.name === groupName) ? { value: groupName, label: groupName } : null}
                                            onChange={(option: any) => setGroupName(option?.value || '')}
                                            placeholder="Select a program to link..."
                                            className="rounded-xl"
                                            classNames={{
                                                control: (state) => cn(
                                                    'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-11 rounded-xl text-sm font-bold',
                                                    state.isFocused && 'ring-2 ring-primary/20 border-primary'
                                                )
                                            }}
                                            components={{
                                                DropdownIndicator: () => <Zap className="w-4 h-4 text-primary/40 mr-4" />
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Sub-total summary for Quick Mode */}
                            {quickRecipients.length > 0 && totalAmount && (
                                <div className="mt-4 p-4 bg-primary/5 rounded-2xl flex items-center justify-between border border-primary/10">
                                    <div>
                                        <p className="text-[10px] font-black text-primary/60">Total Distribution</p>
                                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                                            {quickRecipients.length} recipients × {parseFloat(String(totalAmount).replace(/,/g, '') || '0').toLocaleString()} Credits
                                        </p>
                                    </div>
                                    <div className="text-2xl font-black text-primary">
                                        {(parseFloat(String(totalAmount).replace(/,/g, '') || '0') * quickRecipients.length).toLocaleString()} Credits
                                    </div>
                                </div>
                            )}

                            {/* Insufficient Funds Warning */}
                            {(parseFloat(String(totalAmount).replace(/,/g, '') || '0') * NAIRA_TO_USD_RATE * quickRecipients.length) > AVAILABLE_BALANCE && (
                                <div className="mt-2 p-4 bg-rose-500/5 rounded-2xl flex items-center gap-3 border border-rose-500/10">
                                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black text-rose-600 mb-1">Insufficient Funds</p>
                                        <p className="text-xs font-bold text-gray-500">
                                            Available: <span className="text-gray-900 dark:text-white">≈ {Math.floor(AVAILABLE_BALANCE / NAIRA_TO_USD_RATE).toLocaleString()} Credits</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            )}

            {step === 2 && mode === 'bulk' && (
                <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Upload className="w-4 h-4 text-primary" />
                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Upload Recipients</h4>
                        </div>
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-10 text-center bg-gray-50/10 hover:border-primary/50 transition-all">
                            <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mx-auto mb-4">
                                <FileSpreadsheet className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
                                {uploadedFile ? uploadedFile.name : 'Upload Recipient File'}
                            </p>
                            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                            <label htmlFor="csv-upload" className="inline-block px-8 py-3 bg-white dark:bg-gray-800 border rounded-xl font-black uppercase tracking-widest text-[10px] cursor-pointer hover:bg-primary hover:text-white transition-all shadow-lg">
                                Browse Files
                            </label>
                        </div>

                        {uploadedFile && (
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Valid File</p>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">{parsedRecipients.length} Rows Detected</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-primary" />
                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Distribution Details</h4>
                        </div>
                        <Card className="p-8 bg-white dark:bg-gray-800 border-none shadow-xl rounded-[2.5rem] space-y-6">
                            <div className="space-y-4">
                                <div className={cn(
                                    "p-6 rounded-3xl transition-all duration-300",
                                    linkToProgram ? "bg-primary/[0.03] border border-primary/10" : "bg-gray-50/50 dark:bg-gray-900/50 border border-transparent"
                                )}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                                linkToProgram ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                                            )}>
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-wider">Program Link</p>
                                                <p className="text-[9px] font-bold text-gray-400">Link to a program.</p>
                                            </div>
                                        </div>
                                        <Switcher
                                            checked={linkToProgram}
                                            onChange={(val) => setLinkToProgram(val)}
                                        />
                                    </div>

                                    {linkToProgram ? (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <Select
                                                options={activeCampaigns.map(c => ({ value: c.name, label: c.name }))}
                                                value={activeCampaigns.find(c => c.name === groupName) ? { value: groupName, label: groupName } : null}
                                                onChange={(option: any) => setGroupName(option?.value || '')}
                                                placeholder="Select a program to link..."
                                                className="rounded-xl"
                                                classNames={{
                                                    control: (state) => cn(
                                                        'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-12 rounded-xl text-sm font-bold',
                                                        state.isFocused && 'ring-2 ring-primary/20 border-primary'
                                                    )
                                                }}
                                                components={{
                                                    DropdownIndicator: () => <Zap className="w-4 h-4 text-primary/40 mr-4" />
                                                }}
                                            />
                                            {linkToProgram && !groupName && (
                                                <p className="text-[9px] font-bold text-rose-500 flex items-center gap-1 pl-1 animate-in fade-in duration-300">
                                                    <AlertTriangle className="w-3 h-3" /> Please select a program to continue
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-2 animate-in fade-in duration-300">
                                            <Input
                                                value={groupName}
                                                onChange={(e) => setGroupName(e.target.value)}
                                                placeholder="Reference Name (e.g. Dec_Hackathon)"
                                                className="rounded-xl h-11 text-sm font-bold bg-white dark:bg-gray-900"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Distribution Type</label>
                                <div className="relative">
                                    <Select
                                        options={[
                                            { value: 'equal', label: 'Equal Split (Same Amount)' },
                                            { value: 'custom', label: 'Weighted (Values from CSV)' }
                                        ]}
                                        value={{
                                            value: distributionType,
                                            label: distributionType === 'equal' ? 'Equal Split (Same Amount)' : 'Weighted (Values from CSV)'
                                        }}
                                        onChange={(option: any) => setDistributionType(option?.value || 'equal')}
                                        className="rounded-xl"
                                        classNames={{
                                            control: (state) => cn(
                                                'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-12 rounded-xl text-sm font-bold',
                                                state.isFocused && 'ring-2 ring-primary/20 border-primary'
                                            )
                                        }}
                                        components={{
                                            DropdownIndicator: () => <Settings className="w-4 h-4 text-gray-400 mr-4" />
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-1">Total Fund Amount</label>
                                <Input value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="0.00" className={`rounded-xl h-11 font-bold font-mono ${parseFloat(totalAmount) > AVAILABLE_BALANCE ? 'border-rose-500 focus:ring-rose-500' : ''}`} />
                                <div className="flex justify-between items-center px-1">
                                    {parseFloat(totalAmount) > AVAILABLE_BALANCE ? (
                                        <p className="text-[9px] font-bold text-rose-500">
                                            Insufficient balance: ₦{AVAILABLE_BALANCE.toLocaleString()}
                                        </p>
                                    ) : <div />}
                                    <span className="text-[10px] font-bold text-primary">
                                        ≈ {Math.floor((parseFloat(totalAmount.replace(/,/g, '') || '0') / 30)).toLocaleString()} Credits
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 max-w-4xl mx-auto">
                {step > 1 ? (
                    <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                ) : <div />}

                <button
                    onClick={() => {
                        if (step === 1 && canProceedToStep2()) setStep(2)
                        else if (step === 2 && canProceedToStep3()) setShowConfirmModal(true)
                    }}
                    disabled={step === 1 ? !canProceedToStep2() : !canProceedToStep3()}
                    className="px-8 py-4 bg-primary hover:bg-primary-deep disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl text-[10px] font-black tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-105"
                >
                    {step === 1 ? 'Continue' : 'Review & Send'} <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* FINAL CONFIRMATION MODAL */}
            <Dialog isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} closable={true} className="max-w-2xl p-0 rounded-[2.5rem] bg-white dark:bg-gray-900 border-none overflow-hidden">
                <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Confirm Distribution?</h3>
                        <p className="text-xs font-bold text-gray-400 mt-2 tracking-normal px-8">
                            You are about to send <span className="text-primary font-black">{Math.floor(summary.totalAmount / NAIRA_TO_USD_RATE).toLocaleString()} credits</span> to <span className="text-gray-900 dark:text-white font-black">{summary.totalRecipients} recipient{summary.totalRecipients !== 1 ? 's' : ''}</span>.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-[2rem] text-left border border-gray-100 dark:border-gray-800 space-y-4 shadow-inner">
                        <div className="grid grid-cols-2 gap-y-4">
                            <div>
                                <p className="text-[9px] font-black text-gray-900 dark:text-gray-100 tracking-wider mb-1.5 pl-0.5">Source Account</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                                    <span className="text-[11px] font-black text-gray-900 dark:text-white tracking-tight">Platform Wallet</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-[9px] font-black text-gray-900 dark:text-gray-100 tracking-wider mb-1.5 pr-0.5">Mode</p>
                                <Badge
                                    content={mode === 'single' ? 'Quick Transfer' : 'Bulk Batch'}
                                    className="bg-primary/10 text-primary border-none text-[9px] font-black tracking-wider px-2 py-0.5 rounded-lg"
                                />
                            </div>

                            {linkToProgram && (
                                <div className="col-span-2 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                                    <p className="text-[9px] font-black text-gray-900 dark:text-gray-100 tracking-wider mb-1.5 pl-0.5">Program Link</p>
                                    <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-2xl border border-primary/10">
                                        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-gray-900 dark:text-white tracking-tight">{groupName}</p>
                                            <p className="text-[9px] font-bold text-gray-400">Activity will be synced to this program.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {mode === 'bulk' && (
                                <div className="col-span-2 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-900 dark:text-gray-100 tracking-wider mb-1 pl-0.5">Distribution Method</p>
                                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
                                            {distributionType === 'equal' ? 'Equal Split (Fixed Amount)' : 'Custom Weighting (CSV Values)'}
                                        </span>
                                    </div>
                                    <Settings className="w-4 h-4 text-gray-300" />
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 rounded-2xl p-3 flex items-center gap-3">
                                <AlertTriangle className="w-4 h-4 text-amber-500 grow-0 shrink-0" />
                                <p className="text-[10px] font-bold text-amber-600/90 dark:text-amber-500 leading-normal">
                                    Funds will be debited immediately. This transaction is final and irreversible.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Recipient List for Single Mode */}
                    {mode === 'single' && quickRecipients.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-gray-900 dark:text-gray-100 tracking-wider pl-1">Recipients ({quickRecipients.length})</p>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-2 max-h-48 overflow-y-auto border border-gray-100 dark:border-gray-700 space-y-1">
                                {quickRecipients.map((recipient) => (
                                    <div key={recipient.id} className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-3">
                                            <Avatar size={32} alt={recipient.firstName || recipient.email} className="ring-2 ring-gray-50 dark:ring-gray-800 text-[10px] font-black">
                                                {(recipient.firstName || recipient.email || 'U').charAt(0).toUpperCase()}
                                            </Avatar>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">{recipient.firstName || 'User'}</p>
                                                <p className="text-[9px] font-bold text-gray-400">@{recipient.tagNumber || recipient.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-primary">{parseFloat(totalAmount.replace(/,/g, '') || '0').toLocaleString()} Credits</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-6">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="flex-1 h-14 font-black text-sm text-gray-500 hover:bg-gray-50 dark:bg-gray-800/10 dark:hover:bg-gray-800 dark:text-gray-400 border border-gray-100 dark:border-gray-800 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isProcessing || loading}
                            className="flex-1 h-14 font-black text-sm text-white bg-primary hover:bg-primary-deep rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                        >
                            {isProcessing || loading ? (
                                <><Spinner size={18} /> Sending...</>
                            ) : (
                                <><Send className="w-5 h-5" /> Send Credits</>
                            )}
                        </button>
                    </div>
                </div>
            </Dialog>

            {/* USE CASE MODAL */}
            <Dialog
                isOpen={isUseCaseModalOpen}
                onClose={() => setIsUseCaseModalOpen(false)}
                width={600}
                className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
                contentClassName="!shadow-none"
            >
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            {editingUseCase ? 'Edit Template' : 'New Template'}
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                            Create a shortcut for your distributions
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Settings className="w-6 h-6 text-primary" />
                    </div>
                </div>

                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Case Name</label>
                            <Input
                                value={useCaseForm.title}
                                onChange={(e) => setUseCaseForm({ ...useCaseForm, title: e.target.value })}
                                placeholder="e.g. Hackathon Rewards"
                                className="rounded-xl h-12 text-sm font-bold border-gray-100 dark:border-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Label</label>
                            <Input
                                value={useCaseForm.badgeText}
                                onChange={(e) => setUseCaseForm({ ...useCaseForm, badgeText: e.target.value })}
                                placeholder="e.g. Popular"
                                className="rounded-xl h-12 text-sm font-bold border-gray-100 dark:border-gray-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Short Description</label>
                        <Input
                            value={useCaseForm.description}
                            onChange={(e) => setUseCaseForm({ ...useCaseForm, description: e.target.value })}
                            placeholder="Briefly describe this template..."
                            className="rounded-xl h-12 text-sm font-bold border-gray-100 dark:border-gray-800"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Amount (₦)</label>
                            <Input
                                value={useCaseForm.amount}
                                onChange={(e) => setUseCaseForm({ ...useCaseForm, amount: e.target.value })}
                                placeholder="100,000"
                                className="rounded-xl h-12 text-sm font-bold border-gray-100 dark:border-gray-800 font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Distribution</label>
                            <Select
                                options={[
                                    { value: 'equal', label: 'Equal Split' },
                                    { value: 'custom', label: 'Weighted/Custom' }
                                ]}
                                value={{ value: useCaseForm.distributionType, label: useCaseForm.distributionType === 'equal' ? 'Equal Split' : 'Weighted/Custom' }}
                                onChange={(option: any) => setUseCaseForm({ ...useCaseForm, distributionType: option.value })}
                                className="rounded-xl"
                                classNames={{
                                    control: (state) => cn(
                                        'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 h-12 rounded-xl text-sm font-bold',
                                        state.isFocused && 'ring-2 ring-primary/20 border-primary'
                                    )
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Purpose</label>
                            <Input
                                value={useCaseForm.purpose}
                                onChange={(e) => setUseCaseForm({ ...useCaseForm, purpose: e.target.value })}
                                placeholder="e.g. Event Allocation"
                                className="rounded-xl h-12 text-sm font-bold border-gray-100 dark:border-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Program Link</label>
                            <Input
                                value={useCaseForm.groupName}
                                onChange={(e) => setUseCaseForm({ ...useCaseForm, groupName: e.target.value })}
                                placeholder="e.g. My_Project_ID"
                                className="rounded-xl h-12 text-sm font-bold border-gray-100 dark:border-gray-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Select Visual Icon</label>
                        <div className="grid grid-cols-7 gap-3">
                            {Object.keys(ICON_MAP).map(name => {
                                const Icon = ICON_MAP[name];
                                return (
                                    <button
                                        key={name}
                                        onClick={() => setUseCaseForm({ ...useCaseForm, iconName: name })}
                                        className={cn(
                                            "w-11 h-11 rounded-xl border flex items-center justify-center transition-all",
                                            useCaseForm.iconName === name
                                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                : "bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-primary/30"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8 pt-0 flex flex-col-reverse sm:flex-row gap-4">
                    <button
                        onClick={() => setIsUseCaseModalOpen(false)}
                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-sm font-black text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUseCaseSubmit}
                        disabled={!useCaseForm.title || !useCaseForm.amount || !useCaseForm.purpose}
                        className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-black text-sm rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                    >
                        <Zap className="w-5 h-5" />
                        <span>{editingUseCase ? 'Update Template' : 'Save Template'}</span>
                    </button>
                </div>
            </Dialog>

            <ConfirmDialog
                isOpen={isDeleteConfirmOpen}
                type="danger"
                title="Delete Template"
                confirmText="Delete Template"
                onConfirm={handleConfirmDeleteUseCase}
                onCancel={() => setIsDeleteConfirmOpen(false)}
                onClose={() => setIsDeleteConfirmOpen(false)}
                confirmButtonProps={{
                    className: 'bg-rose-500 hover:bg-rose-600'
                }}
            >
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                    Are you sure you want to delete <span className="font-black text-gray-900 dark:text-white uppercase tracking-tight">"{useCases.find(u => u.id === deletingUseCaseId)?.title}"</span>?
                    This template will be permanently removed from your shortcuts.
                </p>
            </ConfirmDialog>
        </div>
    )
}

