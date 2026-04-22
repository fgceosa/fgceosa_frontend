import React, { useState } from 'react'
import { Calendar, MapPin, Clock, Info, CheckCircle2 } from 'lucide-react'
import { Dialog, Button, Select } from '@/components/ui'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store'
import { registerForEvent, getEvents } from '@/store/slices/events/eventsThunk'

interface EventData {
    id: string
    title: string
    date: string
    location: string
    featured: boolean
}

interface EventRegistrationModalProps {
    isOpen: boolean
    onClose: () => void
    event: EventData | null
}
const EventRegistrationModal = ({
    isOpen,
    onClose,
    event,
}: EventRegistrationModalProps) => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { registering } = useAppSelector((state) => state.events)
    const [step, setStep] = useState<'form' | 'success'>('form')

    if (!event) return null

    const handleRegister = async () => {
        const result = await dispatch(registerForEvent({ eventId: event.id }))
        if (registerForEvent.fulfilled.match(result)) {
            setStep('success')
            toast.push(
                <Notification title="Success" type="success" closable>
                    Successfully registered for the event!
                </Notification>
            )
            // Refresh events to update is_registered status
            dispatch(getEvents())
        } else {
            const errorMsg = (result.payload as string) || 'Registration failed'
            // If already registered, show friendly message and close
            if (errorMsg.toLowerCase().includes('already registered')) {
                toast.push(
                    <Notification title="Already Registered" type="info" closable>
                        You are already registered for this event.
                    </Notification>
                )
                onClose()
            } else {
                toast.push(
                    <Notification title="Registration Failed" type="danger" closable>
                        {errorMsg}
                    </Notification>
                )
            }
            // Refresh events to get latest is_registered status
            dispatch(getEvents())
        }
    }

    const reset = () => {
        setStep('form')
        onClose()
        router.push('/dashboard')
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={reset}
            title=""
            width={600}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden"
        >
            {step === 'form' ? (
                <div className="p-8 sm:p-10">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-5 border border-gray-100 dark:border-gray-700">
                            <Calendar className="w-6 h-6 text-gray-900 dark:text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                            {event.title}
                        </h2>
                        <p className="text-[13px] font-medium text-gray-500 mt-2">
                            Secure your spot for this upcoming event. Provide
                            your details below.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="p-5 rounded-[1.5rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                <Clock className="w-4 h-4 text-[#8B0000]" />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                <MapPin className="w-4 h-4 text-[#8B0000]" />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                <Info className="w-4 h-4 text-[#8B0000]" />
                                <span>Please arrive 15 minutes early.</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-gray-900 dark:text-gray-300 uppercase tracking-widest mb-2">
                                Number of Guests
                            </label>
                            <Select
                                placeholder="Select number of attendees"
                                menuPlacement="top"
                                options={[
                                    { value: '1', label: '1 (Just me)' },
                                    { value: '2', label: '2 People' },
                                    { value: '3', label: '3 People' },
                                    { value: '4', label: '4+ People' },
                                ]}
                            />
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4">
                        <Button
                            variant="plain"
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl font-black capitalize  text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            onClick={handleRegister}
                            loading={registering}
                            className="flex-1 bg-[#8B0000] text-white hover:bg-[#700000] h-14 rounded-2xl font-black capitalize  shadow-xl px-8"
                        >
                            Confirm Registration
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-3">
                        Registration Confirmed!
                    </h2>
                    <p className="text-[13px] font-medium text-gray-500 max-w-xs mb-8">
                        You have successfully registered for{' '}
                        <strong>{event.title}</strong>. An email with further
                        details has been sent to you.
                    </p>
                    <Button
                        variant="solid"
                        block
                        onClick={reset}
                        className="bg-[#8B0000] text-white hover:bg-[#700000] h-14 rounded-2xl font-black capitalize border-none"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            )}
        </Dialog>
    )
}

export default EventRegistrationModal
