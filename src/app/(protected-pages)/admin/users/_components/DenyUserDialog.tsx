import React from 'react'
import { Dialog, Button } from '@/components/ui'
import { Ban, AlertTriangle } from 'lucide-react'
import type { UserMember } from '../types'

interface DenyUserDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    user: UserMember
    isDenying?: boolean
}

export default function DenyUserDialog({
    isOpen,
    onClose,
    onConfirm,
    user,
    isDenying = false,
}: DenyUserDialogProps) {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={() => !isDenying && onClose()}
            width={480}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
            closable={!isDenying}
        >
            <div className="p-8 sm:p-10">
                <div className="flex flex-col items-center text-center">
                    <div className={`w-20 h-20 bg-red-50 dark:bg-red-900/10 text-[#8B0000] border border-red-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner`}>
                        <Ban className="w-10 h-10" />
                    </div>
                    
                    <div className="space-y-2 mb-10">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                            Deny Registration
                        </h2>
                        <p className="text-[11px] font-bold text-gray-400 tracking-tight">Confirmation required</p>
                    </div>

                    <div className="bg-gray-50/50 dark:bg-gray-800/20 rounded-[2rem] p-6 mb-10 border border-gray-100 dark:border-gray-800 flex flex-col items-center shadow-inner w-full">
                        <h4 className="font-black text-gray-900 dark:text-white text-lg tracking-tight">
                            {user.name}
                        </h4>
                    </div>

                    <div className="bg-red-50/30 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-2xl p-5 flex gap-4 items-start mb-10 shadow-inner">
                        <AlertTriangle className="w-5 h-5 text-[#8B0000] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-red-700 dark:text-red-400 font-bold tracking-tight leading-relaxed text-left">
                            Are you sure you want to deny this registration? The user will be notified via email.
                        </p>
                    </div>

                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onClose}
                            disabled={isDenying}
                            className="flex-1 h-14 rounded-2xl border-none text-[13px] font-bold text-gray-400 dark:text-gray-500 capitalize tracking-tight hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDenying}
                            className={`flex-[2] h-14 bg-[#8B0000] shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] text-white rounded-2xl font-bold tracking-tight text-[13px] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center border-none`}
                        >
                            {isDenying ? 'Denying...' : 'Deny Registration'}
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
