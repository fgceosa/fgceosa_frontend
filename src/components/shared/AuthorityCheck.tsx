import useAuthority from '@/utils/hooks/useAuthority'
import type { CommonProps } from '@/@types/common'

interface AuthorityCheckProps extends CommonProps {
    userAuthority: string[]
    authority: string[]
    userPermissions?: string[]
    permission?: string
}

const AuthorityCheck = (props: AuthorityCheckProps) => {
    const {
        userAuthority = [],
        authority = [],
        userPermissions = [],
        permission,
        children
    } = props

    const roleMatched = useAuthority(userAuthority, authority, userPermissions, permission)

    return <>{roleMatched ? children : null}</>
}

export default AuthorityCheck
