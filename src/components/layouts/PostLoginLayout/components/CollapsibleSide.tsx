'use client'

import SideNav from '@/components/template/SideNav'
import Header from '@/components/template/Header'
import MobileNav from '@/components/template/MobileNav'
import SideNavToggle from '@/components/template/SideNavToggle'
import UserProfileDropdown from '@/components//template/UserProfileDropdown'
import LayoutBase from '@/components//template/LayoutBase'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'
import Notification from '@/components/template/Notification'
import MemberID from '@/components/template/MemberID'

const CollapsibleSide = ({ children }: CommonProps) => {
    return (
        <LayoutBase
            type={LAYOUT_COLLAPSIBLE_SIDE}
            className="app-layout-collapsible-side flex flex-auto flex-col h-screen overflow-hidden"
        >
            <div className="flex flex-auto min-w-0 h-full">
                <SideNav />
                <div className="flex flex-col flex-auto min-h-0 min-w-0 relative w-full h-full">
                    <Header
                        className="shadow-sm dark:shadow-2xl"
                        headerStart={
                            <>
                                <MobileNav />
                                <SideNavToggle />
                            </>
                        }
                        headerEnd={
                            <>
                                <MemberID className="hidden md:block" />
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

export default CollapsibleSide
