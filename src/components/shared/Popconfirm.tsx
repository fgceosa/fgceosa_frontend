import { useState } from 'react'
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useClick,
    useDismiss,
    useRole,
    useInteractions,
    FloatingPortal,
    FloatingFocusManager,
} from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import classNames from 'classnames'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

interface PopconfirmProps {
    title: string
    onConfirm: () => void
    onCancel?: () => void
    children: React.ReactElement
    confirmText?: string
    cancelText?: string
    okVariant?: 'solid' | 'plain' | 'default'
    okColorClass?: string
    showArrows?: boolean
}

const Popconfirm = ({
    title,
    onConfirm,
    onCancel,
    children,
    confirmText = 'Yes',
    cancelText = 'No',
    okVariant = 'solid',
    okColorClass = 'bg-rose-600',
    showArrows = true,
}: PopconfirmProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [offset(10), flip(), shift()],
        whileElementsMounted: autoUpdate,
    })

    const click = useClick(context)
    const dismiss = useDismiss(context)
    const role = useRole(context)

    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss,
        role,
    ])

    const handleConfirm = (e: React.MouseEvent) => {
        e.stopPropagation()
        onConfirm()
        setIsOpen(false)
    }

    const handleCancel = (e: React.MouseEvent) => {
        e.stopPropagation()
        onCancel?.()
        setIsOpen(false)
    }

    return (
        <>
            <div
                ref={refs.setReference}
                {...getReferenceProps()}
                className="inline-block w-full sm:w-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
            <FloatingPortal>
                <AnimatePresence>
                    {isOpen && (
                        <FloatingFocusManager context={context} modal={false}>
                            <motion.div
                                ref={refs.setFloating}
                                style={floatingStyles}
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                className="z-[100] bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xl p-4 min-w-[240px] max-w-[300px]"
                                {...getFloatingProps()}
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl shrink-0">
                                        <HiOutlineExclamationCircle className="text-rose-500 text-lg" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight mt-1">
                                        {title}
                                    </p>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        size="xs"
                                        className="h-8 px-3 text-[10px] font-black capitalize  text-gray-400 hover:text-gray-900 dark:hover:text-white border-transparent bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700"
                                        onClick={handleCancel}
                                    >
                                        {cancelText}
                                    </Button>
                                    <Button
                                        size="xs"
                                        variant={okVariant}
                                        className={classNames("h-8 px-3 text-[10px] font-black capitalize  text-white shadow-lg shadow-rose-500/20", okColorClass)}
                                        onClick={handleConfirm}
                                    >
                                        {confirmText}
                                    </Button>
                                </div>

                                {showArrows && (
                                    <div
                                        className={classNames(
                                            "absolute w-2 h-2 bg-white dark:bg-gray-800 border-l border-t border-gray-100 dark:border-gray-700 rotate-45",
                                            context.placement.startsWith('top') && "bottom-[-5px] left-1/2 -translate-x-1/2 border-l-0 border-t-0 border-r border-b",
                                            context.placement.startsWith('bottom') && "top-[-5px] left-1/2 -translate-x-1/2",
                                            context.placement.startsWith('left') && "right-[-5px] top-1/2 -translate-y-1/2 border-t-0 border-l-0 border-r border-b",
                                            context.placement.startsWith('right') && "left-[-5px] top-1/2 -translate-y-1/2 border-r-0 border-b-0 border-l border-t"
                                        )}
                                    />
                                )}

                            </motion.div>
                        </FloatingFocusManager>
                    )}
                </AnimatePresence>
            </FloatingPortal>
        </>
    )
}

export default Popconfirm
