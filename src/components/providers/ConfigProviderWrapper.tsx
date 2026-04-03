'use client'

import ConfigProvider from '@/components/ui/ConfigProvider'
import type { Config } from '@/components/ui/ConfigProvider'
import type { ReactNode } from 'react'

interface ConfigProviderWrapperProps {
    children: ReactNode
    value: Config
}

const ConfigProviderWrapper = ({ children, value }: ConfigProviderWrapperProps) => {
    return (
        <ConfigProvider value={value}>
            {children}
        </ConfigProvider>
    )
}

export default ConfigProviderWrapper
