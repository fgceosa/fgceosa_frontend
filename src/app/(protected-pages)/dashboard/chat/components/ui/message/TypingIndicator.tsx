'use client'

import { motion } from 'framer-motion'

export const TypingIndicator = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex w-full mt-2 space-x-3 max-w-4xl mx-auto px-4"
        >
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-[#0055BA] to-[#003d85] flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
            </div>

            <div className="flex p-4 rounded-2xl rounded-tl-none bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-1.5 h-6">
                    <span
                        className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-[bounce_1s_infinite_0ms]"
                    />
                    <span
                        className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-[bounce_1s_infinite_200ms]"
                    />
                    <span
                        className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-[bounce_1s_infinite_400ms]"
                    />
                </div>
            </div>
        </motion.div>
    )
}

export default TypingIndicator
