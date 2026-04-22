import { Switcher, Tooltip } from '@/components/ui'
import { AlertCircle, ShieldAlert } from 'lucide-react'
import classNames from '@/utils/classNames'
import type { Permission } from '../../types'

interface PermissionItemProps {
    permission: Permission
    onToggle: () => void
    disabled?: boolean
}

export default function PermissionItem({ permission, onToggle, disabled }: PermissionItemProps) {
    return (
        <div
            className={classNames(
                "group relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-500",
                permission.enabled
                    ? "bg-white dark:bg-gray-900 border-primary/20 shadow-xl shadow-primary/5 ring-4 ring-primary/[0.02]"
                    : "bg-gray-50/40 dark:bg-gray-800/20 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
            )}
        >
            {/* Subtle inner glow for active state */}
            {permission.enabled && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none rounded-2xl" />
            )}

            <div className="flex-1 pr-6 relative z-10">
                <div className="flex items-center gap-2.5 mb-1.5">
                    <p className={classNames(
                        "text-[13px] font-bold",
                        permission.enabled ? "text-primary" : "text-gray-900 dark:text-gray-100"
                    )}>
                        {permission.name}
                    </p>
                    {permission.isSensitive && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-50 dark:bg-rose-950/30 rounded-md border border-rose-100/50 dark:border-rose-900/30">
                            <span className="text-[9px] font-bold text-rose-500">Sensitive</span>
                        </div>
                    )}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2">{permission.description}</p>

                {permission.isSensitive && permission.enabled && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/30 dark:border-rose-900/20 rounded-xl">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">Allows sensitive changes</span>
                    </div>
                )}
            </div>

            <div className="relative z-10 shrink-0">
                <Switcher
                    checked={permission.enabled}
                    onChange={onToggle}
                    disabled={disabled}
                />
            </div>
        </div>
    )
}
