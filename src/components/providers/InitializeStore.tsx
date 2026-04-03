'use client'

import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setSession } from '@/store/slices/auth/sessionSlice'
import { setUser } from '@/store/slices/auth/userSlice'
import { setThemeAll } from '@/store/slices/theme/themeSlice'
import { setNavigationTree } from '@/store/slices/navigation'
import { setAccessToken, clearAccessToken } from '@/utils/auth/getClientSession'
import type { ReactNode } from 'react'
import type { Session as NextAuthSession } from 'next-auth'
import type { Theme, LayoutType } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'
import type { User as AuthUser } from '@/@types/auth'
import { fetchMyOrganization } from '@/store/slices/organization/organizationThunk'

interface InitializeStoreProps {
    children: ReactNode
    session: NextAuthSession | null
    theme: Theme
    navigationTree: NavigationTree[]
}

const InitializeStore = ({
    children,
    session,
    theme,
    navigationTree
}: InitializeStoreProps) => {
    const dispatch = useAppDispatch()

    // CRITICAL: Use session email as source of truth, NOT Redux state
    // Redux state can be stale from persistence, causing identity confusion
    const storedUserEmail = useAppSelector(state => state.auth.user.email)
    const signedIn = useAppSelector(state => state.auth.session.signedIn)
    const lastSessionEmailRef = useRef<string | undefined>(undefined)

    useEffect(() => {
        // KILL SWITCH: If the URL says we just logged out, IGNORE any session data
        // from the server and force a clean state.
        const isHardLogout = typeof window !== 'undefined' && window.location.search.includes('logout=true')

        if (isHardLogout) {
            console.log('🛡️ InitializeStore: Hard Logout detected. Blocking session sync.')
            try {
                // Wipe the persistent storage immediately to prevent selection of old data
                localStorage.removeItem('persist:root')
                localStorage.removeItem('qorebit.accessToken')

                // Nuke memory state
                dispatch(setSession(null))
                dispatch(setUser({
                    avatar: '',
                    userName: '',
                    email: '',
                    authority: [],
                    permissions: []
                }))
                clearAccessToken()
            } catch (e) { }
            return
        }

        const currentSessionEmail = session?.user?.email || undefined

        // CRITICAL IDENTITY GUARD: 
        // If Redux says we're signed in as User A, but the Server Session says User B,
        // we must nuke everything immediately to prevent data bleeding.
        // Detect explicit logout OR stale session on refresh
        // (If Redux thinks we are signed in, but server says no session)
        const isIdentityMismatch = signedIn && currentSessionEmail && storedUserEmail && (currentSessionEmail !== storedUserEmail)
        const isStalePersistedSession = signedIn && !currentSessionEmail
        const isLogout = lastSessionEmailRef.current && !currentSessionEmail

        if (isIdentityMismatch || isLogout || isStalePersistedSession) {
            const syncState = async () => {
                const { resetAuthState } = await import('@/store/slices/auth/sessionSlice')
                dispatch(resetAuthState())

                // If it's just a sync (not a hard logout), let the next cycle handle the session sync
                // This prevents the loop where we reset and then immediately set the session again
            }
            syncState()
            lastSessionEmailRef.current = currentSessionEmail
            return
        }

        lastSessionEmailRef.current = currentSessionEmail

        // Only sync if we're not currently handling a mismatch/logout
        dispatch(setSession(session))

        if (session?.user) {
            const sUser = session.user as any
            dispatch(setUser({
                avatar: sUser.image || sUser.picture || sUser.avatar || '',
                userName: sUser.name || sUser.userName || '',
                email: sUser.email || '',
                authority: sUser.authority || ['user'],
                permissions: sUser.permissions || []
            }))

            // Proactively fetch organization details for global context
            const authorities = sUser.authority || []
            const hasOrgRole = authorities.some((a: string) => a.startsWith('org_'))
            const isPlatformAdmin = authorities.includes('platform_super_admin') || authorities.includes('platform_admin')

            if (hasOrgRole || isPlatformAdmin) {
                dispatch(fetchMyOrganization())
            }
        } else {
            dispatch(setUser({
                avatar: '',
                userName: '',
                email: '',
                authority: [],
                permissions: []
            }))
        }

        if (session?.accessToken) {
            setAccessToken(session.accessToken as string, true)
        } else {
            clearAccessToken()
        }

        dispatch(setThemeAll({
            themeSchema: theme.themeSchema,
            direction: theme.direction,
            mode: theme.mode,
            panelExpand: theme.panelExpand,
            controlSize: theme.controlSize,
            layout: {
                type: theme.layout.type,
                sideNavCollapse: theme.layout.sideNavCollapse,
                ...(theme.layout.previousType && {
                    previousType: theme.layout.previousType as LayoutType
                })
            }
        }))

        dispatch(setNavigationTree(navigationTree))
    }, [dispatch, session, theme, navigationTree, signedIn, storedUserEmail])

    return <>{children}</>
}

export default InitializeStore
