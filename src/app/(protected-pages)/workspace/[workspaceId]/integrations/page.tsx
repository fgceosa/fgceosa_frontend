'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button, Switcher, Card } from '@/components/ui'
import { Plus, ExternalLink, Github, GitlabIcon as Gitlab, MessageSquare, Zap, Key, ArrowLeft, Check, Link2, Settings, X, CheckCircle2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import { useRequireAuthority } from '@/utils/hooks/useAuthorization'
import {
    fetchWorkspaceIntegrations,
    connectIntegration,
    disconnectIntegration,
    updateIntegration,
} from '@/store/slices/workspace/workspaceThunk'
import {
    selectWorkspaceIntegrations,
    selectIntegrationsLoading,
} from '@/store/slices/workspace/workspaceSelectors'
import type { WorkspaceIntegration } from '../../types'
import WorkspacePageLayout from '../../_components/WorkspacePageLayout'
import WorkspaceHeader from '../../_components/WorkspaceHeader'
import { Dialog, Input } from '@/components/ui'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

const integrationTypes = [
    {
        type: 'slack',
        name: 'Slack',
        description: 'Send alerts to your team channels',
        icon: MessageSquare,
        iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
        type: 'github',
        name: 'GitHub',
        description: 'Sync your code repositories',
        icon: Github,
        iconBg: 'bg-gray-100 dark:bg-gray-800',
        iconColor: 'text-gray-900 dark:text-white',
    },
    {
        type: 'stripe',
        name: 'Stripe',
        description: 'Handle payments and billing',
        icon: () => (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="8" width="16" height="2" rx="1" />
                <rect x="4" y="14" width="12" height="2" rx="1" />
            </svg>
        ),
        iconBg: 'bg-blue-50 dark:bg-blue-900/20',
        iconColor: 'text-blue-600 dark:text-blue-500',
    },
    {
        type: 'zapier',
        name: 'Zapier',
        description: 'Link with 5,000+ other apps',
        icon: Zap,
        iconBg: 'bg-orange-50 dark:bg-orange-900/20',
        iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
        type: 'webhook',
        name: 'Webhooks',
        description: 'Receive real-time data events',
        icon: Link2,
        iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
        type: 'datadog',
        name: 'Datadog',
        description: 'Monitor performance & logs',
        icon: () => (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="14" width="4" height="7" rx="1" />
                <rect x="10" y="10" width="4" height="11" rx="1" />
                <rect x="17" y="6" width="4" height="15" rx="1" />
            </svg>
        ),
        iconBg: 'bg-purple-50 dark:bg-purple-900/20',
        iconColor: 'text-purple-600 dark:text-purple-400',
    },
]

import classNames from '@/utils/classNames'

export default function IntegrationsPage() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const workspaceId = params.workspaceId as string

    // Require org_super_admin authority
    const hasAuthority = useRequireAuthority(['org_super_admin'])

    const integrations = useAppSelector(selectWorkspaceIntegrations) || []
    const isLoading = useAppSelector(selectIntegrationsLoading)

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [selectedType, setSelectedType] = useState<string>('')
    const [config, setConfig] = useState<Record<string, string>>({})
    const [configuringIntegration, setConfiguringIntegration] = useState<WorkspaceIntegration | null>(null)
    const [disconnectConfirm, setDisconnectConfirm] = useState<{ isOpen: boolean; integration: WorkspaceIntegration | null }>({ isOpen: false, integration: null })

    useEffect(() => {
        if (workspaceId) {
            dispatch(fetchWorkspaceIntegrations(workspaceId))
        }
    }, [workspaceId, dispatch])

    const handleConnect = async () => {
        if (!selectedType) return

        try {
            await dispatch(
                connectIntegration({
                    workspaceId,
                    integrationType: selectedType,
                    config,
                })
            ).unwrap()

            setIsAddDialogOpen(false)
            setSelectedType('')
            setConfig({})
            dispatch(fetchWorkspaceIntegrations(workspaceId))
        } catch (error) {
            console.error('Failed to connect integration:', error)
        }
    }

    const handleToggleIntegration = async (integration: WorkspaceIntegration | null, enabled: boolean, type?: string) => {
        if (enabled && !integration && type) {
            // Connecting a new integration - open dialog for credentials
            openAddDialog(type)
        } else if (!enabled && integration) {
            // Disconnecting an existing integration
            setDisconnectConfirm({ isOpen: true, integration })
        }
    }

    const confirmDisconnect = async () => {
        const integration = disconnectConfirm.integration
        if (!integration) return

        try {
            await dispatch(disconnectIntegration({ workspaceId, integrationId: integration.id })).unwrap()
            dispatch(fetchWorkspaceIntegrations(workspaceId))
        } catch (error) {
            console.error('Failed to disable integration:', error)
        } finally {
            setDisconnectConfirm({ isOpen: false, integration: null })
        }
    }

    const handleUpdateConfig = async () => {
        if (!configuringIntegration) return

        try {
            await dispatch(
                updateIntegration({
                    workspaceId,
                    integrationId: configuringIntegration.id,
                    config,
                })
            ).unwrap()

            setConfiguringIntegration(null)
            setConfig({})
            dispatch(fetchWorkspaceIntegrations(workspaceId))
        } catch (error) {
            console.error('Failed to update integration:', error)
        }
    }

    const openAddDialog = (type: string) => {
        setSelectedType(type)
        setConfig({})
        setIsAddDialogOpen(true)
    }

    const openConfigureDialog = (integration: WorkspaceIntegration) => {
        setConfiguringIntegration(integration)
        setConfig(integration.config)
    }

    const getIntegrationInfo = (type: string) => {
        return integrationTypes.find((i) => i.type === type) || integrationTypes[0]
    }

    const connectedIntegrationTypes = integrations.map((i) => i.type)

    // Combine all integrations into a single list with connection status
    const allIntegrations = integrationTypes.map((integrationType) => {
        const connectedIntegration = integrations.find((i) => i.type === integrationType.type)
        return {
            ...integrationType,
            isConnected: !!connectedIntegration,
            integration: connectedIntegration,
        }
    })

    return (
        <div className="min-h-full bg-[#f5f5f5] dark:bg-gray-950/50">
            <WorkspacePageLayout
                fullWidth={true}
                header={
                    <WorkspaceHeader
                        title="Integrations"
                        description="Connect and manage external tools to supercharge your workspace."
                        icon={Plus}
                        iconBgClass="bg-gradient-to-br from-purple-500 to-indigo-600"
                        tag="App Directory"
                        actions={
                            <Button
                                variant="solid"
                                onClick={() => setIsAddDialogOpen(true)}
                                className="h-14 px-8 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group w-full lg:w-auto"
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                Add Apps
                            </Button>
                        }
                    />
                }
            >
                {/* Integrations Content */}
                <Card className="p-0 border-none shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 relative z-10 transition-all">
                    <div className="p-5 sm:p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between gap-4 bg-gray-50/30 dark:bg-gray-800/20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/50">
                                <Zap className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Marketplace</h3>
                            <span className="px-2.5 py-1 bg-white dark:bg-gray-800 rounded-lg text-[10px] font-black text-primary border border-gray-100 dark:border-gray-700 shadow-sm uppercase tracking-widest">
                                {integrations.length} CONNECTED
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-64 bg-gray-50 dark:bg-gray-800/30 rounded-[2.5rem] animate-pulse border border-gray-100 dark:border-gray-800" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 transition-all">
                                {allIntegrations.map((item) => {
                                    const Icon = item.icon
                                    const isConnected = item.isConnected

                                    return (
                                        <Card
                                            key={item.type}
                                            className="p-8 shadow-xl shadow-gray-100/50 dark:shadow-none bg-gray-50/50 dark:bg-gray-800/20 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] group flex flex-col justify-between h-full hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between mb-8">
                                                    <div className={classNames(
                                                        "p-4 rounded-2xl flex items-center justify-center border transition-all duration-500 bg-white dark:bg-gray-900 shadow-sm group-hover:shadow-md",
                                                        item.iconColor
                                                    )}>
                                                        <Icon className="w-7 h-7" />
                                                    </div>
                                                    <Switcher
                                                        checked={isConnected}
                                                        onChange={(enabled) => {
                                                            handleToggleIntegration(item.integration || null, enabled, item.type)
                                                        }}
                                                        switcherClass="bg-primary dark:bg-primary"
                                                    />
                                                </div>
                                                <div className="space-y-2 mb-8">
                                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.name}</h3>
                                                    <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{item.description}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <div className={classNames(
                                                        "w-2 h-2 rounded-full shadow-sm",
                                                        isConnected ? "bg-emerald-500 animate-pulse ring-4 ring-emerald-500/10" : "bg-gray-300 dark:bg-gray-700"
                                                    )} />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        {isConnected ? 'Live' : 'Inactive'}
                                                    </span>
                                                </div>
                                                {isConnected && (
                                                    <button
                                                        onClick={() => item.integration && openConfigureDialog(item.integration)}
                                                        className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary-deep transition-all hover:scale-105 active:scale-95"
                                                    >
                                                        Setup
                                                        <Settings className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </Card>
            </WorkspacePageLayout>

            {/* Dialogs - Use Dialog component to fix overlap and match reference style */}
            <Dialog
                isOpen={isAddDialogOpen || !!configuringIntegration}
                onClose={() => {
                    setIsAddDialogOpen(false)
                    setConfiguringIntegration(null)
                    setConfig({})
                    setSelectedType('')
                }}
                width={560}
                closable={false}
                className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
                contentClassName="!shadow-none"
            >
                <div className="relative">
                    {/* Custom Header */}
                    <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Link2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    {configuringIntegration
                                        ? `Configure ${getIntegrationInfo(configuringIntegration.type).name}`
                                        : isAddDialogOpen && selectedType
                                            ? `Connect ${getIntegrationInfo(selectedType).name}`
                                            : 'Add Apps'}
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                                    {configuringIntegration
                                        ? 'Adjust your connection parameters'
                                        : 'Link external services to your workspace'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setIsAddDialogOpen(false)
                                setConfiguringIntegration(null)
                                setConfig({})
                                setSelectedType('')
                            }}
                            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                        >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar pb-40">
                        {isAddDialogOpen && !selectedType ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {integrationTypes
                                    .filter((type) => !connectedIntegrationTypes.includes(type.type as any))
                                    .map((integration) => {
                                        const Icon = integration.icon
                                        return (
                                            <button
                                                key={integration.type}
                                                onClick={() => setSelectedType(integration.type)}
                                                className="group flex flex-col items-center gap-4 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 hover:border-primary/30 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl transition-all text-center"
                                            >
                                                <div className={classNames(
                                                    "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-sm group-hover:bg-primary group-hover:border-primary",
                                                    integration.iconBg,
                                                    integration.iconColor
                                                )}>
                                                    <Icon className="w-7 h-7 group-hover:text-white transition-colors" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-black text-sm text-gray-900 dark:text-white uppercase tracking-tight">
                                                        {integration.name}
                                                    </h3>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">
                                                        {integration.description}
                                                    </p>
                                                </div>
                                            </button>
                                        )
                                    })}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 pl-1">
                                        <Key className="w-3.5 h-3.5 text-primary" />
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Access Credential</label>
                                    </div>
                                    <Input
                                        type="password"
                                        value={config.apiKey || ''}
                                        onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                                        className="h-14 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-bold text-base"
                                        placeholder="Paste your API key or token..."
                                    />
                                </div>

                                {(selectedType === 'slack' || configuringIntegration?.type === 'slack') && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 pl-1">
                                            <Link2 className="w-3.5 h-3.5 text-primary" />
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Webhook URL</label>
                                        </div>
                                        <Input
                                            type="url"
                                            value={config.webhookUrl || ''}
                                            onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                                            className="h-14 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-800 transition-all font-bold text-base"
                                            placeholder="https://hooks.slack.com/services/..."
                                        />
                                    </div>
                                )}

                                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                                    <Check className="w-5 h-5 text-primary mt-0.5" />
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest leading-relaxed italic">
                                        Your credentials are encrypted at rest using industry-standard AES-256 protocols.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 bg-gray-50/30 dark:bg-gray-800/10 border-t border-gray-50 dark:border-gray-800 flex gap-4">
                        <Button
                            variant="default"
                            onClick={() => {
                                if (selectedType && !configuringIntegration) {
                                    setSelectedType('')
                                } else {
                                    setIsAddDialogOpen(false)
                                    setConfiguringIntegration(null)
                                    setConfig({})
                                    setSelectedType('')
                                }
                            }}
                            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-100 dark:border-gray-700 transition-all"
                        >
                            {selectedType && !configuringIntegration ? 'Back' : 'Cancel'}
                        </Button>
                        {(selectedType || configuringIntegration) && (
                            <Button
                                variant="solid"
                                onClick={configuringIntegration ? handleUpdateConfig : handleConnect}
                                disabled={!config.apiKey}
                                className="flex-[2] h-14 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                            >
                                <Check className="w-4 h-4" />
                                <span>{configuringIntegration ? 'Update Setup' : 'Connect App'}</span>
                            </Button>
                        )}
                    </div>
                </div>
            </Dialog>

            <ConfirmDialog
                isOpen={disconnectConfirm.isOpen}
                type="danger"
                title="Disconnect Integration"
                onClose={() => setDisconnectConfirm({ isOpen: false, integration: null })}
                onCancel={() => setDisconnectConfirm({ isOpen: false, integration: null })}
                onConfirm={confirmDisconnect}
            >
                <p>
                    Are you sure you want to disable the{' '}
                    <span className="font-black text-gray-900 dark:text-white">
                        {disconnectConfirm.integration ? getIntegrationInfo(disconnectConfirm.integration.type).name : ''}
                    </span>{' '}
                    integration?
                </p>
            </ConfirmDialog>
        </div>
    )
}
