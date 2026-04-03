'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input, Button, Notification, toast } from '@/components/ui'
import { Lock, Eye, EyeOff, CheckCircle2, Sparkles } from 'lucide-react'
import { apiResetPassword } from '@/services/AuthService'

export default function SetupAccountPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [setupComplete, setSetupComplete] = useState(false)

    useEffect(() => {
        if (!token) {
            toast.push(
                <Notification title="Invalid Link" type="danger">
                    The setup link is invalid or has expired. Please contact support.
                </Notification>
            )
            setTimeout(() => router.push('/sign-in'), 3000)
        }
    }, [token, router])

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!password) {
            newErrors.password = 'Password is required'
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm() || !token) return

        setLoading(true)
        try {
            await apiResetPassword({
                newPassword: password,
                confirmPassword,
                token
            })

            setSetupComplete(true)

            toast.push(
                <Notification title="Account Setup Complete" type="success">
                    Your account has been set up successfully. Redirecting to login...
                </Notification>
            )

            setTimeout(() => {
                router.push('/sign-in')
            }, 2000)
        } catch (err: any) {
            toast.push(
                <Notification title="Setup Failed" type="danger">
                    {err.response?.data?.detail || 'An error occurred during account setup. Please try again.'}
                </Notification>
            )
        } finally {
            setLoading(false)
        }
    }

    if (setupComplete) {
        return (
            <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Setup Complete!
                </h2>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                    Redirecting you to login...
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Info Box */}
            <div className="p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10 flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-500 block">
                        Welcome to Your Organization
                    </span>
                    <p className="text-[10px] font-bold text-blue-600/70 leading-relaxed mt-1">
                        You&apos;ve been set up as the organization administrator. Complete your account setup to access your dashboard.
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSetup} className="space-y-6">
                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 pl-1">
                        <Lock className="w-3.5 h-3.5 text-primary" />
                        <label className="text-[10px] font-bold text-gray-400">
                            Create Password
                        </label>
                    </div>
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter a strong password (min. 8 characters)"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
                            }}
                            className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-[10px] text-rose-500 font-bold pl-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 pl-1">
                        <Lock className="w-3.5 h-3.5 text-primary" />
                        <label className="text-[10px] font-bold text-gray-400">
                            Confirm Password
                        </label>
                    </div>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value)
                                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }))
                            }}
                            className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-base font-bold pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-[10px] text-rose-500 font-bold pl-1">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>

                {/* Password Requirements */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-bold text-gray-400 mb-2">
                        Password Requirements
                    </p>
                    <ul className="space-y-1 text-[10px] font-bold text-gray-500">
                        <li className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                            At least 8 characters
                        </li>
                        <li className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${password === confirmPassword && password.length > 0 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                            Passwords match
                        </li>
                    </ul>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-primary hover:bg-primary-deep text-white font-bold text-sm rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Lock className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
                    <span>{loading ? 'Setting Up...' : 'Complete Setup'}</span>
                </button>
            </form>
        </div>
    )
}
