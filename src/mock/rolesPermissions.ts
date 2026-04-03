import { Role, PermissionGroup } from '@/app/(protected-pages)/admin/roles-permissions/types'

const defaultPermissionGroups: PermissionGroup[] = [
    {
        id: 'pg-org',
        category: 'Organization Management',
        permissions: [
            { id: 'p1', name: 'Create Organization', description: 'Create new organization workspaces', enabled: false },
            { id: 'p2', name: 'Edit Organization', description: 'Modify existing organization details', enabled: false },
            { id: 'p3', name: 'Delete Organization', description: 'Permanently remove organizations from platform', enabled: false, isSensitive: true },
            { id: 'p3.1', name: 'Suspend Organization', description: 'Restrict access for specific institutions', enabled: false, isSensitive: true },
            { id: 'p3.2', name: 'Organization Settings', description: 'Manage global organization policy settings', enabled: false },
        ]
    },
    {
        id: 'pg-users',
        category: 'Users & Access',
        permissions: [
            { id: 'p4', name: 'Manage HQ Users', description: 'Create and edit platform administrators', enabled: false },
            { id: 'p5', name: 'Assign Roles', description: 'Update identity and system role assignments', enabled: false, isSensitive: true },
            { id: 'p6', name: 'Audit Logs', description: 'Review system-wide user activity logs', enabled: false },
            { id: 'p6.1', name: 'Impersonate User', description: 'Securely access platform as another user', enabled: false, isSensitive: true },
        ]
    },
    {
        id: 'pg-copilots',
        category: 'Copilots',
        permissions: [
            { id: 'p11', name: 'Manage Copilots', description: 'Full control over AI copilot infrastructure', enabled: false },
            { id: 'p11.1', name: 'Create Copilot', description: 'Deploy new AI copilots to the platform', enabled: false },
            { id: 'p11.2', name: 'Delete Copilot', description: 'Remove copilots from the ecosystem', enabled: false, isSensitive: true },
            { id: 'p12', name: 'Copilot Analytics', description: 'View performance data for all copilots', enabled: false },
            { id: 'p12.1', name: 'Manage Knowledge Base', description: 'Upload and manage knowledge base documents', enabled: false },
        ]
    },
    {
        id: 'pg-credits',
        category: 'Credits',
        permissions: [
            { id: 'p7', name: 'Allocate Credits', description: 'Distribute credits to organizations', enabled: false, isSensitive: true },
            { id: 'p8', name: 'Treasury Access', description: 'Manage platform credit treasury', enabled: false, isSensitive: true },
            { id: 'p8.1', name: 'View Liquidity', description: 'Monitor platform-wide credit liquidity', enabled: false },
        ]
    },
    {
        id: 'pg-billing',
        category: 'Billing & Revenue',
        permissions: [
            { id: 'p9', name: 'View Revenue', description: 'Access financial overview dashboards', enabled: false },
            { id: 'p10', name: 'Manage Pricing', description: 'Update plan costs and credit rates', enabled: false, isSensitive: true },
            { id: 'p10.1', name: 'Revenue Analytics', description: 'Detailed breakdown of revenue streams', enabled: false },
        ]
    },
    {
        id: 'pg-models',
        category: 'Model Library',
        permissions: [
            { id: 'p13', name: 'Enable Models', description: 'Activate AI models for users', enabled: false },
            { id: 'p13.1', name: 'Configure Models', description: 'Manage model hyperparameters and routing', enabled: false },
            { id: 'p14', name: 'Provider Keys', description: 'Manage global API provider credentials', enabled: false, isSensitive: true },
        ]
    },
    {
        id: 'pg-analytics',
        category: 'Analytics',
        permissions: [
            { id: 'p15', name: 'System Health', description: 'Monitor platform performance and uptime', enabled: false },
            { id: 'p16', name: 'Usage Trends', description: 'Macro-level platform usage patterns', enabled: false },
            { id: 'p17', name: 'Export Data', description: 'Export records to external formats', enabled: false },
        ]
    },
    {
        id: 'pg-system',
        category: 'System Settings',
        permissions: [
            { id: 'p18', name: 'Enterprise SSO', description: 'Configure white-labeling and authentication', enabled: false, isSensitive: true },
            { id: 'p19', name: 'Global API Keys', description: 'Provision platform-wide access tokens', enabled: false, isSensitive: true },
            { id: 'p20', name: 'Playground Access', description: 'Access the prompt engineering environment', enabled: false },
            { id: 'p21', name: 'System Maintenance', description: 'Broadcast maintenance periods', enabled: false, isSensitive: true },
        ]
    }
]

export const mockRoles: Role[] = [
    {
        id: 'role-owner',
        name: 'Platform Owner',
        description: 'Complete oversight and ultimate authority across all platform systems and governance.',
        userCount: 1,
        icon: 'crown',
        isSystem: true,
        type: 'System',
        permissions: defaultPermissionGroups.map(pg => ({
            ...pg,
            permissions: pg.permissions.map(p => ({ ...p, enabled: true }))
        }))
    },
    {
        id: 'role-admin',
        name: 'Platform Admin',
        description: 'Day-to-day platform management and organization setup.',
        userCount: 3,
        icon: 'shield',
        isSystem: true,
        type: 'System',
        permissions: defaultPermissionGroups.map(pg => ({
            ...pg,
            permissions: pg.permissions.map(p => ({
                ...p,
                enabled: !['Billing & Revenue', 'Credits'].includes(pg.category) || p.name.includes('View')
            }))
        }))
    },
    {
        id: 'role-billing',
        name: 'Billing & Revenue Admin',
        description: 'Focused on financial operations, revenue tracking, and credit treasury management.',
        userCount: 2,
        icon: 'creditCard',
        isSystem: false,
        type: 'Custom',
        permissions: defaultPermissionGroups.map(pg => ({
            ...pg,
            permissions: pg.permissions.map(p => ({
                ...p,
                enabled: ['Billing & Revenue', 'Credits'].includes(pg.category)
            }))
        }))
    },
    {
        id: 'role-ops',
        name: 'Operations Admin',
        description: 'Responsible for organization support, onboarding, and workspace management.',
        userCount: 5,
        icon: 'users',
        isSystem: false,
        type: 'Organization',
        permissions: defaultPermissionGroups.map(pg => ({
            ...pg,
            permissions: pg.permissions.map(p => ({
                ...p,
                enabled: pg.category === 'Organization Management' || p.name.includes('View') || pg.category === 'Users & Access'
            }))
        }))
    },
    {
        id: 'role-ai',
        name: 'AI / Copilot Admin',
        description: 'Manages platform AI models, copilot configurations, and usage analytics.',
        userCount: 4,
        icon: 'bot',
        isSystem: false,
        type: 'Custom',
        permissions: defaultPermissionGroups.map(pg => ({
            ...pg,
            permissions: pg.permissions.map(p => ({
                ...p,
                enabled: ['Copilots', 'Model Library', 'Analytics'].includes(pg.category)
            }))
        }))
    },
    {
        id: 'role-support',
        name: 'Support Admin',
        description: 'Read-only access to help desk and user troubleshooting data.',
        userCount: 8,
        icon: 'eye',
        isSystem: false,
        type: 'Custom',
        permissions: defaultPermissionGroups.map(pg => ({
            ...pg,
            permissions: pg.permissions.map(p => ({
                ...p,
                enabled: p.name.includes('View') || p.name.includes('Log') || p.name === 'Copilot Analytics'
            }))
        }))
    }
]
