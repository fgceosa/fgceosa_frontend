import React, { useState } from 'react'
import { 
    Wallet, 
    Building2, 
    CreditCard, 
    FileText, 
    Settings2, 
    BellRing,
    Calendar,
    Plus,
    Check
} from 'lucide-react'
import { Card, Button, Input, Select, Switcher, Notification, toast } from '@/components/ui'
import AssociationSettings from './AssociationSettings'
import PaymentSettings from './PaymentSettings'
import InvoiceSettings from './InvoiceSettings'
import SystemPreferences from './SystemPreferences'

const tabs = [
    { id: 'association', label: 'Association', icon: Building2 },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'preferences', label: 'Preferences', icon: Settings2 },
]

export default function SystemSettings() {
    const [activeTab, setActiveTab] = useState('association')

    const renderContent = () => {
        switch (activeTab) {
            case 'association':
                return <AssociationSettings />
            case 'payments':
                return <PaymentSettings />
            case 'invoices':
                return <InvoiceSettings />
            case 'preferences':
                return <SystemPreferences />
            default:
                return <AssociationSettings />
        }
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-72 shrink-0">
                <Card className="p-3 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm sticky top-8">
                    <div className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-[14px] font-black capitalize transition-all duration-300 ${
                                        isActive 
                                            ? 'bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/20' 
                                            : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}
