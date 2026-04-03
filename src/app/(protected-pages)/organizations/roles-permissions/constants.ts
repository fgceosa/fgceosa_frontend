export interface PermissionDef {
    id: string
    name: string
    description: string
    isSensitive?: boolean
}

export interface PermissionGroup {
    id: string
    category: string
    permissions: PermissionDef[]
}

export const ORG_PERMISSIONS: PermissionGroup[] = [
    {
        id: 'org_mgt',
        category: 'Organization Management',
        permissions: [
            { id: 'org:view', name: 'View Organization', description: 'View organization details and public information.' },
            { id: 'org:update', name: 'Update Organization', description: 'Modify organization settings, branding, and preferences.', isSensitive: true },
            { id: 'org:billing', name: 'Manage Billing', description: 'Access billing history, invoices, and payment methods.', isSensitive: true },
        ]
    },
    {
        id: 'team_mgt',
        category: 'Team Management',
        permissions: [
            { id: 'team:view', name: 'View Team', description: 'View the list of organization members and their roles.' },
            { id: 'team:invite', name: 'Invite Members', description: 'Invite new members to the organization.' },
            { id: 'team:manage', name: 'Manage Roles', description: 'Assign roles and update member privileges.', isSensitive: true },
            { id: 'team:remove', name: 'Remove Members', description: 'Remove members from the organization.', isSensitive: true },
        ]
    },
    {
        id: 'ws_mgt',
        category: 'Workspace Management',
        permissions: [
            { id: 'workspace:create', name: 'Create Workspace', description: 'Create new workspaces within the organization.' },
            { id: 'workspace:view', name: 'View Workspaces', description: 'View all workspaces belonging to the organization.' },
            { id: 'workspace:delete', name: 'Delete Workspace', description: 'Delete existing workspaces and their data.', isSensitive: true },
        ]
    },
    {
        id: 'model_mgt',
        category: 'Model Library',
        permissions: [
            { id: 'models:view', name: 'View Models', description: 'Access the organization\'s private model library.' },
            { id: 'models:create', name: 'Create Models', description: 'Add new custom models to the library.' },
        ]
    },
    {
        id: 'copilot_mgt',
        category: 'Copilot Management',
        permissions: [
            { id: 'copilot:view', name: 'View Copilots', description: 'View available copilots and their status.' },
            { id: 'copilot:use', name: 'Use Copilots', description: 'Interact with copilots for tasks and queries.' },
            { id: 'copilot:manage', name: 'Manage Copilots', description: 'Full access to update, configure, and manage copilot settings.', isSensitive: true },
            { id: 'copilot:create', name: 'Create Copilots', description: 'Create and configure new copilots for the organization.', isSensitive: true },
            { id: 'copilot:delete', name: 'Delete Copilots', description: 'Remove copilots from the organization.', isSensitive: true },
        ]
    }
]
