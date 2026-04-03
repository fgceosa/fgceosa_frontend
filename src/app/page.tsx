import { auth } from '@/auth'
import { getRoleBasedRedirectUrl, UserRole } from '@/utils/roleBasedRouting'
import { redirect } from 'next/navigation'

const Page = async () => {
    const session = await auth()

    // Pass UserWithAuthority structure to the helper
    const userWithAuthority = session?.user ? { authority: (session.user.authority || []) as UserRole[] } : null
    const redirectUrl = getRoleBasedRedirectUrl(userWithAuthority)

    redirect(redirectUrl)
}

export default Page
