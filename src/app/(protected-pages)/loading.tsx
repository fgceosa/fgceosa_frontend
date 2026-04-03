import React from 'react'

const Loading = () => {
    return (
        <div className="flex flex-auto flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-auto min-w-0">
                {/* Sidebar Skeleton */}
                <div className="hidden lg:flex flex-col w-72 bg-gray-950 p-6 space-y-8">
                    <div className="h-10 w-32 bg-gray-800/50 rounded-lg animate-pulse" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-12 w-full bg-gray-800/30 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="flex flex-col flex-1 bg-white dark:bg-gray-900 rounded-l-[2rem] lg:-ml-[2rem] z-10 relative overflow-hidden shadow-2xl">
                    {/* Header Skeleton */}
                    <div className="h-20 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-8">
                        <div className="h-10 w-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                            <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                        </div>
                    </div>

                    {/* Body Skeleton */}
                    <div className="p-8 space-y-10 overflow-hidden pointer-events-none">
                        <div className="space-y-3">
                            <div className="h-10 w-80 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                            <div className="h-6 w-96 bg-gray-50 dark:bg-gray-800/50 rounded-lg animate-pulse" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-32 bg-gray-50 dark:bg-gray-800/50 rounded-3xl animate-pulse" />
                            ))}
                        </div>

                        <div className="h-[400px] w-full bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Top progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50 overflow-hidden">
                <div className="h-full bg-primary w-1/4 animate-shimmer" />
            </div>
        </div>
    )
}

export default Loading
