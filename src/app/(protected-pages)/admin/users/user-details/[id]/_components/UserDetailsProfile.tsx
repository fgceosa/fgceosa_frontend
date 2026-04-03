import { Card } from '@/components/ui'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Hash,
    Building2,
    Clock,
    Shield,
    Calendar,
    Globe,
    ExternalLink
} from 'lucide-react'
import type { UserMember } from '@/app/(protected-pages)/admin/users/types'
import dayjs from 'dayjs'
import classNames from '@/utils/classNames'

interface UserDetailsProfileProps {
    data: UserMember
    layout?: 'compact' | 'detailed'
}

const InfoRow = ({ icon: Icon, label, value, isMonospace = false }: { icon: any, label: string, value: string, isMonospace?: boolean }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-50 dark:border-gray-800 last:border-0 group gap-2">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover:bg-primary/5 transition-colors">
                <Icon className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[10px] font-black text-gray-400 tracking-widest">{label}</span>
        </div>
        <span className={classNames(
            "text-sm font-bold text-gray-900 dark:text-white tracking-tight sm:text-right overflow-hidden text-ellipsis",
            isMonospace ? 'font-mono bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700' : ''
        )}>
            {value || 'Not specified'}
        </span>
    </div>
)

const UserDetailsProfile = ({ data: rawData, layout = 'detailed' }: UserDetailsProfileProps) => {
    const data = rawData as any

    console.log('UserDetailsProfile rendering with data:', data);

    if (layout === 'compact') {
        return (
            <div className="space-y-8 font-sans">
                <Card className="p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">Account Info</h3>
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest">Main user details</p>
                    </div>

                    <div className="space-y-1">
                        <InfoRow
                            icon={Hash}
                            label="Tag Number"
                            value={data.tag || 'N/A'}
                            isMonospace
                        />
                        <InfoRow
                            icon={Shield}
                            label="User Role"
                            value={data.role || 'User'}
                        />
                        <InfoRow
                            icon={Clock}
                            label="Last Active"
                            value={data.lastOnline ? dayjs(data.lastOnline).fromNow() : 'Never'}
                        />
                        <InfoRow
                            icon={Calendar}
                            label="Join Date"
                            value={dayjs(data.createdAt || data.lastOnline).format('MMM DD, YYYY')}
                        />
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800">
                        <div className={classNames(
                            "flex items-center gap-3 p-4 rounded-2xl border",
                            data.status === 'active'
                                ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30 text-amber-600 dark:text-amber-400"
                        )}>
                            <div className={classNames(
                                "w-2 h-2 rounded-full animate-pulse",
                                data.status === 'active' ? "bg-emerald-500" : "bg-amber-500"
                            )} />
                            <span className="text-[9px] font-black tracking-widest">Status: {data.status || 'active'}</span>
                        </div>
                    </div>
                </Card>

                {/* Permissions Highlight */}
                <Card className="p-6 sm:p-8 bg-gray-50/50 dark:bg-gray-800/20 rounded-[2rem] border border-gray-100 dark:border-gray-800 border-dashed">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-tight mb-2">Permissions</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-[11px] font-medium leading-relaxed mb-4">
                                This user has <span className="text-primary font-bold">{data.role === 'admin' ? 'Administrative Privileges' : 'User Access'}</span>.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {(data.role === 'admin' ? ['Admin', 'Billing', 'Users', 'Settings'] : ['Workspace', 'API']).map(perm => (
                                    <span key={perm} className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[8px] font-black text-gray-600 dark:text-gray-300 tracking-widest">
                                        {perm}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <Card className="p-6 md:p-10 bg-white dark:bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none font-sans">
            <div className="mb-10">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Profile Information</h3>
                <p className="text-xs font-bold text-gray-400 tracking-widest leading-none">Personal details and contact</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-primary tracking-[0.3em] mb-4">Identification</h4>
                    <InfoRow icon={User} label="First Name" value={data.firstName} />
                    <InfoRow icon={User} label="Last Name" value={data.lastName} />
                    <InfoRow icon={Hash} label="Username" value={data.username || 'N/A'} />
                </div>

                <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-primary tracking-[0.3em] mb-4">Contact</h4>
                    <InfoRow icon={Mail} label="Email Address" value={data.email} />
                    <InfoRow icon={Phone} label="Phone Number" value={data.phone || 'Not Specified'} />

                </div>

                <div className="space-y-1 md:col-span-2">
                    <h4 className="text-[10px] font-black text-primary tracking-[0.3em] mb-4 sm:mt-4">Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                        <InfoRow icon={MapPin} label="Street Address" value={data.address || 'Not Specified'} />
                        <InfoRow icon={MapPin} label="City / State" value={data.city || 'Not Specified'} />
                        <InfoRow icon={Hash} label="Zip / Postal" value={data.postcode || 'Not Specified'} />
                        <InfoRow icon={Globe} label="Country" value={data.country || 'Not Specified'} />
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default UserDetailsProfile
