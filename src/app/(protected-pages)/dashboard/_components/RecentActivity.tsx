'use client'

import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import type { RecentActivityItem } from '../types'
import { Card } from '@/components/ui'
import classNames from '@/utils/classNames'

type RecentActivityProps = {
    data: RecentActivityItem[]
}

const RecentActivity = ({ data }: RecentActivityProps) => {
    const [activities, setActivities] = useState<RecentActivityItem[]>([])

    useEffect(() => {
        if (activities.length === 0) {
            setActivities(data)
        }
    }, [data, activities.length])

    return (
        <Card>
            <div className="fle flex-ro items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                    Recent Activity
                </h4>
                <p>Your latest API calls and account activities:</p>
            </div>

            <div className="space-y-4">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={classNames(
                                    'w-2 h-2 rounded-full',
                                    activity.success
                                        ? 'bg-emerald-500'
                                        : 'bg-red-500',
                                )}
                            />

                            <div>
                                <p className=" font-medium text-gray-800 dark:text-gray-100">
                                    {activity.type}
                                </p>

                                <p className="text-gray-500 dark:text-gray-400">
                                    {activity.model ||
                                        activity.user ||
                                        activity.amount ||
                                        activity.cost ||
                                        0}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className={classNames(
                                "font-medium",
                                (activity.amount?.startsWith('-') || activity.cost?.startsWith('-'))
                                    ? 'text-red-600 dark:text-red-400'
                                    : (activity.amount?.startsWith('+') || activity.cost?.startsWith('+'))
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-gray-700 dark:text-gray-200'
                            )}>
                                {activity.cost || activity.amount || activity.status || ''}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                                {activity.time
                                    ? activity.time
                                    : dayjs().format('MMM D, h:mm A')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default RecentActivity
