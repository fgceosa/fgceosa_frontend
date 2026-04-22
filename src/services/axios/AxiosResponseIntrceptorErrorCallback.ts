import axios from 'axios'
import forceLogout from '@/utils/auth/forceLogout'

const AxiosResponseIntrceptorErrorCallback = (error: any) => {
    /** handle response error here */
    if (axios.isCancel(error)) {
        return
    }

    const { response, config, code } = error
    const isNetworkError = error.message === 'Network Error' || code === 'ERR_NETWORK'
    const isTimeout = code === 'ECONNABORTED' || error.message?.includes('timeout')
    const isOnline = typeof window !== 'undefined' ? window.navigator.onLine : true
    const isTabVisible = typeof document !== 'undefined' ? document.visibilityState === 'visible' : true

    // Check if it's a background polling request that we might want to be more quiet about
    // (e.g. notifications, wallet balance, health checks, etc)
    const isPolling = config?.url?.includes('notifications') || 
                      config?.url?.includes('credits/balance') || 
                      config?.url?.includes('ai/v1/health') ||
                      config?.url?.includes('user/credits') ||
                      config?.url?.includes('dashboard/metrics') ||
                      config?.url?.includes('usage/stats') ||
                      config?.url?.includes('dashboard/admin-stats') ||
                      config?.url?.includes('dashboard/member-summary')

    if (response) {
        if (response.status === 401) {
            console.error('🔒 Session expired or unauthorized. Logging out.')
            forceLogout()
        }

        // Handle the specific 403 "Could not validate credentials" from our backend
        if (response.status === 403 && (response.data as any)?.detail === 'Could not validate credentials') {
            console.error('🛡️ Identity mismatch or invalid token. Logging out for safety.')
            forceLogout()
        }

        // Silent fail for 404s on polling/soft-fail URLs
        if (response.status === 404 && isPolling) {
            console.warn(`🔍 Soft-fail endpoint naturally 404'd: ${config?.url}`)
            return
        }

        // Suppress console noise for expected 400s (e.g. duplicate event registration)
        // These are handled gracefully in the UI layer
        if (response.status === 400 && config?.url?.includes('/register')) {
            return Promise.reject(error)
        }
    }

    // Quieter logging for polling errors when the device is offline
    if (isNetworkError || isTimeout) {
        if (!isOnline) {
            console.warn('📶 Device is offline. Request failed.')
            return
        }
        
        // Prevent console spam from background polls hitting a sleeping backend
        // or temporary network drops, even if the tab is visible.
        if (isPolling) {
            console.warn(`📡 Background poll ${isTimeout ? 'timed out' : 'failed'} silently:`, config?.url)
            return
        }
    }

    // If there's no config and no response, this is likely a CORS-blocked or
    // aborted request with no useful detail — log a concise warning instead.
    if (!config && !response) {
        console.warn(`🌐 Api ${isNetworkError ? '[NETWORK]' : '[TIMEOUT]'} error (no request config — possible CORS block or aborted request):`, error.message || 'unknown')
        return
    }

    const status = response?.status || 'NO_STATUS'
    const method = config?.method?.toUpperCase() || 'UNKNOWN'
    const url = config?.url || 'UNKNOWN'
    const label = isTimeout ? '[TIMEOUT]' : (isNetworkError ? '[NETWORK]' : `[HTTP ${status}]`)

    // Comprehensive logging for debugging network errors
    console.error(`🌐 Api Error ${label}: ${method} ${url}`, {
        message: error.message || 'No error message',
        code: code || 'NO_CODE',
        url,
        method,
        online: isOnline,
        visible: isTabVisible,
        status,
        data: response?.data,
        timestamp: new Date().toISOString()
    })
}

export default AxiosResponseIntrceptorErrorCallback
