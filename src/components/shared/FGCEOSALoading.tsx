import { ShieldCheck } from 'lucide-react'

const FGCEOSALoading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-[#8B0000]/10 border-t-[#8B0000] animate-spin" />
                <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#8B0000] opacity-50" />
            </div>
            <p className="mt-8 text-[11px] font-black text-[#8B0000] uppercase tracking-[0.3em] animate-pulse">
                FGCEOSA
            </p>
        </div>
    )
}

export default FGCEOSALoading
