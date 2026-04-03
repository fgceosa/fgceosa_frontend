'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import { Mail } from 'lucide-react'

type ForgotPasswordFormSchema = {
    email: string
}

export type OnForgotPasswordSubmitPayload = {
    values: ForgotPasswordFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
    setEmailSent: (complete: boolean) => void
}

export type OnForgotPasswordSubmit = (
    payload: OnForgotPasswordSubmitPayload,
) => void

interface ForgotPasswordFormProps extends CommonProps {
    onForgotPasswordSubmit?: OnForgotPasswordSubmit
    emailSent: boolean
    setEmailSent: (compplete: boolean) => void
    setMessage: (message: string) => void
}

const validationSchema: ZodType<ForgotPasswordFormSchema> = z.object({
    email: z.string().email().min(5),
})

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const {
        className,
        onForgotPasswordSubmit,
        setMessage,
        setEmailSent,
        emailSent,
        children,
    } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ForgotPasswordFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const onForgotPassword = async (values: ForgotPasswordFormSchema) => {
        if (onForgotPasswordSubmit) {
            onForgotPasswordSubmit({
                values,
                setSubmitting,
                setMessage,
                setEmailSent,
            })
        }
    }

    return (
        <div className={className}>
            {!emailSent ? (
                <Form onSubmit={handleSubmit(onForgotPassword)} className="space-y-6">
                    <FormItem
                        label="Email Address"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        autoComplete="off"
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
                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </Form>
            ) : (
                <>{children}</>
            )}
        </div>
    )
}

export default ForgotPasswordForm
