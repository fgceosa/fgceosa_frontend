'use client'

import { cloneElement, useState, useEffect } from 'react'
import type { ReactElement } from 'react'
import type { CommonProps } from '@/@types/common'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectPlatformSettingsData, fetchPublicPlatformSettings } from '@/store/slices/platformSettings'
import Logo from '@/components/template/Logo'

// ... (imports)

type SplitProps = CommonProps

const carouselItems = [
    {
        id: 'gateway',
        title: "One API. Every AI Model.",
        desc: "Access OpenAI, Anthropic, DeepSeek, and 20+ leading AI providers through a single, enterprise-grade endpoint. Switch models instantly — no code changes required.",
        color: "from-blue-400/20 to-indigo-500/20",
        accent: "text-blue-300",
        status: "All Providers Live"
    },
    {
        id: 'intelligence',
        title: "Teams, Workspaces & Budgets.",
        desc: "Provision workspaces, assign role-based access, and enforce spending limits per team. Full organizational control over every AI credit and API call.",
        color: "from-orange-400/20 to-amber-500/20",
        accent: "text-orange-300",
        status: "Workspace Ready"
    },
    {
        id: 'copilot',
        title: "Real-Time Usage Intelligence.",
        desc: "Monitor token consumption, track per-model costs, and audit every request with granular analytics. Know exactly how your teams use AI — in real time.",
        color: "from-emerald-400/20 to-teal-500/20",
        accent: "text-emerald-300",
        status: "Analytics Live"
    }
]

const VisualGateway = () => {
    const providers = [
        { name: 'OpenAI', color: 'bg-[#10a37f]', angle: -30, delay: 0 },
        { name: 'Anthropic', color: 'bg-[#d97757]', angle: 30, delay: 0.2 },
        { name: 'Gemini', color: 'bg-[#4285f4]', angle: 150, delay: 0.4 },
        { name: 'DeepSeek', color: 'bg-[#615ced]', angle: 210, delay: 0.6 },
        { name: 'Mistral', color: 'bg-[#f5d142]', angle: 270, delay: 0.8 },
    ]

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-[80px]" />
            
            {/* Static decorative rings */}
            <div className="absolute w-64 h-64 rounded-full border border-white/5" />
            <div className="absolute w-48 h-48 rounded-full border border-dashed border-white/5" />

            {/* Connection Lines & Pulses (SVG) */}
            <svg className="absolute w-[300px] h-[300px] pointer-events-none" viewBox="-150 -150 300 300">
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                </defs>
                {providers.map((p, i) => {
                    const rad = (p.angle * Math.PI) / 180
                    const r = 115
                    const x = Math.cos(rad) * r
                    const y = Math.sin(rad) * r
                    
                    return (
                        <g key={`line-${i}`}>
                            {/* Connection path */}
                            <motion.line
                                x1="0" y1="0"
                                x2={x} y2={y}
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, delay: p.delay, ease: "easeOut" }}
                            />
                            
                            {/* Data Pulse moving along the line */}
                            <motion.circle
                                r="2.5"
                                fill="white"
                                initial={{ "--offset-distance": "0%" } as any}
                                animate={{ "--offset-distance": "100%" } as any}
                                transition={{ 
                                    duration: 2.5, 
                                    repeat: Infinity, 
                                    delay: p.delay,
                                    ease: "linear"
                                }}
                                style={{
                                    offsetPath: `path('M 0 0 L ${x} ${y}')`,
                                    offsetDistance: "var(--offset-distance)",
                                    filter: 'blur(1px) drop-shadow(0 0 5px white)'
                                } as any}
                            />
                        </g>
                    )
                })}
            </svg>

            {/* Provider nodes */}
            {providers.map((p, i) => {
                const rad = (p.angle * Math.PI) / 180
                const r = 115
                const x = Math.cos(rad) * r
                const y = Math.sin(rad) * r
                return (
                    <motion.div key={i}
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            x: x, 
                            y: y,
                            transition: { delay: p.delay + 0.5, duration: 0.8, type: "spring" }
                        }}
                        className="absolute flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] group hover:bg-white/20 transition-all cursor-default"
                        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${p.color} ring-4 ring-white/10 group-hover:scale-125 transition-transform`} />
                        <span className="text-[10px] font-black text-white leading-none whitespace-nowrap tracking-tight">{p.name}</span>
                    </motion.div>
                )
            })}

            {/* Central API hub (Qorebit) */}
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                    scale: [1, 1.05, 1], 
                    opacity: 1,
                    boxShadow: ['0 0 40px rgba(0,85,186,0.2)', '0 0 60px rgba(0,85,186,0.4)', '0 0 40px rgba(0,85,186,0.2)']
                }}
                transition={{ 
                    scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                    opacity: { duration: 1 },
                    boxShadow: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="w-40 h-40 bg-white/15 rounded-[2.2rem] flex flex-col items-center justify-center backdrop-blur-3xl border-2 border-white/30 shadow-2xl relative z-10 gap-2 px-4 group overflow-hidden"
            >
                {/* Internal animated glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-4 border-2 border-white/5 border-dashed rounded-full pointer-events-none"
                />

                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse relative z-10">
                    <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75" />
                </div>
                
                <img
                    src="/img/logo/Qorebit-white.png"
                    alt="Qorebit"
                    className="w-28 h-auto object-contain relative z-10 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                
                <div className="flex flex-col items-center relative z-10">
                    <span className="text-[9px] font-black text-blue-300 tracking-[0.2em] uppercase">Unified API</span>
                    <div className="flex gap-0.5 mt-1">
                        <div className="w-4 h-0.5 bg-blue-500/40 rounded-full" />
                        <div className="w-2 h-0.5 bg-blue-500/40 rounded-full" />
                    </div>
                </div>
            </motion.div>

            {/* Floating Stats / Info */}
            <motion.div 
                animate={{ y: [0, -8, 0], opacity: [0.8, 1, 0.8] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 right-6 bg-white/10 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20"
            >
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Avg. Response</span>
                    <span className="text-[12px] font-black text-white">1.4s Latency</span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Status</span>
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[12px] font-black text-emerald-400">99.9%</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

const VisualIntelligence = () => {
    const workspaces = [
        { name: 'Engineering', members: 12, used: 78, budget: '$500', role: 'Admin', color: 'bg-orange-400' },
        { name: 'Product', members: 6, used: 45, budget: '$250', role: 'Editor', color: 'bg-blue-400' },
        { name: 'Marketing', members: 4, used: 22, budget: '$100', role: 'Viewer', color: 'bg-emerald-400' },
    ]
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-72 space-y-2">
                {workspaces.map((ws, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.3, duration: 0.6 }}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 flex items-center gap-3"
                    >
                        <div className={`w-8 h-8 ${ws.color}/30 rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <div className={`w-3 h-3 ${ws.color} rounded-md`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-black text-white">{ws.name}</span>
                                <span className="text-[9px] font-bold text-white/40">{ws.budget}</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }} animate={{ width: `${ws.used}%` }}
                                    transition={{ delay: i * 0.3 + 0.5, duration: 0.8 }}
                                    className={`h-full ${ws.color} rounded-full`}
                                />
                            </div>
                        </div>
                        <span className="text-[9px] font-bold text-white/40 flex-shrink-0">{ws.members}👤</span>
                    </motion.div>
                ))}
            </div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -top-2 -right-4 bg-white p-2.5 rounded-xl shadow-xl border border-gray-100"
            >
                <div className="text-[8px] font-bold text-gray-400">Total Teams</div>
                <div className="text-lg font-black text-gray-900">3 Active</div>
            </motion.div>
        </div>
    )
}

