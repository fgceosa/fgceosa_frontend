'use client'

import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@/components/ui'
import classNames from '@/utils/classNames'
import {
    Database,
    Zap,
    Activity,
    ShieldX,
    FileText,
    Shield,
    Globe,
    Clock,
    BarChart3,
    LayoutGrid,
    AlertCircle
} from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import RevokeApiKeyModal from './RevokeApiKeyModal'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import {
    selectApiKeys,
    selectKeysLoading,
    deleteApiKey,
    fetchApiKeys,
    fetchApiKeysStats,
} from '@/store/slices/apiKeys'
import CreateApiKeyButton from './CreateApiKeyButton'

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime)

function StatusBadge({ status }: { status: string }) {
    const statusLower = status.toLowerCase()
    const isActive = statusLower === 'active'

    return (
        <div className={classNames(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border transition-all duration-300",
            isActive
                ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 shadow-sm shadow-green-200/20"
                : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700/30"
        )}>

        </div>
    )
}

function EnvironmentBadge({ environment }: { environment: string }) {
    const envLower = environment.toLowerCase()
    const isProd = envLower === 'production'
    const isDev = envLower === 'development'

    return (
        <div className={classNames(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black border transition-all duration-300",
            isProd ? "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/30" :
                isDev ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30" :
                    "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700/30"
        )}>
            <Globe className="w-3 h-3" />
            {environment}
        </div>
    )
}

