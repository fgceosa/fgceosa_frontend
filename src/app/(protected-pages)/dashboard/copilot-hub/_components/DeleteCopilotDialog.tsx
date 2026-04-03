import { Dialog } from '@/components/ui'
import { AlertTriangle, X } from 'lucide-react'
import { Copilot } from '../types'

interface DeleteCopilotDialogProps {
    isOpen: boolean
    copilot: Copilot | null
    onClose: () => void
    onConfirm: () => void
}

export default function DeleteCopilotDialog({
    isOpen,
    copilot,
    onClose,
    onConfirm
}: DeleteCopilotDialogProps) {
    if (!copilot) return null

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            closable={false}
            width={500}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-rose-50/30 dark:bg-rose-900/10">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">Delete copilot</h3>
                            <p className="text-[10px] sm:text-[11px] font-bold text-rose-500 mt-0.5 line-clamp-1 max-w-[200px] sm:max-w-none">
                                Archive identity: "{copilot.name}"
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

                {/* Body */}
                <div className="px-5 sm:px-8 py-6 sm:py-8">
                    <div className="p-4 sm:p-5 bg-rose-50/50 dark:bg-rose-900/5 rounded-2xl border border-rose-100 dark:border-rose-900/20 space-y-2 sm:space-y-3">
                        <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-relaxed">
                            Are you sure you want to delete this agent?
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            This action is irreversible. All associated data, configurations, and connectivity protocols will be permanently purged from the system.
                        </p>
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
                        onClick={onConfirm}
                        className="flex-1 h-12 sm:h-14 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] sm:text-[13px] rounded-xl sm:rounded-2xl shadow-xl shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
                    >
                        <span>Delete copilot</span>
                        <AlertTriangle className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    </button>
                </div>
            </div>
        </Dialog>
    )
}
