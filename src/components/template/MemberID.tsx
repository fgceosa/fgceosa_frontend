'use client'

import { useAppSelector } from '@/store/hook'
import { selectUserProfile } from '@/store/slices/userSettings/userSettingsSelectors'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import type { CommonProps } from '@/@types/common'
import { UserCheck } from 'lucide-react'

const _MemberID = ({ className }: CommonProps) => {
    const userProfile = useAppSelector(selectUserProfile)
    
    if (!userProfile) return null

    const memberID = userProfile.id 
        ? `FGCE/${userProfile.id.substring(0, 6).toUpperCase()}`
        : 'PENDING'

    return (
        <div className={className}>
            <div className="flex items-center gap-4 px-4 py-2 bg-[#8B0000]/5 hover:bg-[#8B0000]/10 dark:bg-[#8B0000]/10 dark:hover:bg-[#8B0000]/20 rounded-xl border border-[#8B0000]/10 transition-all duration-300 group cursor-default whitespace-nowrap min-w-max">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/20 group-hover:scale-110 transition-transform duration-500">
                    <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#8B0000] dark:text-red-400 uppercase tracking-widest leading-none">
                        Member ID
                    </span>
                    <div className="h-3 w-[1px] bg-[#8B0000]/20" />
                    <span className="text-[12px] font-black text-gray-900 dark:text-white font-mono tracking-tighter leading-none pt-0.5">
                        {memberID}
                    </span>
                </div>
            </div>
        </div>
    )
}

const MemberID = withHeaderItem(_MemberID)

export default MemberID
