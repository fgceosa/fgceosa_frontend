'use client'

import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Select from '@/components/ui/Select'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import { User, Mail, Lock, CheckCircle2, Phone, MapPin, Globe } from 'lucide-react'
import PasswordInput from '@/components/shared/PasswordInput'

type SignUpFormSchema = {
    firstName: string
    lastName: string
    nickname: string
    password: string
    confirmPassword: string
    phoneNumber: string
    gender: string
    email: string
    alternativeEmail: string
    fgceSet: string
    fgceHouse: string
    city: string
    country: string
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

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
]

const fgceHouseOptions = [
    { value: 'nnamdi_azikiwe', label: 'Nnamdi Azikiwe' },
    { value: 'obafemi_awolowo', label: 'Obafemi Awolowo' },
    { value: 'ahmadu_bello', label: 'Ahmadu Bello' },
    { value: 'tafawa_balewa', label: 'Tafawa Balewa' },
]

const countryOptions = [
    { value: 'AF', label: 'Afghanistan' },
    { value: 'AL', label: 'Albania' },
    { value: 'DZ', label: 'Algeria' },
    { value: 'AD', label: 'Andorra' },
    { value: 'AO', label: 'Angola' },
    { value: 'AG', label: 'Antigua and Barbuda' },
    { value: 'AR', label: 'Argentina' },
    { value: 'AM', label: 'Armenia' },
    { value: 'AU', label: 'Australia' },
    { value: 'AT', label: 'Austria' },
    { value: 'AZ', label: 'Azerbaijan' },
    { value: 'BS', label: 'Bahamas' },
    { value: 'BH', label: 'Bahrain' },
    { value: 'BD', label: 'Bangladesh' },
    { value: 'BB', label: 'Barbados' },
    { value: 'BY', label: 'Belarus' },
    { value: 'BE', label: 'Belgium' },
    { value: 'BZ', label: 'Belize' },
    { value: 'BJ', label: 'Benin' },
    { value: 'BT', label: 'Bhutan' },
    { value: 'BO', label: 'Bolivia' },
    { value: 'BA', label: 'Bosnia and Herzegovina' },
    { value: 'BW', label: 'Botswana' },
    { value: 'BR', label: 'Brazil' },
    { value: 'BN', label: 'Brunei' },
    { value: 'BG', label: 'Bulgaria' },
    { value: 'BF', label: 'Burkina Faso' },
    { value: 'BI', label: 'Burundi' },
    { value: 'CV', label: 'Cabo Verde' },
    { value: 'KH', label: 'Cambodia' },
    { value: 'CM', label: 'Cameroon' },
    { value: 'CA', label: 'Canada' },
    { value: 'CF', label: 'Central African Republic' },
    { value: 'TD', label: 'Chad' },
    { value: 'CL', label: 'Chile' },
    { value: 'CN', label: 'China' },
    { value: 'CO', label: 'Colombia' },
    { value: 'KM', label: 'Comoros' },
    { value: 'CG', label: 'Congo' },
    { value: 'CD', label: 'Congo (DRC)' },
    { value: 'CR', label: 'Costa Rica' },
    { value: 'CI', label: "Côte d'Ivoire" },
    { value: 'HR', label: 'Croatia' },
    { value: 'CU', label: 'Cuba' },
    { value: 'CY', label: 'Cyprus' },
    { value: 'CZ', label: 'Czech Republic' },
    { value: 'DK', label: 'Denmark' },
    { value: 'DJ', label: 'Djibouti' },
    { value: 'DM', label: 'Dominica' },
    { value: 'DO', label: 'Dominican Republic' },
    { value: 'EC', label: 'Ecuador' },
    { value: 'EG', label: 'Egypt' },
    { value: 'SV', label: 'El Salvador' },
    { value: 'GQ', label: 'Equatorial Guinea' },
    { value: 'ER', label: 'Eritrea' },
    { value: 'EE', label: 'Estonia' },
    { value: 'SZ', label: 'Eswatini' },
    { value: 'ET', label: 'Ethiopia' },
    { value: 'FJ', label: 'Fiji' },
    { value: 'FI', label: 'Finland' },
    { value: 'FR', label: 'France' },
    { value: 'GA', label: 'Gabon' },
    { value: 'GM', label: 'Gambia' },
    { value: 'GE', label: 'Georgia' },
    { value: 'DE', label: 'Germany' },
    { value: 'GH', label: 'Ghana' },
    { value: 'GR', label: 'Greece' },
    { value: 'GD', label: 'Grenada' },
    { value: 'GT', label: 'Guatemala' },
    { value: 'GN', label: 'Guinea' },
    { value: 'GW', label: 'Guinea-Bissau' },
    { value: 'GY', label: 'Guyana' },
    { value: 'HT', label: 'Haiti' },
    { value: 'HN', label: 'Honduras' },
    { value: 'HU', label: 'Hungary' },
    { value: 'IS', label: 'Iceland' },
    { value: 'IN', label: 'India' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'IR', label: 'Iran' },
    { value: 'IQ', label: 'Iraq' },
    { value: 'IE', label: 'Ireland' },
    { value: 'IL', label: 'Israel' },
    { value: 'IT', label: 'Italy' },
    { value: 'JM', label: 'Jamaica' },
    { value: 'JP', label: 'Japan' },
    { value: 'JO', label: 'Jordan' },
    { value: 'KZ', label: 'Kazakhstan' },
    { value: 'KE', label: 'Kenya' },
    { value: 'KI', label: 'Kiribati' },
    { value: 'KP', label: 'Korea (North)' },
    { value: 'KR', label: 'Korea (South)' },
    { value: 'KW', label: 'Kuwait' },
    { value: 'KG', label: 'Kyrgyzstan' },
    { value: 'LA', label: 'Laos' },
    { value: 'LV', label: 'Latvia' },
    { value: 'LB', label: 'Lebanon' },
    { value: 'LS', label: 'Lesotho' },
    { value: 'LR', label: 'Liberia' },
    { value: 'LY', label: 'Libya' },
    { value: 'LI', label: 'Liechtenstein' },
    { value: 'LT', label: 'Lithuania' },
    { value: 'LU', label: 'Luxembourg' },
    { value: 'MG', label: 'Madagascar' },
    { value: 'MW', label: 'Malawi' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'MV', label: 'Maldives' },
    { value: 'ML', label: 'Mali' },
    { value: 'MT', label: 'Malta' },
    { value: 'MH', label: 'Marshall Islands' },
    { value: 'MR', label: 'Mauritania' },
    { value: 'MU', label: 'Mauritius' },
    { value: 'MX', label: 'Mexico' },
    { value: 'FM', label: 'Micronesia' },
    { value: 'MD', label: 'Moldova' },
    { value: 'MC', label: 'Monaco' },
    { value: 'MN', label: 'Mongolia' },
    { value: 'ME', label: 'Montenegro' },
    { value: 'MA', label: 'Morocco' },
    { value: 'MZ', label: 'Mozambique' },
    { value: 'MM', label: 'Myanmar' },
    { value: 'NA', label: 'Namibia' },
    { value: 'NR', label: 'Nauru' },
    { value: 'NP', label: 'Nepal' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'NZ', label: 'New Zealand' },
    { value: 'NI', label: 'Nicaragua' },
    { value: 'NE', label: 'Niger' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'MK', label: 'North Macedonia' },
    { value: 'NO', label: 'Norway' },
    { value: 'OM', label: 'Oman' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'PW', label: 'Palau' },
    { value: 'PA', label: 'Panama' },
    { value: 'PG', label: 'Papua New Guinea' },
    { value: 'PY', label: 'Paraguay' },
    { value: 'PE', label: 'Peru' },
    { value: 'PH', label: 'Philippines' },
    { value: 'PL', label: 'Poland' },
    { value: 'PT', label: 'Portugal' },
    { value: 'QA', label: 'Qatar' },
    { value: 'RO', label: 'Romania' },
    { value: 'RU', label: 'Russia' },
    { value: 'RW', label: 'Rwanda' },
    { value: 'KN', label: 'Saint Kitts and Nevis' },
    { value: 'LC', label: 'Saint Lucia' },
    { value: 'VC', label: 'Saint Vincent and the Grenadines' },
    { value: 'WS', label: 'Samoa' },
    { value: 'SM', label: 'San Marino' },
    { value: 'ST', label: 'São Tomé and Príncipe' },
    { value: 'SA', label: 'Saudi Arabia' },
    { value: 'SN', label: 'Senegal' },
    { value: 'RS', label: 'Serbia' },
    { value: 'SC', label: 'Seychelles' },
    { value: 'SL', label: 'Sierra Leone' },
    { value: 'SG', label: 'Singapore' },
    { value: 'SK', label: 'Slovakia' },
    { value: 'SI', label: 'Slovenia' },
    { value: 'SB', label: 'Solomon Islands' },
    { value: 'SO', label: 'Somalia' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'SS', label: 'South Sudan' },
    { value: 'ES', label: 'Spain' },
    { value: 'LK', label: 'Sri Lanka' },
    { value: 'SD', label: 'Sudan' },
    { value: 'SR', label: 'Suriname' },
    { value: 'SE', label: 'Sweden' },
    { value: 'CH', label: 'Switzerland' },
    { value: 'SY', label: 'Syria' },
    { value: 'TW', label: 'Taiwan' },
    { value: 'TJ', label: 'Tajikistan' },
    { value: 'TZ', label: 'Tanzania' },
    { value: 'TH', label: 'Thailand' },
    { value: 'TL', label: 'Timor-Leste' },
    { value: 'TG', label: 'Togo' },
    { value: 'TO', label: 'Tonga' },
    { value: 'TT', label: 'Trinidad and Tobago' },
    { value: 'TN', label: 'Tunisia' },
    { value: 'TR', label: 'Turkey' },
    { value: 'TM', label: 'Turkmenistan' },
    { value: 'TV', label: 'Tuvalu' },
    { value: 'UG', label: 'Uganda' },
    { value: 'UA', label: 'Ukraine' },
    { value: 'AE', label: 'United Arab Emirates' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'US', label: 'United States' },
    { value: 'UY', label: 'Uruguay' },
    { value: 'UZ', label: 'Uzbekistan' },
    { value: 'VU', label: 'Vanuatu' },
    { value: 'VA', label: 'Vatican City' },
    { value: 'VE', label: 'Venezuela' },
    { value: 'VN', label: 'Vietnam' },
    { value: 'YE', label: 'Yemen' },
    { value: 'ZM', label: 'Zambia' },
    { value: 'ZW', label: 'Zimbabwe' },
]

