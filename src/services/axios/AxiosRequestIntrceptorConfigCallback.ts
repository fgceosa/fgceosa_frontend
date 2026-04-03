import type { InternalAxiosRequestConfig } from 'axios'
import { getAccessToken } from '@/utils/auth/getClientSession'

const AxiosRequestIntrceptorConfigCallback = async (
    config: InternalAxiosRequestConfig,
) => {
    /** Add authentication token to requests */
    let token = getAccessToken()

    /** 
     * URL Normalization: Remove leading slash if present
     * When baseURL has a path (e.g. /api/v1/), Axios will discard that path 
     * if the request URL begins with a leading slash. Normalizing to relative paths
     * ensures consistency across all service calls.
     */
    if (config.url && config.url.startsWith('/')) {
        config.url = config.url.substring(1)
    }

    // Fallback: If no token in localStorage, check Redux store (useful for first load)
    if (!token) {
        try {
            const { default: store } = await import('@/store')
            const state = store.getState()
            // @ts-ignore - accessToken is injected into session in auth.config.ts but might not be in generic type
            token = (state.auth.session.session as any)?.accessToken || null
            if (token) {
                console.debug('🔑 Token retrieved from Redux store fallback')
            }
        } catch (e) {
            // Store might not be fully initialized or other error
        }
    }

    console.log('🌐 Axios Request Interceptor:', {
        url: config.url,
        hasToken: !!token,
        token: token ? token.substring(0, 20) + '...' : 'NONE'
    })

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}

export default AxiosRequestIntrceptorConfigCallback
