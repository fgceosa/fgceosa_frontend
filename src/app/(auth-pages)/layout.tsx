import { ReactNode, Suspense } from 'react'
import Split from '@/components/layouts/AuthLayout/Split'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-auto flex-col h-[100vh]">
            <Suspense fallback={null}>
                <Split>{children}</Split>
            </Suspense>
        </div>
    )
}

export default Layout
