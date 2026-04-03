'use client'

import { useRef, useEffect, useCallback, useMemo } from 'react'
import {
    apexLineChartDefaultOption,
    apexBarChartDefaultOption,
    apexAreaChartDefaultOption,
    apexDonutChartDefaultOption,
    apexRadarChartDefultOption,
} from '@/configs/chart.config'
import { DIR_RTL } from '@/constants/theme.constant'
import dynamic from 'next/dynamic'
import type { ApexOptions } from 'apexcharts'
import type { Direction } from '@/@types/theme'
import type { ReactNode, Ref } from 'react'

import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'

const notDonut = ['line', 'bar', 'area']

type ChartType = 'line' | 'bar' | 'area' | 'donut' | 'radar'

export interface ChartProps {
    id?: string
    series?: ApexOptions['series']
    width?: string | number
    height?: string | number
    /* eslint-disable @typescript-eslint/no-explicit-any */
    xAxis?: any
    customOptions?: ApexOptions
    type?: ChartType
    direction?: Direction
    donutTitle?: string | ReactNode
    donutText?: string | ReactNode
    className?: string
    ref?: Ref<ChartRef>
}

export type ChartRef = {
    rerender: () => void
}

const ApexChart = dynamic(
    () => import('react-apexcharts').then((mod) => mod.default),
    {
        ssr: false,
    },
)

const Chart = (props: ChartProps) => {
    const {
        series = [],
        width = '100%',
        height = 300,
        xAxis,
        customOptions,
        type = 'line',
        direction,
        donutTitle,
        donutText,
        className,
        ...rest
    } = props

    const chartRef = useRef<HTMLDivElement>(null)

    const chartDefaultOption = useMemo(() => {
        switch (type) {
            case 'line':
                return apexLineChartDefaultOption
            case 'bar':
                return apexBarChartDefaultOption
            case 'area':
                return apexAreaChartDefaultOption
            case 'donut':
                return apexDonutChartDefaultOption
            case 'radar':
                return apexRadarChartDefultOption
            default:
                return apexLineChartDefaultOption
        }
    }, [type])

    // Create a deep copy to avoid frozen/non-extensible object issues
    let options: ApexOptions = cloneDeep(chartDefaultOption)

    const setLegendOffset = useCallback(() => {
        const isMobile = window.innerWidth < 768
        if (chartRef.current) {
            const lengend = chartRef.current.querySelectorAll<HTMLDivElement>(
                'div.apexcharts-legend',
            )[0]
            if (direction === DIR_RTL && lengend?.style) {
                lengend.style.right = 'auto'
                lengend.style.left = '0'
            }
            if (isMobile && lengend?.style) {
                lengend.style.position = 'relative'
                lengend.style.top = '0'
                lengend.style.justifyContent = 'start'
                lengend.style.padding = '0'
            }
        }
    }, [direction])

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            notDonut.includes(type as ChartType)
        ) {
            setLegendOffset()
        }
    }, [type, setLegendOffset])

    if (notDonut.includes(type as ChartType)) {
        if (!options.xaxis) {
            options.xaxis = {}
        }
        options.xaxis.categories = xAxis || []
    }

    if (customOptions) {
        options = merge(options, customOptions)
    }

    // Sanitize series data to prevent NaN issues in ApexCharts
    const sanitizeSeries = (seriesData: any): any => {
        if (!seriesData) return []
        return cloneDeep(seriesData).map((s: any) => {
            if (s && typeof s === 'object' && 'data' in s) {
                return {
                    ...s,
                    data: (s.data || []).map((val: any) => {
                        const num = parseFloat(val)
                        return isNaN(num) ? 0 : num
                    })
                }
            }
            const num = parseFloat(s)
            return isNaN(num) ? 0 : num
        })
    }

    const clonedSeries = useMemo(() => sanitizeSeries(series), [series])

    // Ensure height and width are not NaN or invalid
    const chartHeight = useMemo(() => {
        if (typeof height === 'string' && height.includes('%')) return height
        const numHeight = parseFloat(height as string)
        return isNaN(numHeight) ? 300 : numHeight
    }, [height])

    const chartWidth = useMemo(() => {
        if (typeof width === 'string' && width.includes('%')) return width
        const numWidth = parseFloat(width as string)
        return isNaN(numWidth) ? '100%' : numWidth
    }, [width])

    if (type === 'donut') {
        if (!options.plotOptions) options.plotOptions = {}
        if (!options.plotOptions.pie) options.plotOptions.pie = {}
        if (!options.plotOptions.pie.donut) options.plotOptions.pie.donut = {}
        if (!options.plotOptions.pie.donut.labels)
            options.plotOptions.pie.donut.labels = {}
        if (!options.plotOptions.pie.donut.labels.total)
            options.plotOptions.pie.donut.labels.total = {}

        if (donutTitle) {
            options.plotOptions.pie.donut.labels.total.label =
                donutTitle as string
        }
        if (donutText) {
            options.plotOptions.pie.donut.labels.total.formatter = () =>
                donutText as string
        }
    }

    return (
        <div
            ref={chartRef}
            style={direction === DIR_RTL ? { direction: 'ltr' } : {}}
        >
            <ApexChart
                options={options}
                type={type}
                series={clonedSeries}
                width={chartWidth}
                height={chartHeight}
                className={className}
                {...rest}
            />
        </div>
    )
}

export default Chart
