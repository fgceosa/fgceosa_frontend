import { Button, Card, Avatar, Spinner } from '@/components/ui'
import type { MemberProfileCardProps } from '../../../types'
import { User, ShieldCheck, Search, Hash } from 'lucide-react'
import classNames from '@/utils/classNames'

export default function MemberProfileCard({
    data,
    loading,
    error,
    onViewProfile,
}: MemberProfileCardProps) {
    if (loading) {
        return (
            <Card className="h-[420px] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50">
                <Spinner size="40px" />
                <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Verifying Recipient...</p>
            </Card>
        )
    }

    if (error || !data) {
        return (
            <Card className="h-[420px] shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 relative group transition-all duration-500 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-[2rem] flex items-center justify-center mb-6 text-gray-200 dark:text-gray-700">
                    <Search className="w-10 h-10" />
                </div>
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mt-4">
                    {error ? 'Recipient Not Found' : 'Recipient Preview'}
                </h4>
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-2 px-6">
                    {error ? 'Please check the identifier and try again' : 'Type an identifier to verify the target entity'}
                </p>
            </Card>
        )
    }

    const { name, username, role, credits, status = 'active', avatar, tag } = data
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

    return (
        <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 relative group transition-all duration-500">
            {/* Decorative Header */}
            <div className="h-24 bg-gradient-to-r from-primary to-primary-deep relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
            </div>

            <div className="px-8 pb-8 -mt-12 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-white dark:bg-gray-900 rounded-full" />
                        <Avatar
                            src={avatar}
                            className="w-24 h-24 border-4 border-white dark:border-gray-900 shadow-xl shadow-primary/20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl font-black text-white"
                        >
                            {initials}
                        </Avatar>
                        <div className={classNames(
                            "absolute bottom-1 right-1 w-6 h-6 border-4 border-white dark:border-gray-900 rounded-full flex items-center justify-center shadow-lg",
                            status === 'active' ? "bg-emerald-500" : "bg-gray-400"
                        )}>
                            <ShieldCheck className="w-3 h-3 text-white" />
                        </div>
                    </div>

                    <div className="mt-4 space-y-1">
                        <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{name}</h4>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest">
                                <User className="w-3 h-3" />
                                <span>@{username}</span>
                            </div>
                            {tag && (
                                <div className="flex items-center gap-1 text-[10px] font-black bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-gray-500 uppercase tracking-widest border border-gray-200 dark:border-gray-700">
                                    <Hash className="w-2.5 h-2.5" />
                                    <span>{tag}</span>
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">{role || 'Verified Entity'}</p>
                    </div>

                    <div className="w-full mt-8 grid grid-cols-1 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-1 shadow-sm">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Current Balance</span>
                            <span className="text-lg font-black text-primary uppercase">₦{Number(credits || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full mt-8">
                        <Button variant="default" className="rounded-xl font-black uppercase tracking-widest text-[9px] h-10 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">Analytics</Button>
                        <Button variant="solid" onClick={onViewProfile} className="rounded-xl font-black uppercase tracking-widest text-[9px] h-10 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Full Profile</Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
