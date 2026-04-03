import { Card } from '@/components/ui'
import { Settings, Zap, Activity, Cpu } from 'lucide-react'
import type { ReactNode } from 'react'
import { AnalyticsCardProps } from '../types'
import { analyticsData } from '@/mock/apiProvider'
import { FaNairaSign } from 'react-icons/fa6'

const iconMap: Record<string, ReactNode> = {
    activeProviders: <Settings className="h-4 w-4 text-primary" />,
    totalRequests: <Zap className="h-4 w-4 text-yellow-500" />,
    providerCosts: <FaNairaSign className="h-4 w-4 text-success" />,
    avgUptime: <Activity className="h-4 w-4 text-blue-500" />,
}

const defaultIcon = <Cpu className="h-4 w-4 text-gray-400" />

const AnalyticsCard = ({
    title,
    value,
    label,
    icon = defaultIcon,
}: AnalyticsCardProps) => (
    <Card className="shadow-medium hover:shadow-strong transition-all duration-200">
        <div className="space-y-1">
            <div className="flex items-center justify-between pb-2">
                <h6 className="text-sm font-medium text-primary">{title}</h6>
                {icon}
            </div>
            <div className="text-2xl font-bold text-primary">{value}</div>
            <p className="text-xs text-success">{label}</p>
        </div>
    </Card>
)

export default function ApiProvidersAnalytics() {
    return (
        <div className="grid gap-6 md:grid-cols-4">
            {analyticsData.map((card) => (
                <AnalyticsCard
                    key={card.id}
                    title={card.title}
                    value={card.value}
                    label={card.label}
                    icon={iconMap[card.id] || defaultIcon}
                />
            ))}
        </div>
    )
}
