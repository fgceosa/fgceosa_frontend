'use client'

import React, { useState, useEffect } from 'react'
import { FileText, Mail, Building, Save, Eye } from 'lucide-react'
import { Card, Button, Input, Switcher, toast } from '@/components/ui'
import Loading from '@/components/shared/Loading'
import useSystemSettings from '@/utils/hooks/useSystemSettings'
import InvoiceModal from '@/app/(protected-pages)/dashboard/payments/_components/InvoiceModal'

export default function InvoiceSettings() {
    const { rawSettings, loading, updateSettings } = useSystemSettings()
    const [saving, setSaving] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    
    const [formData, setFormData] = useState({
        invoice_footer_note: '',
        tax_percentage: 0,
    })

    useEffect(() => {
        if (rawSettings) {
            setFormData({
                invoice_footer_note: rawSettings.invoice_footer_note || '',
                tax_percentage: Number(rawSettings.tax_percentage) || 0,
            })
        }
    }, [rawSettings])

    const previewData = {
        invoiceId: 'FGCEOSA-INV-2024-001',
        member: 'John Doe Alumni',
        email: 'john.doe@example.com',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        ref: 'REF-890241-PRX',
        paid: '25,000',
        method: 'Online Channel',
        description: 'Annual Dues 2024',
        status: 'PAID'
    }

    const handleSave = async () => {
        setSaving(true)
        await updateSettings(formData)
        setSaving(false)
    }

    const handlePreview = () => {
        setPreviewOpen(true)
        toast.info('Generating template preview...')
    }

    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <Loading loading type="association" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Invoice Configuration</h2>
                    <p className="text-base font-medium text-gray-500">Customize how official receipts and invoices are generated and distributed.</p>
                </div>
                <Button 
                    variant="plain" 
                    onClick={handlePreview}
                    className="h-12 px-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl font-black text-[#8B0000] text-sm capitalize hover:-translate-y-0.5 transition-all flex items-center gap-2 shadow-sm"
                >
                    <Eye className="w-4 h-4" />
                    Preview Template
                </Button>
            </div>

            <Card className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold capitalize tracking-tight text-gray-400">Invoice Footer Note</label>
                            <Input 
                                value={formData.invoice_footer_note}
                                onChange={(e) => setFormData(prev => ({ ...prev, invoice_footer_note: e.target.value }))}
                                placeholder="Thank you for your tireless support..." 
                            />
                            <p className="text-xs font-medium text-gray-400">Appears at the bottom of generated PDF receipts.</p>
                        </div>

                        <div className="space-y-4">
                             <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-[#8B0000]" />
                                    <div>
                                        <h4 className="text-base font-black text-gray-900 dark:text-white">Auto-send Invoice Email</h4>
                                        <p className="text-sm font-medium text-gray-500">Send PDF to member after payment</p>
                                    </div>
                                </div>
                                <Switcher defaultChecked />
                            </div>

                             <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <Building className="w-5 h-5 text-[#8B0000]" />
                                    <div>
                                        <h4 className="text-base font-black text-gray-900 dark:text-white">Tax Percentage (%)</h4>
                                        <p className="text-sm font-medium text-gray-500">Enable tax calculations if applicable</p>
                                    </div>
                                </div>
                                <div className="w-20">
                                    <Input 
                                        type="number"
                                        value={formData.tax_percentage}
                                        onChange={(e) => setFormData(prev => ({ ...prev, tax_percentage: Number(e.target.value) }))}
                                        className="text-center"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center space-y-4">
                         <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center">
                            <FileText className="w-10 h-10 text-gray-300" />
                         </div>
                         <div>
                            <h4 className="text-base font-black text-gray-900 dark:text-white capitalize tracking-tight">A4 Standard Template</h4>
                            <p className="text-sm font-medium text-gray-500 mt-1">Official platform layout with association header and secure QR code.</p>
                         </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button 
                        variant="solid" 
                        size="lg" 
                        onClick={handleSave}
                        loading={saving}
                        className="h-12 px-10 bg-[#8B0000] text-white rounded-2xl font-black text-[10px] capitalize shadow-lg shadow-[#8B0000]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Invoice Settings
                    </Button>
                </div>
            </Card>

            <InvoiceModal 
                isOpen={previewOpen} 
                onClose={() => setPreviewOpen(false)} 
                data={previewData} 
            />
        </div>
    )
}
