'use client'

export const checkAuthState = () => {
    if (typeof window === 'undefined') return

    console.log('🔍 AUTHENTICATION STATE DEBUG')
    console.log('================================')
    
    // Check localStorage
    console.log('📦 LocalStorage:')
    Object.keys(localStorage).forEach(key => {
        console.log(`  ${key}: ${localStorage.getItem(key)}`)
    })
    
    // Check sessionStorage  
    console.log('📦 SessionStorage:')
    Object.keys(sessionStorage).forEach(key => {
        console.log(`  ${key}: ${sessionStorage.getItem(key)}`)
    })
    
    // Check cookies
    console.log('🍪 Cookies:')
    if (document.cookie) {
        document.cookie.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=')
            console.log(`  ${name}: ${value}`)
        })
    } else {
        console.log('  No cookies found')
    }
    
    // Check specifically for NextAuth cookies
    console.log('🔐 NextAuth Cookies:')
    const authCookies = document.cookie.split(';')
        .filter(cookie => 
            cookie.includes('next-auth') || 
            cookie.includes('authjs') || 
            cookie.includes('__Secure-')
        )
    
    if (authCookies.length > 0) {
        authCookies.forEach(cookie => {
            console.log(`  ${cookie.trim()}`)
        })
    } else {
        console.log('  ✅ No NextAuth cookies found')
    }
    
    console.log('================================')
}

export default checkAuthState