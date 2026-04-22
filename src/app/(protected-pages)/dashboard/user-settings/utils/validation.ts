import {
    PASSWORD_REQUIREMENTS,
    PHONE_REGEX,
    FIELD_LENGTHS,
} from '@/store/slices/userSettings/constants'
import type {
    ProfileValidationErrors,
    PasswordValidationErrors,
    UpdateProfileRequest,
} from '../types'

/**
 * Validate profile form
 */
export function validateProfileForm(
    data: UpdateProfileRequest
): ProfileValidationErrors {
    const errors: ProfileValidationErrors = {}

    // First name validation (required)
    if (!data.firstName || !data.firstName.trim()) {
        errors.firstName = 'First name is required'
    } else if (data.firstName.length > 150) {
        errors.firstName = 'First name must be less than 150 characters'
    }

    // Last name validation (required)
    if (!data.lastName || !data.lastName.trim()) {
        errors.lastName = 'Last name is required'
    } else if (data.lastName.length > 150) {
        errors.lastName = 'Last name must be less than 150 characters'
    }

    // Nickname validation (optional)
    if (data.nickname && data.nickname.trim() && data.nickname.length > 150) {
        errors.nickname = 'Nickname must be less than 150 characters'
    }

    // Email validation (required)
    if (!data.email || !data.email.trim()) {
        errors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Invalid email address'
    }

    // Alternative Email validation (optional)
    if (data.alternativeEmail && data.alternativeEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.alternativeEmail)) {
        errors.alternativeEmail = 'Invalid alternative email address'
    }

    // Gender validation (required)
    if (!data.gender || !data.gender.trim()) {
        errors.gender = 'Gender is required'
    }

    // FGCE Set validation (required)
    if (!data.fgceSet || !data.fgceSet.trim()) {
        errors.fgceSet = 'FGCE Set is required'
    }

    // FGCE House validation (required)
    if (!data.fgceHouse || !data.fgceHouse.trim()) {
        errors.fgceHouse = 'FGCE House is required'
    }

    // City validation (required)
    if (!data.city || !data.city.trim()) {
        errors.city = 'City is required'
    }

    // Country validation (optional)
    if (data.country && data.country.trim() && data.country.length > 255) {
        errors.country = 'Country must be less than 255 characters'
    }

    // Password validation (only if provided)
    const hasPassword = data.password && data.password.trim()
    const hasConfirmPassword = data.confirmPassword && data.confirmPassword.trim()

    if (hasPassword || hasConfirmPassword) {
        if (!hasPassword) {
            errors.password = 'Password is required when confirming'
        } else {
            const passwordValidation = validatePassword(data.password!)
            if (!passwordValidation.isValid) {
                errors.password = passwordValidation.errors[0]
            }
        }

        if (!hasConfirmPassword) {
            errors.confirmPassword = 'Please confirm your password'
        } else if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match'
        }
    }

    return errors
}

/**
 * Password strength calculator
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong'

function calculatePasswordStrength(password: string): PasswordStrength {
    let strength = 0

    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return 'weak'
    if (strength <= 4) return 'medium'
    return 'strong'
}

/**
 * Validate password
 */
export function validatePassword(password: string): {
    isValid: boolean
    errors: string[]
    strength: PasswordStrength
    requirements: {
        minLength: boolean
        hasUppercase: boolean
        hasLowercase: boolean
        hasNumber: boolean
        hasSpecial: boolean
    }
} {
    const errors: string[] = []

    const requirements = {
        minLength: password.length >= PASSWORD_REQUIREMENTS.MIN_LENGTH,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    }

    if (!requirements.minLength) {
        errors.push(
            `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`
        )
    }

    if (password.length > PASSWORD_REQUIREMENTS.MAX_LENGTH) {
        errors.push(
            `Password must be less than ${PASSWORD_REQUIREMENTS.MAX_LENGTH} characters`
        )
    }

    if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && !requirements.hasUppercase) {
        errors.push('Password must contain at least one uppercase letter')
    }

    if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && !requirements.hasLowercase) {
        errors.push('Password must contain at least one lowercase letter')
    }

    if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBER && !requirements.hasNumber) {
        errors.push('Password must contain at least one number')
    }

    if (PASSWORD_REQUIREMENTS.REQUIRE_SPECIAL && !requirements.hasSpecial) {
        errors.push('Password must contain at least one special character')
    }

    const strength = calculatePasswordStrength(password)

    return {
        isValid: errors.length === 0,
        errors,
        strength,
        requirements,
    }
}

/**
 * Validate password change form
 */
export function validatePasswordChangeForm(data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}): PasswordValidationErrors {
    const errors: PasswordValidationErrors = {}
    const { currentPassword, newPassword, confirmPassword } = data

    // Current password validation
    if (currentPassword.trim() === '') {
        errors.currentPassword = 'Current password is required'
    }

    // New password validation
    if (newPassword.trim() === '') {
        errors.newPassword = 'New password is required'
    } else {
        const passwordValidation = validatePassword(newPassword)
        if (!passwordValidation.isValid) {
            errors.newPassword = passwordValidation.errors[0]
        }
    }

    // Confirm password validation
    if (confirmPassword.trim() === '') {
        errors.confirmPassword = 'Please confirm your new password'
    } else if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
    }

    // Check if new password is same as current
    if (
        currentPassword.trim() !== '' &&
        newPassword.trim() !== '' &&
        currentPassword === newPassword
    ) {
        errors.newPassword = 'New password must be different from current password'
    }

    return errors
}

/**
 * Validate file for avatar upload
 */
export function validateAvatarFile(file: File): string | null {
    const maxSizeBytes = 5 * 1024 * 1024 // 5MB

    if (file.size > maxSizeBytes) {
        return 'File size must be less than 5MB'
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        return 'File must be a JPEG, PNG, or WebP image'
    }

    return null
}
