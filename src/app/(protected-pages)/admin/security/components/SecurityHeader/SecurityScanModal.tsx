'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    ShieldCheck,
    Radar,
    CheckCircle2,
    Circle,
    Loader2,
    RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Progress from '@/components/ui/Progress'
import { SECURITY_SCAN_STEPS } from '../../constants'
import { runSecurityScan } from '@/store/slices/security'
import { useAppDispatch } from '@/store/hook'

interface SecurityScanModalProps {
    isOpen: boolean
    onClose: () => void
}

/**
 * SecurityScanModal - Simulates a security health check/scan process
 * 
 * Provides visual feedback for organization security auditing:
 * - Real-time progress tracking
 * - Step-by-step audit visualization
 * - Success feedback upon completion
 */
export default function SecurityScanModal({ isOpen, onClose }: SecurityScanModalProps) {
    const dispatch = useAppDispatch()
    const [progress, setProgress] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [completedSteps, setCompletedSteps] = useState<number[]>([])

    const startScan = useCallback(() => {
        // Trigger real backend scan
        dispatch(runSecurityScan())

        // Reset state
        setProgress(0)
        setCurrentStep(0)
        setIsComplete(false)
        setCompletedSteps([])

        let stepIndex = 0
        let currentProgress = 0

        const runStep = () => {
            if (stepIndex < SECURITY_SCAN_STEPS.length) {
                const step = SECURITY_SCAN_STEPS[stepIndex]
                setCurrentStep(stepIndex)

                const stepProgressTarget = ((stepIndex + 1) / SECURITY_SCAN_STEPS.length) * 100
                const increment = (stepProgressTarget - currentProgress) / 20

                let count = 0
                const interval = setInterval(() => {
                    currentProgress += increment
                    setProgress(Math.min(currentProgress, stepProgressTarget))
                    count++

                    if (count >= 20) {
                        clearInterval(interval)
                        setCompletedSteps(prev => [...prev, step.id])
                        stepIndex++
                        setTimeout(runStep, 300)
                    }
                }, step.duration / 20)
            } else {
                setIsComplete(true)
                setProgress(100)
            }
        }

        const timeoutId = setTimeout(runStep, 300)
        return () => clearTimeout(timeoutId)
    }, [dispatch])

    useEffect(() => {
        if (isOpen) {
            const cleanup = startScan()
            return cleanup
        }
    }, [isOpen, startScan])

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            closable={isComplete}
            width={600}
            contentClassName="p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl"
        >
            <div className="relative bg-white dark:bg-gray-950 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-primary animate-pulse" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/10 blur-[120px] rounded-full" />

                <div className="p-8 relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className={`p-3 rounded-2xl ${isComplete ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-blue-100 dark:bg-blue-900/30 text-primary'} transition-colors duration-500`}>
                            {isComplete ? <ShieldCheck className="w-8 h-8" /> : <Radar className="w-8 h-8 animate-pulse" />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100 uppercase">
                                {isComplete ? 'All Clear!' : 'Security Health Check'}
                            </h2>
                            <p className="text-muted-foreground font-medium">
                                {isComplete
                                    ? 'Everything looks great! Your account is safe.'
                                    : "We're making sure everything is safe and secure..."}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Progress Section */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Overall Health</span>
                                <span className="text-3xl font-black text-primary">{Math.round(progress)}%</span>
                            </div>
                            <Progress
                                percent={progress}
                                showInfo={false}
                                customColorClass={isComplete ? 'bg-green-500' : 'bg-primary'}
                                className="h-3"
                            />
                        </div>

                        {/* Steps List */}
                        <div className="grid gap-3">
                            {SECURITY_SCAN_STEPS.map((step, index) => {
                                const isCompleted = completedSteps.includes(step.id)
                                const isCurrent = currentStep === index && !isComplete

                                return (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${isCurrent
                                            ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/10'
                                            : isCompleted
                                                ? 'bg-transparent border-gray-100 dark:border-gray-800'
                                                : 'bg-transparent border-transparent opacity-40'
                                            }`}
                                    >
                                        <div className="shrink-0">
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : isCurrent ? (
                                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-gray-300" />
                                            )}
                                        </div>
                                        <span className={`text-sm font-semibold ${isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                            {step.label}
                                        </span>
                                        {isCompleted && (
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="ml-auto text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-tighter"
                                            >
                                                Secure
                                            </motion.span>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-3">
                        <AnimatePresence mode="wait">
                            {isComplete ? (
                                <motion.div
                                    key="complete-actions"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex w-full gap-3"
                                >
                                    <Button
                                        block
                                        variant="default"
                                        onClick={onClose}
                                        className="rounded-2xl"
                                    >
                                        Dismiss
                                    </Button>
                                    <Button
                                        block
                                        variant="solid"
                                        onClick={startScan}
                                        icon={<RefreshCw className="w-4 h-4" />}
                                        className="rounded-2xl shadow-lg shadow-primary/25"
                                    >
                                        Run Again
                                    </Button>
                                </motion.div>
                            ) : (
                                <Button
                                    key="scanning"
                                    disabled
                                    variant="plain"
                                    className="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-xs"
                                >
                                    Checking your security...
                                </Button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
