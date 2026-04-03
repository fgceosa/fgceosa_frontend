'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Shield,
    History as HistoryIcon,
    AlertTriangle,
    Save,
    Activity,
    Zap,
    CheckCircle,
    Info,
    DollarSign,
    Box
} from 'lucide-react'
import {
    Button,
    Card,
    Input,
    Tabs,
    Badge,
    Notification,
    toast,
    Tag,
    Select
} from '@/components/ui'
import { apiGetRegistryModel, apiUpdateModelRegistry, apiTestModelConnection } from '@/services/modelRegistry/modelRegistryService'
import type { RegistryModel } from '../types'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { VscServer } from 'react-icons/vsc'
import QorebitLoading from '@/components/shared/QorebitLoading'

dayjs.extend(relativeTime)

export default function ModelDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const modelId = params.modelId as string

    const [model, setModel] = useState<RegistryModel | null>(null)
    const [formData, setFormData] = useState<Partial<RegistryModel>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isTesting, setIsTesting] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [hasChanges, setHasChanges] = useState(false)

    const fetchModel = useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await apiGetRegistryModel(modelId)
            setModel(data)
            setFormData(data)
        } catch (error) {
            console.error('Failed to fetch model details', error)
            toast.push(
                <Notification type="danger" duration={3000}>
                    Failed to load model details
                </Notification>
            )
        } finally {
            setIsLoading(false)
        }
    }, [modelId])

    useEffect(() => {
        if (modelId) {
            fetchModel()
        }
    }, [modelId, fetchModel])

    useEffect(() => {
        if (model) {
            const changed = JSON.stringify(formData) !== JSON.stringify(model)
            setHasChanges(changed)
        }
    }, [formData, model])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await apiUpdateModelRegistry(modelId, formData)
            setModel(formData as RegistryModel)
            toast.push(
                <Notification type="success" title="Success" duration={3000}>
                    Model registry updated successfully
                </Notification>
            )
        } catch (error) {
            console.error('Failed to save model:', error)
            toast.push(
                <Notification type="danger" duration={3000}>
                    Failed to save changes
                </Notification>
            )
        } finally {
            setIsSaving(false)
        }
    }

    const handleTestConnection = async () => {
        setIsTesting(true)
        try {
            const result = await apiTestModelConnection(modelId)

            if (result.status === 'success') {
                toast.push(
                    <Notification type="success" title="Gateway Connected" duration={6000}>
                        {result.message}
                    </Notification>
                )
            } else {
                toast.push(
                    <Notification type="danger" title="Connection Failed" duration={8000}>
                        {result.message}
                    </Notification>
                )
            }
        } catch (error) {
            console.error('Connection test failed:', error)
            toast.push(
                <Notification type="danger" title="System Error" duration={6000}>
                    Could not reach connection service.
                </Notification>
            )
        } finally {
            setIsTesting(false)
        }
    }

    if (isLoading) {
        return <QorebitLoading />
    }

    if (!model) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
                    <AlertTriangle className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Model Not Found</h3>
                <p className="text-gray-500 mb-6 max-w-sm">The model identity '{modelId}' could not be located in the global registry.</p>
                <Button variant="solid" onClick={() => router.push('/hq/model-registry')}>Return to Registry</Button>
            </div>
        )
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30'
            case 'Experimental': return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30'
            case 'Restricted': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40'
            case 'Deprecated': return 'bg-gray-100 text-gray-700 dark:bg-gray-800'
            default: return 'bg-gray-50 text-gray-600'
        }
    }

    return (
        <div className="py-8 px-4 sm:px-6 space-y-10 w-full animate-in fade-in duration-700">
            {/* Enterprise Header Section */}
            <div className="flex flex-col space-y-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="plain"
                            onClick={() => router.push('/hq/model-registry')}
                            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl h-10 w-10 p-0 flex items-center justify-center transition-all active:scale-95 border border-gray-100 dark:border-gray-700 shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </Button>
                        <div className="h-px w-8 bg-gray-200 dark:bg-gray-800"></div>
                        <span className="text-[10px] font-black text-primary">Model Governance Console</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary rounded-2xl blur-xl opacity-20"></div>
                                <div className="relative p-3 bg-gradient-to-br from-primary to-blue-700 rounded-2xl shadow-xl ring-4 ring-white dark:ring-gray-900">
                                    <VscServer className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">
                                    {model.name}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black text-gray-400">{model.provider}</span>
                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                    <Badge className={classNames(
                                        "px-2 py-0.5 text-[8px] font-black rounded-md",
                                        getStatusStyle(model.status)
                                    )}>
                                        {model.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="plain"
                                onClick={handleTestConnection}
                                loading={isTesting}
                                className="h-12 px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-black text-[10px] rounded-2xl shadow-sm transition-all hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Zap className="w-4 h-4" />
                                Test Connectivity
                            </Button>
                            <Button
                                variant="solid"
                                loading={isSaving}
                                disabled={!hasChanges}
                                onClick={handleSave}
                                className="h-12 px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    <p className="text-base text-gray-500 dark:text-gray-400 font-medium max-w-3xl leading-relaxed lg:pl-20 line-clamp-2">
                        {model.description}
                    </p>
                </div>
            </div>

            {/* Dashboard Tabs Overlay */}
            <div className="w-full">
                <Tabs
                    value={activeTab}
                    onChange={(val) => setActiveTab(val)}
                    className="w-full"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <Tabs.TabList className="flex gap-2 p-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 w-full overflow-x-auto">
                            {[
                                { value: 'overview', label: 'Basic Info', icon: <Info className="w-3.5 h-3.5" /> },
                                { value: 'pricing', label: 'Cost & Speeds', icon: <DollarSign className="w-3.5 h-3.5" /> },
                                { value: 'compliance', label: 'Safety & Rules', icon: <Shield className="w-3.5 h-3.5" /> },
                                { value: 'lifecycle', label: 'History', icon: <HistoryIcon className="w-3.5 h-3.5" /> },
                            ].map((tab) => (
                                <Tabs.TabNav
                                    key={tab.value}
                                    value={tab.value}
                                    className={classNames(
                                        "flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300 whitespace-nowrap",
                                        activeTab === tab.value
                                            ? "bg-white dark:bg-gray-900 text-primary shadow-sm"
                                            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                    )}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </Tabs.TabNav>
                            ))}
                        </Tabs.TabList>
                    </div>

                    <div className="mt-8">
                        {/* BASIC INFO TAB */}
                        <Tabs.TabContent value="overview" className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="w-full p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-visible">
                                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Info className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Essential Profile</h3>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 pl-1">
                                            Display Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="e.g. GPT-4o Enterprise"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="h-14 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 pl-1">
                                            Memory Size (Context)
                                        </label>
                                        <Input
                                            placeholder="e.g. 128k"
                                            value={formData.contextSize || ''}
                                            onChange={(e) => setFormData({ ...formData, contextSize: e.target.value })}
                                            className="h-14 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-4 md:col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 pl-1">
                                            Model Description
                                        </label>
                                        <textarea
                                            placeholder="Briefly describe the purpose of this model..."
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full min-h-[56px] p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-y"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 pl-1">
                                            Status
                                        </label>
                                        <Select
                                            options={[
                                                { label: 'Approved', value: 'Approved' },
                                                { label: 'Experimental', value: 'Experimental' },
                                                { label: 'Restricted', value: 'Restricted' },
                                                { label: 'Deprecated', value: 'Deprecated' },
                                            ]}
                                            value={formData.status ? { label: formData.status, value: formData.status } as any : null}
                                            onChange={(val) => setFormData({ ...formData, status: val?.value as any })}
                                            menuPosition="fixed"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 pl-1">
                                            Availability Level
                                        </label>
                                        <Select
                                            options={[
                                                { label: 'Global', value: 'Global' },
                                                { label: 'Enterprise-only', value: 'Enterprise-only' },
                                                { label: 'Internal', value: 'Internal' },
                                            ]}
                                            value={formData.availability ? { label: formData.availability, value: formData.availability } as any : null}
                                            onChange={(val) => setFormData({ ...formData, availability: val?.value as any })}
                                            menuPosition="fixed"
                                        />
                                    </div>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card className="p-8 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-[2rem]">
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Box className="w-5 h-5 text-primary" />
                                        Skills & Features
                                    </h3>
                                    <div className="flex flex-wrap gap-3 mb-8">
                                        {(formData.capabilities || []).map(cap => (
                                            <div key={cap} className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                <span className="text-[11px] font-black text-gray-700 dark:text-gray-300">{cap}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="text-[10px] font-black text-gray-400 mb-4">Recommended Use Cases</h4>
                                        <ul className="space-y-3">
                                            {(model.bestUseCases || []).map((useCase, idx) => (
                                                <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                                                    {useCase}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Card>

                                <Card className="p-8 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-[2rem]">
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-amber-500" />
                                        Admin Notes
                                    </h3>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 pl-1">
                                            Governance Commentary
                                        </label>
                                        <textarea
                                            className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm italic text-gray-600 dark:text-amber-200/70 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                            value={formData.compliance?.internalNotes}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                compliance: { ...formData.compliance!, internalNotes: e.target.value }
                                            })}
                                            placeholder="Enter internal policy notes here..."
                                        />
                                    </div>
                                    <div className="mt-8 space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-900 dark:text-white tracking-tight">PII Cleaning</span>
                                                <span className="text-[10px] text-gray-400 font-bold tracking-widest">Automatic gateway filtering</span>
                                            </div>
                                            <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-[9px]">ENABLED</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-900 dark:text-white tracking-tight">Data Retention</span>
                                                <span className="text-[10px] text-gray-400 font-bold tracking-widest">Zero-day retention policy</span>
                                            </div>
                                            <Badge className="bg-blue-50 text-blue-700 border-none font-black text-[9px]">ENFORCED</Badge>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Tabs.TabContent>

                        {/* COST & SPEEDS TAB */}
                        <Tabs.TabContent value="pricing" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <DollarSign className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Costs & Capacity</h3>
                                </div>
                                <div className="p-8 space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 pl-1">Reading Cost (1k Tokens)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <Input
                                                    type="number"
                                                    value={formData.inputPrice}
                                                    onChange={(e) => setFormData({ ...formData, inputPrice: parseFloat(e.target.value) })}
                                                    className="pl-10 h-14 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 pl-1">Writing Cost (1k Tokens)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <Input
                                                    type="number"
                                                    value={formData.outputPrice}
                                                    onChange={(e) => setFormData({ ...formData, outputPrice: parseFloat(e.target.value) })}
                                                    className="pl-10 h-14 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <h4 className="text-[10px] font-black text-gray-400 pl-1">Processing Speeds (Tier Limits)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-gray-400 pl-1">Requests per Minute (RPM)</label>
                                                <Input
                                                    type="number"
                                                    value={formData.tokenLimits?.rpm}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        tokenLimits: { ...formData.tokenLimits!, rpm: parseInt(e.target.value) }
                                                    })}
                                                    className="h-14 rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-gray-400 pl-1">Tokens per Minute (TPM)</label>
                                                <Input
                                                    type="number"
                                                    value={formData.tokenLimits?.tpm}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        tokenLimits: { ...formData.tokenLimits!, tpm: parseInt(e.target.value) }
                                                    })}
                                                    className="h-14 rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Tabs.TabContent>

                        {/* SAFETY & RULES TAB */}
                        <Tabs.TabContent value="compliance" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="p-8 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-[2rem]">
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-emerald-500" />
                                        Safety & Privacy
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl flex items-start gap-4">
                                            <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900 dark:text-emerald-400 mb-1">Enterprise Ready</h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">This model meets the internal security baseline for processing enterprise data.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-gray-400 pl-1">Safety Certifications</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {(model.compliance?.safetyTags || []).map(tag => (
                                                    <Tag key={tag} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-black text-[9px] px-3 py-1 rounded-lg shadow-sm">
                                                        {tag}
                                                    </Tag>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-8 bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-[2rem]">
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Data Control</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-900 dark:text-white">PII Cleaning</span>
                                                <span className="text-[10px] text-gray-400 font-bold">Automatic gateway filtering</span>
                                            </div>
                                            <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-[9px]">ENABLED</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-900 dark:text-white">Data Retention</span>
                                                <span className="text-[10px] text-gray-400 font-bold">Zero-day retention policy</span>
                                            </div>
                                            <Badge className="bg-blue-50 text-blue-700 border-none font-black text-[9px]">ENFORCED</Badge>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Tabs.TabContent>

                        {/* HISTORY TAB */}
                        <Tabs.TabContent value="lifecycle" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <HistoryIcon className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white">History & Updates</h3>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
                                        {(model.lifecycle?.statusHistory || []).map((history, idx) => (
                                            <div key={idx} className="flex items-start gap-10 relative">
                                                <div className={classNames(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white dark:border-gray-900 z-10 shadow-sm",
                                                    idx === 0 ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                                )}>
                                                    <Activity className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 pb-10">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className="text-sm font-black text-gray-900 dark:text-white">Status Changed to {history.status}</h4>
                                                        <span className="text-[10px] text-gray-400 font-bold">{dayjs(history.date).format('MMM DD, YYYY')}</span>
                                                    </div>
                                                    <p className="text-[10px] font-black text-gray-500 dark:text-gray-400">Executed by {history.changedBy} • Verified by Qorebit Root</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {model.lifecycle.deprecationDate && (
                                        <div className="mt-6 p-6 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center border border-rose-100 dark:border-rose-800">
                                                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-rose-700 dark:text-rose-400">Scheduled Deprecation</h4>
                                                    <p className="text-[10px] text-rose-600/70 dark:text-rose-400/50 font-bold">End of Life: {dayjs(model.lifecycle.deprecationDate).format('MMM DD, YYYY')}</p>
                                                </div>
                                            </div>
                                            <Button variant="solid" className="bg-rose-600 text-white h-10 px-6 text-[10px]">Review Migration</Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Tabs.TabContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
