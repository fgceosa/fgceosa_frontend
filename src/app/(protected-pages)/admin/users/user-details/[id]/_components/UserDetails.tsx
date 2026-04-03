'use client'

import UserDetailsHeader from './UserDetailsHeader'
import UserDetailsProfile from './UserDetailsProfile'
import UserDetailsAnalytics from './UserDetailsAnalytics'
import type { UserMember } from '@/app/(protected-pages)/admin/users/types'

interface UserDetailsProps {
    data: UserMember
}

const UserDetails = ({ data }: UserDetailsProps) => {
    return (
        <div className="w-full py-8 px-4 sm:px-6 lg:px-10 space-y-8 animate-in fade-in duration-700">
            {/* Enterprise Header */}
            <UserDetailsHeader data={data} />

            {/* Analytics Overview - Now at the Top */}
            <UserDetailsAnalytics data={data} />

            <div className="flex flex-col gap-8">
                {/* Full Width Sections */}
                <UserDetailsProfile data={data} layout="detailed" />
            </div>
        </div>
    )
}

export default UserDetails
