'use client'

import React, { useState } from 'react'
import {
    User,
    CreditCard,
    BarChart4,
    ShieldAlert,
    Settings,
    ShieldCheck,
    CheckCircle,
    Clock,
    Database,
    ChevronRight,
    X,
    Slash,
    AlertTriangle
} from 'lucide-react'
import {
    Card,
    Tabs,
    Badge,
    Button,
    Dialog,
    toast,
    Notification
} from '@/components/ui'
import type { PlatformOrgDetail } from '../../types'
import classNames from '@/utils/classNames'
import dayjs from 'dayjs'
import { apiUpdatePlatformOrg } from '@/services/PlatformOrganizationService'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'

const { TabNav, TabList, TabContent } = Tabs

interface OrgDetailsTabsProps {
    data: PlatformOrgDetail
    onRefresh: () => void
}

const InfoRow = ({ label, value, isMonospace = false }: { label: string, value: string | null, isMonospace?: boolean }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-50 dark:border-gray-800 last:border-0 group gap-2">
        <span className="text-[10px] font-black text-gray-400">{label}</span>
        <span className={classNames(
            "text-sm font-black text-gray-900 dark:text-white tracking-tight sm:text-right capitalize",
            isMonospace ? 'font-mono bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded border border-gray-100 dark:border-gray-700 text-[11px]' : ''
        )}>
            {value || 'Not specified'}
        </span>
    </div>
)

