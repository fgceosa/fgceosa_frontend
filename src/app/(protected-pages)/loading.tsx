import React from 'react'

const Loading = () => {
    return (
        <div className="flex flex-auto flex-col h-full w-full animate-in fade-in duration-500 pt-8 pb-20">
            {/* Body Skeleton */}
            <div className="space-y-10 overflow-hidden pointer-events-none">
                <div className="space-y-3">
                    <div className="h-10 w-64 md:w-80 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                    <div className="h-6 w-48 md:w-96 bg-gray-50 dark:bg-gray-800/50 rounded-lg animate-pulse" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-50 dark:bg-gray-800/50 rounded-3xl animate-pulse" />
                    ))}
                </div>

                <div className="h-[400px] w-full bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] animate-pulse" />
            </div>

            {/* Top progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden">
                <div className="h-full bg-[#8B0000] w-1/4 animate-[pulse_1.5s_ease-in-out_infinite]" />
            </div>
        </div>
    )
}

export default Loading
