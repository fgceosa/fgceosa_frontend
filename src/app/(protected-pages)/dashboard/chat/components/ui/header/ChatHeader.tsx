import { MessageSquare } from 'lucide-react'
import { useChatModels } from '../../../hooks/useChatModels'
import ModelSelector from './ModelSelector'

interface ChatHeaderProps {
    selectedModel: string
    onModelChange: (modelId: string) => void
    showSidebar?: boolean
    onToggleSidebar?: () => void
}

export default function ChatHeader({ selectedModel, onModelChange, showSidebar, onToggleSidebar }: ChatHeaderProps) {
    const { models, isLoading: isLoadingModels } = useChatModels(selectedModel, onModelChange)

    return (
        <div className="shrink-0 h-[60px] sm:h-[70px] xl:h-[80px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-3 sm:px-4 xl:px-6 flex items-center justify-center z-30 sticky top-0 transition-all">
            <div className="flex items-center justify-between w-full max-w-[1600px] mx-auto gap-2 sm:gap-3">
                {/* Left: Model Selector & Sidebar Toggle */}
                <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-4 flex-1 min-w-0">
                    {onToggleSidebar && (
                        <button
                            onClick={onToggleSidebar}
                            className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all duration-300 ${!showSidebar
                                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                                } flex items-center justify-center shrink-0`}
                        >
                            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                        </button>
                    )}

                    <ModelSelector
                        models={models}
                        selectedModelId={selectedModel}
                        isLoading={isLoadingModels}
                        onModelChange={onModelChange}
                    />
                </div>
            </div>
        </div>
    )
}
