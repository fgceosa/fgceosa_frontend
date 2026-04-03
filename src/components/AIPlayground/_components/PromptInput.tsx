'use client'

import { Dispatch, SetStateAction } from 'react'
import { Send } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import classNames from '@/utils/classNames'
import Loading from '@/components/shared/Loading'

interface PromptInputProps {
    prompt: string
    setPrompt: Dispatch<SetStateAction<string>>
    handleSubmit: () => void
    isLoading: boolean
}

export default function PromptInput({
    prompt,
    setPrompt,
    handleSubmit,
    isLoading,
}: PromptInputProps) {
    return (
        <Card className="p-0 border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10">
                        <Send className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Your Message</h3>
                        <p className="text-[10px] text-gray-400 font-bold">Type your question or instruction</p>
                    </div>
                </div>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
                <div className="relative group">
                    <Input
                        placeholder="What would you like to ask or create today?"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        textArea
                        rows={8}
                        className="w-full rounded-2xl border-gray-200 dark:border-gray-700 p-5 min-h-[160px] bg-gray-50/30 dark:bg-gray-800/20 focus:bg-white dark:focus:bg-gray-900 transition-all focus:ring-4 focus:ring-primary/5 text-base font-medium resize-none shadow-inner"
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-3">
                        <div className="px-3 py-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-opacity group-hover:opacity-100">
                            <p className="text-[10px] font-black text-gray-400">
                                {prompt.length} Chars | {Math.ceil(prompt.length / 4)} Units
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4 sm:gap-0">
                    <div className="w-full sm:w-auto flex justify-center sm:justify-start items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-gray-500">Ready to Send</span>
                    </div>

                    <Button
                        variant="solid"
                        onClick={handleSubmit}
                        disabled={!prompt.trim() || isLoading}
                        className={classNames(
                            'w-full sm:w-auto h-14 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-primary-deep text-white font-black text-sm sm:text-[10px] rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95 group flex items-center justify-center gap-2',
                            isLoading && 'opacity-70 cursor-not-allowed'
                        )}
                    >
                        {isLoading ? (
                            <Loading loading={isLoading} />
                        ) : (
                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        )}
                        <span>{isLoading ? 'AI is Thinking...' : 'Get Answer'}</span>
                    </Button>
                </div>
            </div>
        </Card>
    )
}
