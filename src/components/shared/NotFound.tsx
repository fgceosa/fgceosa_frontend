import React from 'react'
import { SearchX } from 'lucide-react'

type NotFoundProps = {
    message?: string
}

const NotFound = ({ message = "No records found!" }: NotFoundProps = {}) => {
    return (
        <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative mb-8">
                <div className="w-32 h-32 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center shadow-inner border border-gray-100 dark:border-gray-700/50">
                    <SearchX className="w-16 h-16 text-gray-200 dark:text-gray-700" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center border border-gray-100 dark:border-gray-800">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                {message}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                It looks like there's nothing to show here right now. Try refreshing the page or check back later.
            </p>
        </div>
    )
}

export default NotFound
