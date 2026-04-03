import { useState, useRef } from 'react'
import { Dropdown, Spinner } from '@/components/ui'
import { Zap, ChevronDown, Check } from 'lucide-react'
import type { AIModel } from '../../../types'
import type { DropdownRef } from '@/components/ui/Dropdown'
import classNames from '@/utils/classNames'
import { NAIRA_TO_USD_RATE, CURRENCY_SYMBOL } from '@/constants/currency.constant'

interface ModelSelectorProps {
    models: AIModel[]
    selectedModelId: string
    isLoading: boolean
    onModelChange: (modelId: string) => void
}

export default function ModelSelector({ models, selectedModelId, isLoading, onModelChange }: ModelSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef<DropdownRef>(null)

    const currentModel = models.find(m => m.id === selectedModelId)

    const handleSelect = (modelId: string) => {
        onModelChange(modelId)
        setSearchQuery('')
        dropdownRef.current?.handleDropdownClose()
    }

    const filteredModels = models.filter(model =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Dropdown
            ref={dropdownRef}
            placement="bottom-start"
            onOpen={(open) => {
                setIsOpen(open)
                if (!open) setSearchQuery('')
            }}
            renderTitle={
                <div className="relative group min-w-0 flex-1 max-w-[280px] sm:max-w-none sm:min-w-[200px] xl:min-w-[260px]">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0055BA] to-blue-400 rounded-lg sm:rounded-xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                    <button
                        className="relative w-full h-12 sm:h-14 flex items-center justify-between px-3 sm:px-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg sm:rounded-xl shadow-xl shadow-gray-200/40 dark:shadow-none hover:border-blue-500/30 transition-all duration-300 group"
                    >
                        <div className="flex flex-col items-start overflow-hidden min-w-0">
                            <span className="text-[9px] sm:text-[10px] font-black text-gray-500 leading-none mb-1">Active Model</span>
                            <div className="flex items-center gap-2 min-w-0">
                                {isLoading ? (
                                    <Spinner size={12} className="text-blue-500" />
                                ) : (
                                    <span className="text-xs sm:text-[15px] font-black text-gray-900 dark:text-white truncate tracking-tight capitalize">
                                        {currentModel?.name || 'Select model'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                            <ChevronDown className={classNames("w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 transition-transform duration-300", isOpen && "rotate-180")} strokeWidth={3} />
                        </div>
                    </button>
                </div>
            }
        >
            <div className="p-4 w-[calc(100vw-2rem)] sm:w-[340px] max-w-[340px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="px-2 py-3 border-b border-gray-50 dark:border-gray-900/50 mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available models</span>
                </div>

                <div className="mb-4">
                    <Dropdown.Item variant="custom" className="p-0 bg-transparent hover:bg-transparent">
                        <div className="relative group w-full" onClick={(e) => e.stopPropagation()}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                placeholder="Search models..."
                                className="w-full h-11 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg px-4 py-2 text-sm font-bold focus:outline-none focus:border-blue-500/30 transition-all"
                                autoFocus
                            />
                        </div>
                    </Dropdown.Item>
                </div>

                <div className="max-h-[360px] overflow-y-auto space-y-1 custom-scrollbar">
                    {filteredModels.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-xs font-bold text-gray-400">No models found</p>
                        </div>
                    ) : (
                        filteredModels.map((model) => {
                            const isActive = selectedModelId === model.id

                            return (
                                <Dropdown.Item
                                    key={model.id}
                                    variant="custom"
                                    onClick={() => handleSelect(model.id)}
                                    className={classNames(
                                        "w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group/item border mb-1",
                                        isActive
                                            ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/50"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-900 border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                                    )}
                                >
                                    <div className={classNames(
                                        "w-11 h-11 rounded-lg flex items-center justify-center font-black transition-all duration-500 border shrink-0",
                                        isActive
                                            ? "bg-gradient-to-br from-[#0055BA] to-[#003d85] text-white border-blue-600 shadow-lg shadow-blue-500/20 scale-105"
                                            : "bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700 group-hover/item:text-blue-500 group-hover/item:border-blue-500/20 group-hover/item:bg-white dark:group-hover/item:bg-gray-800"
                                    )}>
                                        <Zap className={classNames("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover/item:text-blue-500")} />
                                    </div>

                                    <div className="flex flex-col items-start flex-1 min-w-0">
                                        <div className="flex items-center gap-2 w-full text-left">
                                            <span className={classNames(
                                                "text-sm font-black tracking-tight truncate capitalize",
                                                isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100 group-hover/item:text-blue-600"
                                            )}>
                                                {model.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5 text-left">
                                            <span className="text-[9px] text-gray-400 font-bold capitalize">
                                                {model.provider}
                                            </span>
                                            <span className="text-[9px] text-gray-300 dark:text-gray-600">•</span>
                                            <span className="text-[10px] text-primary-deep font-black">
                                                {CURRENCY_SYMBOL}{(model.pricing.input * NAIRA_TO_USD_RATE).toLocaleString()}/1M
                                            </span>
                                        </div>
                                    </div>

                                    {isActive && (
                                        <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <Check className="w-3.5 h-3.5 text-blue-500" strokeWidth={3} />
                                        </div>
                                    )}
                                </Dropdown.Item>
                            )
                        })
                    )}
                </div>
            </div>
        </Dropdown>
    )
}
