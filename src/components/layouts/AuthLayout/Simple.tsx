import { ReactNode, cloneElement, JSX } from 'react'
import Container from '@/components/shared/Container'
import Logo from '@/components/template/Logo'

interface SimpleProps {
    children: ReactNode
    content?: ReactNode
}

const Simple = ({ children, content }: SimpleProps) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-[#8B0000] dark:bg-gray-900 px-4 py-20 relative overflow-x-hidden overflow-y-auto">
             {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-[#8B0000] -skew-y-3 -translate-y-1/2 z-0" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-5 z-0" />

            <Container className="relative z-10 w-full max-w-[600px] my-auto">
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white/20 dark:border-gray-700">
                    <div className="p-6 sm:p-10">
                        <div className="flex flex-col items-center mb-8 pt-2">
                            <Logo logoWidth={150} logoHeight={68} className="mb-5" />
                            <div className="h-1 w-12 bg-[#8B0000] rounded-full" />
                        </div>
                        
                        <div>
                            {content ? cloneElement(content as JSX.Element, { ...{ children } }) : children}
                        </div>
                    </div>
                </div>

                <div className="mt-10 py-6 text-center">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">
                        Official Alumni Portal of FGCE
                    </p>
                </div>
            </Container>
        </div>
    )
}

export default Simple
