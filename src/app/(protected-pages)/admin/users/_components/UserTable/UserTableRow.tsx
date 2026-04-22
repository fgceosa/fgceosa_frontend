import { useState } from 'react'
import { Eye, Mail, Ban, CheckCircle, Trash2, Globe, Key, MoreVertical, UserCog, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hook'
import { toast, Notification, Checkbox, Dropdown, Button } from '@/components/ui'
import DeleteUserDialog from '../DeleteUserDialog'

import Popconfirm from '@/components/shared/Popconfirm'
import { useHasAuthority } from '@/utils/hooks/useAuthorization'
import { formatExactTime, formatCurrency, generateUserTag, formatCredits } from '../../utils/formatters'
import { deleteUser, resendUserInvitation, updateUser, fetchUsers, fetchUsersAnalytics, verifyUserEmail } from '@/store/slices/admin/users'
import type { UserMember } from '../../types'

interface UserTableRowProps {
    user: UserMember
    isSelected?: boolean
    onSelect?: (id: string) => void
    onAssignRole?: (user: UserMember) => void
}

export default function UserTableRow({ user, isSelected, onSelect, onAssignRole }: UserTableRowProps) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isInviting, setIsInviting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)

    const isPlatformAdmin = useHasAuthority(['super_admin', 'admin'])
    const isPlatformSuperAdmin = useHasAuthority(['super_admin'])

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Member'

    // Protection for Super Admins
    const isProtected = user.role === 'Admin' || user.email === 'admin@qorebit.com'
    const isActive = user.status === 'active'
    const isPending = user.status === 'pending'

    const handleActionSuccess = (msg: string) => {
        toast.push(
            <Notification type="success" title="Success">
                {msg}
            </Notification>
        )
        dispatch(fetchUsers())
        dispatch(fetchUsersAnalytics())
    }

    const handleResendInvite = async () => {
        setIsInviting(true)
        try {
            await dispatch(resendUserInvitation(user.id)).unwrap()
            handleActionSuccess(`Invitation resent to ${user.email}`)
        } catch (error) {
            toast.push(<Notification type="danger" title="Error">Failed to resend invite</Notification>)
        } finally {
            setIsInviting(false)
        }
    }

    const handleVerifyEmail = async () => {
        setIsVerifying(true)
        try {
            await dispatch(verifyUserEmail(user.id)).unwrap()
            handleActionSuccess(`Email verified for ${user.email}`)
        } catch (error) {
            toast.push(<Notification type="danger" title="Error">Failed to verify email</Notification>)
        } finally {
            setIsVerifying(false)
        }
    }

    const handleToggleStatus = async () => {
        try {
            const newStatus = isActive ? 'disabled' : 'active'
            const newActive = !isActive
            await dispatch(updateUser({ id: user.id, data: { status: newStatus, is_active: newActive } as any })).unwrap()
            handleActionSuccess(`Member ${isActive ? 'disabled' : 'enabled'} successfully`)
        } catch (error) {
            toast.push(<Notification type="danger" title="Error">Action failed</Notification>)
        }
    }

    const [mustForce, setMustForce] = useState(false)
    const [dependencyError, setDependencyError] = useState<string | null>(null)

    const handleDeleteUser = async (forceAttempt = false) => {
        setIsDeleting(true)
        try {
            await dispatch(deleteUser({ id: user.id, force: forceAttempt })).unwrap()
            handleActionSuccess(`Member ${user.email} removed from system`)
            setIsDeleteOpen(false)
            setMustForce(false)
            setDependencyError(null)
        } catch (error) {
            const errorMsg = typeof error === 'string' ? error : 'Failed to delete user'
            // Check if backend returned the specific dependency error
            if (errorMsg.includes('active records')) {
                setMustForce(true)
                setDependencyError(errorMsg)
            } else {
                toast.push(<Notification type="danger" title="Error">{errorMsg}</Notification>)
            }
        } finally {
            setIsDeleting(false)
        }
    }

    const handleRowClick = () => {
        router.push(`/admin/users/user-details/${user.id}`)
    }

    // Role display helper - assume role is string for now, but split if comma separated or similar in future
    const roleChips = user.role ? [user.role] : ['Member']

    return (
        <>
            <tr
                className="hover:bg-primary/[0.02] dark:hover:bg-primary/5 transition-all duration-300 group cursor-pointer"
                onClick={handleRowClick}
            >
                {/* Checkbox */}
                <td className="pl-8 py-5" onClick={(e) => e.stopPropagation()}>
                    <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                    </div>
                </td>

                {/* User Info (Name + Email) */}
                <td className="px-8 py-5">
                    <div className="flex items-center gap-4">

                        <div>
                            <div className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-primary transition-colors">{fullName}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{user.email}</span>
                                {user.authProvider && (
                                    <span className="py-0.5 px-1.5 h-auto text-[8px] font-black uppercase tracking-tighter flex items-center gap-1 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-md text-gray-500">
                                        {user.authProvider === 'google' ? <Globe size={8} className="text-blue-500" /> : <Key size={8} className="text-amber-500" />}
                                        {user.authProvider}
                                    </span>
                                )}
                                {!user.isVerified && (
                                    <span className="py-0.5 px-1.5 h-auto text-[8px] font-black uppercase tracking-tighter flex items-center gap-1 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 rounded-md text-amber-600 dark:text-amber-500">
                                        Unverified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </td>

                {/* Current Role(s) */}
                <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-2">
                        {roleChips.map((r, idx) => (
                            <span key={idx} className="inline-flex py-1 px-2.5 rounded-lg bg-primary/5 border border-primary/10 text-primary text-[10px] uppercase font-black tracking-wide">
                                {r}
                            </span>
                        ))}
                    </div>
                </td>

                {/* FGCE Set */}
                <td className="px-8 py-5">
                    <div className="font-black text-gray-900 dark:text-gray-100 text-[11px] uppercase tracking-wider">
                        {user.fgceSet || 'N/A'}
                    </div>
                </td>

                {/* Account Status Badge */}
                <td className="px-8 py-5 text-left">
                    <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex py-1 px-2.5 rounded-lg text-[10px] uppercase font-black tracking-wide border ${user.status === 'active'
                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800 text-emerald-600'
                                : user.status === 'pending'
                                    ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800 text-amber-600'
                                    : 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800 text-rose-600'
                            }`}>
                            {user.status || 'inactive'}
                        </span>
                    </div>
                </td>

                {/* Dues Status Badge */}
                <td className="px-8 py-5 text-left">
                    <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex py-1 px-2.5 rounded-lg text-[10px] uppercase font-black tracking-wide border ${user.dues === 'paid'
                                ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800 text-emerald-600'
                                : user.dues === 'overdue'
                                    ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800 text-rose-600'
                                    : 'bg-gray-50 dark:bg-gray-800/10 border-gray-100 dark:border-gray-800 text-gray-600'
                            }`}>
                            {user.dues || 'unpaid'}
                        </span>
                    </div>
                </td>

                {/* Actions Menu */}
                <td className="px-8 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                        renderTitle={
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <MoreVertical size={16} />
                            </button>
                        }
                        placement="bottom-end"
                    >
                        {/* View Profile */}
                        <Dropdown.Item onClick={() => router.push(`/admin/users/user-details/${user.id}`)}>
                            <span className="flex items-center gap-2">
                                <Eye size={14} /> View Profile
                            </span>
                        </Dropdown.Item>


                        {/* Update Identity Role */}
                        <Dropdown.Item onClick={() => onAssignRole?.(user)}>
                            <span className="flex items-center gap-2 text-primary font-black text-[11px] tracking-wider">
                                <UserCog size={14} /> Update Identity Role
                            </span>
                        </Dropdown.Item>

                        {/* Resend Invite */}
                        {isPending && (
                            <Dropdown.Item onClick={handleResendInvite} disabled={isInviting}>
                                <span className="flex items-center gap-2">
                                    <Mail size={14} /> Resend Invite
                                </span>
                            </Dropdown.Item>
                        )}

                        {/* Verify Email - Platform Super Admin Only */}
                        {isPlatformSuperAdmin && !user.isVerified && (
                            <Dropdown.Item onClick={handleVerifyEmail} disabled={isVerifying}>
                                <span className="flex items-center gap-2 text-emerald-600 font-black text-[11px] tracking-wider">
                                    <ShieldCheck size={14} /> Verify Email
                                </span>
                            </Dropdown.Item>
                        )}

                        {/* Activate/Deactivate */}
                        {!isPending && (
                            <Dropdown.Item onClick={handleToggleStatus} className={isActive ? "text-rose-500 hover:text-rose-600" : "text-emerald-500 hover:text-emerald-600"}>
                                <span className="flex items-center gap-2">
                                    {isActive ? <Ban size={14} /> : <CheckCircle size={14} />}
                                    {isActive ? "Deactivate Member" : "Activate Member"}
                                </span>
                            </Dropdown.Item>
                        )}

                        {/* Delete */}
                        {!isProtected && (
                            <>
                                <Dropdown.Item variant="divider" />
                                <Dropdown.Item onClick={() => setIsDeleteOpen(true)} className="text-rose-500 hover:text-rose-600">
                                    <span className="flex items-center gap-2">
                                        <Trash2 size={14} /> Delete Member
                                    </span>
                                </Dropdown.Item>
                            </>
                        )}
                    </Dropdown>
                </td>
            </tr>

            <DeleteUserDialog
                isOpen={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false)
                    setMustForce(false)
                    setDependencyError(null)
                }}
                onConfirm={handleDeleteUser}
                user={user}
                isDeleting={isDeleting}
                mustForce={mustForce}
                dependencyError={dependencyError}
            />
        </>
    )
}
