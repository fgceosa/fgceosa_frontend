'use client'

import TopUpModal from '@/components/template/Topup/TopUpModal'
import { Button, Card, Progress } from '@/components/ui'
import { CreditCard, Bot, Users, Activity, Plus } from 'lucide-react'
import { ReactNode, useState } from 'react'

import { useAppSelector } from '@/store/hook'
import { selectAdminDashboardData, selectMonthlyMetrics } from '@/store/slices/admindashboard'

import { useRouter } from 'next/navigation'

import classNames from '@/utils/classNames'

interface QuickActionsCardProps {
    budgetUsed?: number
    budgetTotal?: number
    // onTopUp?: () => void
    onTryPlayground?: () => void
    onInviteTeam?: () => void
    extraActions?: ReactNode
}

export default function QuickActionsCard(props: QuickActionsCardProps) {
    const {
        budgetUsed,
        budgetTotal,
        onTryPlayground,
        onInviteTeam,
        extraActions,
    } = props

    const router = useRouter()

    const monthlyMetrics = useAppSelector(selectMonthlyMetrics)
    const currentSpending = (monthlyMetrics as any)?.spending || monthlyMetrics?.totalRevenue || 0

    const estimatedBudget = Math.max(currentSpending * 1.2, 50000)
    const used = budgetUsed ?? currentSpending
    const total = budgetTotal ?? estimatedBudget
    const progress = total > 0 ? (used / total) * 100 : 0
    const remaining = Math.max(0, 100 - progress)

    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)

    const userAuthority = useAppSelector((state) => state.auth.user.authority) || []
    const isOrgAdmin = userAuthority.includes('admin') ||
        userAuthority.includes('admin') ||
        userAuthority.includes('super_admin') ||
        userAuthority.includes('admin')

    const isOrgMember = userAuthority.includes('member')
    const canCreateCopilot = (isOrgAdmin || userAuthority.includes('user')) && !isOrgMember

    const actions = [
        {
            title: 'Use Copilot',
            description: 'AI-assisted development',
            icon: <Bot className="w-8 h-8" />,
            onClick: () => router.push('/dashboard/copilot-hub'),
            bg: "bg-gradient-to-br from-[#0055BA] to-blue-700 shadow-xl shadow-blue-900/20",
            iconBg: "bg-white/20 text-white",
            textPrimary: "text-white",
            textSecondary: "text-blue-100"
        },
        {
            title: 'Create Project',
            description: 'Start a new workspace',
            icon: <Plus className="w-8 h-8" />,
            onClick: () => router.push('/dashboard/projects?create=true'),
            bg: "bg-gray-50/50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800",
            iconBg: "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-600",
            textPrimary: "text-gray-900 dark:text-white",
            textSecondary: "text-gray-500 dark:text-gray-400"
        }
    ]

    return (
        <>
            <Card className="shadow-lg border-none bg-white dark:bg-gray-900 overflow-hidden h-full flex flex-col">
                <div className="p-6 pb-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Quick Actions
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            Common tasks to get you started
                        </p>
                    </div>
                </div>

                <div className="px-6 py-2 flex-1">
                    <div className="grid grid-cols-1 gap-4">
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className={classNames(
                                    "group relative flex items-center gap-5 p-5 rounded-[1.5rem] transition-all duration-500 text-left overflow-hidden h-full hover:scale-[1.02]",
                                    action.bg
                                )}
                            >
                                <div className={classNames(
                                    "w-16 h-16 rounded-[1.25rem] flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3",
                                    action.iconBg
                                )}>
                                    {action.icon}
                                </div>

                                <div className="flex flex-col z-10">
                                    <span className={classNames("font-black text-lg mb-0.5 transition-colors duration-200", action.textPrimary)}>
                                        {action.title}
                                    </span>
                                    <span className={classNames("text-[12px] font-medium", action.textSecondary)}>
                                        {action.description}
                                    </span>
                                </div>

                                <div className="ml-auto opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-10">
                                    <Activity className={classNames("w-5 h-5 rotate-45", action.textPrimary)} />
                                </div>

                                {/* Abstract shiny background effect for blue card */}
                                {index === 0 && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform pointer-events-none" />
                                )}
                            </button>
                        ))}
                    </div>

                    {extraActions && <div className="mt-4">{extraActions}</div>}
                </div>

                <div className="mt-auto p-6 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-end justify-between mb-3">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                                Monthly Budget
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-gray-900 dark:text-white">
                                    ₦{used.toLocaleString()}
                                </span>
                                <span className="text-xs font-semibold text-gray-400">
                                    / ₦{total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className={classNames(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                remaining > 20
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                    : "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                            )}>
                                {remaining.toFixed(0)}% Left
                            </div>
                        </div>
                    </div>

                    <div className="relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={classNames(
                                "absolute left-0 top-0 h-full transition-all duration-500 ease-out rounded-full",
                                progress > 80 ? "bg-red-500" : "bg-[#0055BA]"
                            )}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                        <div
                            className="absolute left-0 top-0 h-full w-full opacity-20 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"
                            style={{ backgroundSize: '200% 100%' }}
                        />
                    </div>
                </div>
            </Card>

            <TopUpModal
                isOpen={isTopUpModalOpen}
                onClose={() => setIsTopUpModalOpen(false)}
            />
        </>
    )
}
