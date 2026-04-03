'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { Calendar } from 'lucide-react'
import dayjs from 'dayjs'

interface DateRange {
    startDate: string
    endDate: string
}

interface DateRangeFilterProps {
    onDateRangeChange: (range: DateRange) => void
}

const presetRanges = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
    { label: 'This Year', days: 365 },
]

export default function DateRangeFilter({ onDateRangeChange }: DateRangeFilterProps) {
    const [selectedRange, setSelectedRange] = useState<string>('Last 30 Days')
    const [customStartDate, setCustomStartDate] = useState('')
    const [customEndDate, setCustomEndDate] = useState('')
    const [showCustom, setShowCustom] = useState(false)

    const handlePresetClick = (label: string, days: number) => {
        setSelectedRange(label)
        setShowCustom(false)
        const endDate = dayjs().format('YYYY-MM-DD')
        const startDate = dayjs().subtract(days, 'day').format('YYYY-MM-DD')
        onDateRangeChange({ startDate, endDate })
    }

    const handleCustomApply = () => {
        if (customStartDate && customEndDate) {
            setSelectedRange('Custom')
            onDateRangeChange({
                startDate: customStartDate,
                endDate: customEndDate,
            })
            setShowCustom(false)
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                Date Range:
            </span>

            {presetRanges.map((range) => (
                <Button
                    key={range.label}
                    size="sm"
                    variant={selectedRange === range.label ? 'solid' : 'default'}
                    onClick={() => handlePresetClick(range.label, range.days)}
                >
                    {range.label}
                </Button>
            ))}

            <Button
                size="sm"
                variant={showCustom ? 'solid' : 'default'}
                onClick={() => setShowCustom(!showCustom)}
            >
                Custom Range
            </Button>

            {showCustom && (
                <div className="flex items-center gap-2 w-full mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                            From:
                        </label>
                        <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            max={dayjs().format('YYYY-MM-DD')}
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                            To:
                        </label>
                        <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            max={dayjs().format('YYYY-MM-DD')}
                            min={customStartDate}
                            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <Button
                        size="sm"
                        variant="solid"
                        onClick={handleCustomApply}
                        disabled={!customStartDate || !customEndDate}
                    >
                        Apply
                    </Button>
                </div>
            )}
        </div>
    )
}
