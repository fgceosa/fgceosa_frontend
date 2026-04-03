'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import { Lock, CheckCircle2 } from 'lucide-react'

type ResetPasswordFormSchema = {
    newPassword: string
    confirmPassword: string
}

export type OnResetPasswordSubmitPayload = {
    values: ResetPasswordFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
    setResetComplete?: (complete: boolean) => void
}

export type OnResetPasswordSubmit = (
    payload: OnResetPasswordSubmitPayload,
) => void

interface ResetPasswordFormProps extends CommonProps {
    onResetPasswordSubmit?: OnResetPasswordSubmit
    resetComplete: boolean
    setResetComplete: (complete: boolean) => void
    setMessage: (message: string) => void
}

const validationSchema: ZodType<ResetPasswordFormSchema> = z
    .object({
        newPassword: z.string({ required_error: 'Please enter your password' }).min(8, 'Minimum 8 characters required'),
        confirmPassword: z.string({
            required_error: 'Confirm Password Required',
        }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Your passwords do not match',
        path: ['confirmPassword'],
    })

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const {
        className,
        setMessage,
        setResetComplete,
        resetComplete,
        onResetPasswordSubmit,
        children,
    } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ResetPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const handleResetPassword = async (values: ResetPasswordFormSchema) => {
        if (onResetPasswordSubmit) {
            onResetPasswordSubmit({
                values,
                setSubmitting,
                setMessage,
                setResetComplete,
            })
        }
    }

    return (
        <div className={className}>
            {!resetComplete ? (
                <Form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6">
                    <FormItem
                        label="New Password"
                        invalid={Boolean(errors.newPassword)}
                        errorMessage={errors.newPassword?.message}
                    >
                        <Controller
                            name="newPassword"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <PasswordInput
                                        autoComplete="off"
                                        placeholder="••••••••••••"
                                        className="pl-11 rounded-xl h-12 text-sm font-bold bg-gray-50/50 focus:bg-white transition-all"
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Repeat Password"
                        invalid={Boolean(errors.confirmPassword)}
                        errorMessage={errors.confirmPassword?.message}
                    >
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <PasswordInput
                                        autoComplete="off"
                                        placeholder="Repeat Password"
                                        className="pl-11 rounded-xl h-12 text-sm font-bold bg-gray-50/50 focus:bg-white transition-all"
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                    <Button
                        block
                        loading={isSubmitting}
                        variant="solid"
                        type="submit"
                        className="h-14 bg-primary hover:bg-primary-deep text-white font-bold text-sm rounded-[1.2rem] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isSubmitting ? 'Updating password...' : 'Reset Password'}
                    </Button>
                </Form>
            ) : (
                <>{children}</>
            )}
        </div>
    )
}

export default ResetPasswordForm
