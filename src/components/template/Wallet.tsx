'use client'

import React from 'react'
import { BiWallet } from 'react-icons/bi'
import { useWalletRedux } from '@/hooks/useWalletRedux'
import { useAppSelector } from '@/store'
import { selectCurrentOrganizationId } from '@/store/slices/organization/organizationSelectors'
import { NAIRA_TO_CREDIT_RATE } from '@/constants/currency.constant'
import classNames from '@/utils/classNames'
import { useUserAuthorities } from '@/utils/hooks/useAuthorization'

import { usePathname } from 'next/navigation'

type WalletProps = {
    compact?: boolean
    variant?: 'default' | 'ghost'
    showIcon?: boolean
    className?: string
}

const Wallet = ({ compact = false, variant = 'default', showIcon = true, className }: WalletProps) => {
    const pathname = usePathname()
    const organizationId = useAppSelector(selectCurrentOrganizationId)
    const combinedAuthorities = useUserAuthorities()

    // Determine if the user is in a management role for the organization
    const isOrgManagement = combinedAuthorities.some(a => ['org_super_admin', 'org_admin'].includes(a))
    const isPlatformAdmin = combinedAuthorities.some(a => a.startsWith('platform_'))

    // Route-based "expectation" to prevent flickering.
    // If we are on an org/workspace path and have admin rights, we EXPECT an org wallet.
    const isOnOrgContextRoute = pathname?.startsWith('/organizations') || pathname?.includes('/workspace/')
    const expectsOrgWallet = isOnOrgContextRoute && (isOrgManagement || isPlatformAdmin)

    // Actual display logic: Show Org Wallet if we have the ID and the rights.
    const showOrgWallet = !!organizationId && (isOrgManagement || isPlatformAdmin)

    const { balance, organizationBalance, isLoading: reduxLoading, error } = useWalletRedux({
        autoRefreshInterval: 30000,
        refreshOnFocus: true,
        organizationId: showOrgWallet ? organizationId : undefined
    })

    // Enhanced loading logic:
    // If we expect an Org wallet but don't have the ID or balance yet, stay in loading state.
    const isLoading = reduxLoading || (expectsOrgWallet && (organizationBalance === null || !organizationId) && !error)

    // Suppression of personal balance display when org balance is expected
    const displayCredits = showOrgWallet ? (organizationBalance?.balance ?? 0) : balance.ai_credits
    const walletLabel = showOrgWallet ? 'Org' : 'Personal'

    return (
        <div className={classNames(
            'flex items-center gap-3 transition-all duration-300 group',
            variant === 'default' && (showOrgWallet
                ? 'px-4 py-2 rounded-full bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-800/20 cursor-pointer'
                : 'px-4 py-2 rounded-full bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 hover:bg-blue-100/50 dark:hover:bg-blue-800/20 cursor-pointer'),
            variant === 'ghost' && 'px-0 py-0 bg-transparent border-none',
            compact ? 'w-full' : 'min-w-0 md:min-w-[180px]',
            className
        )}>
            {showIcon && (
                <div className={classNames(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110",
                    variant === 'default'
                        ? (showOrgWallet ? "bg-emerald-100/50 dark:bg-emerald-900/30" : "bg-[#0055BA]/10 dark:bg-[#0055BA]/20")
                        : "bg-white/10 backdrop-blur-md border border-white/20"
                )}>
                    <BiWallet className={classNames(
                        "w-4 h-4",
                        variant === 'default'
                            ? (showOrgWallet ? "text-emerald-600 dark:text-emerald-400" : "text-[#0055BA]")
                            : "text-white"
                    )} />
                </div>
            )}
            <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    {!isLoading ? (
                        <span className={classNames(
                            "text-sm font-black tracking-tight whitespace-nowrap",
                            variant === 'default'
                                ? (showOrgWallet ? "text-gray-700 dark:text-gray-200" : "text-gray-900 dark:text-gray-100")
                                : "text-white"
                        )}>
                            {error ? '0' : displayCredits.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                        </span>
                    ) : (
                        <div className="w-12 h-3 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    )}
                    <span className={classNames(
                        "text-[8px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded",
                        showOrgWallet
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : (variant === 'ghost' ? "bg-white/10 text-white border-white/20" : "bg-primary/5 text-primary border border-primary/10")
                    )}>
                        {walletLabel}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Wallet
