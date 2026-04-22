'use client'

import StackedSideNav from '@/components/template/StackedSideNav'
import Header from '@/components/template/Header'
import MobileNav from '@/components/template/MobileNav'
import UserProfileDropdown from '@/components//template/UserProfileDropdown'
import LayoutBase from '@/components//template/LayoutBase'
import { LAYOUT_STACKED_SIDE } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import Notification from '@/components/template/Notification'
import Wallet from '@/components/template/Wallet'

const StackedSide = ({ children }: CommonProps) => {
    return (
        <LayoutBase
            type={LAYOUT_STACKED_SIDE}
            className="app-layout-stacked-side flex flex-auto flex-col h-screen overflow-hidden"
        >
            <div className="flex flex-auto min-w-0 h-full">
                <StackedSideNav />
                <div className="flex flex-col flex-auto min-h-0 min-w-0 relative w-full h-full">
                    <Header
                        className="shadow-sm dark:shadow-2xl"
                        headerStart={<MobileNav />}
                        headerEnd={
                            <>
                                <Notification />
                                <UserProfileDropdown hoverable={false} />
                            </>
                        }
                    />
                    <div className="h-full flex flex-auto flex-col overflow-x-hidden overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </LayoutBase>
    )
}

export default StackedSide
