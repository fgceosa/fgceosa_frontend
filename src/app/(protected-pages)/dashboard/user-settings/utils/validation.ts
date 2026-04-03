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

    // Username validation (optional)
    if (data.username && data.username.trim()) {
        if (data.username.length > 150) {
            errors.username = 'Username must be less than 150 characters'
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
            errors.username = 'Username can only contain letters, numbers, underscores, and hyphens'
        }
    }

    // First name validation (optional)
    if (data.firstName && data.firstName.trim()) {
        if (data.firstName.length > 150) {
            errors.firstName = 'First name must be less than 150 characters'
        }
    }

    // Last name validation (optional)
    if (data.lastName && data.lastName.trim()) {
        if (data.lastName.length > 150) {
            errors.lastName = 'Last name must be less than 150 characters'
        }
    }

    // Phone validation (optional)
    if (data.phone && data.phone.trim()) {
        if (data.phone.length > 50) {
            errors.phone = 'Phone number must be less than 50 characters'
        }
    }

    // Address validation (optional)
    if (data.address && data.address.trim()) {
        if (data.address.length > 500) {
            errors.address = 'Address must be less than 500 characters'
        }
    }

    // City validation (optional)
    if (data.city && data.city.trim()) {
        if (data.city.length > 255) {
            errors.city = 'City must be less than 255 characters'
        }
    }

    // State validation (optional)
    if (data.state && data.state.trim()) {
        if (data.state.length > 255) {
            errors.state = 'State must be less than 255 characters'
        }
    }

    // Postcode validation (optional)
    if (data.postcode && data.postcode.trim()) {
        if (data.postcode.length > 50) {
            errors.postcode = 'Postcode must be less than 50 characters'
        }
    }

    // Country validation (optional)
    if (data.country && data.country.trim()) {
        if (data.country.length > 255) {
            errors.country = 'Country must be less than 255 characters'
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
