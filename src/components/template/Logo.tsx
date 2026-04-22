'use client'

import classNames from 'classnames'
import Image from 'next/image'
import type { CommonProps } from '@/@types/common'
import useSystemSettings from '@/utils/hooks/useSystemSettings'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number
    logoHeight?: number
}

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        className,
        imgClass,
        style,
        logoWidth,
        logoHeight,
    } = props

    const { settings } = useSystemSettings()

    const width = logoWidth || (type === 'full' ? 140 : 50)
    const height = logoHeight || (type === 'full' ? 60 : 50)

    return (
        <div className={classNames('logo flex items-center justify-center', className)} style={style}>
            <Image
                className={classNames('object-contain', imgClass)}
                src={`${LOGO_SRC_PATH}fgceosa-logo.png`}
                alt={`${settings.associationName} logo`}
                width={width}
                height={height}
                priority
            />
        </div>
    )
}

export default Logo