const VisualCopilot = () => {
    const models = [
        { name: 'gpt-4o', pct: 45, color: 'bg-emerald-400', calls: '91' },
        { name: 'claude-3-5', pct: 28, color: 'bg-orange-400', calls: '56' },
        { name: 'deepseek', pct: 18, color: 'bg-blue-400', calls: '36' },
    ]
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-72 bg-white/10 backdrop-blur-md rounded-[2rem] p-5 border border-white/20 shadow-2xl space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Token Usage</div>
                        <motion.div
                            animate={{ opacity: [1, 0.6, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-2xl font-black text-white"
                        >
                            2.4M
                        </motion.div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Cost</div>
                        <div className="text-lg font-black text-emerald-300">₦28,650</div>
                    </div>
                </div>
                {/* Live indicator */}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-white/50">Live · 197 requests today</span>
                </div>
                {/* Model bars */}
                <div className="space-y-2.5">
                    {models.map((m, i) => (
                        <div key={i}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] font-bold text-white/70">{m.name}</span>
                                <span className="text-[9px] font-bold text-white/40">{m.calls} calls</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }} animate={{ width: `${m.pct}%` }}
                                    transition={{ delay: i * 0.2 + 0.3, duration: 1 }}
                                    className={`h-full ${m.color} rounded-full`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-2 -right-4 bg-white p-2.5 rounded-xl shadow-xl border border-gray-100"
            >
                <div className="text-[8px] font-bold text-gray-400">Avg Latency</div>
                <div className="text-sm font-black text-gray-900">342ms</div>
            </motion.div>
        </div>
    )
}

const Split = ({ children, ...rest }: SplitProps) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const isSignIn = pathname === '/sign-in'
    const isSignUp = pathname === '/sign-up'
    const isForgotPassword = pathname === '/forgot-password'
    const isSetupAccount = pathname === '/setup-account'

    const [currentIndex, setCurrentIndex] = useState(0)

    const dispatch = useAppDispatch()
    const platformSettings = useAppSelector(selectPlatformSettingsData)

    useEffect(() => {
        if (!platformSettings) {
            dispatch(fetchPublicPlatformSettings())
        }
    }, [dispatch, platformSettings])

    const platformName = platformSettings?.general.platformName || "QOREBIT"

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
        }, 7000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
            {/* Left Side: Visual/Content */}
            <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-[#0055BA]">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-full h-full">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-20" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-3xl opacity-20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/img/others/grid.svg')] opacity-[0.03]" />
                </div>

                <div className="relative z-20 flex-shrink-0 -mt-24">
                    <img 
                        src="/img/logo/Qorebit-white.png" 
                        alt="Qorebit Platform" 
                        className="w-36 md:w-40 lg:w-44 h-auto object-contain drop-shadow-sm"
                        onError={(e) => {
                            e.currentTarget.src = "/img/logo/logo-light-full.png"
                        }}
                    />
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-center -mt-20">
                    <div className="max-w-4xl mx-auto w-full p-12 bg-[#003B82] rounded-[5rem] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] relative group overflow-hidden">
                        {/* Glass Overlay Glows */}
                        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-1000" />
                        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-1000" />

                        {/* Visual Container */}
                        <div className="h-80 relative mb-12">
                            <motion.div
                                key={`bg-${currentIndex}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.2 }}
                                className={`absolute inset-0 bg-gradient-to-br ${carouselItems[currentIndex].color} rounded-full blur-3xl opacity-40`}
                            />
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="w-full h-full"
                                >
                                    {carouselItems[currentIndex].id === 'gateway' && <VisualGateway />}
                                    {carouselItems[currentIndex].id === 'intelligence' && <VisualIntelligence />}
                                    {carouselItems[currentIndex].id === 'copilot' && <VisualCopilot />}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Text Container */}
                        <div className="space-y-6 relative z-10">
                            <AnimatePresence mode="wait">
                                <motion.div key={`text-${currentIndex}`} className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-xs font-bold text-white">
                                            {carouselItems[currentIndex].status}
                                        </span>
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.7, delay: 0.1 }}
                                        className="text-4xl 2xl:text-5xl font-black text-white leading-[1.1] tracking-tighter"
                                    >
                                        {carouselItems[currentIndex].title.split(' ').map((word, i, arr) => (
                                            <span key={i}>
                                                {i === arr.length - 1 ? (
                                                    <span className={carouselItems[currentIndex].accent}>{word}</span>
                                                ) : (
                                                    word
                                                )}{' '}
                                            </span>
                                        ))}
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.7, delay: 0.2 }}
                                        className="text-lg text-blue-100/70 font-medium leading-relaxed max-w-lg"
                                    >
                                        {carouselItems[currentIndex].desc}
                                    </motion.p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex gap-3 mt-12 relative z-10">
                            {carouselItems.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === i ? "w-12 bg-white" : "w-3 bg-white/20 hover:bg-white/40"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <p className="text-xs font-medium text-white/50">© 2025 {platformName}</p>
                    <div className="flex gap-8">
                        <a href="https://qorebit.ai/docs" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-white/50 hover:text-white transition-colors">Documentation</a>
                        <a href="https://qorebit.ai/privacy" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-white/50 hover:text-white transition-colors">Privacy</a>
                        <a href="https://qorebit.ai/terms" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-white/50 hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>

            {/* Right Side: Authentication Forms */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-y-auto bg-gray-50/50 dark:bg-gray-950">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-[640px] relative z-10">
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 lg:p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] relative overflow-hidden group">
                        {/* Decorative subtle accent in form container */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#e49c0e]/5 rounded-full blur-2xl -ml-12 -mb-12" />

                        <div className="relative z-10 mb-8">
                            {/* Rendering the primary Qorebit logo per request */}
                            <div className="mb-3 flex justify-center lg:justify-start">
                                <img
                                    src="/img/logo/Qorebit-Logo.svg"
                                    alt="Qorebit Platform"
                                    className="w-16 lg:w-20 h-auto object-contain"
                                />
                            </div>

                        </div>

                        {children ? cloneElement(children as ReactElement, { ...rest }) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Split
