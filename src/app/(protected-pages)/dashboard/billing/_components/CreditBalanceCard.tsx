import type { ReactNode } from 'react'
import { Wallet, History, CreditCard } from 'lucide-react'
import { Card, Progress } from '@/components/ui'
import { stats } from '@/mock/billing'

const CreditBalanceCard = () => {
    const iconMap: Record<string, ReactNode> = {
        available_balance: <Wallet className="w-5 h-5 text-white" />,
        monthly_usage: <History className="w-5 h-5 text-primary" />,
        total_credits_used: <CreditCard className="w-5 h-5 text-primary" />,
    }

    const bgMap: Record<string, string> = {
        available_balance: 'bg-primary text-white shadow-strong border-0',
        monthly_usage: 'shadow-medium border-border/50',
        total_credits_used: 'shadow-medium border-border/50',
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stats.map((item) => (
                <Card key={item.key} className={bgMap[item.key]}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    item.key === 'available_balance'
                                        ? 'bg-white/20'
                                        : 'bg-primary/10'
                                }`}
                            >
                                {iconMap[item.key]}
                            </div>
                            <h3
                                className={`text-base font-medium ${
                                    item.key === 'available_balance'
                                        ? 'text-white opacity-90'
                                        : 'text-foreground'
                                }`}
                            >
                                {item.title}
                            </h3>
                        </div>

                        {item.status && (
                            <span
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                    item.key === 'available_balance'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-primary/10 text-primary'
                                }`}
                            >
                                {item.status}
                            </span>
                        )}
                    </div>

                    {/* Body */}
                    {item.type === 'usage' ? (
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <p className="text-xl font-bold text-foreground">
                                        {item.value}
                                    </p>
                                    {item.maxValue && (
                                        <p className="text-muted-foreground">
                                            / {item.maxValue}
                                        </p>
                                    )}
                                </div>
                                <Progress
                                    percent={item.percent}
                                    strokeWidth={8}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {item.subtext}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <p
                                className={`text-xl font-bold ${
                                    item.key === 'available_balance'
                                        ? 'text-white'
                                        : 'text-foreground'
                                }`}
                            >
                                {item.value}
                            </p>
                            <p
                                className={`${
                                    item.key === 'available_balance'
                                        ? 'opacity-80 text-white'
                                        : 'text-muted-foreground'
                                }`}
                            >
                                {item.subtext}
                            </p>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    )
}

export default CreditBalanceCard
