import { useState } from 'react'
import { useAppDispatch } from '@/store/hook'
import {
    updateUser,
    deleteUser,
    fetchUsers,
} from '@/store/slices/admin/users'
import type { UpdateUserRequest } from '@/services/admin/users/userService'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import DeleteUserDialog from '../../../_components/DeleteUserDialog'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import type { UserMember } from '@/app/(protected-pages)/admin/users/types'
import type { UserFormSchema } from '@/components/view/Form/types'
import UserForm from '@/components/view/Form/UserForm'

type UserEditProps = {
    data: UserMember
}

const UserEdit = ({ data }: UserEditProps) => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [mustForce, setMustForce] = useState(false)
    const [dependencyError, setDependencyError] = useState<string | null>(null)

    const handleFormSubmit = async (values: UserFormSchema) => {
        try {
            setIsSubmiting(true)

            // Build update payload
            const updatePayload: UpdateUserRequest = {
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username,
                phoneNumber: values.phoneNumber,
                dialCode: values.dialCode,
                address: values.address,
                postcode: values.postcode,
                city: values.city,
                country: values.country,
            }

            // dispatch update
            await dispatch(
                updateUser({ id: data.id, data: updatePayload }),
            ).unwrap()

            // Refresh users registry
            dispatch(fetchUsers())

            toast.push(
                <Notification type="success">User Identity Updated!</Notification>,
                {
                    placement: 'top-center',
                },
            )

            setIsSubmiting(false)
            router.push('/admin/users')
        } catch {
            setIsSubmiting(false)
            toast.push(
                <Notification type="danger">
                    Failed to update user identity
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }

    const getDefaultValues = () => {
        if (data) {
            const {
                firstName,
                lastName,
                email,
                img,
                username,
                phoneNumber,
                address,
                city,
                country,
                postcode,
            } = data

            type MaybePersonalInfo = {
                phoneNumber?: string
                dialCode?: string
                country?: string
                address?: string
                city?: string
                postcode?: string
            }

            const personalInfo =
                (data as unknown as { personalInfo?: MaybePersonalInfo })
                    .personalInfo || {}

            return {
                firstName: (firstName ?? '') as string,
                lastName: (lastName ?? '') as string,
                email: (email ?? '') as string,
                img: (img ?? '') as string,
                username: (username as string) ?? '',
                phoneNumber: personalInfo?.phoneNumber || phoneNumber || '',
                dialCode: personalInfo?.dialCode || '',
                country: personalInfo?.country || country || '',
                address: personalInfo?.address || address || '',
                city: personalInfo?.city || city || '',
                postcode: personalInfo?.postcode || postcode || '',
                tags: [],
            }
        }

        return {}
    }

    const handleConfirmDelete = async (forceAttempt = false) => {
        try {
            setIsDeleting(true)
            await dispatch(deleteUser({ id: data.id, force: forceAttempt })).unwrap()
            dispatch(fetchUsers())
            toast.push(
                <Notification type="success">
                    User decommissioned successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            setDeleteConfirmationOpen(false)
            router.push('/admin/users')
        } catch (error) {
            const errorMsg = typeof error === 'string' ? error : 'Failed to decommission user'
            if (errorMsg.includes('active records')) {
                setMustForce(true)
                setDependencyError(errorMsg)
            } else {
                toast.push(
                    <Notification type="danger">
                        {errorMsg}
                    </Notification>,
                    { placement: 'top-center' },
                )
            }
        } finally {
            setIsDeleting(false)
        }
    }

    const handleDelete = () => setDeleteConfirmationOpen(true)
    const handleCancel = () => setDeleteConfirmationOpen(false)
    const handleBack = () => router.push('/admin/users')

    return (
        <div className="font-sans">
            <UserForm
                defaultValues={getDefaultValues() as UserFormSchema}
                isEdit={true}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8 py-5 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm mb-12">
                        <Button
                            className="bg-gray-50/50 dark:bg-gray-800/10 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white rounded-2xl h-14 px-8 font-black text-[11px] capitalize tracking-[0.2em] transition-all border-none font-mono"
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft className="w-5 h-5" />}
                            onClick={handleBack}
                        >
                            Back To Registry
                        </Button>
                        <div className="flex items-center gap-4">
                            <Button
                                className="bg-rose-50/50 dark:bg-rose-900/10 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/30 border border-rose-100 dark:border-rose-900/30 rounded-2xl h-14 px-8 font-black text-[11px] capitalize tracking-[0.2em] transition-all"
                                type="button"
                                icon={<TbTrash className="w-5 h-5" />}
                                onClick={handleDelete}
                            >
                                Decommission
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                                className="bg-[#8B0000] hover:bg-[#700000] text-white rounded-2xl h-14 px-12 font-black text-[11px] capitalize tracking-[0.2em] shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] transition-all hover:-translate-y-1 active:scale-95 border-none"
                            >
                                Commit Modifications
                            </Button>
                        </div>
                    </div>
                </Container>
            </UserForm>

            <DeleteUserDialog
                isOpen={deleteConfirmationOpen}
                onClose={() => {
                    setDeleteConfirmationOpen(false)
                    setMustForce(false)
                    setDependencyError(null)
                }}
                onConfirm={handleConfirmDelete}
                user={data}
                isDeleting={isDeleting}
                mustForce={mustForce}
                dependencyError={dependencyError}
            />
        </div>
    )
}

export default UserEdit
