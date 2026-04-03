import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    '/admin-dashboard': {
        key: 'admindashboard',
        authority: ['platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/dashboard': {
        key: 'user',
        authority: ['user', 'staff'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/organizations/dashboard': {
        key: 'org-dashboard',
        authority: ['org_super_admin', 'org_admin', 'org_member'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/organizations/chat': {
        key: 'chat',
        authority: ['org_super_admin', 'org_admin', 'org_member', 'user'],
        meta: {
            pageBackgroundType: 'default',
            pageContainerType: 'gutterless',
        },
    },
    '/organizations/chat/[copilotId]': {
        key: 'chat',
        authority: ['org_super_admin', 'org_admin', 'org_member', 'user'],
        meta: {
            pageBackgroundType: 'default',
            pageContainerType: 'gutterless',
        },
    },
    '/organizations/members': {
        key: 'org-members',
        authority: ['org_super_admin', 'org_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/organizations/team': {
        key: 'org-team',
        authority: ['org_super_admin', 'org_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/organizations/roles-permissions': {
        key: 'org-roles',
        authority: ['org_super_admin', 'org_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/organizations/credits-usage': {
        key: 'org-credits-usage',
        authority: ['org_super_admin', 'org_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    '/platform-copilot-management': {
        key: 'platform-copilot-management',
        authority: ['platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    /* '/organizations/integrations': {
        key: 'org-integrations',
        authority: ['org_super_admin', 'org_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    }, */

    '/organizations/audit-logs': {
        key: 'org-audit-logs',
        authority: ['org_super_admin', 'org_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/organizations/settings': {
        key: 'org-settings',
        authority: ['org_super_admin', 'org_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/dashboard/help-center': {
        key: 'help-center',
        authority: ['user', 'staff', 'org_admin', 'org_super_admin', 'platform_admin', 'platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/home': {
        key: 'home',
        authority: ['user', 'staff', 'org_admin', 'org_super_admin', 'platform_admin', 'platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/revenue': {
        key: 'revenue',
        authority: ['platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/enterprise': {
        key: 'enterprise',
        authority: ['platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/dashboard/api-keys': {
        key: 'apikeys',
        authority: [
            'user',
            'org_super_admin',
            'org_admin',
            'platform_super_admin',
        ],
        meta: {
            pageBackgroundType: 'default',
            pageContainerType: 'contained',
        },
    },
    '/organizations/api-keys': {
        key: 'org-api-keys',
        authority: ['org_super_admin', 'org_admin', 'platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/organizations/workspaces': {
        key: 'org-workspaces',
        authority: ['org_super_admin', 'org_admin', 'platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/organizations/model-library': {
        key: 'org-model-library',
        authority: ['org_super_admin', 'org_admin', 'platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/organizations/model-library/[modelId]': {
        key: 'org-model-library-detail',
        authority: ['org_super_admin', 'org_admin', 'platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/organizations/ai-playground': {
        key: 'aiplayground',
        authority: ['user', 'org_super_admin', 'org_admin', 'platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/platform/ai-playground': {
        key: 'platform-aiplayground',
        authority: ['platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/dashboard/model-library': {
        key: 'modellibrary',
        authority: [
            'org_super_admin',
            'org_admin',
            'org_member',
            'platform_super_admin',
            'user',
        ],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/dashboard/model-library/[modelId]': {
        key: 'modellibrary-detail',
        authority: [
            'org_super_admin',
            'org_admin',
            'org_member',
            'platform_super_admin',
            'user',
        ],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/admin/users': {
        key: 'user-management',
        authority: ['platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/platform/organizations': {
        key: 'platform-organizations',
        authority: ['platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/platform/organizations/[id]': {
        key: 'platform-organizations-detail',
        authority: ['platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/platform-admin-dashboard': {
        key: 'platformAdminDashboard',
        authority: ['platform_admin', 'platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/dashboard/chat': {
        key: 'chat',
        authority: ['platform_admin', 'platform_super_admin', 'user', 'org_super_admin', 'org_admin'],
        meta: {
            pageBackgroundType: 'default',
            pageContainerType: 'gutterless',
        },
    },
    '/dashboard/billing': {
        key: 'billing',
        authority: ['user'],
        meta: {
            pageBackgroundType: 'default',
            pageContainerType: 'contained',
        },
    },
    '/dashboard/shared-credits': {
        key: 'shared-credits',
        authority: ['user', 'org_super_admin', 'org_admin', 'platform_admin'],
        meta: {
            pageBackgroundType: 'default',
            pageContainerType: 'contained',
        },
    },
    '/admin/platform-settings': {
        key: 'platform_settings',
        authority: ['platform_admin', 'platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/admin/roles-permissions': {
        key: 'roles-permissions',
        authority: ['platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/admin/credits/bulk': {
        key: 'admin.credits.bulk',
        authority: ['platform_admin', 'platform_super_admin', 'org_super_admin', 'org_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'default',
        },
    },
    '/dashboard/user-settings': {
        key: 'user_settings',
        authority: ['user'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/dashboard/copilot-hub/[copilotId]/settings': {
        key: 'copilot-hub',
        authority: ['user', 'staff', 'org_admin', 'org_super_admin', 'platform_super_admin'],
        meta: {
            pageBackgroundType: 'default',
            pageContainerType: 'contained',
        },
    },
    '/dashboard/copilot-hub': {
        key: 'copilot-hub',
        authority: ['user', 'staff', 'org_admin', 'org_super_admin'],
        meta: {
            pageBackgroundType: 'default',
            pageContainerType: 'gutterless',
        },
    },
    '/admin/security': {
        key: 'security',
        authority: ['platform_admin', 'platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/admin/audit-log': {
        key: 'audit-log',
        authority: ['platform_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/workspace/[workspaceId]/members': {
        key: 'workspace-members',
        authority: ['user', 'staff', 'org_admin', 'org_super_admin'],
        dynamicRoute: true,
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'gutterless',
        },
    },
    '/dashboard/projects': {
        key: 'dashboard-projects',
        authority: ['user', 'staff', 'org_admin', 'org_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/dashboard/projects/[id]/usage': {
        key: 'project-usage',
        authority: ['user', 'staff', 'org_admin', 'org_super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/workspace/[workspaceId]/projects': {
        key: 'workspace-projects',
        authority: ['user', 'staff', 'org_admin', 'org_super_admin'],
        dynamicRoute: true,
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'gutterless',
        },
    },
    '/workspace/[workspaceId]/roles': {
        key: 'workspace-roles',
        authority: ['staff', 'org_admin', 'org_super_admin'],
        dynamicRoute: true,
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'gutterless',
        },
    },
    /* '/workspace/[workspaceId]/integrations': {
        key: 'workspace-integrations',
        authority: ['user', 'staff', 'org_admin', 'org_super_admin'],
        dynamicRoute: true,
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'gutterless',
        },
    }, */
    '/workspace/[workspaceId]/usage': {
        key: 'workspace-usage',
        authority: ['user', 'staff', 'org_admin', 'org_super_admin'],
        dynamicRoute: true,
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'gutterless',
        },
    },
    '/workspace/[workspaceId]/settings': {
        key: 'workspace-settings',
        authority: ['user', 'staff', 'org_admin', 'org_super_admin'],
        dynamicRoute: true,
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'gutterless',
        },
    },
    '/workspace/[workspaceId]/credits': {
        key: 'workspace-credits',
        authority: ['user', 'staff', 'org_admin', 'org_super_admin'],
        dynamicRoute: true,
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'gutterless',
        },
    },
}

export const publicRoutes: Routes = {
    '/check-email': {
        key: 'checkEmail',
        authority: [],
    },
    '/verify-email': {
        key: 'verifyEmail',
        authority: [],
    },
}

export const authRoutes = authRoute
