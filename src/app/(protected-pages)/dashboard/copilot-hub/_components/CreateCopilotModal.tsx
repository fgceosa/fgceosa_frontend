'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hook'
import {
    Dialog,
    Input,
    Select,
    Notification,
    toast,
} from '@/components/ui'
import { Bot, Sparkles, X, Globe, Code2, FileUp, Image as ImageIcon, Mic, Link, Brain, Zap, Check } from 'lucide-react'
import classNames from '@/utils/classNames'
import type { Copilot, CopilotCategory, CopilotCapability, CreateCopilotPayload, CopilotVisibility } from '../types'
import { COPILOT_CATEGORIES, COPILOT_MODELS, COPILOT_CAPABILITIES } from '../types'
import { apiCreateCopilot } from '@/services/CopilotService'
import useCurrentSession from '@/utils/hooks/useCurrentSession'

interface CreateCopilotModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (copilot: Copilot) => void
}

const getVisibilityOptions = (userRole: string) => {
    const options = [
        { value: 'private', label: 'Private', description: 'Only you can access' },
        { value: 'workspace', label: 'Workspace', description: 'Workspace members can access' },
        { value: 'public', label: 'Public', description: 'Anyone can access' },
    ]

    if (userRole === 'user') {
        return options.filter(o => o.value !== 'workspace')
    }

    return options
}

