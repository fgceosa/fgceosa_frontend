
import { useState } from 'react'
import { Dialog, Input, Button, Notification, toast } from '@/components/ui'
import { Shield, Lock, X, Sparkles } from 'lucide-react'
import { useAppDispatch } from '@/store'
import { createPermission, fetchPermissions } from '@/store/slices/rolesPermissions/rolesPermissionsThunk'

interface CreatePermissionModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CreatePermissionModal({ isOpen, onClose }: CreatePermissionModalProps) {
    const dispatch = useAppDispatch()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            toast.push(
                <Notification type="danger" title="Validation Error">
                    Permission name is required
                </Notification>
            )
            return
        }

        setIsSaving(true)
        try {
            await dispatch(createPermission({ name, description })).unwrap()
            toast.push(
                <Notification type="success" title="Permission Created">
                    Rule has been successfully added to the catalog.
                </Notification>
            )
            dispatch(fetchPermissions())
            onClose()
            setName('')
            setDescription('')
        } catch (error: any) {
            toast.push(
                <Notification type="danger" title="Creation Failed">
                    {error || 'Failed to create permission'}
                </Notification>
            )
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className="sm:max-w-[500px] !p-0 overflow-hidden bg-white dark:bg-gray-900 border-none rounded-[2.5rem] shadow-2xl"
        >
            <div className="relative">
                {/* Premium Background Blurs */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent" />

                <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center text-primary transition-transform hover:rotate-6">
                                <Shield className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    New Permission
                                </h1>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">
                                    Define System Rule
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-400"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                    Permission Name
                                </label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. workspace:manage"
                                    className="h-14 bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-primary/20 focus:border-primary text-gray-900 dark:text-white font-bold"
                                />
                                <p className="text-[10px] text-gray-400 font-medium px-1">
                                    Use colon format: <span className="font-bold text-primary">category:action</span>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                                    Definition
                                </label>
                                <Input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe what this allows..."
                                    className="h-14 bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-primary/20 focus:border-primary text-gray-900 dark:text-white font-bold"
                                />
                            </div>
                        </div>

                        {/* Sensitivity Preview */}
                        {name && (
                            <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 flex items-start gap-3">
                                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-gray-600 dark:text-gray-300">
                                        System will categorize this under:
                                    </p>
                                    <p className="text-sm font-black text-primary uppercase tracking-tight mt-0.5">
                                        {name.includes(':') ? name.split(':')[0].replace(/_/g, ' ') : 'General'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="plain"
                                onClick={onClose}
                                className="flex-1 h-14 font-black uppercase tracking-widest text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                disabled={isSaving || !name.trim()}
                                className="flex-2 h-14 px-10 bg-primary hover:bg-primary-deep text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shrink-0"
                            >
                                {isSaving ? 'Creating...' : 'Create Rule'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    )
}
