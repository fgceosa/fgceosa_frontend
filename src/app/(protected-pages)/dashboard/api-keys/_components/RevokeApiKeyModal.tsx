'use client'

import { AlertTriangle, ShieldX, X } from 'lucide-react'
import { Button, Dialog } from '@/components/ui'
import classNames from '@/utils/classNames'

interface RevokeApiKeyModalProps {
    isOpen: boolean
    keyName: string
    onClose: () => void
    onConfirm: () => void
    isRevoking?: boolean
}

export default function RevokeApiKeyModal({
    isOpen,
    keyName,
    onClose,
    onConfirm,
    isRevoking = false,
}: RevokeApiKeyModalProps) {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={520}
            contentClassName="p-0 border-none bg-transparent shadow-none"
        >
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] sm:rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 relative">
                <div className="p-6 sm:p-10">
                    {/* Header Icon */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[32px] bg-red-50 dark:bg-red-900/10 flex items-center justify-center border border-red-100 dark:border-red-800/50 shadow-inner">
                            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400 animate-pulse" />
                        </div>
                    </div>

                    {/* Title & Identity */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
                            Revoke API Key
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400">
                            <span className="uppercase">Identity:</span>
                            <span className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded border border-red-100/50 dark:border-red-800/30 font-mono break-all line-clamp-1 max-w-[200px]">
                                {keyName}
                            </span>
                        </div>
                    </div>

                    {/* Warning Content */}
                    <div className="space-y-6 mb-10">
                        <p className="text-center text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-sm">
                            Are you sure you want to <strong className="text-gray-900 dark:text-white">revoke</strong> this API key? This will immediately disconnect all applications and services using this credential.
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm flex-shrink-0">
                                    <ShieldX className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-gray-900 dark:text-white mb-1 uppercase tracking-wider">Access Termination</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium italic">
                                        Revocation is permanent. The authentication token will be blacklisted and cannot be reactivated.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                        <button
                            onClick={onClose}
                            disabled={isRevoking}
                            className="flex sm:flex-1 h-12 rounded-xl sm:rounded-none bg-gray-50 sm:bg-transparent items-center justify-center text-xs font-black text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isRevoking}
                            className={classNames(
                                "flex-1 w-full h-12 rounded-xl text-white font-black transition-all shadow-lg text-[11px] uppercase tracking-wider",
                                isRevoking
                                    ? "bg-gray-400 cursor-not-allowed opacity-50"
                                    : "bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none hover:scale-[1.02] active:scale-[0.98]"
                            )}
                        >
                            {isRevoking ? 'Revoking...' : 'Revoke Access'}
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
