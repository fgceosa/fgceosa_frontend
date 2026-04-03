import { useState } from 'react'
import classNames from '../utils/classNames'
import useTimeout from '../hooks/useTimeout'
import {
    CheckCircle2,
    Info,
    AlertTriangle,
    XCircle,
    X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TypeAttributes, CommonProps } from '../@types/common'
import type { ReactNode, MouseEvent, Ref } from 'react'

export interface AlertProps extends CommonProps {
    closable?: boolean
    customClose?: ReactNode | string
    customIcon?: ReactNode | string
    duration?: number
    title?: ReactNode | string
    onClose?: (e?: MouseEvent<any>) => void
    showIcon?: boolean
    triggerByToast?: boolean
    type?: TypeAttributes.Status
    ref?: Ref<HTMLDivElement>
}

const DEFAULT_TYPE = 'warning'

const TYPE_MAP = {
    success: {
        bg: 'bg-emerald-50/80 dark:bg-emerald-500/10',
        border: 'border-emerald-100 dark:border-emerald-500/20',
        accent: 'bg-emerald-500',
        text: 'text-emerald-900 dark:text-emerald-100',
        icon: 'text-emerald-500',
        title: 'text-emerald-950 dark:text-emerald-50',
        symbol: CheckCircle2,
    },
    info: {
        bg: 'bg-blue-50/80 dark:bg-blue-500/10',
        border: 'border-blue-100 dark:border-blue-500/20',
        accent: 'bg-blue-500',
        text: 'text-blue-900 dark:text-blue-100',
        icon: 'text-blue-500',
        title: 'text-blue-950 dark:text-blue-50',
        symbol: Info,
    },
    warning: {
        bg: 'bg-amber-50/80 dark:bg-amber-500/10',
        border: 'border-amber-100 dark:border-amber-500/20',
        accent: 'bg-amber-500',
        text: 'text-amber-900 dark:text-amber-100',
        icon: 'text-amber-500',
        title: 'text-amber-950 dark:text-amber-50',
        symbol: AlertTriangle,
    },
    danger: {
        bg: 'bg-rose-50/80 dark:bg-rose-500/10',
        border: 'border-rose-100 dark:border-rose-500/20',
        accent: 'bg-rose-500',
        text: 'text-rose-900 dark:text-rose-100',
        icon: 'text-rose-500',
        title: 'text-rose-950 dark:text-rose-50',
        symbol: XCircle,
    },
}

const TYPE_ARRAY: TypeAttributes.Status[] = [
    'success',
    'danger',
    'info',
    'warning',
]

const Alert = (props: AlertProps) => {
    const {
        children,
        className,
        closable = false,
        customClose,
        customIcon,
        duration = 5000,
        title = null,
        onClose,
        ref,
        showIcon = true,
        triggerByToast = false,
        ...rest
    } = props

    const getType = () => {
        const { type = DEFAULT_TYPE } = props
        if (TYPE_ARRAY.includes(type)) {
            return type
        }
        return DEFAULT_TYPE
    }

    const type = getType()
    const config = TYPE_MAP[type]
    const Icon = config.symbol

    const [isVisible, setIsVisible] = useState(true)

    const { clear } = useTimeout(
        () => {
            if (duration > 0) {
                setIsVisible(false)
                onClose?.()
            }
        },
        duration,
        duration > 0 && !triggerByToast,
    )

    const handleClose = (e: MouseEvent<any>) => {
        setIsVisible(false)
        onClose?.(e)
        clear()
    }

    if (!isVisible && !triggerByToast) {
        return null
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    className={classNames(
                        'relative flex w-full overflow-hidden border backdrop-blur-md transition-all duration-300',
                        config.bg,
                        config.border,
                        !triggerByToast ? 'rounded-2xl shadow-xl shadow-black/5' : 'rounded-none',
                        className
                    )}
                    {...rest}
                >
                    {/* Left Accent Bar */}
                    <div className={classNames('absolute left-0 top-0 bottom-0 w-1.5', config.accent)} />

                    <div className="flex w-full items-start gap-4 p-4 pl-6">
                        {showIcon && (
                            <div className={classNames('mt-0.5 shrink-0', config.icon)}>
                                {customIcon || <Icon className="h-5 w-5" strokeWidth={2.5} />}
                            </div>
                        )}

                        <div className="flex-1 space-y-1">
                            {title && (
                                <h5 className={classNames('text-sm font-black uppercase tracking-widest', config.title)}>
                                    {title}
                                </h5>
                            )}
                            <div className={classNames('text-[13px] font-medium leading-relaxed', config.text)}>
                                {children}
                            </div>
                        </div>

                        {closable && (
                            <button
                                onClick={handleClose}
                                className={classNames(
                                    'group flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                                    'hover:bg-black/5 dark:hover:bg-white/5',
                                    config.icon
                                )}
                            >
                                {customClose || (
                                    <X className="h-4 w-4 transition-transform group-hover:rotate-90" strokeWidth={2.5} />
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Alert
