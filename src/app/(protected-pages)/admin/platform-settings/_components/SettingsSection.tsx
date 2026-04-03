import { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

interface SettingsSectionProps {
    title: string
    description: string
    children: ReactNode
    icon: ReactNode
    updatedAt?: string
}

export function SettingsSection({
    title,
    description,
    children,
    icon,
    updatedAt,
}: SettingsSectionProps) {
    return (
        <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Form Header with Gradient Accent */}
            <div className="relative p-8 pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/5 rounded-2xl border border-primary/10">
                            <span className="text-primary">{icon}</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                                {description}
                            </p>
                        </div>
                    </div>

                    {updatedAt && (
                        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-full border border-gray-100 dark:border-gray-700/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Last Sync: {updatedAt}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 space-y-10">
                {children}
            </div>
        </Card>
    )
}
