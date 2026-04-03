'use server'

import { signOut } from '@/auth'
import appConfig from '@/configs/app.config'
import { redirect } from 'next/navigation'

const handleSignOut = async () => {
    try {
        await signOut({ 
            redirectTo: appConfig.unAuthenticatedEntryPath,
            redirect: true 
        })
    } catch (error) {
        // Fallback redirect if signOut fails
        console.error('SignOut error:', error)
        redirect(appConfig.unAuthenticatedEntryPath)
    }
}

export default handleSignOut
