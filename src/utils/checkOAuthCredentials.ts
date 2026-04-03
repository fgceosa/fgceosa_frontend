/**
 * Development utility to check OAuth credentials
 * This helps identify configuration issues during development
 */
export const checkOAuthCredentials = () => {
    if (process.env.NODE_ENV === 'development') {
        const issues = []

        // Check Google credentials
        if (!process.env.GOOGLE_AUTH_CLIENT_ID || process.env.GOOGLE_AUTH_CLIENT_ID === 'your-google-client-id-here') {
            issues.push('❌ GOOGLE_AUTH_CLIENT_ID is not properly configured')
        } else {
            console.log('✅ GOOGLE_AUTH_CLIENT_ID is configured')
        }

        if (!process.env.GOOGLE_AUTH_CLIENT_SECRET || process.env.GOOGLE_AUTH_CLIENT_SECRET === 'your-google-client-secret-here') {
            issues.push('❌ GOOGLE_AUTH_CLIENT_SECRET is not properly configured')
        } else {
            console.log('✅ GOOGLE_AUTH_CLIENT_SECRET is configured')
        }

        // Check GitHub credentials
        if (!process.env.GITHUB_AUTH_CLIENT_ID || process.env.GITHUB_AUTH_CLIENT_ID === 'your-github-client-id-here') {
            issues.push('❌ GITHUB_AUTH_CLIENT_ID is not properly configured')
        } else {
            console.log('✅ GITHUB_AUTH_CLIENT_ID is configured')
        }

        if (!process.env.GITHUB_AUTH_CLIENT_SECRET || process.env.GITHUB_AUTH_CLIENT_SECRET === 'your-github-client-secret-here') {
            issues.push('❌ GITHUB_AUTH_CLIENT_SECRET is not properly configured')
        } else {
            console.log('✅ GITHUB_AUTH_CLIENT_SECRET is configured')
        }

        // Check base configuration
        if (!process.env.AUTH_SECRET) {
            issues.push('❌ AUTH_SECRET is not configured')
        } else {
            console.log('✅ AUTH_SECRET is configured')
        }

        if (!process.env.NEXTAUTH_URL) {
            issues.push('❌ NEXTAUTH_URL is not configured')
        } else {
            console.log(`✅ NEXTAUTH_URL is configured: ${process.env.NEXTAUTH_URL}`)
        }

        if (issues.length > 0) {
            console.warn('\n🚨 OAuth Configuration Issues:')
            issues.forEach(issue => console.warn(issue))
            console.warn('\n📖 Please check OAUTH_SETUP.md for detailed setup instructions\n')
            return false
        } else {
            console.log('\n✅ All OAuth credentials appear to be configured correctly\n')
            return true
        }
    }
    return true
}

/**
 * Validates that OAuth callback URLs are correctly formatted
 */
export const getOAuthCallbackURLs = () => {
    const baseURL = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
    
    return {
        google: `${cleanBaseURL}/api/auth/callback/google`,
        github: `${cleanBaseURL}/api/auth/callback/github`,
    }
}

/**
 * Development utility to print OAuth callback URLs
 */
export const printOAuthCallbackURLs = () => {
    if (process.env.NODE_ENV === 'development') {
        const urls = getOAuthCallbackURLs()
        console.log('\n📋 OAuth Callback URLs for Provider Setup:')
        console.log(`Google: ${urls.google}`)
        console.log(`GitHub: ${urls.github}`)
        console.log('\nAdd these URLs to your OAuth provider configurations\n')
    }
}
