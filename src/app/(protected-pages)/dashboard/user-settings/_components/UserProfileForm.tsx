'use client'

import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Upload } from '@/components/ui/Upload'
import Select from '@/components/ui/Select'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { HiOutlineUser } from 'react-icons/hi'
import { 
    Save, 
    User, 
    Trash2, 
    Mail, 
    Lock, 
    Phone, 
    MapPin, 
    Globe, 
    Users, 
    Calendar, 
    CheckCircle2,
    ShieldCheck,
    HelpCircle 
} from 'lucide-react'
import PasswordInput from '@/components/shared/PasswordInput'
import useSystemSettings from '@/utils/hooks/useSystemSettings'
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
import { getAvatarUrl } from '@/utils/imageUrl'
import DeleteAvatarModal from './DeleteAvatarModal'

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
]

const fgceHouseOptions = [
    { value: 'nnamdi_azikiwe', label: 'Nnamdi Azikiwe' },
    { value: 'obafemi_awolowo', label: 'Obafemi Awolowo' },
    { value: 'ahmadu_bello', label: 'Ahmadu Bello' },
    { value: 'tafawa_balewa', label: 'Tafawa Balewa' },
]

export default function UserProfileForm() {
    const dispatch = useDispatch()
    const { settings } = useSystemSettings()

    // Selectors
    const userProfile = useSelector(selectUserProfile)
    const isUpdateLoading = useSelector(selectUpdateLoading)
    const isAvatarLoading = useSelector(selectAvatarLoading)
    const completionPercentage = useSelector(selectProfileCompletionPercentage)

    // Form state
    const [formData, setFormData] = useState<UpdateProfileRequest>({
        firstName: '',
        lastName: '',
        nickname: '',
        password: '',
        confirmPassword: '',
        phone: '',
        gender: '',
        email: '',
        alternativeEmail: '',
        fgceSet: '',
        fgceHouse: '',
        city: '',
        country: '',
    })

    const [validationErrors, setValidationErrors] = useState<ProfileValidationErrors>({})
    const [hasChanges, setHasChanges] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Pre-fill form with user data
    useEffect(() => {
        if (userProfile) {
            setFormData({
                firstName: userProfile.firstName || '',
                lastName: userProfile.lastName || '',
                nickname: userProfile.nickname || '',
                password: '',
                confirmPassword: '',
                phone: userProfile.phone || '',
                gender: userProfile.gender || '',
                email: userProfile.email || '',
                alternativeEmail: userProfile.alternativeEmail || '',
                fgceSet: userProfile.fgceSet || '',
                fgceHouse: userProfile.fgceHouse || '',
                city: userProfile.city || '',
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
                formData.nickname !== (userProfile.nickname || '') ||
                formData.password !== '' ||
                formData.phone !== (userProfile.phone || '') ||
                formData.gender !== (userProfile.gender || '') ||
                formData.email !== (userProfile.email || '') ||
                formData.alternativeEmail !== (userProfile.alternativeEmail || '') ||
                formData.fgceSet !== (userProfile.fgceSet || '') ||
                formData.fgceHouse !== (userProfile.fgceHouse || '') ||
                formData.city !== (userProfile.city || '') ||
                formData.country !== (userProfile.country || '')
            setHasChanges(changed)
        }
    }, [formData, userProfile])

    // Handle input change
    const handleInputChange = (field: keyof UpdateProfileRequest, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (validationErrors[field]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
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

        // Clean data to send
        const dataToSend: any = { ...formData }
        // Remove confirmPassword as it's not needed by API
        delete dataToSend.confirmPassword
        // If password is empty, don't send it
        if (!dataToSend.password) {
            delete dataToSend.password
        }

        try {
            await dispatch(updateUserProfile(dataToSend) as any).unwrap()
            toast.push(
                <Notification type="success">
                    Profile updated successfully
                </Notification>,
                { placement: 'top-center' }
            )
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
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

    // Avatar handlers (keep existing ones)
    const handleAvatarUpload = async (files: File[]) => {
        if (files.length === 0) return
        const file = files[0]
        const validationError = validateAvatarFile(file)
        if (validationError) {
            toast.push(<Notification type="danger">{validationError}</Notification>, { placement: 'top-center' })
            return
        }
        try {
            await dispatch(uploadAvatar(file) as any).unwrap()
            toast.push(<Notification type="success">Avatar uploaded successfully</Notification>, { placement: 'top-center' })
        } catch (error: any) {
            toast.push(<Notification type="danger">{error || 'Failed to upload avatar'}</Notification>, { placement: 'top-center' })
        }
    }

    const handleAvatarDelete = async () => {
        setIsDeleting(true)
        try {
            await dispatch(deleteAvatar() as any).unwrap()
            toast.push(<Notification type="success">Profile picture removed successfully</Notification>, { placement: 'top-center' })
            setIsDeleteModalOpen(false)
        } catch (error: any) {
            toast.push(<Notification type="danger">{error || 'Failed to remove profile picture'}</Notification>, { placement: 'top-center' })
        } finally {
            setIsDeleting(false)
        }
    }

    // Get user initials for avatar
    const userInitials = useMemo(() => {
        const first = formData.firstName?.[0] || ''
        const last = formData.lastName?.[0] || ''
        return (first + last).toUpperCase() || 'U'
    }, [formData.firstName, formData.lastName])

    return (
        <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Form Header */}
            <div className="relative p-5 sm:p-8 pb-0 sm:pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-6 sm:pb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl border" style={{ backgroundColor: 'rgba(139, 0, 0, 0.05)', borderColor: 'rgba(139, 0, 0, 0.1)' }}>
                            <User className="h-6 w-6" style={{ color: '#8B0000' }} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">My Profile</h3>
                            <p className="text-base text-gray-500 dark:text-gray-400 mt-0.5">
                                Update your personal and security information
                            </p>
                        </div>
                    </div>

                    {/* Completion Tracker */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <svg className="w-12 h-12 transform -rotate-90">
                                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200 dark:text-gray-700" />
                                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * completionPercentage) / 100} className="transition-all duration-1000 ease-out" style={{ color: '#8B0000' }} />
                            </svg>
                            <span className="absolute text-xs font-black" style={{ color: '#8B0000' }}>{completionPercentage}%</span>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Strength</p>
                            <p className="text-base font-bold text-gray-900 dark:text-white">Profile Score</p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-10 sm:space-y-12">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 p-6 rounded-3xl border" style={{ backgroundColor: 'rgba(139, 0, 0, 0.03)', borderColor: 'rgba(139, 0, 0, 0.08)' }}>
                    <div className="relative group">
                        <Avatar 
                            size={100} 
                            className="ring-4 ring-white dark:ring-gray-900 shadow-2xl transition-transform duration-500 group-hover:scale-105" 
                            icon={<HiOutlineUser className="text-4xl" />} 
                            src={(() => {
                                const raw = getAvatarUrl(userProfile?.avatar)
                                return raw ? `${raw}${raw.includes('?') ? '&' : '?'}v=${new Date(userProfile?.updatedAt || Date.now()).getTime()}` : ''
                            })()}
                        >
                            {userInitials}
                        </Avatar>
                        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                            <Upload showList={false} uploadLimit={1} onChange={handleAvatarUpload} disabled={isAvatarLoading}>
                                <Save className="w-6 h-6 text-white" />
                            </Upload>
                        </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-4">
                        <div>
                            <h4 className="text-lg font-black text-gray-900 dark:text-white">Profile Photo</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">PNG, JPG or WebP. Max 5MB.</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                            <Upload showList={false} uploadLimit={1} onChange={handleAvatarUpload} disabled={isAvatarLoading}>
                                <Button type="button" size="sm" className="text-white hover:text-white font-black h-10 px-6 rounded-xl shadow-lg hover:opacity-90 transition-all" style={{ backgroundColor: '#8B0000' }} loading={isAvatarLoading} disabled={isAvatarLoading}>Update Photo</Button>
                            </Upload>
                             {userProfile?.avatar && (
                                <Button type="button" size="sm" variant="plain" className="text-red-500 hover:text-red-600 font-black hover:bg-red-50 dark:hover:bg-red-900/10 h-10 px-6 rounded-xl" onClick={() => setIsDeleteModalOpen(true)} disabled={isAvatarLoading}>
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Picture
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Fields Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
                    
                    {/* Basic Info */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
                            <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <h4 className="text-sm font-black text-gray-900 dark:text-gray-100 tracking-wide">Personal Details</h4>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">First Name *</label>
                                    <Input className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all font-bold" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} placeholder="Obinna" invalid={!!validationErrors.firstName} prefix={<User className="w-4 h-4 text-gray-300" />} />
                                    {validationErrors.firstName && <p className="text-[10px] text-red-500 font-black mt-1 ml-1">{validationErrors.firstName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">Last Name *</label>
                                    <Input className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all font-bold" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} placeholder="Okeke" invalid={!!validationErrors.lastName} prefix={<User className="w-4 h-4 text-gray-300" />} />
                                    {validationErrors.lastName && <p className="text-[10px] text-red-500 font-black mt-1 ml-1">{validationErrors.lastName}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">Nickname</label>
                                    <Input className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all font-bold" value={formData.nickname} onChange={(e) => handleInputChange('nickname', e.target.value)} placeholder="Obi" prefix={<HiOutlineUser className="w-4 h-4 text-gray-300" />} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">Gender *</label>
                                    <Select placeholder="Select gender" options={genderOptions} value={genderOptions.find(o => o.value === formData.gender)} onChange={(opt) => handleInputChange('gender', opt?.value || '')} className="h-14" />
                                    {validationErrors.gender && <p className="text-[10px] text-red-500 font-black mt-1 ml-1">{validationErrors.gender}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">Email Address (Primary)</label>
                                <Input 
                                    className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl transition-all font-bold opacity-60 cursor-not-allowed" 
                                    value={formData.email} 
                                    disabled={true}
                                    placeholder="obinna@example.com" 
                                    prefix={<Lock className="w-4 h-4 text-gray-400" />} 
                                />
                                <p className="text-[10px] text-gray-400 font-bold mt-1 ml-1 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> External verification required to change primary email
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">Alternative Email</label>
                                <Input className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all font-bold" value={formData.alternativeEmail} onChange={(e) => handleInputChange('alternativeEmail', e.target.value)} placeholder="alt@example.com" prefix={<Mail className="w-4 h-4 text-gray-300" />} invalid={!!validationErrors.alternativeEmail} />
                            </div>
                        </div>
                    </div>

                    {/* Security & Organization */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
                            <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <ShieldCheck className="w-4 h-4 text-gray-400" />
                            </div>
                            <h4 className="text-sm font-black text-gray-900 dark:text-gray-100 tracking-wide">Security & House Info</h4>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">New Password *</label>
                                    <PasswordInput className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all font-bold" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="••••••••" prefix={<Lock className="w-4 h-4 text-gray-300" />} invalid={!!validationErrors.password} />
                                    {validationErrors.password && <p className="text-[10px] text-red-500 font-black mt-1 ml-1">{validationErrors.password}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">Confirm Password *</label>
                                    <PasswordInput className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all font-bold" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} placeholder="••••••••" prefix={<CheckCircle2 className="w-4 h-4 text-gray-300" />} invalid={!!validationErrors.confirmPassword} />
                                    {validationErrors.confirmPassword && <p className="text-[10px] text-red-500 font-black mt-1 ml-1">{validationErrors.confirmPassword}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">Phone Number</label>
                                    <Input className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all font-bold" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+234 810..." prefix={<Phone className="w-4 h-4 text-gray-300" />} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">FGCE Set *</label>
                                    <Input className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all font-bold" value={formData.fgceSet} onChange={(e) => handleInputChange('fgceSet', e.target.value)} placeholder="Set 2005" prefix={<Calendar className="w-4 h-4 text-gray-300" />} invalid={!!validationErrors.fgceSet} />
                                    {validationErrors.fgceSet && <p className="text-[10px] text-red-500 font-black mt-1 ml-1">{validationErrors.fgceSet}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">FGCE House *</label>
                                <Select placeholder="Select house" options={fgceHouseOptions} value={fgceHouseOptions.find(o => o.value === formData.fgceHouse)} onChange={(opt) => handleInputChange('fgceHouse', opt?.value || '')} />
                                {validationErrors.fgceHouse && <p className="text-[10px] text-red-500 font-black mt-1 ml-1">{validationErrors.fgceHouse}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">City *</label>
                                    <Input className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all font-bold" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} placeholder="Enugu" prefix={<MapPin className="w-4 h-4 text-gray-300" />} invalid={!!validationErrors.city} />
                                    {validationErrors.city && <p className="text-[10px] text-red-500 font-black mt-1 ml-1">{validationErrors.city}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900 dark:text-gray-100 ml-1">Country</label>
                                    <Input className="h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-[#8B0000]/20 transition-all font-bold" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} placeholder="Nigeria" prefix={<Globe className="w-4 h-4 text-gray-300" />} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-gray-100 dark:border-gray-800 gap-8">
                    <div className="flex items-center gap-3">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 italic">Required fields are marked with *</p>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <Button type="button" variant="plain" className="font-black text-gray-400 hover:text-gray-900 h-14 px-8 rounded-2xl w-full sm:w-auto" onClick={() => userProfile && setFormData({ firstName: userProfile.firstName || '', lastName: userProfile.lastName || '', nickname: userProfile.nickname || '', password: '', confirmPassword: '', phone: userProfile.phone || '', gender: userProfile.gender || '', email: userProfile.email || '', alternativeEmail: userProfile.alternativeEmail || '', fgceSet: userProfile.fgceSet || '', fgceHouse: userProfile.fgceHouse || '', city: userProfile.city || '', country: userProfile.country || '' })} disabled={!hasChanges || isUpdateLoading}>Reset</Button>
                        <Button className="text-white font-black h-14 px-12 rounded-2xl shadow-2xl disabled:shadow-none transition-all flex items-center justify-center gap-3 w-full sm:w-auto hover:opacity-90 active:scale-95" style={{ backgroundColor: '#8B0000', boxShadow: '0 20px 25px -5px rgba(139, 0, 0, 0.25)' }} variant="solid" type="submit" loading={isUpdateLoading} disabled={!hasChanges || isUpdateLoading}>
                            {!isUpdateLoading && <Save className="w-5 h-5" />}
                            {isUpdateLoading ? 'Updating Profile...' : 'Save All Changes'}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Help & Support Section */}
            <div className="bg-gray-50/50 dark:bg-gray-800/20 p-8 sm:p-12 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-8 h-8 text-[#8B0000]" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white leading-none">Need Help?</h4>
                        <p className="text-sm font-bold text-gray-500 mt-2">Reach out to the {settings.associationName} secretariat for assistance.</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto">
                    <div className="flex flex-col gap-1 px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm min-w-[200px]">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Support</p>
                        <p className="text-[13px] font-black text-[#8B0000] dark:text-red-400 leading-none">{settings.contactEmail}</p>
                    </div>
                    <div className="flex flex-col gap-1 px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm min-w-[200px]">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Phone Support</p>
                        <p className="text-[13px] font-black text-gray-900 dark:text-white uppercase leading-none">{settings.contactPhone}</p>
                    </div>
                </div>
            </div>

            <DeleteAvatarModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleAvatarDelete} isDeleting={isDeleting} />
        </Card>
    )
}

