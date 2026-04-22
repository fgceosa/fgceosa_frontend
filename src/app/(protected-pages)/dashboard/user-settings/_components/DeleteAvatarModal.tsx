'use client'

import { Dialog, Button, Avatar } from '@/components/ui'
import { HiOutlineExclamation } from 'react-icons/hi'

interface DeleteAvatarModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isDeleting: boolean
}

export default function DeleteAvatarModal({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
}: DeleteAvatarModalProps) {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={480}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
            contentClassName="p-0 border-none"
            closable={!isDeleting}
        >
            <div className="p-8 sm:p-10">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6">
                        <Avatar
                            className="text-red-600 bg-red-100 dark:text-red-100"
                            shape="circle"
                            size={56}
                        >
                            <span className="text-2xl">
                                <HiOutlineExclamation />
                            </span>
                        </Avatar>
                    </div>
                    <div className="space-y-2 mb-8">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Delete Picture</h3>
                        <div className="text-[13px] font-bold text-gray-500 leading-relaxed px-4">
                            Are you sure you want to remove your profile picture? This will reset your avatar to your initials.
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <Button
                            className="flex-1 h-12 rounded-2xl font-black text-gray-400 border-none hover:bg-gray-50 dark:hover:bg-gray-800"
                            onClick={onClose}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            className="flex-[1.5] h-12 rounded-2xl font-black text-white border-none shadow-lg bg-[#8B0000] hover:bg-[#700000]"
                            onClick={onConfirm}
                            loading={isDeleting}
                            disabled={isDeleting}
                        >
                            Delete Picture
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
