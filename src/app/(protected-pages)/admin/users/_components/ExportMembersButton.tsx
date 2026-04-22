'use client'

import React from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSelector } from 'react-redux'
import { selectUsersList } from '@/store/slices/admin/users/userSelectors'
import dayjs from 'dayjs'

const ExportMembersButton = () => {
    const members = useSelector(selectUsersList)

    const handleExport = () => {
        if (!members || members.length === 0) {
            return
        }

        // Define the headers for CSV
        const headers = [
            'Name',
            'Email',
            'Phone',
            'FGCE Set',
            'FGCE House',
            'Role',
            'Status',
            'Joined Date',
            'Last Active'
        ]

        // Map data to rows
        const rows = members.map(member => [
            member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim(),
            member.email,
            member.phone || member.phoneNumber || 'N/A',
            member.fgceSet || 'N/A',
            member.fgceHouse || 'N/A',
            member.role || 'Member',
            member.status || 'Active',
            dayjs(member.createdAt).format('YYYY-MM-DD'),
            member.lastOnline ? dayjs(member.lastOnline).format('YYYY-MM-DD HH:mm') : 'N/A'
        ])

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(value => {
                // Escape commas and wrap in quotes if necessary
                const stringValue = String(value).replace(/"/g, '""')
                return `"${stringValue}"`
            }).join(','))
        ].join('\n')

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        const fileName = `fgceosa-members-${dayjs().format('YYYY-MM-DD')}.csv`
        
        link.setAttribute('href', url)
        link.setAttribute('download', fileName)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Button
            variant="plain"
            size="sm"
            onClick={handleExport}
            disabled={!members || members.length === 0}
            className="h-11 px-6 border border-gray-200 dark:border-gray-700 rounded-2xl font-black  text-[10px] text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
        >
            <Download className="h-3.5 w-3.5" />
            DOWNLOAD DIRECTORY
        </Button>
    )
}

export default ExportMembersButton
