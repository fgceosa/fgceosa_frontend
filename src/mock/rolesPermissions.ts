import { Role, PermissionGroup } from '@/app/(protected-pages)/admin/roles-permissions/types'

const defaultPermissionGroups: PermissionGroup[] = [
    {
        id: 'pg-org',
        category: 'Platform Management',
        permissions: [
            { id: 'p1', name: 'Create Platform', description: 'Create new platform workspaces', enabled: false },
            { id: 'p2', name: 'Edit Platform', description: 'Modify existing platform details', enabled: false },
            { id: 'p3', name: 'Delete Platform', description: 'Permanently remove platforms from platform', enabled: false, isSensitive: true },
            { id: 'p3.1', name: 'Suspend Platform', description: 'Restrict access for specific institutions', enabled: false, isSensitive: true },
            { id: 'p3.2', name: 'Platform Settings', description: 'Manage global platform policy settings', enabled: false },
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
            { id: 'p7', name: 'Allocate Credits', description: 'Distribute credits to platforms', enabled: false, isSensitive: true },
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
        id: 'super_admin',
        name: 'Super Admin',
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
        id: 'admin',
        name: 'Admin',
        description: 'Day-to-day platform management and user administration.',
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
        id: 'member',
        name: 'Member',
        description: 'Standard access to platform tools, community features and personal profile.',
        userCount: 154,
        icon: 'users',
        isSystem: true,
        type: 'Custom',
        permissions: defaultPermissionGroups.map(pg => ({
            ...pg,
            permissions: pg.permissions.map(p => ({
                ...p,
                enabled: pg.category === 'Analytics' && p.name.includes('View')
            }))
        }))
    }
]
