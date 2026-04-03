'use client'

import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Upload } from '@/components/ui/Upload'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { HiOutlineUser } from 'react-icons/hi'
import { Save, User, Trash2, Mail } from 'lucide-react'
import {
    updateUserProfile,
    uploadAvatar,
    deleteAvatar,
    selectUserProfile,
    selectUpdateLoading,
    selectAvatarLoading,
    selectProfileCompletionPercentage,
} from '@/store/slices/userSettings'
import { validateProfileForm, validateAvatarFile } from '../utils/validation'
import type { UpdateProfileRequest, ProfileValidationErrors } from '../types'
import { config } from '@/configs/env'
import DeleteAvatarModal from './DeleteAvatarModal'

// Helper to get full avatar URL
const getAvatarUrl = (avatarPath: string | null): string => {
    if (!avatarPath) return ''
    // If already a full URL, return as is
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath
    }
    // Prepend API base URL
    const apiUrl = config.apiUrl || ''
    return `${apiUrl}${avatarPath}`
}

export default function UserProfileForm() {
    const dispatch = useDispatch()

    // Selectors
    const userProfile = useSelector(selectUserProfile)
    const isUpdateLoading = useSelector(selectUpdateLoading)
    const isAvatarLoading = useSelector(selectAvatarLoading)
    const completionPercentage = useSelector(selectProfileCompletionPercentage)

    // Form state
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        firstName: '',
        lastName: '',
        username: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
    })

    const [validationErrors, setValidationErrors] = useState<ProfileValidationErrors>({})
    const [hasChanges, setHasChanges] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Pre-fill form with user data
    useEffect(() => {
        if (userProfile) {
            let fName = userProfile.firstName || ''
            let lName = userProfile.lastName || ''

            // Fallback: if names are empty but a full name exists, try to split it
            if (!fName && !lName && userProfile.name && userProfile.name !== 'User' && userProfile.name !== userProfile.email) {
                const parts = userProfile.name.split(' ')
                fName = parts[0]
                lName = parts.slice(1).join(' ')
            }

            setFormData({
                firstName: fName,
                lastName: lName,
                username: userProfile.username || '',
                phone: userProfile.phone || '',
                address: userProfile.address || '',
                city: userProfile.city || '',
                state: userProfile.state || '',
                postcode: userProfile.postcode || '',
                country: userProfile.country || '',
            })
        }
    }, [userProfile])

    // Track changes
    useEffect(() => {
        if (userProfile) {
            const changed =
                formData.firstName !== (userProfile.firstName || '') ||
                formData.lastName !== (userProfile.lastName || '') ||
                formData.username !== (userProfile.username || '') ||
                formData.phone !== (userProfile.phone || '') ||
                formData.address !== (userProfile.address || '') ||
                formData.city !== (userProfile.city || '') ||
                formData.state !== (userProfile.state || '') ||
                formData.postcode !== (userProfile.postcode || '') ||
                formData.country !== (userProfile.country || '')
            setHasChanges(changed)
        }
    }, [formData, userProfile])

    // Handle input change
    const handleInputChange = (field: keyof UpdateProfileRequest, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error for this field
        if (validationErrors[field]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    // Handle avatar upload
    const handleAvatarUpload = async (files: File[]) => {
        if (files.length === 0) return

        const file = files[0]

        // Validate file
        const validationError = validateAvatarFile(file)
        if (validationError) {
            toast.push(
                <Notification type="danger">{validationError}</Notification>,
                { placement: 'top-center' }
            )
            return
        }

        try {
            await dispatch(uploadAvatar(file) as any).unwrap()
            toast.push(
                <Notification type="success">
                    Avatar uploaded successfully
                </Notification>,
                { placement: 'top-center' }
            )
        } catch (error: any) {
            toast.push(
                <Notification type="danger">
                    {error || 'Failed to upload avatar'}
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    // Handle avatar delete
    const handleAvatarDelete = async () => {
        setIsDeleting(true)
        try {
            await dispatch(deleteAvatar() as any).unwrap()
            toast.push(
                <Notification type="success">
                    Profile picture removed successfully
                </Notification>,
                { placement: 'top-center' }
            )
            setIsDeleteModalOpen(false)
        } catch (error: any) {
            toast.push(
                <Notification type="danger">
                    {error || 'Failed to remove profile picture'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsDeleting(false)
        }
    }

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        const errors = validateProfileForm(formData)
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

        // Only send non-empty fields
        const dataToSend: UpdateProfileRequest = {}
        if (formData.firstName && formData.firstName.trim()) {
            dataToSend.firstName = formData.firstName.trim()
        }
        if (formData.lastName && formData.lastName.trim()) {
            dataToSend.lastName = formData.lastName.trim()
        }
        if (formData.username && formData.username.trim()) {
            dataToSend.username = formData.username.trim()
        }
        if (formData.phone && formData.phone.trim()) {
            dataToSend.phone = formData.phone.trim()
        }
        if (formData.address && formData.address.trim()) {
            dataToSend.address = formData.address.trim()
        }
        if (formData.city && formData.city.trim()) {
            dataToSend.city = formData.city.trim()
        }
        if (formData.state && formData.state.trim()) {
            dataToSend.state = formData.state.trim()
        }
        if (formData.postcode && formData.postcode.trim()) {
            dataToSend.postcode = formData.postcode.trim()
        }
        if (formData.country && formData.country.trim()) {
            dataToSend.country = formData.country.trim()
        }

        try {
            await dispatch(updateUserProfile(dataToSend) as any).unwrap()
            toast.push(
                <Notification type="success">
                    Profile updated successfully
                </Notification>,
                { placement: 'top-center' }
            )
            setHasChanges(false)
        } catch (error: any) {
            toast.push(
                <Notification type="danger">
                    {error || 'Failed to update profile'}
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    // Get user initials for avatar
    const userInitials = useMemo(() => {
        const first = formData.firstName?.[0] || ''
        const last = formData.lastName?.[0] || ''
        return (first + last).toUpperCase() || 'U'
    }, [formData.firstName, formData.lastName])

    return (
        <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
            {/* Form Header with Gradient Accent */}
            <div className="relative p-5 sm:p-8 pb-0 sm:pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-6 sm:pb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h3>
                            <p className="text-base text-gray-500 dark:text-gray-400 mt-0.5">
                                Public profile and contact information
                            </p>
                        </div>
                    </div>

                    {/* Premium Completion Tracker */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <svg className="w-12 h-12 transform -rotate-90">
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    className="text-gray-200 dark:text-gray-700"
                                />
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    strokeDasharray={125.6}
                                    strokeDashoffset={125.6 - (125.6 * completionPercentage) / 100}
                                    className="text-primary transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <span className="absolute text-xs font-bold text-primary">{completionPercentage}%</span>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs font-black text-gray-900 dark:text-gray-100 leading-none mb-1">Status</p>
                            <p className="text-base font-bold text-gray-900 dark:text-white">Profile Strength</p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-8 sm:space-y-10">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-blue-50/30 dark:bg-blue-900/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-blue-100/50 dark:border-blue-800/20">
                    <div className="relative group">
                        <Avatar
                            size={100}
                            className="ring-4 ring-white dark:ring-gray-900 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                            icon={<HiOutlineUser className="text-4xl" />}
                            src={getAvatarUrl(userProfile?.avatar ?? null)}
                        >
                            {userInitials}
                        </Avatar>
                        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                            <Upload
                                showList={false}
                                uploadLimit={1}
                                onChange={handleAvatarUpload}
                                disabled={isAvatarLoading}
                            >
                                <Save className="w-6 h-6 text-white" />
                            </Upload>
                        </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-4">
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Your Photo</h4>
                            <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                                This will be displayed on your profile.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                            <Upload
                                showList={false}
                                uploadLimit={1}
                                onChange={handleAvatarUpload}
                                disabled={isAvatarLoading}
                            >
                                <Button
                                    type="button"
                                    size="sm"
                                    className="bg-primary hover:bg-primary-deep text-white hover:text-white font-bold h-10 px-6 rounded-xl shadow-lg shadow-primary/20"
                                    loading={isAvatarLoading}
                                    disabled={isAvatarLoading}
                                >
                                    Update Photo
                                </Button>
                            </Upload>
                            {userProfile?.avatar && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="plain"
                                    className="text-red-500 hover:text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 h-10 px-6 rounded-xl"
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    disabled={isAvatarLoading}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Fields Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Left Column: Basic Info */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h4 className="text-sm font-black text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">Basic Info</h4>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="username" className="text-sm font-black text-gray-900 dark:text-gray-100">Username</label>
                                    <Input
                                        id="username"
                                        className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-base"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        placeholder="johndoe"
                                        prefix={<span className="text-gray-400">@</span>}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="firstName" className="text-sm font-black text-gray-900 dark:text-gray-100">First Name</label>
                                            <Input
                                                id="firstName"
                                                className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-base"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                placeholder="John"
                                                invalid={!!validationErrors.firstName}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="lastName" className="text-sm font-black text-gray-900 dark:text-gray-100">Last Name</label>
                                            <Input
                                                id="lastName"
                                                className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-base"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                placeholder="Doe"
                                                invalid={!!validationErrors.lastName}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-black text-gray-900 dark:text-gray-100">Email Address</label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                className="h-14 bg-gray-100/50 dark:bg-gray-800/50 border-none rounded-xl cursor-not-allowed opacity-70 text-base"
                                                value={userProfile?.email || ''}
                                                disabled
                                                readOnly
                                                prefix={<Mail className="w-4 h-4 text-gray-400" />}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 rounded text-[10px] font-black text-emerald-600">Verified</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Contact & Location */}
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <h4 className="text-sm font-black text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">Contact & Location</h4>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-black text-gray-900 dark:text-gray-100">Phone Number</label>
                                        <Input
                                            id="phone"
                                            className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-base"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            invalid={!!validationErrors.phone}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="address" className="text-sm font-black text-gray-900 dark:text-gray-100">Street Address</label>
                                        <Input
                                            id="address"
                                            className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-base"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="123 Street Name"
                                            invalid={!!validationErrors.address}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="city" className="text-sm font-black text-gray-900 dark:text-gray-100">City / State</label>
                                            <Input
                                                id="city"
                                                className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-base"
                                                value={formData.city}
                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                                placeholder="New York"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="postcode" className="text-sm font-black text-gray-900 dark:text-gray-100">Zip / Postal</label>
                                            <Input
                                                id="postcode"
                                                className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-base"
                                                value={formData.postcode}
                                                onChange={(e) => handleInputChange('postcode', e.target.value)}
                                                placeholder="10001"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="country" className="text-sm font-black text-gray-900 dark:text-gray-100">Country</label>
                                        <Input
                                            id="country"
                                            className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-base"
                                            value={formData.country}
                                            onChange={(e) => handleInputChange('country', e.target.value)}
                                            placeholder="United States"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Submit Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 sm:pt-8 border-t border-gray-100 dark:border-gray-800 gap-6 sm:gap-0">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 italic text-center sm:text-left">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        All fields marked with * are optional except for required identity verification.
                    </p>
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                        <Button
                            type="button"
                            variant="plain"
                            className="font-bold text-gray-400 hover:text-gray-900 h-14 sm:h-12 px-8 rounded-xl w-full sm:w-auto"
                            onClick={() => {
                                if (userProfile) {
                                    setFormData({
                                        firstName: userProfile.firstName || '',
                                        lastName: userProfile.lastName || '',
                                        username: userProfile.username || '',
                                        phone: userProfile.phone || '',
                                        address: userProfile.address || '',
                                        city: userProfile.city || '',
                                        state: userProfile.state || '',
                                        postcode: userProfile.postcode || '',
                                        country: userProfile.country || '',
                                    })
                                }
                            }}
                            disabled={!hasChanges || isUpdateLoading}
                        >
                            Reset
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary-deep text-white font-bold h-14 sm:h-12 px-10 rounded-xl shadow-xl shadow-primary/25 disabled:shadow-none transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                            variant="solid"
                            type="submit"
                            loading={isUpdateLoading}
                            disabled={!hasChanges || isUpdateLoading}
                        >
                            {!isUpdateLoading && <Save className="w-4 h-4" />}
                            {isUpdateLoading ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </form>

            <DeleteAvatarModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleAvatarDelete}
                isDeleting={isDeleting}
            />
        </Card>
    )
}