export default function ApiKeysList() {
    const dispatch = useDispatch()

    const apiKeys = useSelector(selectApiKeys)
    const isLoading = useSelector(selectKeysLoading)

    const [revokeConfirmationOpen, setRevokeConfirmationOpen] = useState(false)
    const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null)
    const [selectedKeyName, setSelectedKeyName] = useState<string>('')
    const [isRevoking, setIsRevoking] = useState(false)

    const handleRevoke = useCallback((id: string, name: string) => {
        setSelectedKeyId(id)
        setSelectedKeyName(name)
        setRevokeConfirmationOpen(true)
    }, [])

    const handleCancelRevoke = useCallback(() => {
        if (isRevoking) return
        setRevokeConfirmationOpen(false)
        setSelectedKeyId(null)
        setSelectedKeyName('')
    }, [isRevoking])

    const handleConfirmRevoke = useCallback(async () => {
        if (!selectedKeyId) return

        setIsRevoking(true)
        try {
            await dispatch(deleteApiKey(selectedKeyId) as any).unwrap()
            await dispatch(fetchApiKeys() as any).unwrap()
            toast.push(
                <Notification type="success" title="Access Revoked">
                    API key has been successfully revoked.
                </Notification>,
                { placement: 'top-center' }
            )
        } catch (error: any) {
            toast.push(
                <Notification type="danger">
                    {error || 'Failed to revoke API key'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsRevoking(false)
            setRevokeConfirmationOpen(false)
            setSelectedKeyId(null)
            setSelectedKeyName('')
        }
    }, [dispatch, selectedKeyId])

    const hasData = apiKeys && apiKeys.length > 0

    return (
        <div className="space-y-6">
            <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all">
                <div className="p-6 md:p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">API Key Registry</h3>
                        <p className="text-sm font-bold text-gray-400 mt-1">Manage your API keys and security</p>
                    </div>
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                        <Database className="w-5 h-5 text-primary" />
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {!hasData && !isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                            <div className="w-20 h-20 bg-primary/5 rounded-[30px] flex items-center justify-center mb-6 border border-primary/10 relative">
                                <Zap className="w-10 h-10 text-primary opacity-20" />
                                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-20 animate-pulse" />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">No API Keys Found</h4>
                            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm text-sm leading-relaxed mb-6">
                                Start by creating your first API key to begin integrating our AI services.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-6 md:-mx-8">
                            <div className="min-w-[700px] px-6 md:px-8">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                                        <th className="px-6 py-5 text-left w-[25%] rounded-l-2xl">
                                            <div className="flex items-center gap-2 text-xs font-black text-gray-900 dark:text-gray-200">
                                                <FileText className="w-3.5 h-3.5" />
                                                <span>Name</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-left w-[15%]">
                                            <div className="flex items-center gap-2 text-xs font-black text-gray-900 dark:text-gray-200">
                                                <LayoutGrid className="w-3.5 h-3.5" />
                                                <span>Linked Project</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-center w-[12%]">
                                            <div className="flex items-center justify-center gap-2 text-xs font-black text-gray-900 dark:text-gray-200">
                                                <Activity className="w-3.5 h-3.5" />
                                                <span>Status</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-left w-[18%]">
                                            <div className="flex items-center gap-2 text-xs font-black text-gray-900 dark:text-gray-200">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>Last Heartbeat</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-right w-[15%]">
                                            <div className="flex items-center justify-end gap-2 text-xs font-black text-gray-900 dark:text-gray-200">
                                                <BarChart3 className="w-3.5 h-3.5" />
                                                <span>Throughput</span>
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-center w-[15%] rounded-r-2xl">
                                            <span className="text-xs font-black text-gray-900 dark:text-gray-200">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {apiKeys.map((apiKey) => (
                                        <tr
                                            key={apiKey.id}
                                            className="group hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-all duration-200"
                                        >
                                            <td className="px-6 py-6 group-hover:text-primary transition-colors">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-black text-gray-900 dark:text-gray-100 text-sm">{apiKey.name}</span>
                                                    {(apiKey.allowedIps || apiKey.allowedDomains) && (
                                                        <div className="flex items-center gap-2">
                                                            {apiKey.allowedIps && (
                                                                <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-100/50 dark:border-emerald-800/30">
                                                                    <Shield className="w-2.5 h-2.5" />
                                                                    <span>IP RESTRICTED</span>
                                                                </div>
                                                            )}
                                                            {apiKey.allowedDomains && (
                                                                <div className="flex items-center gap-1 text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded border border-indigo-100/50 dark:border-indigo-800/30">
                                                                    <Globe className="w-2.5 h-2.5" />
                                                                    <span>CORS RESTRICTED</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                {apiKey.projectName ? (
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black border bg-primary/5 text-primary border-primary/10 dark:bg-primary/10 dark:text-primary dark:border-primary/20 transition-all duration-300">
                                                        <LayoutGrid className="w-3 h-3" />
                                                        {apiKey.projectName}
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black border bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-800/50 dark:text-gray-500 dark:border-gray-800 transition-all duration-300 italic">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Unlinked
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <StatusBadge status={apiKey.status} />
                                            </td>
                                            <td className="px-6 py-6 font-medium">
                                                {apiKey.lastUsed ? (
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-base text-gray-900 dark:text-gray-100 font-bold">
                                                            {dayjs(apiKey.lastUsed).fromNow()}
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-black">
                                                            {dayjs(apiKey.lastUsed).format('MMM D, HH:mm')}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-gray-400 italic text-sm">
                                                        <AlertCircle className="w-3.5 h-3.5 opacity-30" />
                                                        Unused
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-base font-black text-gray-900 dark:text-white">
                                                        {apiKey.requests.toLocaleString()}
                                                    </span>
                                                    <span className="text-xs font-black text-gray-400">Calls</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <button
                                                    onClick={() => handleRevoke(apiKey.id, apiKey.name)}
                                                    className="w-9 h-9 mx-auto flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100 dark:bg-red-900/10 dark:border-red-800/50 dark:hover:bg-red-500 transition-all duration-300 group/btn"
                                                    title="Revoke Key"
                                                >
                                                    <ShieldX className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <RevokeApiKeyModal
                isOpen={revokeConfirmationOpen}
                keyName={selectedKeyName}
                onClose={handleCancelRevoke}
                onConfirm={handleConfirmRevoke}
                isRevoking={isRevoking}
            />
        </div>
    )
}
