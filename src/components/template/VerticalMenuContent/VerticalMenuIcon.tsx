import navigationIcon from '@/configs/navigation-icon.config'
import classNames from '@/utils/classNames'
import type { ElementType, ComponentPropsWithRef } from 'react'

type VerticalMenuIconProps = {
    icon: string
    gutter?: string
    currentKey: string
    className?: string
}

export const Icon = <T extends ElementType>({
    component,
    ...props
}: {
    header: T
} & ComponentPropsWithRef<T>) => {
    const Component = component
    return <Component {...props} />
}

const VerticalMenuIcon = ({ icon, className }: VerticalMenuIconProps) => {
    if (typeof icon !== 'string' && !icon) {
        return <></>
    }

    return (
        <>
            {navigationIcon[icon] && (
                <span className={classNames('text-2xl', className)}>
                    {navigationIcon[icon]}
                </span>
            )}
        </>
    )
}

export default VerticalMenuIcon
