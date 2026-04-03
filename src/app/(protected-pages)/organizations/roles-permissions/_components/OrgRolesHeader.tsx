import { ShieldCheck } from 'lucide-react'

interface OrgRolesHeaderProps {
    onCreateRole?: () => void
    onCreatePermission?: () => void
    activeTab: string
}

export default function OrgRolesHeader({ onCreateRole, onCreatePermission, activeTab }: OrgRolesHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="space-y-4 lg:space-y-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-xs font-black text-primary whitespace-nowrap">Organization</span>
                    <div className="h-px w-12 bg-primary/20" />
                    <span className="text-xs font-black text-gray-900 dark:text-gray-100 whitespace-nowrap">Team Management</span>
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
                    Manage member roles and permissions for your organization workspace and team access.
                </p>
            </div>

            {activeTab === 'roles' && onCreateRole && (
                <button
                    onClick={onCreateRole}
                    className="h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.03] active:scale-95 flex items-center gap-3 group relative overflow-hidden"
                >
                    <span className="relative z-10">Create Role</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
            )}
        </div>
    )
}
