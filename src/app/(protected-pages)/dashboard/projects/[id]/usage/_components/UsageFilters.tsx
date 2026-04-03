'use client'

import { useState } from 'react'
import { Card, Button, DatePicker } from '@/components/ui'
import { Filter, Calendar, RotateCcw } from 'lucide-react'
import dayjs from 'dayjs'

interface UsageFiltersProps {
    onDateRangeChange: (startDate?: string, endDate?: string) => void
}

export default function UsageFilters({ onDateRangeChange }: UsageFiltersProps) {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])

    const handleDateRangeChange = (dates: [Date | null, Date | null] | null) => {
        if (dates) {
            setDateRange(dates)
            const [start, end] = dates
            onDateRangeChange(
                start ? dayjs(start).format('YYYY-MM-DD') : undefined,
                end ? dayjs(end).format('YYYY-MM-DD') : undefined
            )
        } else {
            setDateRange([null, null])
            onDateRangeChange(undefined, undefined)
        }
    }

    const handleClearFilters = () => {
        setDateRange([null, null])
        onDateRangeChange(undefined, undefined)
    }

    const hasActiveFilters = dateRange[0] || dateRange[1]

    return (
        <Card className="p-0 border-none bg-white dark:bg-gray-950 rounded-[1.5rem] shadow-xl shadow-gray-200/40 dark:shadow-none transition-all duration-500">
            <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10 shadow-sm shrink-0">
                        <Filter className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-primary opacity-80">Filter</span>
                        <h3 className="text-base font-black text-gray-900 dark:text-white">Timeframe</h3>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl md:justify-end">
                    <div className="relative flex-1 group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <DatePicker.DatePickerRange
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            placeholder="Select Dates"
                            className="w-full h-11 pl-10 rounded-xl bg-gray-50 border-gray-100 focus:bg-white transition-all text-sm font-bold"
                        />
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleClearFilters}
                            className="h-11 px-5 rounded-xl font-black text-[9px] bg-rose-50 hover:bg-rose-100 text-rose-600 border-none transition-all flex items-center gap-2 group"
                        >
                            <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
                            Reset
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    )
}
