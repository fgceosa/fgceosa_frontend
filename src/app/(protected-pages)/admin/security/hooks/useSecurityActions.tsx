import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hook'
import { performAdminAction, updateSecurityEventStatus } from '@/store/slices/security'
import { Notification, toast } from '@/components/ui'
import type { SecurityEvent, ApiKey } from '../types'

type AdminActionType = 'lock_account' | 'enforce_limit' | 'require_verification' | 'reset_api_keys'
type SecurityActionType = 'block' | 'investigate' | 'verify' | 'limit' | 'revoke' | 'monitor'

/**
 * Custom hook for handling security-related admin actions
 */
export function useSecurityActions() {
    const dispatch = useAppDispatch()

    const handleSecurityEventAction = useCallback(async (
        action: SecurityActionType,
        event: SecurityEvent
    ) => {
        const actionMessages: Record<SecurityActionType, { title: string; message: string; adminAction?: AdminActionType }> = {
            block: {
                title: 'User Account Locked',
                message: `${event.user?.name || 'User'} has been temporarily locked out.`,
                adminAction: 'lock_account'
            },
            investigate: {
                title: 'Investigation Started',
                message: `Event #${event.id} marked for investigation.`
            },
            verify: {
                title: 'Verification Required',
                message: `${event.user?.name || 'User'} will be prompted to verify their identity.`,
                adminAction: 'require_verification'
            },
            limit: {
                title: 'Rate Limit Enforced',
                message: `Stricter limits applied to ${event.user?.name || 'User'}.`,
                adminAction: 'enforce_limit'
            },
            revoke: {
                title: 'Access Revoked',
                message: 'API key has been revoked successfully.'
            },
            monitor: {
                title: 'Monitoring Enabled',
                message: 'Enhanced monitoring activated for this key.'
            }
        }

        const config = actionMessages[action]

        try {
            // Update event status if applicable
            if (action === 'investigate') {
                await dispatch(updateSecurityEventStatus({
                    id: event.id,
                    status: 'investigating'
                })).unwrap()
            } else if (action === 'block') {
                await dispatch(updateSecurityEventStatus({
                    id: event.id,
                    status: 'resolved' // Backend maps status=resolved with action=block
                })).unwrap()
            }

            // Perform admin action if applicable
            if (config.adminAction && event.user?.id) {
                await dispatch(performAdminAction({
                    userId: event.user.id,
                    action: config.adminAction,
                    reason: event.description
                })).unwrap()
            }

            toast.push(
                <Notification type="success" title={config.title}>
                    {config.message}
                </Notification>
            )
        } catch (error) {
            toast.push(
                <Notification type="danger" title="Action Failed">
                    Failed to perform the requested action. Please try again.
                </Notification>
            )
        }
    }, [dispatch])

    const handleApiKeyAction = useCallback(async (
        action: 'revoke' | 'monitor' | 'lock_account' | 'enforce_limit' | 'require_verification',
        apiKey: ApiKey
    ) => {
        const actionMessages = {
            revoke: {
                title: 'API Key Revoked',
                message: `${apiKey.keyName} (${apiKey.keyPrefix}) has been revoked.`
            },
            monitor: {
                title: 'Monitoring Enabled',
                message: `Enhanced monitoring activated for ${apiKey.keyName}.`
            },
            lock_account: {
                title: 'Account Locked',
                message: `${apiKey.owner}'s account has been locked.`,
                adminAction: 'lock_account' as AdminActionType
            },
            enforce_limit: {
                title: 'Limit Enforced',
                message: `Stricter rate limits applied to ${apiKey.owner}.`,
                adminAction: 'enforce_limit' as AdminActionType
            },
            require_verification: {
                title: 'Verification Required',
                message: `${apiKey.owner} will be required to verify their identity.`,
                adminAction: 'require_verification' as AdminActionType
            }
        }

        const config = actionMessages[action]

        try {
            // Perform admin action if applicable
            if ('adminAction' in config && config.adminAction) {
                await dispatch(performAdminAction({
                    userId: apiKey.ownerId,
                    action: config.adminAction,
                    reason: `API key abuse detected: ${apiKey.keyName}`
                })).unwrap()
            }

            toast.push(
                <Notification type="success" title={config.title}>
                    {config.message}
                </Notification>
            )
        } catch (error) {
            toast.push(
                <Notification type="danger" title="Action Failed">
                    Failed to perform the requested action. Please try again.
                </Notification>
            )
        }
    }, [dispatch])

    return {
        handleSecurityEventAction,
        handleApiKeyAction
    }
}
