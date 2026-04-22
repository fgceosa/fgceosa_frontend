import {
    HiCheckCircle,
    HiOutlineInformationCircle,
    HiOutlineExclamation,
    HiOutlineExclamationCircle,
} from 'react-icons/hi'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { ReactNode } from 'react'
import type { DialogProps } from '@/components/ui/Dialog'
import type { ButtonProps } from '@/components/ui/Button'

type StatusType = 'info' | 'success' | 'warning' | 'danger'

interface ConfirmDialogProps extends DialogProps {
    cancelText?: ReactNode | string
    confirmText?: ReactNode | string
    confirmButtonProps?: ButtonProps
    cancelButtonProps?: ButtonProps
    type?: StatusType
    title?: ReactNode | string
    children?: ReactNode
    onCancel?: () => void
    onConfirm?: () => void
}

const StatusIcon = ({ status }: { status: StatusType }) => {
    switch (status) {
        case 'info':
            return (
                <Avatar
                    className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
                    shape="circle"
                >
                    <span className="text-2xl">
                        <HiOutlineInformationCircle />
                    </span>
                </Avatar>
            )
        case 'success':
            return (
                <Avatar
                    className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
                    shape="circle"
                >
                    <span className="text-2xl">
                        <HiCheckCircle />
                    </span>
                </Avatar>
            )
        case 'warning':
            return (
                <Avatar
                    className="text-amber-600 bg-amber-100 dark:text-amber-100"
                    shape="circle"
                >
                    <span className="text-2xl">
                        <HiOutlineExclamationCircle />
                    </span>
                </Avatar>
            )
        case 'danger':
            return (
                <Avatar
                    className="text-red-600 bg-red-100 dark:text-red-100"
                    shape="circle"
                >
                    <span className="text-2xl">
                        <HiOutlineExclamation />
                    </span>
                </Avatar>
            )

        default:
            return null
    }
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
    const {
        type = 'info',
        title,
        children,
        onCancel,
        onConfirm,
        cancelText = 'Cancel',
        confirmText = 'Confirm',
        confirmButtonProps,
        cancelButtonProps,
        ...rest
    } = props

    const handleCancel = () => {
        onCancel?.()
    }

    const handleConfirm = () => {
        onConfirm?.()
    }

    return (
        <Dialog 
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl" 
            contentClassName="p-0 border-none"
            {...rest}
        >
            <div className="p-8 sm:p-10">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6">
                        <StatusIcon status={type} />
                    </div>
                    <div className="space-y-2 mb-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight capitalize">{title}</h3>
                        <div className="text-[13px] font-bold text-gray-500 leading-relaxed px-4">
                            {children}
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <Button
                            className="flex-1 h-12 rounded-2xl font-bold capitalize text-gray-500 border-none hover:bg-gray-50 dark:hover:bg-gray-800"
                            onClick={handleCancel}
                            {...cancelButtonProps}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            variant="solid"
                            className={`flex-[1.5] h-12 rounded-2xl font-bold capitalize text-white border-none shadow-lg ${type === 'danger' ? 'bg-[#8B0000] hover:bg-[#700000]' : 'bg-gray-900 dark:bg-white dark:text-gray-900'}`}
                            onClick={handleConfirm}
                            {...confirmButtonProps}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default ConfirmDialog
