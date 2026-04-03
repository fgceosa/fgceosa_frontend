import { useState } from 'react'
import { Eye, Mail, Ban, CheckCircle, Trash2, Globe, Key, MoreVertical, UserCog, Zap, ShieldCheck } from 'lucide-react'
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
    onAllocateCredits?: (user: UserMember) => void
}

export default function UserTableRow({ user, isSelected, onSelect, onAssignRole, onAllocateCredits }: UserTableRowProps) {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isInviting, setIsInviting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)

    const isPlatformAdmin = useHasAuthority(['platform_super_admin', 'platform_admin'])
    const isPlatformSuperAdmin = useHasAuthority(['platform_super_admin'])

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'User'

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
            handleActionSuccess(`User ${isActive ? 'disabled' : 'enabled'} successfully`)
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
            handleActionSuccess(`User ${user.email} removed from system`)
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
                    <Checkbox checked={isSelected} onChange={() => onSelect?.(user.id)} />
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

                {/* Organization */}
                <td className="px-8 py-5">
                    <div className="font-medium text-gray-500 dark:text-gray-400 text-sm">
                        {user.organization?.name || '-'}
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

                {/* Last Active */}
                <td className="px-8 py-5">
                    <div className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase leading-relaxed max-w-[100px] whitespace-normal">
                        {formatExactTime(user.lastOnline)}
                    </div>
                </td>

                {/* Credits */}
                <td className="px-8 py-5 text-right">
                    <div className="flex flex-col items-end">
                        <span className="font-black text-primary text-sm flex items-center gap-1" title="User Balance">
                            {formatCredits(user.credits)}
                        </span>
                        {user.orgCredits !== undefined && user.orgCredits > 0 && (
                            <span className="text-[10px] text-gray-400 font-medium mt-0.5" title="Organization Balance">
                                Org: {formatCredits(user.orgCredits)}
                            </span>
                        )}
                    </div>
                </td>

                {/* Spending */}
                <td className="px-8 py-5 text-right">
                    <div className="flex flex-col items-end">
                        <span className="font-black text-gray-900 dark:text-white text-xs">
                            {formatCurrency(user.totalSpending)}
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

                        {/* Allocate Credits */}
                        {isPlatformAdmin && (
                            <Dropdown.Item onClick={() => onAllocateCredits?.(user)}>
                                <span className="flex items-center gap-2 text-primary font-black text-[11px] tracking-wider">
                                    <Zap size={14} /> Allocate Credits
                                </span>
                            </Dropdown.Item>
                        )}

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
                                    {isActive ? "Deactivate User" : "Activate User"}
                                </span>
                            </Dropdown.Item>
                        )}

                        {/* Delete */}
                        {!isProtected && (
                            <>
                                <Dropdown.Item variant="divider" />
                                <Dropdown.Item onClick={() => setIsDeleteOpen(true)} className="text-rose-500 hover:text-rose-600">
                                    <span className="flex items-center gap-2">
                                        <Trash2 size={14} /> Delete User
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
