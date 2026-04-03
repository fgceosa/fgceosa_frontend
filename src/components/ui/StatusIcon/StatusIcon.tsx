import {
    CheckCircle2,
    Info,
    AlertTriangle,
    XCircle,
} from 'lucide-react'
import type { TypeAttributes, CommonProps } from '../@types/common'
import type { ReactNode, JSX } from 'react'

export interface StatusIconProps extends CommonProps {
    type: TypeAttributes.Status
    custom?: ReactNode | JSX.Element
    iconColor?: string
}

const ICONS: Record<
    TypeAttributes.Status,
    {
        color: string
        icon: JSX.Element
    }
> = {
    success: {
        color: 'text-emerald-500',
        icon: <CheckCircle2 strokeWidth={2.5} />,
    },
    info: {
        color: 'text-blue-500',
        icon: <Info strokeWidth={2.5} />,
    },
    warning: {
        color: 'text-amber-500',
        icon: <AlertTriangle strokeWidth={2.5} />,
    },
    danger: {
        color: 'text-rose-500',
        icon: <XCircle strokeWidth={2.5} />,
    },
}

const StatusIcon = (props: StatusIconProps) => {
    const { type = 'info', custom, iconColor } = props

    const config = ICONS[type]

    return (
        <span className={`text-xl ${iconColor || config.color}`}>
            {custom || config.icon}
        </span>
    )
}

export default StatusIcon
