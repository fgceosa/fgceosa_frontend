import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardClient from './_components/DashboardClient'

export default async function Page() {
    const session = await auth()
    const authority = session?.user?.authority || []

    if (authority.includes('super_admin') || authority.includes('admin')) {
        redirect('/admin/dashboard')
    }

    return <DashboardClient />
}
// export default function Page() {
//     return <h3>Welcome onboard  user</h3>
// }