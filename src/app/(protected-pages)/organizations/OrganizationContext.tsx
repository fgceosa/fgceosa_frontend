'use client'

import { createContext, useContext } from 'react'
import { OrganizationContextType } from './types'

export const OrganizationContext = createContext<OrganizationContextType>({
    organizationId: null,
    organizationName: null,
    userRole: null
})

export function useOrganization() {
    return useContext(OrganizationContext)
}
