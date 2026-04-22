
import { useState } from 'react'
import { Dialog, Input, Button, Notification, toast } from '@/components/ui'
import { Shield } from 'lucide-react'
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
                <Notification type="danger" title="Required">
                    Permission name is required.
                </Notification>
            )
            return
        }

        setIsSaving(true)
        try {
            await dispatch(createPermission({ name, description })).unwrap()
            toast.push(
                <Notification type="success" title="Permission Created">
                    Permission has been created successfully.
                </Notification>
            )
            dispatch(fetchPermissions())
            onClose()
            setName('')
            setDescription('')
        } catch (error: any) {
            toast.push(
                <Notification type="danger" title="Failed">
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
            width={480}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
            contentClassName="p-0 border-none"
        >
            <div className="p-8 sm:p-10">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                        <Shield className="w-6 h-6 text-[#8B0000]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">New Permission</h2>
                        <p className="text-xs font-bold text-gray-400 mt-1">Add a new permission to the system</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-1">Permission Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. member:manage"
                            className="h-12 border-gray-200 dark:border-gray-700 rounded-xl font-bold"
                        />
                        <p className="text-[11px] text-gray-400 font-medium ml-1">
                            Use format: <span className="font-bold text-[#8B0000]">scope:action</span>
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 ml-1">Description</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What does this permission allow?"
                            className="h-12 border-gray-200 dark:border-gray-700 rounded-xl font-bold"
                        />
                    </div>

                    {/* Preview */}
                    {name && (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800 animate-in fade-in duration-300">
                            <p className="text-xs font-bold text-gray-400">Category</p>
                            <p className="text-sm font-black text-[#8B0000] mt-1">
                                {name.includes(':') ? name.split(':')[0].replace(/_/g, ' ') : 'General'}
                            </p>
                        </div>
                    )}

                    <div className="flex gap-4 pt-2">
                        <Button
                            type="button"
                            variant="plain"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-2xl font-black text-gray-400 border-none hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            disabled={isSaving || !name.trim()}
                            loading={isSaving}
                            className="flex-[1.5] h-12 bg-[#8B0000] hover:bg-[#700000] text-white font-black rounded-2xl shadow-lg border-none disabled:opacity-50"
                        >
                            Create Permission
                        </Button>
                    </div>
                </form>
            </div>
        </Dialog>
    )
}
