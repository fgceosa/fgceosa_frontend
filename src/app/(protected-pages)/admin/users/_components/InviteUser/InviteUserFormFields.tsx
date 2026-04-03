import { FormItem, Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Controller, UseFormReturn } from 'react-hook-form'
import { User, Mail, Shield } from 'lucide-react'
import { CustomRoleOption, CustomMultiValueLabel } from './UserRoleSelect'
import { BASIC_ROLES } from '../../data/basicRoles'
import type { InviteUserFormData } from '../../types'

interface InviteUserFormFieldsProps {
    formMethods: UseFormReturn<InviteUserFormData>
    onSubmit: (data: InviteUserFormData) => void
}

export default function InviteUserFormFields({ formMethods, onSubmit }: InviteUserFormFieldsProps) {
    const { control, handleSubmit, formState: { errors } } = formMethods

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
                {/* Full Name */}
                <FormItem
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <div className="flex items-center gap-2 pl-1 mb-2">
                        <User className="w-3.5 h-3.5 text-primary" />
                        <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Full Name</label>
                    </div>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Full name is required' }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                className="h-14 bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all rounded-2xl font-bold text-base"
                                placeholder="John Doe"
                            />
                        )}
                    />
                </FormItem>

                {/* Email Address */}
                <FormItem
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <div className="flex items-center gap-2 pl-1 mb-2">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Email Address</label>
                    </div>
                    <Controller
                        name="email"
                        control={control}
                        rules={{ required: 'Email address is required' }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="email"
                                className="h-14 bg-gray-50/50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-all rounded-2xl font-bold text-base"
                                placeholder="email@company.com"
                            />
                        )}
                    />
                </FormItem>

                {/* Role Selection */}
                <FormItem
                    invalid={Boolean(errors.role)}
                    errorMessage={errors.role?.message}
                >
                    <div className="flex items-center gap-2 pl-1 mb-2">
                        <Shield className="w-3.5 h-3.5 text-primary" />
                        <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Role</label>
                    </div>
                    <Controller
                        name="role"
                        control={control}
                        rules={{ required: 'Please select a role' }}
                        render={({ field }) => (
                            <Select<any>
                                instanceId="role-select"
                                placeholder="Select a role"
                                components={{
                                    Option: CustomRoleOption as any,
                                }}
                                className="rounded-2xl font-bold text-base"
                                value={field.value}
                                options={BASIC_ROLES}
                                onChange={field.onChange}
                                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                                menuPosition="fixed"
                                styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                }}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Form>
    )
}
