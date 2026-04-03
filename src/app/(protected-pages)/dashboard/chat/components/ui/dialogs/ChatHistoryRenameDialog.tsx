'use client'

import { useEffect, useState } from 'react'
import { Dialog, Input, Form, FormItem } from '@/components/ui'
import { Pencil, X, MessageSquare, Save } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
    selectRenameDialog,
    setRenameDialog,
    renameChat,
} from '@/store/slices/chat'

type FormSchema = {
    title: string
}

const validationSchema: ZodType<FormSchema> = z.object({
    title: z.string().min(1, 'Please enter a chat title'),
})

const ChatHistoryRenameDialog = () => {
    const dispatch = useAppDispatch()
    const renameDialog = useAppSelector(selectRenameDialog)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            title: renameDialog?.title,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (renameDialog?.open) {
            reset({
                title: renameDialog?.title,
            })
        }
    }, [renameDialog?.title, renameDialog?.open, reset])

    const handleDialogClose = () => {
        if (!isSubmitting) {
            dispatch(
                setRenameDialog({
                    id: '',
                    title: '',
                    open: false,
                }),
            )
        }
    }

    const onFormSubmit = async ({ title }: FormSchema) => {
        setIsSubmitting(true)
        try {
            await dispatch(
                renameChat({
                    chatId: renameDialog.id,
                    title,
                })
            ).unwrap()
            handleDialogClose()
        } catch (error) {
            console.error('Failed to rename chat:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={renameDialog?.open}
            onClose={handleDialogClose}
            closable={false}
            width={640}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
            contentClassName="!shadow-none"
        >
            <div className="relative">
                {/* Custom Header */}
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Pencil className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Rename Chat</h3>
                            <p className="text-[10px] font-black text-gray-400 mt-0.5">Adjust the identifier for this conversation</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDialogClose}
                        disabled={isSubmitting}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                <Form onSubmit={handleSubmit(onFormSubmit)}>
                    {/* Form Body */}
                    <div className="px-8 py-10">
                        <FormItem
                            invalid={Boolean(errors.title)}
                            errorMessage={errors.title?.message}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pl-1">
                                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                                    <label className="text-[10px] font-black text-gray-400">Chat Title</label>
                                </div>
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter new chat title..."
                                            autoComplete="off"
                                            className="rounded-2xl border-gray-100 dark:border-gray-800 h-14 text-base font-bold dark:bg-gray-800/50 focus:border-primary/30 transition-all"
                                        />
                                    )}
                                />
                            </div>
                        </FormItem>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 pb-8 pt-0 flex gap-4">
                        <button
                            type="button"
                            onClick={handleDialogClose}
                            disabled={isSubmitting}
                            className="flex-1 h-16 rounded-2xl border border-gray-100 dark:border-gray-800 text-[11px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 h-16 bg-primary hover:bg-primary-deep text-white font-black text-[11px] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Updating...</span>
                                </div>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 transition-transform group-hover:scale-110" />
                                    <span>Rename Chat</span>
                                </>
                            )}
                        </button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default ChatHistoryRenameDialog
