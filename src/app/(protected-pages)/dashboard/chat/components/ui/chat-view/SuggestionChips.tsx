'use client'

import { TbBriefcase, TbChartLine, TbCoin, TbSchool, TbRocket } from 'react-icons/tb'
import type { ReactNode } from 'react'

type SuggestionChip = {
    label: string
    icon: ReactNode
}

const suggestions: SuggestionChip[] = [
    { label: 'Career Advancement', icon: <TbBriefcase /> },
    { label: 'Smart Investing', icon: <TbChartLine /> },
    { label: 'Side Income', icon: <TbCoin /> },
    { label: 'Skill Building', icon: <TbSchool /> },
    { label: 'Business Growth', icon: <TbRocket /> },
]

type SuggestionChipsProps = {
    onChipClick: (label: string) => void
}

const SuggestionChips = ({ onChipClick }: SuggestionChipsProps) => {
    return (
        <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto mt-8">
            {suggestions.map((suggestion) => (
                <button
                    key={suggestion.label}
                    onClick={() => onChipClick(suggestion.label)}
                    className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-[#0055BA]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group min-w-[200px]"
                >
                    <span className="text-xl text-gray-400 group-hover:text-[#0055BA] transition-colors">{suggestion.icon}</span>
                    <span className="text-sm font-black text-gray-600 dark:text-gray-300 group-hover:text-[#0055BA] transition-colors">{suggestion.label}</span>
                </button>
            ))}
        </div>
    )
}

export default SuggestionChips
