'use client'

import { useState, useEffect } from 'react'
import { Dialog, Input, Select, Notification, toast, Button } from '@/components/ui'
import { Server, Plus, X, Globe, Shield, Zap, Info } from 'lucide-react'
import type { RegistryModel, ModelStatus, AvailabilityScope, RegistryProvider } from '../types'
import { apiRegisterModel, apiGetRegistryProviders } from '@/services/modelRegistry/modelRegistryService'

interface RegisterModelModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function RegisterModelModal({
    isOpen,
    onClose,
    onSuccess,
}: RegisterModelModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [providers, setProviders] = useState<{ label: string, value: string }[]>([])
    const [loadingProviders, setLoadingProviders] = useState(false)

    const [formData, setFormData] = useState<any>({
        name: '',
        slug: '',
        providerId: '',
        contextSize: '',
        status: 'Approved',
        availability: 'Global',
        inputPrice: 0,
        outputPrice: 0,
    })

    useEffect(() => {
        if (isOpen) {
            fetchProviders()
        }
    }, [isOpen])

    const fetchProviders = async () => {
        setLoadingProviders(true)
        try {
            const response = await apiGetRegistryProviders()
            const options = response.providers.map((p: RegistryProvider) => ({
                label: p.name,
                value: p.id
            }))
            setProviders(options)
        } catch (error) {
            console.error('Failed to fetch providers', error)
        } finally {
            setLoadingProviders(false)
        }
    }

    const handleSubmit = async () => {
        if (!formData.name || !formData.slug || !formData.providerId) {
            toast.push(
                <Notification type="warning" duration={2000}>
                    Please fill in all core fields (Name, Slug/ID, Provider)
                </Notification>
            )
            return
        }

        setIsSubmitting(true)
        try {
            // Map camelCase to snake_case for backend if needed, 
            // but ApiService/Axios might handle it if we have interceptors.
            // Actually, AIModelCreate in backend expects provider_id, but we used alias in public.
            // Wait, AIModelCreate does NOT have aliases. I should use snake_case for POST bodies.

            const payload = {
                name: formData.name,
                slug: formData.slug,
                provider_id: formData.providerId,
                context_size: formData.contextSize,
                status: formData.status,
                availability: formData.availability,
                input_price: formData.inputPrice,
                output_price: formData.outputPrice
            }

            await apiRegisterModel(payload as any)
            toast.push(
                <Notification type="success" title="Success" duration={3000}>
                    New model registered successfully
                </Notification>
            )
            onSuccess()
            handleClose()
        } catch (error) {
            toast.push(
                <Notification type="danger" duration={3000}>
                    Failed to register model
                </Notification>
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                name: '',
                slug: '',
                providerId: '',
                contextSize: '',
                status: 'Approved',
                availability: 'Global',
                inputPrice: 0,
                outputPrice: 0,
            })
            onClose()
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            closable={false}
            width={720}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Server className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Add New AI Model</h3>
                            <p className="text-[10px] font-black text-gray-400 mt-0.5">Add a new AI model to your business library</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="px-8 py-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info Section */}
                        <div className="space-y-6 md:col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="w-4 h-4 text-primary" />
                                <h4 className="text-[11px] font-black text-gray-900 dark:text-white">Basic Info</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 pl-1">AI Model Name</label>
                                    <Input
                                        placeholder="e.g. GPT-4o"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 pl-1">Unique Slug ID</label>
                                    <Input
                                        placeholder="e.g. gpt-4o"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 pl-1">Made By</label>
                                    <Select
                                        placeholder={loadingProviders ? "Loading..." : "Select Provider"}
                                        options={providers}
                                        value={providers.find(p => p.value === formData.providerId) || null}
                                        onChange={(val) => setFormData({ ...formData, providerId: val?.value as string })}
                                        className="rounded-xl"
                                        isLoading={loadingProviders}
                                        menuPosition="fixed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 pl-1">Context Window</label>
                                    <Input
                                        placeholder="e.g. 128k"
                                        value={formData.contextSize}
                                        onChange={(e) => setFormData({ ...formData, contextSize: e.target.value })}
                                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Availability Section */}
                        <div className="space-y-6 md:col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-primary" />
                                <h4 className="text-[11px] font-black text-gray-900 dark:text-white">Availability & Safety</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 pl-1">Status</label>
                                    <Select
                                        options={[
                                            { label: 'Approved', value: 'Approved' },
                                            { label: 'Experimental', value: 'Experimental' },
                                        ]}
                                        value={{ label: formData.status, value: formData.status }}
                                        onChange={(val) => setFormData({ ...formData, status: val?.value as ModelStatus })}
                                        className="rounded-xl"
                                        menuPosition="fixed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 pl-1">Visibility</label>
                                    <Select
                                        options={[
                                            { label: 'Global', value: 'Global' },
                                            { label: 'Enterprise-only', value: 'Enterprise-only' },
                                            { label: 'Internal', value: 'Internal' },
                                        ]}
                                        value={{ label: formData.availability, value: formData.availability }}
                                        onChange={(val) => setFormData({ ...formData, availability: val?.value as AvailabilityScope })}
                                        className="rounded-xl"
                                        menuPosition="fixed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="space-y-6 md:col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-primary" />
                                <h4 className="text-[11px] font-black text-gray-900 dark:text-white">Pricing & Cost (per 1k tokens)</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 pl-1">Reading Price ($)</label>
                                    <Input
                                        type="number"
                                        placeholder="0.005"
                                        value={formData.inputPrice}
                                        onChange={(e) => setFormData({ ...formData, inputPrice: parseFloat(e.target.value) })}
                                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 pl-1">Writing Price ($)</label>
                                    <Input
                                        type="number"
                                        placeholder="0.015"
                                        value={formData.outputPrice}
                                        onChange={(e) => setFormData({ ...formData, outputPrice: parseFloat(e.target.value) })}
                                        className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-sm font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 pb-8 pt-4 flex gap-4">
                    <Button
                        variant="plain"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-black text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Registering...</span>
                            </div>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                                <span>Add New Model</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}
