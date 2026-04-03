import { Bot, Plus } from 'lucide-react'

interface CopilotHubHeaderProps {
    onCreateClick: () => void
    allowCreate?: boolean
}

export default function CopilotHubHeader({ onCreateClick, allowCreate = true }: CopilotHubHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3 lg:space-y-1">
                <div className="flex items-center gap-3 sm:gap-4 mb-2">
                    <span className="text-[10px] sm:text-[11px] font-black text-primary whitespace-nowrap">Copilot Hub</span>
                    <div className="h-px w-8 sm:w-12 bg-primary/20" />
                    <span className="text-[10px] sm:text-[11px] font-black text-gray-400 whitespace-nowrap">Registry</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                        <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-none">
                        Copilot Hub
                    </h1>
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 lg:pl-14 font-medium max-w-2xl leading-relaxed">
                    Discover, create, and manage AI copilots to automate workflows and assist your team.
                </p>
            </div>


            <div className="flex items-center gap-3 w-full sm:w-auto">
                {allowCreate && (
                    <button
                        onClick={onCreateClick}
                        className="h-12 sm:h-14 px-6 sm:px-8 bg-primary hover:bg-primary-deep text-white font-black text-[10px] sm:text-xs rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 group w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="whitespace-nowrap">Create New Copilot</span>
                    </button>
                )}
            </div>

        </div>
    )
}
