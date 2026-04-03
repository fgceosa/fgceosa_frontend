'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Home, Compass, AlertCircle } from 'lucide-react'
import appConfig from '@/configs/app.config'
import { Button } from '@/components/ui'
import Logo from '@/components/template/Logo'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-6 sm:p-12 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full max-h-[800px] pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-soft-light animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-soft-light animate-pulse delay-1000" />
            </div>

            <div className="max-w-4xl w-full relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                {/* Visual Section */}
                <div className="lg:w-1/2 order-2 lg:order-1 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Soft Glow Backdrop */}
                        <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] blur-xl" />

                        <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-12 shadow-sm flex items-center justify-center min-w-[320px]">
                            <div className="flex flex-col items-center gap-6">
                                <Logo type="full" logoWidth={120} logoHeight={60} />
                                <div className="h-px w-12 bg-gray-100 dark:bg-gray-800" />
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-4xl font-black text-primary/10 tracking-tighter">404</span>
                                    <div className="flex justify-center gap-1.5">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2 space-y-8 text-center lg:text-left order-1 lg:order-2">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-100 dark:border-amber-800"
                        >
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">404 Error</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1]"
                        >
                            Page Not Found
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-base text-gray-500 dark:text-gray-400 font-medium max-w-sm leading-relaxed"
                        >
                            The page you're looking for doesn't exist or has been moved.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <Button
                            variant="solid"
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary hover:bg-primary-deep text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
