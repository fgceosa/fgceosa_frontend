import { Plus, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui'

interface RolesHeaderProps {
    onCreateRole: () => void
    onCreatePermission: () => void
    activeTab: string
}

export default function RolesHeader({ onCreateRole, onCreatePermission, activeTab }: RolesHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="space-y-4 lg:space-y-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-[10px] font-black text-primary whitespace-nowrap">Administration</span>
                    <div className="h-px w-12 bg-primary/20" />
                    <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">Access Control</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
                        Roles & Permissions
                    </h1>
                </div>
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                    Manage HQ admin roles and rules for organizations, billing, and system settings.
                </p>
            </div>


            <Button
                variant="solid"
                onClick={activeTab === 'permissions' ? onCreatePermission : onCreateRole}
                className="h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group"
            >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                {activeTab === 'permissions' ? 'Create Permission' : 'Create Role'}
            </Button>
        </div>
    )
}
