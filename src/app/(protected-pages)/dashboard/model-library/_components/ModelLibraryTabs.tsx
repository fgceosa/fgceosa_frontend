import { MessageSquareText, Link2 } from 'lucide-react'
import { Badge } from '@/components/ui'
import classNames from '@/utils/classNames'

interface ModelLibraryTabsProps {
    category: 'Text' | 'Embedding'
    setCategory: (cat: 'Text' | 'Embedding') => void
    textCount: number
    embeddingCount: number
}

export default function ModelLibraryTabs({ category, setCategory, textCount, embeddingCount }: ModelLibraryTabsProps) {
    return (
        <div className="flex justify-center">
            <div className="bg-white dark:bg-gray-900 p-1.5 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex shadow-xl shadow-gray-200/50 dark:shadow-none">
                <button
                    onClick={() => setCategory('Text')}
                    className={classNames(
                        "px-6 py-2.5 rounded-[1.5rem] flex items-center gap-2 transition-all duration-300",
                        category === 'Text'
                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                            : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                >
                    <MessageSquareText className="w-4 h-4" />
                    <span className="text-[11px] font-black">Text</span>
                    <Badge content={textCount.toString()} innerClass={classNames("text-[10px] px-1.5 py-0", category === 'Text' ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400")} />
                </button>
                <button
                    onClick={() => setCategory('Embedding')}
                    className={classNames(
                        "px-6 py-2.5 rounded-[1.5rem] flex items-center gap-2 transition-all duration-300",
                        category === 'Embedding'
                            ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                            : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    )}
                >
                    <Link2 className="w-4 h-4" />
                    <span className="text-[11px] font-black">Embedding</span>
                    <Badge content={embeddingCount.toString()} innerClass={classNames("text-[10px] px-1.5 py-0", category === 'Embedding' ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400")} />
                </button>
            </div>
        </div>
    )
}
