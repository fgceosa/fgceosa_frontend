import { useState, useEffect } from 'react'
import { Dialog, Input } from '@/components/ui'
import { Share2, X, Users, Sparkles } from 'lucide-react'
import { Copilot } from '../types'

interface ShareCopilotDialogProps {
    isOpen: boolean
    copilot: Copilot | null
    onClose: () => void
    onConfirm: (emails: string[], message: string) => void
}

export default function ShareCopilotDialog({
    isOpen,
    copilot,
    onClose,
    onConfirm
}: ShareCopilotDialogProps) {
    const [emails, setEmails] = useState('')
    const [message, setMessage] = useState('')

    // Reset state when dialog opens/closes or copilot changes
    useEffect(() => {
        if (isOpen) {
            setEmails('')
            setMessage('')
        }
    }, [isOpen, copilot])

    const handleConfirm = () => {
        const emailList = emails.split(',').map(e => e.trim()).filter(e => e)
        onConfirm(emailList, message)
    }

    if (!copilot) return null

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            closable={false}
            width={540}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0055BA]/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
                            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#0055BA]" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">Share copilot</h3>
                            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 mt-0.5 line-clamp-1 max-w-[200px] sm:max-w-none">
                                Collaborate on <span className="text-[#0055BA]">"{copilot.name}"</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group shrink-0"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 pl-1">
                            <Users className="w-3.5 h-3.5 text-[#0055BA]" />
                            <label className="text-[10px] sm:text-[11px] font-bold text-gray-400">Collaborator emails</label>
                        </div>
                        <Input
                            placeholder="email1@example.com, email2@example.com"
                            value={emails}
                            onChange={(e) => setEmails(e.target.value)}
                            className="rounded-xl border-gray-100 dark:border-gray-800 h-12 text-[13px] sm:text-base font-bold"
                        />
                        <p className="text-[9px] sm:text-[10px] text-gray-400 pl-1">Enter email addresses separated by commas</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 pl-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#0055BA]" />
                            <label className="text-[10px] sm:text-[11px] font-bold text-gray-400">Personal message (optional)</label>
                        </div>
                        <Input
                            textArea
                            rows={3}
                            placeholder="Add a note for your team..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="rounded-xl sm:rounded-2xl border-gray-100 dark:border-gray-800 text-[13px] sm:text-base font-bold"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 sm:px-8 pb-5 sm:pb-8 pt-0 sm:pt-4 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <button
                        onClick={onClose}
                        className="flex-1 h-12 sm:h-14 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] sm:text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 h-12 sm:h-14 bg-[#0055BA] hover:bg-[#004299] text-white font-bold text-[11px] sm:text-[13px] rounded-xl sm:rounded-2xl shadow-xl shadow-[#0055BA]/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                    >
                        <span>Share copilot</span>
                        <Share2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
