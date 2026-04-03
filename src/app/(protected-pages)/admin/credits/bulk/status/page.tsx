'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, ArrowLeft, RefreshCw, FileText } from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'

export default function BatchStatusPage() {
    const router = useRouter()
    const [status, setStatus] = useState<'processing' | 'completed' | 'failed'>('processing')
    const [progress, setProgress] = useState(0)

    // Simulate processing
    useEffect(() => {
        if (status === 'processing') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        setStatus('completed')
                        return 100
                    }
                    return prev + 5
                })
            }, 200)
            return () => clearInterval(interval)
        }
    }, [status])

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900/50 -m-4 sm:-m-8 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="plain"
                        onClick={() => router.push('/admin/credits/bulk')}
                        className="h-10 w-10 p-0 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Batch Status</h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tracking allocation ID: #BLK-2025-001</p>
                    </div>
                </div>

                {/* Main Status Card */}
                <Card className="p-8 bg-white dark:bg-gray-800 border-none shadow-xl rounded-[2.5rem] relative overflow-hidden">
                    {status === 'processing' && (
                        <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                    )}

                    <div className="flex flex-col items-center justify-center py-10 space-y-6">
                        {status === 'processing' && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                                <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
                            </div>
                        )}
                        {status === 'completed' && (
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                            </div>
                        )}

                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                {status === 'processing' ? 'Processing Allocation...' : 'Distribution Complete'}
                            </h2>
                            <p className="text-sm font-medium text-gray-500 max-w-md mx-auto">
                                {status === 'processing'
                                    ? `Validating and distributing credits to ${120} recipients. Please do not close this window.`
                                    : `Successfully distributed ₦500,000 to 120 recipients.`}
                            </p>
                        </div>

                        {status === 'completed' && (
                            <div className="flex gap-4">
                                <Button onClick={() => router.push('/admin/credits/bulk')} className="rounded-xl px-6 py-5 font-black uppercase tracking-widest text-[10px]">
                                    New Distribution
                                </Button>
                                <Button variant="default" className="rounded-xl px-6 py-5 font-black uppercase tracking-widest text-[10px] gap-2">
                                    <FileText className="w-4 h-4" />
                                    Download Report
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Validations & Logs */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-emerald-500/5 border-emerald-500/10 rounded-3xl">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Success</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{status === 'completed' ? 120 : 0}</p>
                    </Card>
                    <Card className="p-6 bg-amber-500/5 border-amber-500/10 rounded-3xl">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Retrying</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">0</p>
                    </Card>
                    <Card className="p-6 bg-rose-500/5 border-rose-500/10 rounded-3xl">
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Failed</p>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">0</p>
                    </Card>
                </div>

                {/* Detailed Logs Mock */}
                <Card className="bg-white dark:bg-gray-800 border-none shadow-lg rounded-[2rem] overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Audit Log</h3>
                        <Badge content="Live" className="bg-primary/10 text-primary border-none" />
                    </div>
                    <div className="p-0">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-[10px] font-black">
                                        {i}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">Processing Batch Chunk #{i}</p>
                                        <p className="text-[10px] text-gray-400">2 seconds ago</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Success</span>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </div>
    )
}
