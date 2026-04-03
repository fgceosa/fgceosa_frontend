'use client'

import React from 'react'
import classNames from '@/utils/classNames'

interface WorkspacePageLayoutProps {
    header: React.ReactNode
    tabs?: React.ReactNode
    children: React.ReactNode
    fullWidth?: boolean
}

export default function WorkspacePageLayout({
    header,
    tabs,
    children,
    fullWidth = false,
}: WorkspacePageLayoutProps) {
    return (
        <div className={classNames(
            "py-8 space-y-10 animate-in fade-in duration-700 transition-all",
            fullWidth
                ? "w-full min-w-full max-w-none px-4 sm:px-6 md:px-8"
                : "max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8"
        )}>
            {/* Header Section */}
            {header}

            {/* Background Decoration & Content */}
            <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />

                {/* Tab Navigation if present */}
                {tabs && <div className="mb-10 relative z-20">{tabs}</div>}

                {/* Main Content */}
                <div className="relative z-10">{children}</div>
            </div>
        </div>
    )
}
