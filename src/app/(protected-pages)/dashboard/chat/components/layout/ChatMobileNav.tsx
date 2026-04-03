'use client'

import { useState } from 'react'
import ChatSideNav from './ChatSideNav'
import useResponsive from '@/utils/hooks/useResponsive'
import NavToggle from '@/components/shared/NavToggle'
import classNames from '@/utils/classNames'
import Drawer from '@/components/ui/Drawer'

interface ChatMobileNavProps {
    isOpen: boolean
    onClose: () => void
}

const ChatMobileNav = ({ isOpen, onClose }: ChatMobileNavProps) => {
    const { smaller } = useResponsive()

    if (!smaller.xl) {
        return null
    }

    return (
        <Drawer
            isOpen={isOpen}
            width={330}
            placement="left"
            onClose={onClose}
            onRequestClose={onClose}
            bodyClass="p-0"
        >
            <ChatSideNav
                className="border-0"
                onClick={onClose}
                showOnMobile
            />
        </Drawer>
    )
}

export default ChatMobileNav
