'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, Input } from '@/components/ui'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { Lock, Eye, EyeOff, Check, X, ShieldCheck } from 'lucide-react'
import classNames from '@/utils/classNames'
import {
    changePassword,
    selectPasswordLoading,
    selectPasswordChangeSuccess,
    resetPasswordSuccess,
} from '@/store/slices/userSettings'
import { validatePasswordChangeForm, validatePassword } from '../utils/validation'
import type { ChangePasswordRequest, PasswordValidationErrors } from '../types'

export default function PasswordSettingsCard() {
    const dispatch = useDispatch()
    const isLoading = useSelector(selectPasswordLoading)
    const isSuccess = useSelector(selectPasswordChangeSuccess)

    const [formData, setFormData] = useState<ChangePasswordRequest & { confirmPassword: string }>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    const [validationErrors, setValidationErrors] = useState<PasswordValidationErrors>({})

    // Validate password strength in real-time
    const passwordValidation = validatePassword(formData.newPassword)

    // Reset form on success
    useEffect(() => {
        if (isSuccess) {
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            })
            toast.push(
                <Notification type="success">
                    Password changed successfully
                </Notification>,
                { placement: 'top-center' }
            )
            dispatch(resetPasswordSuccess())
        }
    }, [isSuccess, dispatch])

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error for this field
        if (validationErrors[field as keyof PasswordValidationErrors]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[field as keyof PasswordValidationErrors]
                return newErrors
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        const errors = validatePasswordChangeForm(formData)
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            toast.push(
                <Notification type="danger">
                    Please fix the validation errors
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        try {
            await dispatch(
                changePassword({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }) as any
            ).unwrap()
            // Success is handled by useEffect watching isSuccess
        } catch (error: any) {
            // Extract error message
            let errorMessage = 'Failed to change password'

            if (typeof error === 'string') {
                errorMessage = error
            } else if (error?.message) {
                errorMessage = error.message
            }

            // Show specific error for incorrect password
            if (errorMessage.toLowerCase().includes('incorrect password')) {
                errorMessage = 'Current password is incorrect. Please try again.'
            }

            toast.push(
                <Notification type="danger" duration={5000}>
                    {errorMessage}
                </Notification>,
                { placement: 'top-center' }
            )

            // Clear current password field on error
            setFormData(prev => ({
                ...prev,
                currentPassword: ''
            }))
        }
    }

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
    }

    return (
        <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="p-5 sm:p-8 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl border" style={{ backgroundColor: 'rgba(139, 0, 0, 0.05)', borderColor: 'rgba(139, 0, 0, 0.1)' }}>
                        <Lock className="h-6 w-6" style={{ color: '#8B0000' }} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Security & Password</h3>
                        <p className="text-base text-gray-500 dark:text-gray-400 mt-0.5">
                            Manage your password and security preferences
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                    {/* Left Column: Form Fields */}
                    <div className="space-y-6">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <label htmlFor="currentPassword" className="text-sm font-black text-gray-900 dark:text-gray-100">
                                Current Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showPasswords.current ? 'text' : 'password'}
                                    className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all text-base"
                                    value={formData.currentPassword}
                                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                    placeholder="••••••••"
                                    invalid={!!validationErrors.currentPassword}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {validationErrors.currentPassword && (
                                <p className="text-sm font-bold text-red-500 mt-1">{validationErrors.currentPassword}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="text-sm font-black text-gray-900 dark:text-gray-100">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPasswords.new ? 'text' : 'password'}
                                    className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all text-base"
                                    value={formData.newPassword}
                                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                    placeholder="••••••••"
                                    invalid={!!validationErrors.newPassword}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-black text-gray-900 dark:text-gray-100">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all text-base"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    placeholder="••••••••"
                                    invalid={!!validationErrors.confirmPassword}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="text-sm font-bold text-red-500 mt-1">{validationErrors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Password Health & Submitting */}
                    <div className="space-y-6 sm:space-y-8">
                        {/* Real-time Health Check */}
                        <div className="p-5 sm:p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-base font-bold text-gray-900 dark:text-white">Password Health</h4>
                                <div className={classNames(
                                    "px-2 py-1 rounded text-[10px] font-black",
                                    passwordValidation.strength === 'strong' ? "bg-emerald-100 text-emerald-700" :
                                        passwordValidation.strength === 'medium' ? "bg-amber-100 text-amber-700" :
                                            "bg-red-100 text-red-700"
                                )}>
                                    {passwordValidation.strength}
                                </div>
                            </div>

                            {/* Strength Meter */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className={classNames("h-1.5 rounded-full transition-all duration-500",
                                    formData.newPassword ? (passwordValidation.strength !== 'weak' || passwordValidation.strength === 'weak' ? 'bg-red-500' : 'bg-gray-200') : 'bg-gray-200'
                                )} />
                                <div className={classNames("h-1.5 rounded-full transition-all duration-500",
                                    passwordValidation.strength === 'medium' || passwordValidation.strength === 'strong' ? 'bg-yellow-500' : 'bg-gray-200'
                                )} />
                                <div className={classNames("h-1.5 rounded-full transition-all duration-500",
                                    passwordValidation.strength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                                )} />
                            </div>

                            <ul className="space-y-3">
                                {[
                                    { label: 'Minimum 8 characters', met: passwordValidation.requirements.minLength },
                                    { label: 'Uppercase & Lowercase', met: passwordValidation.requirements.hasUppercase && passwordValidation.requirements.hasLowercase },
                                    { label: 'At least one number', met: passwordValidation.requirements.hasNumber },
                                    { label: 'Special character', met: passwordValidation.requirements.hasSpecial },
                                ].map((req, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium">
                                        <div className={classNames(
                                            "w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                            req.met ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                                        )}>
                                            {req.met ? <Check size={10} strokeWidth={4} /> : <div className="w-1 h-1 bg-current rounded-full" />}
                                        </div>
                                        <span className={req.met ? "text-gray-900 dark:text-white" : "text-gray-400"}>{req.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4">
                            <Button
                                className="w-full text-white font-bold h-14 px-10 rounded-xl shadow-xl disabled:shadow-none transition-all flex items-center justify-center gap-2 hover:opacity-90"
                                style={{ backgroundColor: '#8B0000', boxShadow: '0 20px 25px -5px rgba(139, 0, 0, 0.25)' }}
                                variant="solid"
                                type="submit"
                                loading={isLoading}
                                disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                            >
                                <ShieldCheck className="w-5 h-5" />
                                {isLoading ? 'Updating Security...' : 'Update Password'}
                            </Button>
                            <p className="text-[10px] text-center text-gray-400 mt-4 font-black">
                                Last updated: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </Card>
    )
}
