export const SLICE_BASE_NAME = 'userSettings'

// Password validation constants
export const PASSWORD_REQUIREMENTS = {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: false,  // Optional
    REQUIRE_LOWERCASE: false,  // Optional
    REQUIRE_NUMBER: false,     // Optional
    REQUIRE_SPECIAL: false,    // Optional
} as const

// Phone validation pattern
export const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/

// Image upload constants
export const AVATAR_UPLOAD = {
    MAX_SIZE_MB: 5,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const

// Field lengths
export const FIELD_LENGTHS = {
    FIRST_NAME_MAX: 50,
    LAST_NAME_MAX: 50,
    PHONE_MAX: 20,
    ADDRESS_MAX: 200,
    STATE_MAX: 50,
} as const
