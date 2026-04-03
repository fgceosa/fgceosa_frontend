'use client'

import { useState, useRef } from 'react'
import { Check, ChevronsUpDown, Plus, Building2, LayoutGrid, Zap } from 'lucide-react'
import { Dropdown } from '@/components/ui'
import type { Workspace } from '../types'
import classNames from '@/utils/classNames'

interface WorkspaceSwitcherProps {
    workspaces: Workspace[]
    currentWorkspace: Workspace | null
    onWorkspaceChange: (workspace: Workspace) => void
    onCreateNew?: () => void
    collapsed?: boolean
}

export default function WorkspaceSwitcher({
    workspaces,
    currentWorkspace,
    onWorkspaceChange,
    onCreateNew,
    collapsed = false,
}: WorkspaceSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<any>(null)

    const handleSelect = (workspace: Workspace) => {
        onWorkspaceChange(workspace)
        setIsOpen(false)
        dropdownRef.current?.handleDropdownClose()
    }

    return (
        <Dropdown
            ref={dropdownRef}
            placement="bottom-end"
            renderTitle={
                collapsed ? (
                    <div className="flex justify-center w-full">
                        <button
                            className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 hover:scale-110 active:scale-95 transition-all duration-300 group"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Building2 className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2.5 w-full">
                        <span className="text-[10px] font-black text-gray-950 dark:text-white px-1">
                            Switch Workspace
                        </span>
                        <button
                            className="w-full h-14 flex items-center justify-between px-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl transition-colors duration-300 hover:border-primary group"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <div className="flex flex-col items-start overflow-hidden">
                                <span className="text-sm font-black text-gray-900 dark:text-white truncate tracking-tight">
                                    {currentWorkspace?.name || 'Select ...'}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-bold text-gray-400">Active Now</span>
                                </div>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-transparent flex items-center justify-center border border-primary/10 transition-colors">
                                <ChevronsUpDown className="w-3 h-3 text-primary" />
                            </div>
                        </button>
                    </div>
                )
            }
        >
            <div className="py-3 w-[320px] bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-3 border-b border-gray-50 dark:border-gray-900/50 mb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <LayoutGrid className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] font-black text-gray-400">Switch Workspace</span>
                        </div>
                        <div className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border border-emerald-100 dark:border-emerald-800/30">
                            <span className="text-[8px] font-black text-emerald-600">{workspaces.length} Total</span>
                        </div>
                    </div>
                </div>

                <div className="max-h-[360px] overflow-y-auto px-2 space-y-1 custom-scrollbar">
                    {workspaces.map((workspace) => {
                        const isActive = currentWorkspace?.id === workspace.id

                        return (
                            <button
                                key={workspace.id}
                                onClick={() => handleSelect(workspace)}
                                className={classNames(
                                    "w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group/item",
                                    isActive
                                        ? "bg-primary/5 border border-primary/10"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-900 border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                                )}
                            >
                                <div className={classNames(
                                    "w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-500 border",
                                    isActive
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                                        : "bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700 group-hover/item:text-primary group-hover/item:border-primary/20 group-hover/item:bg-white dark:group-hover/item:bg-gray-800"
                                )}>
                                    {workspace.name.substring(0, 2).toUpperCase()}
                                </div>

                                <div className="flex flex-col items-start flex-1 min-w-0">
                                    <div className="flex items-center gap-2 w-full">
                                        <span className={classNames(
                                            "text-xs font-black tracking-tight truncate",
                                            isActive ? "text-primary" : "text-gray-900 dark:text-gray-100 group-hover/item:text-primary"
                                        )}>
                                            {workspace.name}
                                        </span>
                                        {isActive && <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium truncate w-full mt-0.5">
                                        {workspace.description || 'Enterprise Workspace'}
                                    </span>
                                </div>

                                {isActive ? (
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                        <LayoutGrid className="w-3 h-3 text-gray-400" />
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {onCreateNew && (
                    <div className="mt-2 px-2 pt-2 border-t border-gray-50 dark:border-gray-900/50 flex gap-2">
                        <button
                            onClick={() => {
                                onCreateNew()
                                setIsOpen(false)
                                dropdownRef.current?.handleDropdownClose()
                            }}
                            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-white hover:opacity-90 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-primary/20"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black">Create Workspace</span>
                        </button>
                    </div>
                )}
            </div>
        </Dropdown >
    )
}
