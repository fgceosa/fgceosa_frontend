'use client'

import Logo from '@/components/template/Logo'
import useTheme from '@/utils/hooks/useTheme'
import Link from 'next/link'
import type { Mode } from '@/@types/theme'
import { useUserAuthorities } from '@/utils/hooks/useAuthorization'
import { getRoleBasedRedirectUrl, UserRole } from '@/utils/roleBasedRouting'

const HeaderLogo = ({ mode }: { mode?: Mode }) => {
    const defaultMode = useTheme((state) => state.mode)
    const combinedAuthorities = useUserAuthorities()

    return (
        <Link href={getRoleBasedRedirectUrl({ authority: combinedAuthorities as UserRole[] })}>
            <Logo
                imgClass="max-h-10"
                mode={mode || defaultMode}
                className="hidden lg:block"
            />
        </Link>
    )
}

export default HeaderLogo
