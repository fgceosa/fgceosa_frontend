import { useCallback, useState } from 'react'
import classNames from '@/utils/classNames'
import useTimeout from '../hooks/useTimeout'
import CloseButton from '../CloseButton'
import StatusIcon from '../StatusIcon'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type { ReactNode, MouseEvent, Ref } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface NotificationProps extends CommonProps {
    closable?: boolean
    customIcon?: ReactNode | string
    duration?: number
    onClose?: (e: MouseEvent<HTMLButtonElement>) => void
    ref?: Ref<HTMLDivElement>
    title?: string
    triggerByToast?: boolean
    type?: TypeAttributes.Status
    width?: number | string
}

const TYPE_CONFIG = {
    success: {
        bg: 'bg-emerald-50/90 dark:bg-emerald-500/10',
        border: 'border-emerald-100 dark:border-emerald-500/20',
        accent: 'bg-emerald-500',
        title: 'text-emerald-950 dark:text-emerald-50',
        text: 'text-emerald-900/80 dark:text-emerald-100/70',
        iconBg: 'bg-emerald-500/10',
    },
    info: {
        bg: 'bg-blue-50/90 dark:bg-blue-500/10',
        border: 'border-blue-100 dark:border-blue-500/20',
        accent: 'bg-blue-500',
        title: 'text-blue-950 dark:text-blue-50',
        text: 'text-blue-900/80 dark:text-blue-100/70',
        iconBg: 'bg-blue-500/10',
    },
    warning: {
        bg: 'bg-amber-50/90 dark:bg-amber-500/10',
        border: 'border-amber-100 dark:border-amber-500/20',
        accent: 'bg-amber-500',
        title: 'text-amber-950 dark:text-amber-50',
        text: 'text-amber-900/80 dark:text-amber-100/70',
        iconBg: 'bg-amber-500/10',
    },
    danger: {
        bg: 'bg-rose-50/90 dark:bg-rose-500/10',
        border: 'border-rose-100 dark:border-rose-500/20',
        accent: 'bg-rose-500',
        title: 'text-rose-950 dark:text-rose-50',
        text: 'text-rose-900/80 dark:text-rose-100/70',
        iconBg: 'bg-rose-500/10',
    },
}

const Notification = (props: NotificationProps) => {
    const {
        className,
        children,
        closable = false,
        customIcon,
        duration = 4500,
        onClose,
        style,
        ref,
        title,
        triggerByToast,
        type = 'info',
        width = 400,
        ...rest
    } = props

    const [isVisible, setIsVisible] = useState(true)
    const config = TYPE_CONFIG[type]

    const { clear } = useTimeout(() => {
        setIsVisible(false)
        onClose?.(null as any)
    }, duration, duration > 0)

    const handleClose = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            setIsVisible(false)
            onClose?.(e)
            clear()
        },
        [onClose, clear],
    )

    if (!isVisible && !triggerByToast) {
        return null
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    className={classNames(
                        'relative flex overflow-hidden border backdrop-blur-xl transition-all duration-300',
                        config.bg,
                        config.border,
                        !triggerByToast ? 'rounded-3xl shadow-2xl shadow-black/10' : 'rounded-none',
                        className
                    )}
                    style={{ width: width, ...style }}
                >
                    {/* Left Accent Bar */}
                    <div className={classNames('absolute left-0 top-0 bottom-0 w-1.5', config.accent)} />

                    <div className="flex w-full items-start gap-4 p-5 pl-7">
                        {(type || customIcon) && (
                            <div className={classNames(
                                'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 shadow-sm',
                                config.iconBg
                            )}>
                                {customIcon ? (
                                    <div className="text-xl">{customIcon}</div>
                                ) : (
                                    <StatusIcon type={type} />
                                )}
                            </div>
                        )}

                        <div className="flex-1 min-w-0 pt-1">
                            {title && (
                                <h6 className={classNames('text-[13px] font-black uppercase tracking-widest mb-1', config.title)}>
                                    {title}
                                </h6>
                            )}
                            <div className={classNames('text-sm font-medium leading-relaxed', config.text)}>
                                {children}
                            </div>
                        </div>

                        {closable && (
                            <CloseButton
                                className={classNames(
                                    'group mt-1 h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                                    'hover:bg-black/5 dark:hover:bg-white/5',
                                    config.title
                                )}
                                resetDefaultClass
                                onClick={handleClose}
                            />
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Notification
