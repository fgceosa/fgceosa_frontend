import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const protectedRoutes: Routes = {
    // Admin Routes
    '/admin/dashboard': {
        key: 'admin-dashboard',
        authority: ['super_admin', 'admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/admin/users': {
        key: 'user-management',
        authority: ['super_admin', 'admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/admin/dashboard/payments': {
        key: 'payment-management',
        authority: ['super_admin', 'admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/admin/events': {
        key: 'event-management',
        authority: ['super_admin', 'admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/admin/dashboard/announcements': {
        key: 'announcements',
        authority: ['super_admin', 'admin', 'member'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    // User/Member Routes
    '/dashboard/payments': {
        key: 'member-payments',
        authority: ['member', 'super_admin', 'admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/dashboard': {
        key: 'member-dashboard',
        authority: ['member', 'super_admin', 'admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/member/profile': {
        key: 'member-profile',
        authority: ['member', 'super_admin', 'admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/member/directory': {
        key: 'member-directory',
        authority: ['member', 'super_admin', 'admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    '/member/dues': {
        key: 'member-dues',
        authority: ['member', 'super_admin', 'admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },

    // Common/Shared Routes
    '/home': {
        key: 'home',
        authority: ['member', 'admin', 'super_admin'],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
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
