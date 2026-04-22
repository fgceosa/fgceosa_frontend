import {
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    // ---- Dashboard ----
    {
        key: 'dashboard',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.dashboard',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['super_admin', 'admin', 'member'],
        subMenu: [],
    },

    // ---- Alumni/Member Management ----
    {
        key: 'members',
        path: '/admin/users',
        title: 'Member List',
        translateKey: 'nav.members',
        icon: 'usermanagement',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['super_admin', 'admin'],
        subMenu: [],
    },

    // ---- Communication ----
    {
        key: 'admin-announcements',
        path: '/admin/dashboard/announcements',
        title: 'Manage Announcements',
        translateKey: 'nav.adminAnnouncements',
        icon: 'chat',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['super_admin', 'admin'],
        subMenu: [],
    },
    {
        key: 'announcements',
        path: '/dashboard/announcements',
        title: 'Announcements',
        translateKey: 'nav.announcements',
        icon: 'chat',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['member'],
        subMenu: [],
    },
    // ---- Payments & Dues ----
    {
        key: 'admin-payments',
        path: '/admin/dashboard/payments',
        title: 'Manage Payments',
        translateKey: 'nav.adminPayments',
        icon: 'billing',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['super_admin', 'admin'],
        subMenu: [],
    },
    {
        key: 'payments',
        path: '/dashboard/payments',
        title: 'Payments & Dues',
        translateKey: 'nav.payments',
        icon: 'billing',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['member'],
        subMenu: [],
    },
    {
        key: 'admin-events',
        path: '/admin/events',
        title: 'Manage Events',
        translateKey: 'nav.adminEvents',
        icon: 'calendar',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['super_admin', 'admin'],
        subMenu: [],
    },
    {
        key: 'events',
        path: '/dashboard/events',
        title: 'Events',
        translateKey: 'nav.events',
        icon: 'calendar',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['member'],
        subMenu: [],
    },

    // ---- Settings ----
    {
        key: 'user-settings',
        path: '/dashboard/user-settings',
        title: 'My Profile',
        translateKey: 'nav.myProfile',
        icon: 'userProfile',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['super_admin', 'admin', 'member'],
        subMenu: [],
    },
    {
        key: 'system-settings',
        path: '/admin/settings/system',
        title: 'System Settings',
        translateKey: 'nav.systemSettings',
        icon: 'platformSettings',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['super_admin', 'admin'],
        subMenu: [],
    },
    {
        key: 'roles-permissions',
        path: '/admin/roles-permissions',
        title: 'Roles & Permissions',
        translateKey: 'nav.rolesPermissions',
        icon: 'shield',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['super_admin'],
        subMenu: [],
    },
]

export default navigationConfig
