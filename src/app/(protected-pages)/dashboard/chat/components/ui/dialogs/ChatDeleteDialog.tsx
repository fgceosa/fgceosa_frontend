'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setDeleteDialog, deleteChat, setSelectedConversation } from '@/store/slices/chat'
import { Dialog, Notification, toast } from '@/components/ui'
import { Trash2, X, AlertTriangle, AlertCircle } from 'lucide-react'

const ChatDeleteDialog = () => {
    const dispatch = useAppDispatch()
    const deleteDialog = useAppSelector((state) => state.chat?.deleteDialog)
    const selectedConversation = useAppSelector((state) => state.chat?.selectedConversation)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleClose = () => {
        if (!isDeleting) {
            dispatch(setDeleteDialog({ id: '', title: '', open: false }))
        }
    }

    const handleConfirm = async () => {
        setIsDeleting(true)
        try {
            await dispatch(deleteChat(deleteDialog.id)).unwrap()

            // Clear selection if deleted chat was selected
            if (selectedConversation === deleteDialog.id) {
                dispatch(setSelectedConversation(''))
            }

            // Show success notification
            toast.push(
                <Notification type="success">
                    Chat deleted successfully
                </Notification>
            )

            handleClose()
        } catch (error) {
            console.error('Failed to delete chat:', error)

            // Show error notification
            toast.push(
                <Notification type="danger">
                    Failed to delete chat. Please try again.
                </Notification>
            )
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog
            isOpen={deleteDialog?.open || false}
            onClose={handleClose}
            closable={false}
            width={600}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-red-50/30 dark:bg-red-900/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Delete Conversation</h3>
                            <p className="text-[10px] font-black text-gray-400 mt-0.5">This action is permanent and irreversible</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="px-8 py-10">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-800/20 w-full">
                            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                                Are you sure you want to delete <span className="font-black text-gray-900 dark:text-white underline decoration-red-500/30">&quot;{deleteDialog?.title}&quot;</span>?
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
                            <AlertCircle className="w-4 h-4" />
                            <p className="text-[10px] font-black">All messages in this chat will be lost.</p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 pb-8 pt-0 flex gap-4">
                    <button
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="flex-1 h-16 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="flex-1 h-16 bg-red-600 hover:bg-red-700 text-white font-black text-[11px] rounded-2xl shadow-xl shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Purging...</span>
                            </div>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                                <span>Delete Forever</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    )
}

export default ChatDeleteDialog
