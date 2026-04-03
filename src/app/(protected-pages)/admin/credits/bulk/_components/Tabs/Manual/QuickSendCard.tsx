import { Button, Card } from '@/components/ui'
import { Send, Sparkles, ChevronRight } from 'lucide-react'
import type { QuickSendCardProps } from '../../../types'

export default function QuickSendCard({ items, onSend }: QuickSendCardProps) {
    return (
        <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="p-6 md:p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Fast Send</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Commonly sent amounts</p>
                </div>
                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-4">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className="group flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-gray-800 rounded-2xl cursor-pointer transition-all duration-300"
                        onClick={onSend}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <span className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-primary uppercase">
                                {item.amount}
                            </span>
                            <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                ))}

                <button
                    onClick={onSend}
                    className="w-full h-12 mt-4 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
                >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Quick</span>
                </button>
            </div>
        </Card>
    )
}
