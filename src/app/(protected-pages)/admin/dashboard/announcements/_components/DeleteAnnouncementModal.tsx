'use client'

import React from 'react'
import { Trash2, AlertTriangle, X } from 'lucide-react'
import { Button, Dialog } from '@/components/ui'

interface DeleteAnnouncementModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
}

const DeleteAnnouncementModal = ({ isOpen, onClose, onConfirm, title }: DeleteAnnouncementModalProps) => {
    return (
        <Dialog
            isOpen={isOpen}
            width={450}
            onClose={onClose}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
            <div className="p-8 sm:p-10">
                <div className="flex flex-col items-center text-center">
                    {/* Warning Icon */}
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mb-6 border border-red-100 dark:border-red-900/30 animate-bounce-slow">
                        <Trash2 className="w-10 h-10 text-[#8B0000]" />
                    </div>

                    {/* Content */}
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-3">
                        Delete Announcement?
                    </h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                        Are you sure you want to delete <span className="text-gray-900 dark:text-white font-black italic">"{title}"</span>? This action cannot be undone and will remove it from all member dashboards.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col w-full gap-3">
                        <Button 
                            variant="solid" 
                            onClick={onConfirm}
                            className="w-full bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white h-14 rounded-2xl font-black capitalize  transition-all hover:scale-[1.02] active:scale-[0.98] border-none shadow-lg shadow-red-900/20"
                        >
                            Confirm Delete
                        </Button>
                        <Button 
                            variant="plain" 
                            onClick={onClose}
                            className="w-full h-14 rounded-2xl font-black capitalize  text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            Discard Action
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default DeleteAnnouncementModal
