import { Badge, Card } from '@/components/ui'
import classNames from '@/utils/classNames'
import ModelCard from './ModelCard'
import type { Model } from '../types'

interface ModelLibraryViewProps {
    viewType: 'Cards' | 'List'
    models: Model[]
    isLoading: boolean
}

export default function ModelLibraryView({ viewType, models, isLoading }: ModelLibraryViewProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-gray-400 text-sm font-bold animate-pulse">Loading model library...</p>
            </div>
        )
    }

    if (models.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white dark:bg-gray-900 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <p className="text-gray-500 font-bold">No models found</p>
                    <p className="text-gray-400 text-xs font-medium">Try adjusting your filters or search query</p>
                </div>
            </div>
        )
    }

    if (viewType === 'Cards') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                {models.map((model) => (
                    <ModelCard key={model.id} model={model} />
                ))}
            </div>
        )
    }

    return (
        <Card className="bg-white dark:bg-gray-900 rounded-[2rem] border-none shadow-xl overflow-hidden mb-12 px-2 py-2">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-[10px] font-black text-gray-400">Model Name</th>
                            <th className="px-6 py-3 text-[10px] font-black text-gray-400">Provider</th>
                            <th className="px-6 py-3 text-[10px] font-black text-gray-400">Context</th>
                            <th className="px-6 py-3 text-[10px] font-black text-gray-400">Input Price</th>
                            <th className="px-6 py-3 text-[10px] font-black text-gray-400">Output Price</th>
                            <th className="px-6 py-3 text-[10px] font-black text-gray-400 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {models.map((model) => (
                            <tr key={model.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-[13px] text-gray-900 dark:text-white group-hover:text-primary transition-colors">{model.name}</span>
                                        {model.badges && model.badges.length > 0 && (
                                            <Badge content={model.badges[0]} innerClass="text-[8px] scale-90 px-1 py-0" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-[10px] font-black text-gray-500">{model.provider}</td>
                                <td className="px-6 py-3 text-[11px] font-black text-gray-900 dark:text-gray-300">{model.context}</td>
                                <td className="px-6 py-3 text-[11px] font-black text-emerald-600 dark:text-emerald-400">{model.inputPrice}</td>
                                <td className="px-6 py-3 text-[11px] font-black text-blue-600 dark:text-blue-400">{model.outputPrice}</td>
                                <td className="px-6 py-3 text-[10px] font-black text-gray-900 dark:text-gray-300">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <div className={classNames("w-1.5 h-1.5 rounded-full", model.status === 'Approved' ? "bg-emerald-500" : "bg-amber-500")} />
                                        {model.status}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}
