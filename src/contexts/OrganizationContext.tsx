import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAppSelector } from '@/store'
import { selectCurrentWorkspace } from '@/store/slices/workspace/workspaceSelectors'
import useCurrentSession from '@/utils/hooks/useCurrentSession'

interface OrganizationContextType {
    organizationId: string | null
    organizationName: string | null
}

const OrganizationContext = createContext<OrganizationContextType>({
    organizationId: null,
    organizationName: null
})

export function OrganizationProvider({ children }: { children: ReactNode }) {
    const { session } = useCurrentSession()
    const currentWorkspace = useAppSelector(selectCurrentWorkspace)
    const [organizationId, setOrganizationId] = useState<string | null>(null)
    const [organizationName, setOrganizationName] = useState<string | null>(null)

    useEffect(() => {
        // Try to get organization from workspace first
        if (currentWorkspace?.organizationId) {
            setOrganizationId(currentWorkspace.organizationId)
            setOrganizationName(currentWorkspace.name)
        }
        // Fallback: Get from user session if available
        else if (session?.user) {
            const user = session.user as any
            // If user has organizationId in their profile
            if (user.organizationId) {
                setOrganizationId(user.organizationId)
                setOrganizationName(user.organizationName || null)
            }
        }
    }, [currentWorkspace, session])

    return (
        <OrganizationContext.Provider value={{ organizationId, organizationName }}>
            {children}
        </OrganizationContext.Provider>
    )
}

export function useOrganization() {
    return useContext(OrganizationContext)
}
