'use client'

import React, { useState, useEffect } from 'react'
import {
    Dialog,
    Input,
    Notification,
    toast
} from '@/components/ui'
import {
    Building2,
    X,
    User,
    Mail,
    FileText,
    Sparkles,
    Send,
    Shield,
    Zap
} from 'lucide-react'
import classNames from '@/utils/classNames'
import { apiCreateOrganizationWithAdmin } from '@/services/PlatformOrganizationService'

interface CreateOrganizationModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function CreateOrganizationModal({
    isOpen,
    onClose,
    onSuccess
}: CreateOrganizationModalProps) {
    const [orgName, setOrgName] = useState<string>('')
    const [orgDescription, setOrgDescription] = useState<string>('')
    const [adminEmail, setAdminEmail] = useState<string>('')
    const [adminName, setAdminName] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setOrgName('')
            setOrgDescription('')
            setAdminEmail('')
            setAdminName('')
            setErrors({})
        }
    }, [isOpen])

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!orgName.trim()) {
            newErrors.orgName = 'Organization name is required'
        }
        if (!adminName.trim()) {
            newErrors.adminName = 'Admin name is required'
        }
        if (!adminEmail.trim()) {
            newErrors.adminEmail = 'Admin email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
            newErrors.adminEmail = 'Invalid email format'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleCreate = async () => {
        if (!validateForm()) return

        setLoading(true)
        try {
            await apiCreateOrganizationWithAdmin({
                name: orgName.trim(),
                description: orgDescription.trim() || undefined,
                admin_email: adminEmail.trim(),
                admin_name: adminName.trim()
            })

            toast.push(
                <Notification title="Success" type="success">
                    Organization "{orgName}" created successfully. Setup email sent to {adminEmail}.
                </Notification>
            )

            // Reset form and close modal
            handleReset()
            onSuccess()
            onClose()
        } catch (err: any) {
            toast.push(
                <Notification title="Creation Failed" type="danger">
                    {err.response?.data?.detail || 'An error occurred while creating the organization.'}
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setOrgName('')
        setOrgDescription('')
        setAdminEmail('')
        setAdminName('')
        setErrors({})
    }

    const handleClose = () => {
        handleReset()
        onClose()
    }

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
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Create Organization</h3>
                            <p className="text-[10px] font-black text-gray-400 mt-0.5">
                                Register new organization with admin
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

                {/* Form Body */}
                <div className="px-8 py-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Organization Details Section */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 pl-1">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-400">Organization Name</label>
                            </div>
                            <Input
                                placeholder="e.g., Acme Corporation, Tech Innovations Ltd"
                                value={orgName}
                                onChange={(e) => {
                                    setOrgName(e.target.value)
                                    if (errors.orgName) setErrors(prev => ({ ...prev, orgName: '' }))
                                }}
                                className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold"
                            />
                            {errors.orgName && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.orgName}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 pl-1">
                                <FileText className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-400">Description (Optional)</label>
                            </div>
                            <Input
                                textArea
                                placeholder="Brief description of the organization and its purpose..."
                                value={orgDescription}
                                onChange={(e) => setOrgDescription(e.target.value)}
                                rows={3}
                                className="rounded-2xl border-gray-100 dark:border-gray-800 text-base font-bold"
                            />
                        </div>
                    </div>

                    {/* Admin User Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pl-1">
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-primary" />
                            <label className="text-[10px] font-black text-gray-400">Initial Admin User</label>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 pl-1">
                                <User className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-400">Admin Full Name</label>
                            </div>
                            <Input
                                placeholder="e.g., John Doe"
                                value={adminName}
                                onChange={(e) => {
                                    setAdminName(e.target.value)
                                    if (errors.adminName) setErrors(prev => ({ ...prev, adminName: '' }))
                                }}
                                className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold"
                            />
                            {errors.adminName && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.adminName}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 pl-1">
                                <Mail className="w-3.5 h-3.5 text-primary" />
                                <label className="text-[10px] font-black text-gray-400">Admin Email Address</label>
                            </div>
                            <Input
                                type="email"
                                placeholder="admin@company.com"
                                value={adminEmail}
                                onChange={(e) => {
                                    setAdminEmail(e.target.value)
                                    if (errors.adminEmail) setErrors(prev => ({ ...prev, adminEmail: '' }))
                                }}
                                className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold"
                            />
                            {errors.adminEmail && <p className="text-[10px] text-rose-500 font-bold pl-1">{errors.adminEmail}</p>}
                        </div>
                    </div>

                    {/* Info Boxes */}
                    <div className="space-y-4">
                        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10 flex items-start gap-4">
                            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                <Send className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-black text-emerald-700 dark:text-emerald-500 block">Setup Email Notification</span>
                                <p className="text-[10px] font-bold text-emerald-600/70 leading-relaxed">
                                    A secure setup link will be sent to the admin's email. They'll use it to set their password and access the organization.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-amber-50/50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/10 flex items-start gap-4">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-black text-amber-700 dark:text-amber-500 block">Default Role Assignment</span>
                                <p className="text-[10px] font-bold text-amber-600/70 leading-relaxed">
                                    The admin user will be assigned the <span className="font-black">org_super_admin</span> role with full organizational privileges.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 pb-8 pt-6 flex gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <button
                        onClick={handleClose}
                        className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="flex-1 h-14 bg-primary hover:bg-primary-deep text-white font-black text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        <Zap className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
                        <span>{loading ? 'Creating...' : 'Create Organization'}</span>
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
