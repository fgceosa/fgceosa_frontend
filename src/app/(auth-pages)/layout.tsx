import { ReactNode, Suspense } from 'react'
import Simple from '@/components/layouts/AuthLayout/Simple'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex flex-auto flex-col h-[100vh]">
            <Suspense fallback={null}>
                <Simple>{children}</Simple>
            </Suspense>
        </div>
    )
}

export default Layout
