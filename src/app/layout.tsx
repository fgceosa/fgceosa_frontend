import { auth } from '@/auth'
import ReduxProvider from '@/components/providers/ReduxProvider'
import ConfigProviderWrapper from '@/components/providers/ConfigProviderWrapper'
import pageMetaConfig from '@/configs/page-meta.config'
import { getNavigation } from '@/server/actions/navigation/getNavigation'
import { getTheme } from '@/server/actions/theme'
import applyTheme from '@/utils/applyThemeSchema'
import presetThemeSchemaConfig from '@/configs/preset-theme-schema.config'
import InitializeStore from '@/components/providers/InitializeStore'
import { Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import type { ReactNode } from 'react'
import '@/assets/styles/app.css'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
})

export const metadata = {
    ...pageMetaConfig,
}

import type { Viewport } from 'next'
import { headers, cookies } from 'next/headers'

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    // Force async dynamic APIs for Next.js 15 compatibility
    await headers()
    await cookies()

    const session = await auth()

    const navigationTree = await getNavigation()

    const theme = await getTheme()

    return (
        <html
            className={`${theme.mode === 'dark' ? 'dark' : 'light'} overflow-x-hidden w-full`}
            dir={theme.direction}
            suppressHydrationWarning
        >
            <body className={`${inter.variable} font-sans overflow-x-hidden w-full m-0 p-0`} suppressHydrationWarning>
                <NextTopLoader
                    color="#8B0000"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={4}
                    crawl={true}
                    showSpinner={false}
                    easing="ease"
                    speed={200}
                    shadow="0 0 10px #8B0000,0 0 5px #8B0000"
                />
                <ReduxProvider>
                    <InitializeStore
                        session={session}
                        theme={theme}
                        navigationTree={navigationTree}
                    >
                        <ConfigProviderWrapper
                            value={{
                                mode: theme.mode,
                                direction: theme.direction,
                                controlSize: theme.controlSize,
                            }}
                        >
                            {children}
                        </ConfigProviderWrapper>
                    </InitializeStore>
                </ReduxProvider>
                <script
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                        __html: `(${applyTheme.toString()})(${JSON.stringify([
                            theme.themeSchema || 'default',
                            theme.mode,
                            presetThemeSchemaConfig,
                        ]).slice(1, -1)})`,
                    }}
                />
            </body>
        </html>
    )
}
