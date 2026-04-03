/**
 * Simple relative time formatter
 */
export const formatRelativeTime = (timestamp: number) => {
    if (!timestamp) return 'No activity'
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
}

/**
 * Format exact time
 */
export const formatExactTime = (timestamp: number) => {
    if (!timestamp) return 'Never'
    return new Date(timestamp).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })
}

/**
 * Format currency in NGN
 */
export const formatCurrency = (amount: number) => {
    return `₦${amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}`
}

/**
 * Format credits with 2 decimal places
 * Robust version that handles string, number, or undefined
 */
export const formatCredits = (amount: number | string | undefined) => {
    if (amount === undefined || amount === null) return '0.00'
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return '0.00'
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}


/**
 * Generate user tag
 */
export const generateUserTag = (id: string) => {
    return `@qor${id.substring(0, 5)}`
}
