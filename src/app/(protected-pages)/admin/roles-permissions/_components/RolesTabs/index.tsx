
import classNames from '@/utils/classNames'

const TABS = [
    { label: 'Roles', value: 'roles' },
    { label: 'Permissions', value: 'permissions' },
]

interface RolesTabsProps {
    activeTab?: string
    onChange?: (tab: string) => void
}

export default function RolesTabs({ activeTab = 'roles', onChange }: RolesTabsProps) {
    return (
        <div className="flex items-center gap-8 border-b border-gray-100 dark:border-gray-800">
            {TABS.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onChange?.(tab.value)}
                    className={classNames(
                        "relative pb-4 text-sm font-bold transition-colors",
                        activeTab === tab.value
                            ? "text-primary"
                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    )}
                >
                    {tab.label}
                    {activeTab === tab.value && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                    )}
                </button>
            ))}
        </div>
    )
}
