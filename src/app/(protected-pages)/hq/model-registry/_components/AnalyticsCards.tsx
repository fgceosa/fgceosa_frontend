import { Card } from '@/components/ui'
import {
    VscServer,
    VscCheck,
    VscLock,
    VscCircleSlash,
    VscCombine
} from 'react-icons/vsc'
import type { RegistryAnalytics } from '../types'
import classNames from '@/utils/classNames'

interface AnalyticsCardsProps {
    data: RegistryAnalytics | null
    loading: boolean
}

const AnalyticsCard = ({
    title,
    value,
    icon: Icon,
    colorClass,
    loading
}: {
    title: string;
    value: string | number;
    icon: any;
    colorClass: string;
    loading: boolean;
}) => (
    <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
        <div className="relative flex flex-col p-6 bg-white dark:bg-gray-900 rounded-[1.8rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden h-full">
            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={classNames(
                    "p-3 rounded-2xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex items-center justify-center bg-opacity-10",
                    colorClass.replace('bg-', 'text-'),
                    colorClass.replace('bg-', 'bg-').replace('-600', '-50'),
                    "border-" + colorClass.split('-')[1] + "-100/50"
                )}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 relative z-10">
                    <div className={classNames(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        colorClass.replace('bg-', 'bg-')
                    )} />
                    <span className="text-[10px] font-black text-gray-400">
                        Registry
                    </span>
                </div>
            </div>
            <div className="space-y-1 relative z-10">
                <span className="text-[10px] font-black text-gray-400">{title}</span>
                {loading ? (
                    <div className="h-8 w-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
                ) : (
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                        {value}
                    </h3>
                )}
                <p className="text-xs font-bold text-gray-400 italic">Global Stats</p>
            </div>
        </div>
    </div>
)

const AnalyticsCards = ({ data, loading }: AnalyticsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
            <AnalyticsCard
                title="Total Models"
                value={data?.totalModels || 0}
                icon={VscServer}
                colorClass="bg-blue-600"
                loading={loading}
            />
            <AnalyticsCard
                title="Ready for Use"
                value={data?.approvedModels || 0}
                icon={VscCheck}
                colorClass="bg-emerald-600"
                loading={loading}
            />
            <AnalyticsCard
                title="Restricted Access"
                value={data?.restrictedModels || 0}
                icon={VscLock}
                colorClass="bg-amber-600"
                loading={loading}
            />
            <AnalyticsCard
                title="Retired Models"
                value={data?.deprecatedModels || 0}
                icon={VscCircleSlash}
                colorClass="bg-rose-600"
                loading={loading}
            />
            <AnalyticsCard
                title="Service Providers"
                value={data?.activeProviders || 0}
                icon={VscCombine}
                colorClass="bg-purple-600"
                loading={loading}
            />
        </div>
    )
}

export default AnalyticsCards
