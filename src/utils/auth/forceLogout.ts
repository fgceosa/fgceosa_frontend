import appConfig from '@/configs/app.config'

/**
 * Performs a LIGHTNING-FAST atomic logout.
 * Removes the 10-second delay by bypassing async library calls 
 * and using direct browser navigation.
 */
const forceLogout = () => {
  if (typeof window !== 'undefined') {
    // 1. Instant synchronous wipe
    localStorage.clear()
    sessionStorage.clear()

    // 2. Wipe non-httpOnly cookies as a fast first pass
    const host = window.location.hostname
    const domains = [host, `.${host}`, '']
    const names = ['qorebit.session-token', 'next-auth.session-token', 'authjs.session-token']
    names.forEach(name => {
      domains.forEach(d => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; ${d ? `domain=${d};` : ''} secure; samesite=lax`
      })
    })

    // 3. HARD REDIRECT TO LOGOUT API
    // We use .replace() to avoid adding the secure session to history
    // and to trigger the navigation instantly.
    window.location.replace('/api/auth/logout')
  }
}

export default forceLogout