const validationSchema = z
    .object({
        firstName: z
            .string({ required_error: 'First name is required' })
            .min(1, 'First name is required'),
        lastName: z
            .string({ required_error: 'Last name is required' })
            .min(1, 'Last name is required'),
        nickname: z.string().default(''),
        password: z
            .string({ required_error: 'Password is required' })
            .min(8, 'Password must be at least 8 characters long'),
        confirmPassword: z.string({
            required_error: 'Please confirm your password',
        }),
        phoneNumber: z.string().default(''),
        gender: z
            .string({ required_error: 'Gender is required' })
            .min(1, 'Gender is required'),
        email: z
            .string({ required_error: 'Email address is required' })
            .email('Please enter a valid email address'),
        alternativeEmail: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
        fgceSet: z
            .string({ required_error: 'FGCE Set is required' })
            .min(1, 'FGCE Set is required'),
        fgceHouse: z
            .string({ required_error: 'FGCE House is required' })
            .min(1, 'FGCE House is required'),
        city: z
            .string({ required_error: 'City is required' })
            .min(1, 'City is required'),
        country: z
            .string({ required_error: 'Country is required' })
            .min(1, 'Country is required'),
        acceptTerms: z.literal(true, {
            errorMap: () => ({ message: 'You must accept the privacy policy' }),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

const inputClass = 'rounded-xl h-12 text-sm'
const labelClass = 'font-bold text-gray-900'

const SignUpForm = (props: SignUpFormProps) => {
    const { onSignUp, className, setMessage, defaultValues } = props

    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            nickname: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            gender: '',
            email: '',
            alternativeEmail: '',
            fgceSet: '',
            fgceHouse: '',
            city: '',
            country: '',
            acceptTerms: false,
            ...defaultValues,
        },
    })

    useEffect(() => {
        if (defaultValues) {
            reset((prev) => ({
                ...prev,
                ...defaultValues,
            }))
        }
    }, [defaultValues, reset])

    const handleSignUp = async (values: SignUpFormSchema) => {
        if (onSignUp) {
            onSignUp({ values, setSubmitting, setMessage })
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(handleSignUp)} className="space-y-5">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormItem
                        label="First Name *"
                        labelClass={labelClass}
                        invalid={Boolean(errors.firstName)}
                        errorMessage={errors.firstName?.message}
                    >
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B0000] transition-colors">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Obinna"
                                        autoComplete="given-name"
                                        className={`pl-11 ${inputClass}`}
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Last Name *"
                        labelClass={labelClass}
                        invalid={Boolean(errors.lastName)}
                        errorMessage={errors.lastName?.message}
                    >
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B0000] transition-colors">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Okeke"
                                        autoComplete="family-name"
                                        className={`pl-11 ${inputClass}`}
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                </div>

                {/* Nickname */}
                <FormItem
                    label="Nickname"
                    labelClass={labelClass}
                    invalid={Boolean(errors.nickname)}
                    errorMessage={errors.nickname?.message}
                >
                    <Controller
                        name="nickname"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="e.g. Obi"
                                autoComplete="off"
                                className={inputClass}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Email & Alternative Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormItem
                        label="Email Address *"
                        labelClass={labelClass}
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B0000] transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder="obinna@example.com"
                                        autoComplete="email"
                                        className={`pl-11 ${inputClass}`}
                                        disabled={!!defaultValues?.email}
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Alternative Email (Optional)"
                        labelClass={labelClass}
                        invalid={Boolean(errors.alternativeEmail)}
                        errorMessage={errors.alternativeEmail?.message}
                    >
                        <Controller
                            name="alternativeEmail"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B0000] transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder="alt@example.com"
                                        autoComplete="off"
                                        className={`pl-11 ${inputClass}`}
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                </div>

                {/* Phone Number & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormItem
                        label="Phone Number"
                        labelClass={labelClass}
                        invalid={Boolean(errors.phoneNumber)}
                        errorMessage={errors.phoneNumber?.message}
                    >
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B0000] transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <Input
                                        type="tel"
                                        placeholder="+234 800 000 0000"
                                        autoComplete="tel"
                                        className={`pl-11 ${inputClass}`}
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Gender *"
                        labelClass={labelClass}
                        invalid={Boolean(errors.gender)}
                        errorMessage={errors.gender?.message}
                    >
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Select gender"
                                    options={genderOptions}
                                    value={genderOptions.find((o) => o.value === field.value) || null}
                                    onChange={(option) => field.onChange(option?.value || '')}
                                />
                            )}
                        />
                    </FormItem>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormItem
                        label="Password *"
                        labelClass={labelClass}
                        invalid={Boolean(errors.password)}
                        errorMessage={errors.password?.message}
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B0000] transition-colors z-10">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <PasswordInput
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className={`pl-11 ${inputClass}`}
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Confirm Password *"
                        labelClass={labelClass}
                        invalid={Boolean(errors.confirmPassword)}
                        errorMessage={errors.confirmPassword?.message}
                    >
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B0000] transition-colors z-10">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <PasswordInput
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className={`pl-11 ${inputClass}`}
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                </div>

                {/* FGCE Set & House */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormItem
                        label="FGCE Set *"
                        labelClass={labelClass}
                        invalid={Boolean(errors.fgceSet)}
                        errorMessage={errors.fgceSet?.message}
                    >
                        <Controller
                            name="fgceSet"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="e.g. Set 2005"
                                    autoComplete="off"
                                    className={inputClass}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="FGCE House *"
                        labelClass={labelClass}
                        invalid={Boolean(errors.fgceHouse)}
                        errorMessage={errors.fgceHouse?.message}
                    >
                        <Controller
                            name="fgceHouse"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Select house"
                                    options={fgceHouseOptions}
                                    value={fgceHouseOptions.find((o) => o.value === field.value) || null}
                                    onChange={(option) => field.onChange(option?.value || '')}
                                />
                            )}
                        />
                    </FormItem>
                </div>

                {/* City & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormItem
                        label="City *"
                        labelClass={labelClass}
                        invalid={Boolean(errors.city)}
                        errorMessage={errors.city?.message}
                    >
                        <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B0000] transition-colors">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="e.g. Enugu"
                                        autoComplete="address-level2"
                                        className={`pl-11 ${inputClass}`}
                                        {...field}
                                    />
                                </div>
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Country *"
                        labelClass={labelClass}
                        invalid={Boolean(errors.country)}
                        errorMessage={errors.country?.message}
                    >
                        <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Select country"
                                    options={countryOptions}
                                    value={countryOptions.find((o) => o.value === field.value) || null}
                                    onChange={(option) => field.onChange(option?.value || '')}
                                    isClearable
                                />
                            )}
                        />
                    </FormItem>
                </div>

                {/* Privacy Policy Checkbox */}
                <div className="pt-2">
                    <Controller
                        name="acceptTerms"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={field.value}
                                onChange={(val) => field.onChange(val)}
                                className="items-start"
                                checkboxClass="text-[#8B0000]"
                            >
                                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-tight block pt-0.5">
                                    Please confirm that you agree to our{' '}
                                    <a href="/privacy" className="text-[#8B0000] font-bold hover:underline">
                                        privacy policy
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
                    className="h-14 bg-[#8B0000] hover:bg-[#660000] text-white font-bold text-sm rounded-[1.2rem] shadow-xl shadow-[#8B0000]/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                >
                    {isSubmitting ? 'Creating your account...' : 'Create Account'}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm
