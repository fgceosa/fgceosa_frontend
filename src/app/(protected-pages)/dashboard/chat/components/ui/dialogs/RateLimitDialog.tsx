'use client'

import { HiOutlineClock } from 'react-icons/hi'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

interface RateLimitDialogProps {
    isOpen: boolean
    onClose: () => void
    retryAfter?: number // seconds
}

const RateLimitDialog = ({ isOpen, onClose, retryAfter = 60 }: RateLimitDialogProps) => {
    return (
        <Dialog 
            isOpen={isOpen} 
            onClose={onClose}
            contentClassName="pb-0 px-0"
            width={480}
        >
            <div className="px-6 pb-6 pt-2 flex">
                <div>
                    <Avatar
                        className="bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-100"
                        shape="circle"
                    >
                        <span className="text-2xl">
                            <HiOutlineClock />
                        </span>
                    </Avatar>
                </div>
                <div className="ml-4 rtl:mr-4">
                    <h5 className="mb-2">Rate Limit Reached</h5>
                    <p className="text-sm leading-relaxed">
                        You&apos;ve made too many requests in a short time. 
                        The free tier has rate limits to ensure fair usage for everyone.
                    </p>
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm font-medium mb-2">What you can do:</p>
                        <ul className="text-sm space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                            <li>Wait about {retryAfter} seconds and try again</li>
                            <li>Space out your messages more</li>
                            <li>Add credits to your OpenRouter account for higher limits</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-2xl rounded-br-2xl">
                <div className="flex justify-end items-center gap-2">
                    <Button
                        size="sm"
                        variant="solid"
                        onClick={onClose}
                    >
                        Got it
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default RateLimitDialog
