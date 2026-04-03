import { Card, Button, Notification, toast } from '@/components/ui'
import { Users, UserX, AlertCircle, LogOut } from 'lucide-react'
import classNames from '@/utils/classNames'
import type { SessionMetrics } from '../types'
import { useAppDispatch } from '@/store/hook'
import { terminateAllSessions } from '@/store/slices/security'

interface SessionMonitoringProps {
    metrics?: SessionMetrics
}

export default function SessionMonitoring({ metrics }: SessionMonitoringProps) {
    const dispatch = useAppDispatch()

    // Use metrics or default to 0s to avoid showing misleading mock data
    const data = metrics || {
        activeSessions: 0,
        failedLogins24h: 0,
        suspiciousPatterns: 0
    }

    const handleInvalidateSessions = async () => {
        try {
            await dispatch(terminateAllSessions()).unwrap()
            toast.push(
                <Notification type="success" title="Sessions Invalidated">
                    All active user sessions have been terminated. Users will need to log in again.
                </Notification>
            )
        } catch (error: any) {
            toast.push(
                <Notification type="danger" title="Action Failed">
                    {error || 'Failed to invalidate sessions. Please try again.'}
                </Notification>
            )
        }
    }

    const stats = [
        {
            label: 'Active Sessions',
            value: data.activeSessions,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: 'Failed Logins (24h)',
            value: data.failedLogins24h,
            icon: UserX,
            color: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/20'
        },
        {
            label: 'Suspicious Patterns',
            value: data.suspiciousPatterns,
            icon: AlertCircle,
            color: 'text-rose-500',
            bg: 'bg-rose-50 dark:bg-rose-900/20'
        }
    ]

    return (
        <Card className="rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none bg-white dark:bg-gray-900 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Session Monitoring
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-1">Real-time authentication</p>
                </div>
                <Button
                    size="sm"
                    variant="solid"
                    color="red-600"
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-3"
                    icon={<LogOut className="w-3 h-3" />}
                    onClick={handleInvalidateSessions}
                >
                    Kill All
                </Button>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/20 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className={classNames(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                stat.bg,
                                stat.color
                            )}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                {stat.label}
                            </span>
                        </div>
                        <h4 className="text-2xl font-black text-gray-900 dark:text-white">
                            {stat.value}
                        </h4>
                    </div>
                ))}
            </div>
        </Card>
    )
}
