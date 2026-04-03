'use client'

import React from 'react'
import { Card } from '@/components/ui'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
    { name: 'Sales', value: 40, color: '#0055BA' },
    { name: 'Support', value: 25, color: '#0088FE' },
    { name: 'Eng', value: 20, color: '#00C49F' },
    { name: 'Other', value: 15, color: '#FFBB28' },
]

export default function TeamInsights() {
    return (
        <Card className="rounded-[2.5rem] border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none p-8">
            <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-8">
                Team Insights
            </h3>

            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full h-48 md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="w-full md:w-1/2 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-gray-400">Top Departments</span>
                    </div>
                    {data.map((item) => (
                        <div key={item.name} className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs font-black text-gray-700 dark:text-gray-300">{item.name}</span>
                                </div>
                                <span className="text-xs font-black text-gray-900 dark:text-gray-100">{item.value}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}
