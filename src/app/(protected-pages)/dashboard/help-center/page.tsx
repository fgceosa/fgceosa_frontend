'use client'

import React from 'react'
import { Card, Button, Input } from '@/components/ui'
import {
    Search,
    Book,
    MessageCircle,
    Video,
    FileText,
    ExternalLink,
    ChevronRight,
    HelpCircle,
    Zap,
    Shield,
    Users,
    Settings
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchHelpCenter } from '@/store/slices/helpCenter/helpCenterThunk'
import classNames from '@/utils/classNames'

const iconMap: Record<string, any> = {
    Zap,
    Users,
    Shield,
    Settings,
    MessageCircle,
    Book,
    Video
}

export default function HelpCenterPage() {
    const dispatch = useAppDispatch()
    const { categories, faqs, loading } = useAppSelector((state) => state.helpCenter)

    React.useEffect(() => {
        dispatch(fetchHelpCenter())
    }, [dispatch])

    if (loading && categories.length === 0) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black text-gray-400">Loading resources...</p>
            </div>
        )
    }

    return (
        <div className="w-full p-6 sm:p-10 pt-10 sm:pt-16 space-y-16">
            {/* Elite Header section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pb-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-primary whitespace-nowrap">Resources</span>
                            <div className="h-px w-8 bg-primary/20" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">Help Center</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-white dark:bg-gray-900 rounded-[1.25rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 shrink-0">
                            <HelpCircle className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-none mb-1">
                                How can we help?
                            </h1>
                            <p className="text-[11px] font-bold text-gray-400">Guides and support for your workspace</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Banner - Redesigned to be more Premium */}
            <div className="relative group">
                <Card className="p-10 sm:p-16 border-none shadow-2xl shadow-primary/20 bg-gradient-to-br from-primary to-blue-700 rounded-[3rem] overflow-hidden text-center relative">
                    {/* Abstract design elements */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full -ml-24 -mb-24 blur-[80px]" />

                    <div className="relative z-10 w-full space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                                Search for <span className="text-blue-400 italic">answers</span>
                            </h2>
                            <p className="text-blue-100 font-medium text-lg">
                                Search our comprehensive guides or explore categories below to find instant solutions.
                            </p>
                        </div>

                        <div className="relative transform hover:scale-[1.01] transition-all duration-500">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative">
                                <Input
                                    placeholder="What are you looking for?"
                                    className="h-16 pl-14 pr-6 rounded-[1.5rem] border-none shadow-2xl text-lg font-bold bg-white/95 dark:bg-gray-800/95 backdrop-blur-md focus:ring-4 focus:ring-primary/20 transition-all"
                                />
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                            {['Credits', 'API', 'Team', 'Billing'].map(tag => (
                                <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Support Channels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: MessageCircle, label: 'Chat with us', sub: 'Instant Support', color: 'text-blue-500' },
                    { icon: Book, label: 'Read Guides', sub: 'How-to Tutorials', color: 'text-emerald-500' },
                    { icon: Video, label: 'Watch Videos', sub: 'Walkthroughs', color: 'text-purple-500' }
                ].map((item, idx) => (
                    <Card key={idx} className="p-8 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:translate-y-[-4px] transition-all duration-500 group">
                        <div className="flex items-center gap-5">
                            <div className={classNames("w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center transition-transform group-hover:scale-110", item.color)}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-gray-900 dark:text-white text-base">{item.label}</h3>
                                <p className="text-[10px] font-black text-gray-400">{item.sub}</p>
                            </div>
                            <div className="ml-auto p-2 rounded-xl bg-gray-50 dark:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all">
                                <ChevronRight className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Categories Section */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                    <h2 className="text-[10px] font-black text-gray-400">Browse Categories</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-100 dark:from-gray-800 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {categories.map((cat) => {
                        const IconComponent = iconMap[cat.icon] || HelpCircle
                        return (
                            <Card key={cat.id} className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden group border border-gray-100/50 dark:border-gray-800/50 transition-all">
                                <div className="p-8 pb-0">
                                    <div className="flex items-center gap-5 pb-8 border-b border-gray-100 dark:border-gray-800">
                                        <div className={classNames("w-16 h-16 rounded-[1.5rem] flex items-center justify-center border transition-all duration-500 group-hover:rotate-6", cat.bgColor, cat.color, "border-opacity-10 shadow-sm")}>
                                            <IconComponent className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-none mb-1.5">{cat.title}</h3>
                                            <p className="text-xs text-gray-400 font-medium tracking-wide">{cat.description}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 pt-4 space-y-2">
                                    {cat.articles.map((article) => (
                                        <button key={article.id} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group/item">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800 group-hover/item:bg-primary transition-colors" />
                                                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{article.title}</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover/item:text-primary transition-all group-hover/item:translate-x-1" />
                                        </button>
                                    ))}
                                </div>

                                <div className="px-8 pb-8 pt-2">
                                    <Button variant="plain" className="w-full h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-primary font-black text-[10px] flex items-center justify-center gap-2 hover:bg-primary/5 transition-all group-hover:gap-4">
                                        Explore all {cat.title}
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="px-0 py-4 bg-primary/[0.02] dark:bg-primary/[0.02] rounded-[3rem] border border-primary/5">
                <div className="w-full p-8 space-y-10">
                    <div className="text-center space-y-3">
                        <span className="text-[10px] font-black text-primary">Quick Help</span>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white">Common Inquiries</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="p-8 bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-none rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-4 hover:border-primary/20 transition-all">
                                <div className="text-primary/20">
                                    <HelpCircle className="w-6 h-6" />
                                </div>
                                <h4 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{faq.question}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Support Footer */}
            <div className="relative p-12 sm:p-20 bg-gradient-to-br from-primary to-blue-700 rounded-[3rem] overflow-hidden text-center group">
                <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-50" />

                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <p className="text-[11px] font-black text-white/80">Still need assistance?</p>
                        <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                            Our team is <span className="text-blue-400 italic">always</span> ready.
                        </h2>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button
                            variant="solid"
                            className="h-16 px-12 bg-white text-gray-900 font-black text-[11px] rounded-[1.25rem] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Elite Support
                        </Button>
                        <a
                            href="https://qorebit.ai/contact-us"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-16 flex items-center justify-center px-12 bg-white/10 border border-white/20 text-white font-black text-[11px] rounded-[1.25rem] transition-all hover:bg-white/20 hover:text-white"
                        >
                            Email Help Desk
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
