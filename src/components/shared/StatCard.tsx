'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon | React.ReactNode
    subtext?: string
    color?: 'blue' | 'emerald' | 'burgundy' | 'amber' | 'gray' | 'indigo'
    isSelected?: boolean
    isFirst?: boolean
    onClick?: () => void
    trend?: {
        value: string
        isPositive: boolean
    }
}

const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    subtext, 
    color = 'blue', 
    isSelected = false, 
    isFirst = false,
    onClick,
    trend 
}: StatCardProps) => {
    
    const getThemeClasses = () => {
        switch (color) {
            case 'burgundy':
                return {
                    iconContainer: 'bg-red-50 text-[#8B0000] shadow-red-100/50',
                    line: 'bg-[#8B0000]',
                    subtextBadge: 'bg-red-50 text-[#8B0000]'
                }
            case 'emerald':
                return {
                    iconContainer: 'bg-emerald-50 text-emerald-600 shadow-emerald-100/50',
                    line: 'bg-emerald-500',
                    subtextBadge: 'bg-emerald-50 text-emerald-600'
                }
            case 'amber':
                return {
                    iconContainer: 'bg-amber-50 text-amber-600 shadow-amber-100/50',
                    line: 'bg-amber-500',
                    subtextBadge: 'bg-amber-50 text-amber-600'
                }
            case 'gray':
                return {
                    iconContainer: 'bg-gray-50 text-gray-400 shadow-gray-100/50',
                    line: 'bg-gray-400',
                    subtextBadge: 'bg-gray-100 text-gray-400'
                }
            case 'indigo':
                return {
                    iconContainer: 'bg-indigo-50 text-indigo-600 shadow-indigo-100/50',
                    line: 'bg-indigo-500',
                    subtextBadge: 'bg-indigo-50 text-indigo-600'
                }
            default: // blue
                return {
                    iconContainer: 'bg-blue-50 text-blue-600 shadow-blue-100/50',
                    line: 'bg-blue-500',
                    subtextBadge: 'bg-blue-50 text-blue-600'
                }
        }
    }

    const theme = getThemeClasses()

    return (
        <div 
            onClick={onClick}
            className={`group p-8 bg-white dark:bg-gray-800 rounded-[2rem] border transition-all duration-500 hover:-translate-y-1 relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${
                isSelected 
                    ? 'border-[#8B0000]/30 shadow-[0_25px_60px_-15px_rgba(139,0,0,0.15)] ring-1 ring-[#8B0000]/10' 
                    : 'border-gray-200/80 dark:border-gray-700 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_-10px_rgba(0,0,0,0.12)]'
            }`}
        >
             {/* Brand color accent line */}
            <div className={`absolute top-0 left-0 w-full h-[3px] transition-all duration-700 ${
                (isSelected || isFirst) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            } ${(isFirst && !isSelected) ? 'bg-[#8B0000]' : theme.line}`}></div>
            
            <div className="relative z-10 space-y-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${theme.iconContainer}`}>
                    {React.isValidElement(Icon) ? Icon : <Icon className="w-6 h-6" />}
                </div>

                <div className="space-y-1.5">
                    <h3 className={`text-[13px] font-black capitalize tracking-tight transition-colors ${
                        isSelected ? 'text-[#8B0000]' : 'text-gray-900 dark:text-gray-300'
                    }`}>
                        {title}
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-xl font-black text-gray-900 dark:text-white leading-none tracking-tighter font-mono">{value}</p>
                        {trend && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${trend.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {trend.isPositive ? '↑' : '↓'} {trend.value}
                            </span>
                        )}
                        {!trend && subtext && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${theme.subtextBadge}`}>
                                {subtext.includes('+') ? '↑' : ''} {subtext.split(' ')[0]}
                            </span>
                        )}
                    </div>
                    {subtext && (
                        <p className="text-[10px] font-bold text-gray-400 italic">
                            {subtext.includes('+') ? subtext.split(' ').slice(1).join(' ') : subtext}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StatCard
