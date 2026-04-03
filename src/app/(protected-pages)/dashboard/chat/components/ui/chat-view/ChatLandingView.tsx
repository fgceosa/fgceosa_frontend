import { ReactNode } from 'react'
import { motion } from 'framer-motion'

type ChatLandingViewProps = {
    suggestionChips?: ReactNode
}

const ChatLandingView = ({ suggestionChips }: ChatLandingViewProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 py-8 sm:py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl space-y-6 sm:space-y-8"
            >
                <div className="space-y-3 sm:space-y-4">
                    <h1 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white leading-tight">
                        How can I <span className="text-[#0055BA]">help you</span> today?
                    </h1>
                    <p className="text-sm sm:text-base md:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Experience the next generation of enterprise intelligence. Analyze records, generate code, or explore complex ideas with precision.
                    </p>
                </div>

                <div className="pt-4 sm:pt-8 flex flex-wrap justify-center">
                    {suggestionChips}
                </div>
            </motion.div>
        </div>
    )
}

export default ChatLandingView
