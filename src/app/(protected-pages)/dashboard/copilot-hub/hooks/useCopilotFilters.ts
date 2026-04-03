import { useMemo } from 'react'
import { useAppSelector } from '@/store/hook'
import { Copilot, TabKey, CopilotCategory } from '../types'

interface UseCopilotFiltersProps {
    copilots: Copilot[]
    prebuiltTemplates: Copilot[]
    myCopilots: Copilot[]
    activeTab: TabKey
    selectedCategory: CopilotCategory | 'all'
    searchQuery: string
    currentUserId?: string
    session: any // kept for backwards compat (isSuperadmin check)
}

export function useCopilotFilters({
    copilots,
    prebuiltTemplates,
    myCopilots,
    activeTab,
    selectedCategory,
    searchQuery,
    currentUserId,
    session,
}: UseCopilotFiltersProps) {
    // Read org role from Redux store — the single source of truth (set by RoleSync)
    const orgRole = useAppSelector((state: any) => state.organization?.userRole)
    const isOrgMember = orgRole === 'org_member'

    const filteredCopilots = useMemo(() => {
        let result: Copilot[] = []

        // Authority from session (for platform-level checks like isSuperadmin)
        const userAuthority = (session?.user as any)?.authority || []
        const sessionRole = (session?.user as any)?.role || ''

        switch (activeTab) {
            case 'all':
                const combined = [...copilots]
                // org_members never see prebuilt templates in the 'all' feed
                if (!isOrgMember) {
                    const existingIds = new Set(combined.map(c => c.id))
                    prebuiltTemplates.forEach(t => {
                        if (!existingIds.has(t.id)) combined.push(t)
                    })
                }
                result = combined
                break
            case 'templates':
                result = [...prebuiltTemplates]
                break
            case 'my-copilots':
                result = [...myCopilots]
                break
            case 'shared':
                result = myCopilots.filter(c => c.createdBy !== currentUserId)
                break
            case 'workspace':
                result = [...copilots]
                break
            default:
                result = []
        }

        // Apply Lifecycle Filtering
        // 1. Owners and Superadmins can see everything except disabled (unless superadmin)
        // 2. Regular users only see 'active'
        const isSuperadmin = userAuthority.includes('platform_super_admin') || sessionRole === 'platform_super_admin'

        result = result.filter(c => {
            const isOwner = currentUserId && c.createdBy === currentUserId

            // Superadmin sees everything
            if (isSuperadmin) return true

            // Hide official templates (created by platform_super_admin) that are still in draft mode
            // They only become visible to organizations when "published" (status: active)
            const isOfficial = (c as any).isOfficial === true || (c as any).is_official === true
            if (isOfficial && c.status === 'draft' && !isSuperadmin) {
                return false
            }

            // Owners can see their own Drafts and Inactive (Paused) ones
            if (isOwner) {
                return c.status !== 'disabled'
            }

            // Regular users:
            // Since backend controls visibility (workspace assignment), 
            // if we received it, we should likely show it unless it's disabled.
            // Explicitly allowing 'draft' so team members can test assigned drafts.
            return c.status === 'active' || c.status === 'draft'
        })

        // Apply local filters (category, search)
        if (selectedCategory !== 'all') {
            result = result.filter(c => c.category === selectedCategory)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                c =>
                    c.name.toLowerCase().includes(query) ||
                    c.description.toLowerCase().includes(query) ||
                    c.tags?.some(t => t.toLowerCase().includes(query))
            )
        }

        return result
    }, [activeTab, copilots, prebuiltTemplates, myCopilots, selectedCategory, searchQuery, currentUserId, session, isOrgMember])

    return filteredCopilots
}
