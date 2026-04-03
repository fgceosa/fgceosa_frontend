import classNames from '@/utils/classNames'

/**
 * Configuration for a status badge appearance
 */
export interface StatusConfigItem {
    bg: string
    text: string
    border: string
    dot: string
}

/**
 * Props for the StatusBadge component
 */
interface StatusBadgeProps {
    /** The status value to display */
    status: string
    /** Configuration object mapping status values to their visual styles */
    config: Record<string, StatusConfigItem>
    /** Optional default configuration to use when status is not found in config */
    defaultConfig?: StatusConfigItem
    /** Optional CSS class name for additional styling */
    className?: string
}

/**
 * Default visual configuration for unknown statuses
 */
const DEFAULT_CONFIG: StatusConfigItem = {
    bg: 'bg-gray-50',
    text: 'text-gray-500',
    border: 'border-gray-100',
    dot: 'bg-gray-400'
}

/**
 * StatusBadge - A reusable badge component for displaying status with visual indicators
 * 
 * @example
 * ```tsx
 * <StatusBadge 
 *   status="active" 
 *   config={STATUS_CONFIG}
 * />
 * ```
 */
export default function StatusBadge({
    status,
    config,
    defaultConfig = DEFAULT_CONFIG,
    className
}: StatusBadgeProps) {
    const normalizedStatus = status?.toLowerCase() || ''
    const styleConfig = config[normalizedStatus] || defaultConfig

    return (
        <span
            className={classNames(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border",
                styleConfig.bg,
                styleConfig.text,
                styleConfig.border,
                className
            )}
        >
            <div className={classNames("w-1.5 h-1.5 rounded-full mr-1.5", styleConfig.dot)} />
            {status}
        </span>
    )
}
