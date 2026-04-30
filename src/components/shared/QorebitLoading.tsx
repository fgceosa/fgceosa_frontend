import { Bot } from 'lucide-react'

const QorebitLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary opacity-50" />
            </div>
            <p className="mt-8 text-[11px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">
                FGCEOSA
            </p>
        </div>
    )
}

export default QorebitLoading
