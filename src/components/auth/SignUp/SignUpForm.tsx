'use client'

import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Segment from '@/components/ui/Segment'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import { User, Building2, Mail, Lock, CheckCircle2 } from 'lucide-react'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'

type SignUpFormSchema = {
    userName: string
    password: string
    email: string
    confirmPassword: string
    accountType: 'individual' | 'organization'
    organizationName?: string
    acceptTerms: boolean
}

export type OnSignUpPayload = {
    values: SignUpFormSchema
    setSubmitting: (isSubmitting: boolean) => void
    setMessage: (message: string) => void
}

export type OnSignUp = (payload: OnSignUpPayload) => void

interface SignUpFormProps extends CommonProps {
    setMessage: (message: string) => void
    onSignUp?: OnSignUp
    defaultValues?: Partial<SignUpFormSchema>
}

const validationSchema: ZodType<SignUpFormSchema> = z
    .object({
        email: z
            .string({ required_error: 'Please enter your email' })
            .email('Please enter a valid email address'),
        userName: z
            .string({ required_error: 'Please enter your name' })
            .min(1, 'Name is required'),
        password: z
            .string({ required_error: 'Password Required' })
            .min(8, 'Password must be at least 8 characters long'),
        confirmPassword: z.string({
            required_error: 'Confirm Password Required',
        }),
        accountType: z.enum(['individual', 'organization']),
        organizationName: z.string().optional(),
        acceptTerms: z.literal(true, {
            errorMap: () => ({ message: 'You must accept the terms and conditions' }),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
    .refine((data) => {
        if (data.accountType === 'organization' && !data.organizationName) {
            return false
        }
        return true
    }, {
        message: 'Organization name is required',
        path: ['organizationName'],
    })

const SignUpForm = (props: SignUpFormProps) => {
    const { onSignUp, className, setMessage, defaultValues } = props

    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
        reset,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            accountType: 'individual',
            acceptTerms: false,
            ...defaultValues
        }
    })

    useEffect(() => {
        if (defaultValues) {
            reset((prev) => ({
                ...prev,
                ...defaultValues,
            }))
        }
    }, [defaultValues, reset])

    const accountType = watch('accountType')

    const handleSignUp = async (values: SignUpFormSchema) => {
        if (onSignUp) {
            onSignUp({ values, setSubmitting, setMessage })
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(handleSignUp)} className="space-y-6">
                {!defaultValues?.email && (
                    <FormItem
                        label="I am signing up as"
                        invalid={Boolean(errors.accountType)}
                        errorMessage={errors.accountType?.message}
                    >
                        <Controller
                            name="accountType"
                            control={control}
                            render={({ field }) => (
                                <div className="w-full bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-2xl flex gap-1">
                                    <div
                                        className={classNames(
                                            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-300",
                                            field.value === 'individual' ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                                        )}
                                        onClick={() => field.onChange('individual')}
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="text-xs font-bold">Personal</span>
                                    </div>
                                    <div
                                        className={classNames(
                                            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-300",
                                            field.value === 'organization' ? "bg-white dark:bg-gray-700 text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                                        )}
                                        onClick={() => field.onChange('organization')}
                                    >
                                        <Building2 className="w-4 h-4" />
                                        <span className="text-xs font-bold">Company</span>
                                    </div>
                                </div>
                            )}
                        />
                    </FormItem>
                )}

                {accountType === 'organization' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                        <FormItem
                            label="Company Name"
                            invalid={Boolean(errors.organizationName)}
                            errorMessage={errors.organizationName?.message}
                        >
                            <Controller
                                name="organizationName"
                                control={control}
                                render={({ field }) => (
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <Input
                                            type="text"
                                            placeholder="Acme Corp"
                                            autoComplete="off"
                                            className="pl-11 rounded-xl h-12 text-sm font-bold"
                                            {...field}
                                        />
                                    </div>
                                )}
                            />
                        </FormItem>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                        label="Your Name"
                        invalid={Boolean(errors.userName)}
                        errorMessage={errors.userName?.message}
                    >
                        <Controller
                            name="userName"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="John Doe"
                                        autoComplete="off"
                                        className="pl-11 rounded-xl h-12 text-sm font-bold"
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
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
                                        placeholder="john@example.com"
                                        autoComplete="off"
                                        className="pl-11 rounded-xl h-12 text-sm font-bold"
                                        disabled={!!defaultValues?.email}
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem
                        label="Password"
                        invalid={Boolean(errors.password)}
                        errorMessage={errors.password?.message}
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <PasswordInput
                                        autoComplete="off"
                                        placeholder="••••••••"
                                        className="pl-11 rounded-xl h-12 text-sm font-bold"
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
                                        placeholder="••••••••"
                                        className="pl-11 rounded-xl h-12 text-sm font-bold"
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                </div>

                <div className="pt-2">
                    <Controller
                        name="acceptTerms"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value}
                                onChange={(val) => field.onChange(val)}
                                className="items-start"
                            >
                                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-tight block pt-0.5">
                                    I agree to the{' '}
                                    <a href="/terms" className="text-primary font-bold hover:underline px-1">
                                        Terms & Conditions
                                    </a>{' '}
                                    and{' '}
                                    <a href="/privacy" className="text-primary font-bold hover:underline">
                                        Privacy Policy
                                    </a>
                                </span>
                            </Checkbox>
                        )}
                    />
                    {errors.acceptTerms && (
                        <p className="text-xs text-rose-600 font-bold mt-1 tracking-tight">{errors.acceptTerms.message}</p>
                    )}

                </div>

                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                    className="h-14 bg-primary hover:bg-primary-deep text-white font-bold text-sm rounded-[1.2rem] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                >
                    {isSubmitting ? 'Creating your account...' : 'Create Account'}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm
