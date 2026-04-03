import {
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'
import organizationsNavigationConfig from './organizations-navigation.config'

const navigationConfig: NavigationTree[] = [
    // ---- Dashboards ----
    {
        key: 'platform-dashboard',
        path: '/platform/dashboard',
        title: 'Platform Dashboard',
        translateKey: 'nav.platform_dashboard',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['platform_super_admin', 'platform_admin'],
        subMenu: [],
    },
    {
        key: 'user',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['user', 'staff', 'org_admin'],
        subMenu: [],
    },

    // ---- Core Apps ----
    {
        key: 'chat',
        path: '/dashboard/chat',
        title: 'Chat',
        translateKey: 'nav.chats',
        icon: 'chat',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['user'],
        subMenu: [],
    },
    {
        key: 'ai-playground',
        path: '/dashboard/ai-playground',
        title: 'AI Playground',
        translateKey: 'nav.aiPlayground',
        icon: 'aiplayground',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['user', 'staff', 'org_admin'],
        subMenu: [],
    },

    {
        key: 'copilot-hub',
        path: '/dashboard/copilot-hub',
        title: 'Copilot Hub',
        translateKey: 'nav.copilotHub',
        icon: 'copilotHub',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['user', 'staff', 'org_admin'],
        subMenu: [],
    },
    {
        key: 'projects',
        path: '/dashboard/projects',
        title: 'Projects',
        translateKey: 'nav.projects',
        icon: 'projects',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['user', 'staff', 'org_admin', 'org_super_admin'],
        subMenu: [],
    },

    // ---- Platform Management ----
    {
        key: 'platform-copilot-management',
        path: '/platform-copilot-management',
        title: 'Copilot Management',
        translateKey: 'nav.copilotManagement',
        icon: 'copilotHub',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['platform_super_admin'],
        subMenu: [],
    },
    {
        key: 'user-management',
        path: '/admin/users',
        title: 'User Management',
        translateKey: 'nav.userManagement',
        icon: 'usermanagement',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['platform_super_admin'],
        subMenu: [],
    },
    {
        key: 'platform-organizations',
        path: '/platform/organizations',
        title: 'Organizations',
        translateKey: 'nav.organizations',
        icon: 'workspace',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['platform_super_admin'],
        subMenu: [],
    },
    {
        key: 'modellibrary',
        path: '/dashboard/model-library',
        title: 'Model Library',
        translateKey: 'nav.home',
        icon: 'api_provider',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['user', 'staff', 'org_admin', 'org_super_admin', 'org_member'],
        subMenu: [],
    },
    {
        key: 'revenue',
        path: '/revenue',
        title: 'Revenue',
        translateKey: 'nav.home',
        icon: 'revenue',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['platform_super_admin'],
        subMenu: [],
    },
    {
        key: 'admin.credits.bulk',
        path: '/admin/credits/bulk',
        title: 'Distribute Credit',
        translateKey: 'nav.bulk-credit',
        icon: 'bulkCredit',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['platform_admin', 'platform_super_admin'],
        subMenu: [],
    },

    // ---- User Development & Billing ----
    {
        key: 'apikeys',
        path: '/dashboard/api-keys',
        title: 'API Keys',
        translateKey: 'nav.home',
        icon: 'key',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['user', 'staff', 'org_admin'],
        subMenu: [],
    },
    {
        key: 'billing',
        path: '/dashboard/billing',
        title: 'Billing',
        translateKey: 'nav.billing',
        icon: 'billing',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['user'],
        subMenu: [],
    },
    {
        key: 'shared-credits',
        path: '/dashboard/shared-credits',
        title: 'Share Credit',
        translateKey: 'nav.shared-credits',
        icon: 'sharedCredits',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['user'],
        subMenu: [],
    },

    // ---- Platform Settings ----
    {
        key: 'roles-permissions',
        path: '/admin/roles-permissions',
        title: 'Roles & Permissions',
        translateKey: 'nav.rolesPermissions',
        icon: 'shield',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['platform_super_admin'],
        subMenu: [],
    },
    {
        key: 'security',
        path: '/admin/security',
        title: 'Security',
        translateKey: 'nav.security',
        icon: 'security',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['platform_admin', 'platform_super_admin'],
        subMenu: [],
    },
    {
        key: 'audit-log',
        path: '/admin/audit-log',
        title: 'Audit Logs',
        translateKey: 'nav.auditLogs',
        icon: 'audit',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['platform_super_admin'],
        subMenu: [],
    },
    {
        key: 'platform-settings',
        path: '/admin/platform-settings',
        title: 'Settings',
        translateKey: 'nav.platform_settings',
        icon: 'platformSettings',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['platform_admin', 'platform_super_admin'],
        subMenu: [],
    },

    // ---- User Settings ----
    {
        key: 'user-settings',
        path: '/dashboard/user-settings',
        title: 'Settings',
        translateKey: 'nav.user_settings',
        icon: 'platformSettings',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['user'],
        subMenu: [],
    },

    // ---- Organization Specific Navigation ----
    ...organizationsNavigationConfig,

    // ---- Support ----
    {
        key: 'help-center',
        path: '/dashboard/help-center',
        title: 'Help Center',
        translateKey: 'nav.help-center',
        icon: 'chat',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['user', 'staff', 'org_admin', 'org_super_admin', 'platform_admin'],
        subMenu: [],
    },
]

export default navigationConfig
