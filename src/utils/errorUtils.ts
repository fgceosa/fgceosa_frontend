/**
 * Safely extracts a human-readable error message from various error objects
 * (e.g., Axios errors, FastAPI validation errors, basic objects, or strings).
 */
export const extractErrorMessage = (error: any, defaultMessage: string = 'An unexpected error occurred'): string => {
    if (!error) return defaultMessage

    if (typeof error === 'string') return error

    // Handle FastAPI / Pydantic validation errors: { detail: [ { msg: "...", ... } ] }
    if (error.detail && Array.isArray(error.detail)) {
        return error.detail
            .map((err: any) => err.msg || err.message || JSON.stringify(err))
            .join('; ')
    }

    // Handle common API error structures
    if (error.message && typeof error.message === 'string') return error.message
    if (error.detail && typeof error.detail === 'string') return error.detail
    if (error.error && typeof error.error === 'string') return error.error

    // Handle nested data objects (common with Axios error.response.data)
    if (error.response?.data) {
        return extractErrorMessage(error.response.data, defaultMessage)
    }

    // Fallback for array of errors
    if (Array.isArray(error)) {
        return error
            .map((err: any) => extractErrorMessage(err, ''))
            .filter(Boolean)
            .join('; ')
    }

    // Last resort: stringify if it's an object but not null
    try {
        if (typeof error === 'object') {
            return JSON.stringify(error)
        }
    } catch (e) {
        // Ignore JSON stringify errors
    }

    return String(error) || defaultMessage
}
