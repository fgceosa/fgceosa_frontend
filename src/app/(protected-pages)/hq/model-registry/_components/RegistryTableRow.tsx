import { Badge } from '@/components/ui'
import { MoreHorizontal, Eye, Edit2, Shield, AlertTriangle, Trash2 } from 'lucide-react'
import type { RegistryModel } from '../types'
import classNames from '@/utils/classNames'
import { Dropdown } from '@/components/ui'
import { useRouter } from 'next/navigation'
import { VscServer } from 'react-icons/vsc'

interface RegistryTableRowProps {
    model: RegistryModel
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800'
        case 'Experimental': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800'
        case 'Deprecated': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800'
        default: return 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:border-gray-700'
    }
}

const getScopeColor = (scope: string) => {
    switch (scope) {
        case 'Global': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'Enterprise-only': return 'bg-purple-50 text-purple-600 border-purple-100'
        case 'Internal': return 'bg-gray-50 text-gray-600 border-gray-100'
        default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
}

const RegistryTableRow = ({ model }: RegistryTableRowProps) => {
    const router = useRouter()

    const handleNavigate = () => {
        router.push(`/hq/model-registry/${model.id}`)
    }

    return (
        <tr
            className="group hover:bg-primary/[0.02] dark:hover:bg-primary/5 transition-all duration-300 cursor-pointer border-b border-gray-100 dark:border-gray-800"
            onClick={handleNavigate}
        >
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                        <VscServer className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="font-black text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors text-sm">
                            {model.name}
                        </span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-none font-black text-[10px]">
                    {model.provider}
                </div>
            </td>
            <td className="px-6 py-5">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                    {model.contextSize
                        ? (!isNaN(Number(model.contextSize))
                            ? `${(Number(model.contextSize) / 1000).toLocaleString()}k Tokens`
                            : model.contextSize.includes('Tokens') ? model.contextSize : `${model.contextSize} Tokens`)
                        : 'N/A'
                    }
                </span>
            </td>
            <td className="px-6 py-5">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-900 dark:text-white mt-1">
                        IN: ${(model.inputPrice ?? 0).toFixed(4)}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 italic">
                        OUT: ${(model.outputPrice ?? 0).toFixed(4)}
                    </span>
                </div>
            </td>
            <td className="px-6 py-5 text-center">
                <div className={classNames(
                    "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black border transition-all duration-300 shadow-sm",
                    getStatusColor(model.status)
                )}>
                    {model.status}
                </div>
            </td>
            <td className="px-6 py-5 text-center">
                <div className={classNames(
                    "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black border transition-all duration-300",
                    getScopeColor(model.availability)
                )}>
                    {model.availability}
                </div>
            </td>
            <td className="px-6 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={handleNavigate}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-primary hover:text-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 transition-all duration-300 shadow-sm"
                        title="Manage Registry"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <Dropdown
                        placement="bottom-end"
                        renderTitle={
                            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-200 border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 transition-all duration-300 shadow-sm">
                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                        }
                    >
                        <Dropdown.Item>
                            <div className="flex items-center gap-2 p-1">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black">Compliance</span>
                            </div>
                        </Dropdown.Item>
                        <Dropdown.Item
                            className="text-rose-600"
                            onClick={async () => {
                                try {
                                    // We need to import the service at the top, but for now we'll dynamically import or use the prop
                                    // Since we don't have a refresh callback in props yet, we should probably add one or simple reload
                                    // For this iteration, let's assume we can add the import at the top

                                    const { apiUpdateModelRegistry } = await import('@/services/modelRegistry/modelRegistryService')
                                    const { toast, Notification } = await import('@/components/ui')

                                    await apiUpdateModelRegistry(model.id, { status: 'Deprecated' as any })

                                    toast.push(
                                        <Notification type="success" title="Model Deprecated" duration={3000}>
                                            {model.name} has been deprecated.
                                        </Notification>
                                    )
                                    // Ideally refresh or navigate. For now, we'll reload the page to see changes as this is a list view
                                    setTimeout(() => window.location.reload(), 1000)

                                } catch (error) {
                                    console.error("Deprecation failed", error)
                                    const { toast, Notification } = await import('@/components/ui')
                                    toast.push(
                                        <Notification type="danger" title="Error" duration={3000}>
                                            Failed to deprecate model.
                                        </Notification>
                                    )
                                }
                            }}
                        >
                            <div className="flex items-center gap-2 p-1">
                                <Trash2 className="w-4 h-4" />
                                <span className="text-[10px] font-black">Deprecate</span>
                            </div>
                        </Dropdown.Item>
                    </Dropdown>
                </div>
            </td>
        </tr>
    )
}

export default RegistryTableRow