export default function CreateCopilotModal({
    isOpen,
    onClose,
    onSuccess,
}: CreateCopilotModalProps) {
    const { session } = useCurrentSession()
    const userRole = (session?.user as any)?.role || ''
    const VISIBILITY_OPTIONS = getVisibilityOptions(userRole)
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<CreateCopilotPayload>>({
        name: '',
        description: '',
        category: 'general',
        domain: '',
        visibility: 'private',
        model: 'gpt-4o',
        systemPrompt: '',
        welcomeMessage: '',
        suggestedPrompts: [],
        capabilities: [],
        temperature: 0.7,
        maxTokens: 4096,
        tags: [],
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [suggestedPromptInput, setSuggestedPromptInput] = useState('')

    const validateStep = (currentStep: number): boolean => {
        const newErrors: Record<string, string> = {}

        if (currentStep === 1) {
            if (!formData.name?.trim()) {
                newErrors.name = 'Name is required'
            }
            if (!formData.description?.trim()) {
                newErrors.description = 'Description is required'
            }
        }

        if (currentStep === 2) {
            if (!formData.systemPrompt?.trim()) {
                newErrors.systemPrompt = 'System prompt is required'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1)
        }
    }

    const handleBack = () => {
        setStep(step - 1)
    }

    const handleSubmit = async () => {
        if (!validateStep(step)) return

        setIsLoading(true)
        try {
            // Call the real API
            const payload: CreateCopilotPayload = {
                name: formData.name!,
                description: formData.description || '',
                category: formData.category as CopilotCategory,
                domain: formData.domain || undefined,
                visibility: formData.visibility as CopilotVisibility,
                model: formData.model!,
                systemPrompt: formData.systemPrompt || '',
                welcomeMessage: formData.welcomeMessage || '',
                suggestedPrompts: formData.suggestedPrompts || [],
                capabilities: formData.capabilities || [],
                temperature: (formData.temperature !== undefined && !isNaN(formData.temperature)) ? formData.temperature : 0.7,
                maxTokens: (formData.maxTokens !== undefined && !isNaN(formData.maxTokens) && formData.maxTokens >= 1) ? formData.maxTokens : 4096,
                tags: formData.tags || [],
            }

            const newCopilot = await apiCreateCopilot(payload)

            toast.push(
                <Notification title="Success" type="success">
                    Copilot "{newCopilot.name}" created successfully!
                </Notification>
            )

            onSuccess(newCopilot)
            handleReset()
            // Redirect to settings page to add context and publish
            router.push(`/dashboard/copilot-hub/${newCopilot.id}/settings`)
        } catch (error: unknown) {
            console.error('Failed to create copilot:', error)

            let errorMessage = 'Failed to create copilot. Please try again.'
            const errorData = (error as any)?.response?.data

            if (errorData?.detail) {
                if (Array.isArray(errorData.detail)) {
                    errorMessage = errorData.detail.map((err: any) =>
                        `${err.loc[err.loc.length - 1]}: ${err.msg}`
                    ).join(', ')
                } else {
                    errorMessage = errorData.detail
                }
            } else if (errorData?.message) {
                errorMessage = errorData.message
            } else if (error instanceof Error) {
                errorMessage = error.message
            }

            toast.push(
                <Notification title="Error" type="danger">
                    {errorMessage}
                </Notification>
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setStep(1)
        setFormData({
            name: '',
            description: '',
            category: 'general',
            domain: '',
            visibility: 'private',
            model: 'gpt-4o',
            systemPrompt: '',
            welcomeMessage: '',
            suggestedPrompts: [],
            capabilities: [],
            temperature: 0.7,
            maxTokens: 4096,
            tags: [],
        })
        setErrors({})
        setSuggestedPromptInput('')
    }

    const handleClose = () => {
        handleReset()
        onClose()
    }

    const addSuggestedPrompt = () => {
        if (suggestedPromptInput.trim()) {
            setFormData({
                ...formData,
                suggestedPrompts: [...(formData.suggestedPrompts || []), suggestedPromptInput.trim()],
            })
            setSuggestedPromptInput('')
        }
    }

    const removeSuggestedPrompt = (index: number) => {
        setFormData({
            ...formData,
            suggestedPrompts: formData.suggestedPrompts?.filter((_, i) => i !== index),
        })
    }

    const toggleCapability = (cap: CopilotCapability) => {
        const current = formData.capabilities || []
        if (current.includes(cap)) {
            setFormData({ ...formData, capabilities: current.filter(c => c !== cap) })
        } else {
            setFormData({ ...formData, capabilities: [...current, cap] })
        }
    }

    const categoryOptions = COPILOT_CATEGORIES.map(c => ({ value: c.value, label: c.label }))
    const modelOptions = COPILOT_MODELS.map(m => ({ value: m.value, label: m.label }))
    const visibilityOptions = VISIBILITY_OPTIONS.map(v => ({ value: v.value, label: v.label }))

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            closable={false}
            width={640}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
                            <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Create Copilot</h3>
                            <p className="text-[10px] font-black text-gray-400 mt-0.5">
                                Step {step} of 3: {step === 1 ? 'Basic Identity' : step === 2 ? 'Intelligence Config' : 'Capabilities'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="flex h-1 bg-gray-50 dark:bg-gray-800/50">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`flex-1 transition-all duration-500 ${s <= step ? 'bg-primary' : 'bg-transparent'
                                }`}
                        />
                    ))}
                </div>

                {/* Form Body */}
                <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 pb-40">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pl-1">
                                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-900 dark:text-gray-100">Copilot Name</label>
                                </div>
                                <Input
                                    placeholder="e.g., Code Assistant, Research Helper"
                                    value={formData.name}
                                    onChange={(e: any) => {
                                        setFormData({ ...formData, name: e.target.value })
                                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
                                    }}
                                    className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold"
                                />
                                {errors.name && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pl-1">
                                    <Bot className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-900 dark:text-gray-100">Description</label>
                                </div>
                                <Input
                                    textArea
                                    placeholder="Describe what your copilot does and how it can help users..."
                                    value={formData.description}
                                    onChange={(e: any) => {
                                        setFormData({ ...formData, description: e.target.value })
                                        if (errors.description) setErrors(prev => ({ ...prev, description: '' }))
                                    }}
                                    rows={3}
                                    className="rounded-2xl border-gray-100 dark:border-gray-800 text-base font-bold"
                                />
                                {errors.description && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pl-1">
                                    <Globe className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-900 dark:text-gray-100">Assigned Domain (Optional)</label>
                                </div>
                                <Input
                                    placeholder="e.g., Financial Analysis, Customer Support, Internal HR"
                                    value={formData.domain}
                                    onChange={(e: any) => setFormData({ ...formData, domain: e.target.value })}
                                    className="rounded-xl border-gray-100 dark:border-gray-800 h-10 text-sm font-bold"
                                />
                                <p className="text-[10px] text-gray-500 font-medium pl-1 italic">
                                    If set, the copilot will strictly refuse queries outside this domain.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 pl-1">
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-primary" />
                                        <label className="text-[10px] font-black text-gray-900 dark:text-gray-100">Category</label>
                                    </div>
                                    <Select
                                        options={categoryOptions}
                                        value={categoryOptions.find(o => o.value === formData.category)}
                                        onChange={(option: any) => setFormData({ ...formData, category: option?.value as CopilotCategory })}
                                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 pl-1">
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-primary" />
                                        <label className="text-[10px] font-black text-gray-900 dark:text-gray-100">Visibility</label>
                                    </div>
                                    <Select
                                        options={visibilityOptions}
                                        value={visibilityOptions.find(o => o.value === formData.visibility)}
                                        onChange={(option: any) => setFormData({ ...formData, visibility: option?.value as CopilotVisibility })}
                                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Configuration */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pl-1">
                                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-900 dark:text-gray-100">AI Model Selection</label>
                                </div>
                                <Select
                                    options={modelOptions}
                                    value={modelOptions.find(o => o.value === formData.model)}
                                    onChange={(option: any) => setFormData({ ...formData, model: option?.value })}
                                    className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pl-1">
                                    <Bot className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-900 dark:text-gray-100">System Instruction / Persona</label>
                                </div>
                                <Input
                                    textArea
                                    placeholder="Define your copilot's personality, expertise, and behavior..."
                                    value={formData.systemPrompt}
                                    onChange={(e: any) => {
                                        setFormData({ ...formData, systemPrompt: e.target.value })
                                        if (errors.systemPrompt) setErrors(prev => ({ ...prev, systemPrompt: '' }))
                                    }}
                                    rows={4}
                                    className="rounded-2xl border-gray-100 dark:border-gray-800 text-base font-bold"
                                />
                                {errors.systemPrompt && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.systemPrompt}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 pl-1">
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-primary" />
                                        <label className="text-[10px] font-black text-gray-900 dark:text-gray-100">Temperature ({formData.temperature})</label>
                                    </div>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={2}
                                        step={0.1}
                                        value={formData.temperature}
                                        onChange={(e: any) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 pl-1">
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-primary" />
                                        <label className="text-[10px] font-black text-gray-900 dark:text-gray-100">Max Tokens ({formData.maxTokens})</label>
                                    </div>
                                    <Input
                                        type="number"
                                        min={256}
                                        max={32768}
                                        step={256}
                                        value={formData.maxTokens}
                                        onChange={(e: any) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Capabilities & Prompts */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pl-1">
                                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-900 dark:text-gray-100">Core Capabilities</label>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {COPILOT_CAPABILITIES.map((cap) => {
                                        const isSelected = formData.capabilities?.includes(cap.value)
                                        const Icon = {
                                            'web-search': Globe,
                                            'code-execution': Code2,
                                            'file-upload': FileUp,
                                            'image-generation': ImageIcon,
                                            'voice-input': Mic,
                                            'api-integration': Link,
                                            'memory': Brain,
                                            'function-calling': Zap,
                                            'vision': ImageIcon
                                        }[cap.value] || Sparkles

                                        return (
                                            <button
                                                key={cap.value}
                                                onClick={() => toggleCapability(cap.value)}
                                                className={classNames(
                                                    "group relative p-4 rounded-2xl border-2 text-left transition-all duration-300",
                                                    isSelected
                                                        ? "border-primary bg-primary/[0.02] shadow-sm ring-4 ring-primary/5"
                                                        : "bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={classNames(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border",
                                                        isSelected
                                                            ? "bg-primary text-white border-primary"
                                                            : "bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700 group-hover:text-primary group-hover:border-primary/20"
                                                    )}>
                                                        <Icon className="w-5 h-5" strokeWidth={2.5} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <p className={classNames(
                                                                "text-xs font-black truncate",
                                                                "text-gray-900 dark:text-white"
                                                            )}>
                                                                {cap.label}
                                                            </p>
                                                            {isSelected && (
                                                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
                                                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className={classNames(
                                                            "text-[10px] font-medium leading-relaxed mt-0.5 line-clamp-1",
                                                            "text-gray-500 dark:text-gray-400"
                                                        )}>
                                                            {cap.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pl-1">
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-primary" />
                                    <label className="text-[10px] font-black text-gray-900 dark:text-gray-100">Suggested Prompts</label>
                                </div>
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="Add a sample prompt..."
                                        value={suggestedPromptInput}
                                        onChange={(e: any) => setSuggestedPromptInput(e.target.value)}
                                        onKeyPress={(e: any) => e.key === 'Enter' && addSuggestedPrompt()}
                                        className="flex-1 rounded-2xl border-gray-100 dark:border-gray-800 h-14 text-base font-bold shadow-sm focus:shadow-blue-500/5"
                                    />
                                    <button
                                        onClick={addSuggestedPrompt}
                                        className="px-8 h-14 rounded-2xl bg-[#0055BA] text-white text-[11px] font-black hover:bg-[#004299] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Add</span>
                                    </button>
                                </div>
                                {formData.suggestedPrompts && formData.suggestedPrompts.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.suggestedPrompts.map((prompt, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 group transition-all hover:border-rose-200"
                                            >
                                                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{prompt}</span>
                                                <button
                                                    onClick={() => removeSuggestedPrompt(idx)}
                                                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-5 sm:px-8 pb-5 sm:pb-8 pt-4 sm:pt-6 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] z-10 relative">
                    {step === 1 ? (
                        <button
                            onClick={handleClose}
                            className="w-full sm:flex-1 h-14 sm:h-16 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800 text-sm sm:text-base font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shrink-0"
                        >
                            Cancel
                        </button>
                    ) : (
                        <button
                            onClick={handleBack}
                            className="w-full sm:flex-1 h-14 sm:h-16 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800 text-sm sm:text-base font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shrink-0"
                        >
                            Back
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="w-full sm:flex-[2.5] h-16 sm:h-20 bg-primary hover:bg-primary-deep text-white font-black text-lg sm:text-xl rounded-xl sm:rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 sm:gap-4 group"
                        >
                            <span>Continue</span>
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-12" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full sm:flex-[2.5] h-16 sm:h-20 bg-primary hover:bg-primary-deep text-white font-black text-lg sm:text-xl rounded-xl sm:rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 sm:gap-4 group disabled:opacity-50"
                        >
                            <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${isLoading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
                            <span>{isLoading ? 'Creating...' : 'Create Copilot'}</span>
                        </button>
                    )}
                </div>
            </div>
        </Dialog>
    )
}
