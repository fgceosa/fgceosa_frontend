import { components, OptionProps, MultiValueGenericProps } from 'react-select'
import { CheckCircle2 } from 'lucide-react'
import classNames from '@/utils/classNames'

const { MultiValueLabel } = components

/**
 * Custom option component for role selection dropdown
 */
export const CustomRoleOption = ({
    innerProps,
    label,
    isSelected,
    data
}: OptionProps<any>) => {
    return (
        <div
            className={classNames(
                "flex items-center justify-between p-4 cursor-pointer rounded-xl transition-all m-1",
                isSelected
                    ? 'bg-primary/10 text-primary font-bold shadow-sm'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            )}
            {...innerProps}
        >
            <div className="flex flex-col gap-0.5">
                <span className="text-sm font-black uppercase tracking-tight">{label}</span>
                {data.description && <span className="text-[10px] opacity-70 italic font-medium">{data.description}</span>}
            </div>
            {isSelected && <CheckCircle2 className="text-primary w-5 h-5 shrink-0" />}
        </div>
    )
}

/**
 * Custom multi-value label component for selected roles
 */
export const CustomMultiValueLabel = ({ children, ...props }: MultiValueGenericProps<any>) => {
    return (
        <MultiValueLabel {...props}>
            <div className="inline-flex items-center px-1">
                {children}
            </div>
        </MultiValueLabel>
    )
}
