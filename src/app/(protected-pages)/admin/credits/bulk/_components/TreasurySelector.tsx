import { ChevronDown, Landmark, Building2, Ticket, Check } from 'lucide-react'
import { Dropdown } from '@/components/ui'
import classNames from '@/utils/classNames'
import type { Treasury } from '../types'

interface TreasurySelectorProps {
    selectedTreasury: Treasury | null
    onSelect: (treasury: Treasury) => void
    treasuries: Treasury[]
}

export default function TreasurySelector({
    selectedTreasury,
    onSelect,
    treasuries,
}: TreasurySelectorProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'platform':
                return Landmark
            case 'organization':
                return Building2
            case 'program':
                return Ticket
            default:
                return Landmark
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-gray-900 dark:text-gray-100 pl-1">Source Account</label>
            <Dropdown
                placement="bottom-start"
                renderTitle={
                    <div className="relative group w-full">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
                        <div className="relative flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 h-16 shadow-xl shadow-gray-200/40 dark:shadow-none cursor-pointer hover:border-primary/30 transition-all w-full">
                            {selectedTreasury && (
                                <div className={classNames(
                                    "p-2.5 rounded-xl border shrink-0",
                                    selectedTreasury.type === 'platform' ? "bg-blue-50 text-primary border-blue-100 dark:bg-primary/10" :
                                        selectedTreasury.type === 'organization' ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10" :
                                            "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10"
                                )}>
                                    {(() => {
                                        const Icon = getIcon(selectedTreasury.type)
                                        return <Icon className="w-5 h-5" />
                                    })()}
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-gray-900 dark:text-white truncate text-left">
                                        {selectedTreasury?.name || 'Select Account'}
                                    </span>
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400 truncate text-left">
                                        {selectedTreasury?.scope || 'Platform-wide scope'}
                                    </span>
                                </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                }
            >
                {treasuries.map((t) => {
                    const Icon = getIcon(t.type)
                    return (
                        <Dropdown.Item
                            key={t.id}
                            eventKey={t.id}
                            onClick={() => onSelect(t)}
                            className="flex items-center justify-between gap-3 px-4 py-3 min-w-[280px]"
                        >
                            <div className="flex items-center gap-3">
                                <div className={classNames(
                                    "p-1.5 rounded-lg border",
                                    t.type === 'platform' ? "bg-blue-50 text-primary border-blue-100" :
                                        t.type === 'organization' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            "bg-amber-50 text-amber-600 border-amber-100"
                                )}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-gray-900 dark:text-white truncate">
                                        {t.name}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 truncate">
                                        {t.scope}
                                    </span>
                                </div>
                            </div>
                            {selectedTreasury?.id === t.id && (
                                <Check className="w-4 h-4 text-primary" />
                            )}
                        </Dropdown.Item>
                    )
                })}
            </Dropdown>
        </div>
    )
}