const OrgDetailsTabs = ({ data, onRefresh }: OrgDetailsTabsProps) => {
    const [activeTab, setActiveTab] = useState('profile')
    const { profile, billing, activity } = data
    const [statusConfirmOpen, setStatusConfirmOpen] = useState(false)
    const [pendingIsActive, setPendingIsActive] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleStatusChange = async () => {
        setLoading(true)
        try {
            await apiUpdatePlatformOrg(profile.id, { is_active: pendingIsActive })
            toast.push(
                <Notification type="success">
                    Organization {pendingIsActive ? 'reactivated' : 'suspended'}.
                </Notification>
            )
            onRefresh()
        } catch (err) {
            toast.push(
                <Notification type="danger">
                    Action failed. Please try again.
                </Notification>
            )
        } finally {
            setLoading(false)
            setStatusConfirmOpen(false)
        }
    }

    return (
        <Tabs value={activeTab} onChange={setActiveTab} className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <TabList className="bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl w-fit mb-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-wrap gap-1">
                    {[
                        { id: 'profile', label: 'Organization Profile', icon: User },
                        { id: 'billing', label: 'Billing', icon: CreditCard },
                        { id: 'usage', label: 'Usage', icon: BarChart4 },
                        { id: 'security', label: 'Security', icon: ShieldAlert },
                        { id: 'admin', label: 'Manage', icon: Settings }
                    ].map((t) => (
                        <TabNav
                            key={t.id}
                            value={t.id}
                            className="px-6 py-2.5 rounded-xl flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md data-[state=active]:text-primary transition-all font-black text-[10px] whitespace-nowrap"
                        >
                            <t.icon className="w-4 h-4" />
                            <span>{t.label}</span>
                        </TabNav>
                    ))}
                </TabList>
            </div>
            <div className="min-h-[400px]">
                <TabContent value="profile" className="space-y-6">
                    <Card className="p-8 md:p-12 rounded-[2.5rem] border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none bg-white dark:bg-gray-900 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">General Information</h3>
                                <p className="text-[11px] font-black text-gray-400 leading-none">Full details of the organization</p>
                            </div>
                            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 self-start md:self-auto shadow-inner">
                                <span className="text-[10px] font-black text-gray-400">Organization ID: </span>
                                <span className="text-[11px] font-mono font-bold text-gray-900 dark:text-white">{profile.id}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                            <div className="space-y-8">
                                <div className="p-8 bg-gray-50/30 dark:bg-gray-800/20 rounded-[2rem] border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm">
                                    <h4 className="text-[11px] font-black text-primary mb-8 flex items-center gap-3">
                                        Basic Info
                                    </h4>
                                    <div className="space-y-2">
                                        <InfoRow label="Organization Name" value={profile.name} />
                                        <InfoRow label="Status" value="Enterprise" />
                                        <InfoRow label="Domain" value={profile.email.split('@')[1] || 'Internal'} />
                                    </div>
                                </div>

                                <div className="p-8 bg-gray-50/30 dark:bg-gray-800/20 rounded-[2rem] border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm">
                                    <h4 className="text-[11px] font-black text-primary mb-8 flex items-center gap-3">
                                        Organization Description
                                    </h4>
                                    <div className="italic">
                                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed">
                                            {profile.description || "No description available for this organization. You can update this in the settings."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="p-8 bg-gray-50/30 dark:bg-gray-800/20 rounded-[2rem] border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm">
                                    <h4 className="text-[11px] font-black text-primary mb-8 flex items-center gap-3">
                                        Contact & Access
                                    </h4>
                                    <div className="space-y-2">
                                        <InfoRow label="Owner" value={profile.owner} />
                                        <InfoRow label="Email" value={profile.email} />
                                        <InfoRow label="Access Level" value="Level 1" />
                                    </div>
                                </div>

                                <div className="p-8 bg-gray-50/30 dark:bg-gray-800/20 rounded-[2rem] border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm">
                                    <h4 className="text-[11px] font-black text-primary tracking-[0.4em] uppercase mb-8 flex items-center gap-3">
                                        System History
                                    </h4>
                                    <div className="space-y-2">
                                        <InfoRow label="Joined Date" value={dayjs(profile.createdAt).format('DD MMM YYYY HH:mm')} />
                                        <InfoRow label="Last Updated" value="Just now" />
                                        <InfoRow label="Health Status" value={profile.status === 'active' ? 'Active' : 'Under Review'} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabContent>

                <TabContent value="billing" className="space-y-6">
                    <Card className="p-10 rounded-[2.5rem] border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none bg-white dark:bg-gray-900">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Billing & Credits</h3>
                                <p className="text-[10px] font-black text-gray-400 leading-none">Manage organization funds and usage</p>
                            </div>
                            <Button
                                variant="solid"
                                size="lg"
                                className="rounded-2xl font-black text-[11px] shadow-xl shadow-primary/20"
                            >
                                View Invoices
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-primary">Balance Summary</h4>
                                <div className="p-8 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800">
                                    <InfoRow label="Available Credits" value={`${billing.credits.toLocaleString()} QOR`} isMonospace />
                                    <InfoRow label="Monthly Limit" value="Unlimited" />
                                    <InfoRow label="Billing Frequency" value="Monthly" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-primary">Spending Insights</h4>
                                <div className="p-8 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800">
                                    <InfoRow label="Monthly Spend" value={`₦${billing.monthlyUsage.toLocaleString()}`} />
                                    <InfoRow label="Estimated Total" value={`₦${(billing.monthlyUsage * 1.05).toLocaleString()}`} />
                                    <InfoRow label="Usage Status" value="Healthy" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabContent>

                <TabContent value="usage" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="p-8 rounded-[2.5rem] border-gray-100 dark:border-gray-800 space-y-8 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/40 dark:shadow-none">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">Usage History</h3>
                                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-[9px] font-black">SYSTEM LIVE</Badge>
                            </div>
                            <div className="h-[320px] w-full pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={[
                                            { hour: '00:00', value: 45 },
                                            { hour: '01:00', value: 60 },
                                            { hour: '02:00', value: 40 },
                                            { hour: '03:00', value: 80 },
                                            { hour: '04:00', value: 95 },
                                            { hour: '05:00', value: 70 },
                                            { hour: '06:00', value: 50 },
                                            { hour: '07:00', value: 65 },
                                            { hour: '08:00', value: 85 },
                                            { hour: '09:00', value: 40 },
                                            { hour: '10:00', value: 55 },
                                            { hour: '11:00', value: 75 },
                                        ]}
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="hour"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                        />
                                        <RechartsTooltip
                                            cursor={{ fill: 'rgba(0, 85, 186, 0.05)' }}
                                            contentStyle={{
                                                borderRadius: '24px',
                                                border: 'none',
                                                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                                                fontSize: '11px',
                                                fontWeight: '900',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                                padding: '16px'
                                            }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="#0055BA"
                                            radius={[8, 8, 0, 0]}
                                            barSize={32}
                                        >
                                            {[45, 60, 40, 80, 95, 70, 50, 65, 85, 40, 55, 75].map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={index === 11 ? '#0055BA' : 'rgba(0, 85, 186, 0.1)'}
                                                    className="transition-all duration-500 hover:opacity-80"
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-gray-400 pt-4 border-t border-gray-50 dark:border-gray-800">
                                <span>12H Window</span>
                                <span>Real-time Sync: {dayjs().format('HH:mm')}</span>
                            </div>
                        </Card>

                        <Card className="p-8 rounded-[2.5rem] border-gray-100 dark:border-gray-800 space-y-10 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/40 dark:shadow-none">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Usage by Workspace</h3>
                            <div className="space-y-6">
                                {activity.topWorkspaces.length > 0 ? activity.topWorkspaces.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-gray-100 dark:border-gray-800 group hover:border-primary/30 transition-all duration-500">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-800 group-hover:shadow-xl group-hover:shadow-primary/5 group-hover:scale-110 transition-all">
                                                <Database className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{item.name}</span>
                                                <span className="text-[10px] font-black text-gray-400">Workspace Env</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-base font-black text-gray-900 dark:text-white tracking-tight">₦{item.usage.toLocaleString()}</div>
                                            <div className="text-[10px] font-black text-primary">Spent</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center">
                                        <p className="text-[10px] font-black text-gray-400">No performance data recorded</p>
                                    </div>
                                )}
                            </div>
                            <Button variant="plain" className="w-full text-[10px] font-black text-primary hover:bg-primary/5 rounded-2xl h-14 border border-primary/10">
                                View All Usage
                            </Button>
                        </Card>
                    </div>
                </TabContent>

                <TabContent value="security" className="space-y-6">
                    <Card className="p-10 rounded-[2.5rem] border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none bg-white dark:bg-gray-900">
                        <div className="flex flex-col gap-2 mb-10">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Security Activity</h3>
                            <p className="text-xs text-gray-500 font-medium">History of security events and system monitoring.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {[
                                { label: 'Recent Logins', value: '4 / 24h', status: 'Safe', color: 'text-emerald-500' },
                                { label: 'Identified Issues', value: '0 / 24h', status: 'None', color: 'text-gray-400' },
                                { label: 'System Updates', value: 'Active', status: 'Uptodate', color: 'text-emerald-500' },
                                { label: 'System Flags', value: '1 Active', status: 'Review', color: 'text-amber-500' }
                            ].map((sig, i) => (
                                <div key={i} className="p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-32">
                                    <div className="text-[10px] font-black text-gray-400">{sig.label}</div>
                                    <div className="text-xl font-black text-gray-900 dark:text-white">{sig.value}</div>
                                    <Badge className={classNames(
                                        "px-3 py-1 rounded-lg text-[8px] font-black border self-start",
                                        sig.status === 'None' || sig.status === 'Safe' || sig.status === 'Uptodate' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            "bg-amber-50 text-amber-500 border-amber-200"
                                    )}>{sig.status}</Badge>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h4 className="text-[11px] font-black text-gray-900 dark:text-white">Event History</h4>
                                <Button variant="plain" size="xs" className="text-primary font-black text-[10px] h-auto p-0 hover:bg-transparent">Export Records</Button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { time: '2026-01-22 09:12', event: 'Administrative state transition: ACTIVE', level: 'info', actor: 'System Auto' },
                                    { time: '2026-01-21 23:45', event: 'New resource allocation requested', level: 'info', actor: 'API Master' },
                                    { time: '2026-01-20 18:02', event: 'Concurrent login anomaly detected', level: 'caution', actor: 'Owner Key' }
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center gap-6 p-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all rounded-[1.5rem] border border-transparent hover:border-gray-200 group">
                                        <div className={classNames(
                                            "w-2 h-2 rounded-full shrink-0 shadow-sm",
                                            log.level === 'warning' ? "bg-rose-500 animate-pulse" :
                                                log.level === 'caution' ? "bg-amber-500" : "bg-emerald-500"
                                        )} />
                                        <span className="text-[11px] font-mono font-bold text-gray-400 w-32 group-hover:text-gray-600 transition-colors">{log.time}</span>
                                        <span className="text-sm font-black text-gray-700 dark:text-gray-300 flex-1 tracking-tight">{log.event}</span>
                                        <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-500 border-none px-4 py-1.5 rounded-xl text-[9px] font-black">{log.actor}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </TabContent>

                <TabContent value="admin" className="space-y-6">
                    <Card className="p-10 rounded-[3rem] border-gray-100 dark:border-gray-800 space-y-10 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/40 dark:shadow-none">
                        <div className="flex items-center gap-5 pb-8 border-b border-gray-50 dark:border-gray-800">
                            <div className="w-14 h-14 bg-primary/10 rounded-[1.5rem] flex items-center justify-center border border-primary/20">
                                <Settings className="w-7 h-7 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Organization Status</h3>
                                <p className="text-[10px] text-gray-400 font-bold">Manage organization access and state</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className={classNames(
                                "flex items-center justify-between p-6 rounded-3xl border group overflow-hidden relative",
                                profile.status === 'active'
                                    ? "bg-rose-50/20 dark:bg-rose-500/5 border-rose-100 dark:border-rose-500/10"
                                    : "bg-emerald-50/20 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10"
                            )}>
                                <div className={classNames(
                                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                                    profile.status === 'active' ? "bg-rose-500/5" : "bg-emerald-500/5"
                                )} />
                                <div className="flex flex-col relative z-10">
                                    <span className={classNames(
                                        "text-sm font-black capitalize tracking-tight mb-1 flex items-center gap-2",
                                        profile.status === 'active' ? "text-rose-600" : "text-emerald-600"
                                    )}>
                                        {profile.status === 'active' ? 'Suspend Organization' : 'Reactivate Organization'}
                                        <Badge className={classNames(
                                            "border-none text-[8px] px-2 py-0.5 text-white",
                                            profile.status === 'active' ? "bg-rose-500" : "bg-emerald-500"
                                        )}>
                                            {profile.status === 'active' ? 'CRITICAL' : 'RECOVERY'}
                                        </Badge>
                                    </span>
                                    <span className={classNames(
                                        "text-[10px] font-bold max-w-[280px]",
                                        profile.status === 'active' ? "text-rose-400" : "text-emerald-400"
                                    )}>
                                        {profile.status === 'active'
                                            ? "Turn off all platform access for this organization immediately."
                                            : "Restore full platform access and functionality for this organization."
                                        }
                                    </span>
                                </div>
                                {profile.status === 'active' ? (
                                    <Button
                                        variant="solid"
                                        className="bg-rose-500 hover:bg-rose-600 text-white rounded-2xl shadow-xl shadow-rose-500/30 text-[10px] px-8 py-4 h-auto font-black transition-all hover:scale-105 active:scale-95"
                                        onClick={() => {
                                            setPendingIsActive(false)
                                            setStatusConfirmOpen(true)
                                        }}
                                    >Suspend Now</Button>
                                ) : (
                                    <Button
                                        variant="solid"
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-500/30 text-[10px] px-8 py-4 h-auto font-black transition-all hover:scale-105 active:scale-95"
                                        onClick={() => {
                                            setPendingIsActive(true)
                                            setStatusConfirmOpen(true)
                                        }}
                                    >Reactivate Now</Button>
                                )}
                            </div>

                            <div className="flex items-center justify-between p-6 bg-amber-50/20 dark:bg-amber-500/5 rounded-3xl border border-amber-100 dark:border-amber-500/10 group">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-amber-600 tracking-tight mb-1">Pause Credits</span>
                                    <span className="text-[10px] font-bold text-amber-400 max-w-[280px]">Stop this organization from spending any more credits.</span>
                                </div>
                                <Button variant="solid" className="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-xl shadow-amber-500/30 text-[10px] px-8 py-4 h-auto font-black transition-all hover:scale-105 active:scale-95">Pause Spending</Button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-gray-700 dark:text-gray-300 tracking-tight mb-1">Block Integrations</span>
                                    <span className="text-[10px] font-bold text-gray-400 max-w-[280px]">Disconnect all external apps and Google integrations.</span>
                                </div>
                                <Button variant="plain" className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl text-[10px] px-8 py-4 h-auto font-black hover:bg-gray-100 transition-all">Block Now</Button>
                            </div>
                        </div>
                    </Card>
                </TabContent>
            </div>

            <Dialog
                isOpen={statusConfirmOpen}
                onClose={() => setStatusConfirmOpen(false)}
                closable={false}
                width={500}
                className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
                contentClassName="!shadow-none"
            >
                <div className="relative">
                    {/* Dynamic Header */}
                    <div className={classNames(
                        "px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between",
                        pendingIsActive ? "bg-emerald-50/30 dark:bg-emerald-500/5" : "bg-rose-50/30 dark:bg-rose-500/5"
                    )}>
                        <div className="flex items-center gap-4">
                            <div className={classNames(
                                "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                                pendingIsActive
                                    ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                    : "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400"
                            )}>
                                {pendingIsActive ? <CheckCircle className="w-6 h-6" /> : <Slash className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                                    {pendingIsActive ? 'Reactivate Account' : 'Suspend Account'}
                                </h3>
                                <p className="text-[10px] text-gray-400 font-black mt-0.5">Confirm Identity State Mutation</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setStatusConfirmOpen(false)}
                            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                        >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                {pendingIsActive
                                    ? "Are you sure you want to restore all platform access and features for this organization? This will allow all associated members to resume their activities immediately."
                                    : "Are you sure you want to suspend this organization? This critical action will immediately revoke platform access for all associated users and halt active workspace processes until manually reactivated."
                                }
                            </p>

                            {!pendingIsActive && (
                                <div className="p-4 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600">
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 leading-tight">
                                            Caution: High Impact Action impacts all org members
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStatusConfirmOpen(false)}
                                className="flex-1 h-14 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-inter"
                            >
                                Dismiss
                            </button>
                            <Button
                                variant="solid"
                                loading={loading}
                                className={classNames(
                                    "flex-[2] h-14 text-white rounded-2xl font-black text-[11px] shadow-xl transition-all border-none active:scale-95",
                                    pendingIsActive
                                        ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                                        : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                                )}
                                onClick={handleStatusChange}
                            >
                                {pendingIsActive ? 'Confirm Activation' : 'Confirm Suspension'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Tabs>
    )
}

export default OrgDetailsTabs
