import { BarChart3 } from 'lucide-react'

interface ModelLibraryHeaderProps {
    modelCount: number
    statusFilter: string
}

export default function ModelLibraryHeader({ modelCount, statusFilter }: ModelLibraryHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="space-y-4 lg:space-y-1">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-[10px] font-black text-primary whitespace-nowrap">Intelligence</span>
                    <div className="h-px w-12 bg-primary/20" />
                    <span className="text-[10px] font-black text-gray-400 whitespace-nowrap">Model Library</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                        <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-none">
                            Model Hub
                        </h1>
                        <span className="text-[10px] sm:text-xs font-black text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-700 shadow-sm">
                            {modelCount} models ({statusFilter})
                        </span>
                    </div>
                </div>
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                    Explore global AI models, manage your environments, and track usage in one hub.
                </p>
            </div>
        </div>

    )
}
