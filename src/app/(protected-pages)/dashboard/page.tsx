import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardClient from './_components/DashboardClient'

export default async function Page() {
    const session = await auth()
    const authority = session?.user?.authority || []

    if (
        authority.includes('org_super_admin') ||
        authority.includes('org_admin') ||
        authority.includes('org_member')
    ) {
        redirect('/organizations/dashboard')
    }

    if (authority.includes('platform_super_admin') || (session?.user as any)?.role === 'platform_super_admin') {
        redirect('/platform/dashboard')
    }

    return <DashboardClient />
}
// export default function Page() {
//     return <h3>Welcome onboard  user</h3>
// }