import React from 'react'

const Loading = () => {
    return (
        <div className="flex flex-auto flex-col h-screen w-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
            {/* Top Bar Skeleton */}
            <div className="h-16 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-8 z-20">
                <div className="flex items-center gap-4">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg animate-pulse" />
                    <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                    <div className="h-8 w-24 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Skeleton */}
                <div className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-6 space-y-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-10 w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl animate-pulse" />
                    ))}
                </div>

                {/* Main Content Skeleton */}
                <div className="flex-1 p-8 space-y-8 overflow-hidden pointer-events-none">
                    <div className="space-y-4">
                        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                        <div className="h-4 w-96 bg-gray-100 dark:bg-gray-800/50 rounded-lg animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse" />
                        ))}
                    </div>

                    <div className="flex-1 min-h-[400px] bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse" />
                </div>
            </div>

            {/* Subtle Progress bar at top */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50 overflow-hidden">
                <div className="h-full bg-primary w-1/3 animate-shimmer" />
            </div>
        </div>
    )
}

export default Loading
