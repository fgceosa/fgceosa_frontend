'use client'

import { Shield, Lock, RefreshCw, Eye, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui'
import classNames from '@/utils/classNames'

export default function ApiKeysSecurity() {
    const securityPractices = [
        {
            icon: Lock,
            title: 'Safe Storage',
            description: 'Never share your keys or store them in public places. Treat them as securely as your main account password.',
            color: 'text-rose-600 bg-rose-50',
            severity: 'CRITICAL'
        },
        {
            icon: RefreshCw,
            title: 'Regular Updates',
            description: 'Update your tokens periodically to maintain a clean security profile and prevent unauthorized long-term access.',
            color: 'text-amber-600 bg-amber-50',
            severity: 'RECOMMENDED'
        },
        {
            icon: Shield,
            title: 'Separate Testing',
            description: 'Use different tokens for testing new features to ensure your main production environment remains stable and secure.',
            color: 'text-indigo-600 bg-indigo-50',
            severity: 'BEST PRACTICE'
        },
        {
            icon: Eye,
            title: 'Activity Monitoring',
            description: 'Always keep an eye on your token usage alerts to quickly spot any unusual behavior in your integrations.',
            color: 'text-emerald-600 bg-emerald-50',
            severity: 'MONITORED'
        }
    ]

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {securityPractices.map((practice, i) => (
                    <Card key={i} className="p-8 border-gray-100 dark:border-gray-800 hover:border-primary/20 transition-all bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none group relative overflow-hidden">
                        {/* Decorative Pattern */}
                        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full opacity-30 group-hover:scale-125 transition-transform duration-700" />

                        <div className="flex items-start justify-between mb-6 relative z-10">
                            <div className={classNames("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3", practice.color)}>
                                <practice.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-black text-gray-400 border border-gray-100 px-2.5 py-1 rounded-md leading-none">
                                {practice.severity}
                            </span>
                        </div>

                        <div className="relative z-10">
                            <h4 className="text-base font-black mb-3 text-gray-900 dark:text-white">{practice.title}</h4>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">{practice.description}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-gray-400 text-xs font-black hover:text-primary transition-colors cursor-pointer group">
                    <AlertTriangle className="w-5 h-5 group-hover:animate-bounce" />
                    <span>View complete security protocol documentation</span>
                </div>
            </div>
        </div>
    )
}
