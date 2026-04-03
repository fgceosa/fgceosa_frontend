import { handlers } from '@/auth'
import { checkOAuthCredentials, printOAuthCallbackURLs } from '@/utils/checkOAuthCredentials'

// Check OAuth credentials in development
if (process.env.NODE_ENV === 'development') {
    checkOAuthCredentials()
    printOAuthCallbackURLs()
}

export const { GET, POST } = handlers
