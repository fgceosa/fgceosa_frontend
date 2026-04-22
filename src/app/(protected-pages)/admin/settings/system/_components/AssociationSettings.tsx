'use client'

import React, { useState, useEffect } from 'react'
import { Building2, Mail, Phone, MapPin, UploadCloud, Save } from 'lucide-react'
import { Card, Button, Input, toast, Upload } from '@/components/ui'
import Loading from '@/components/shared/Loading'
import useSystemSettings from '@/utils/hooks/useSystemSettings'

export default function AssociationSettings() {
    const { rawSettings, loading, updateSettings } = useSystemSettings()
    const [logo, setLogo] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)
    
    const [formData, setFormData] = useState({
        association_name: '',
        contact_email: '',
        contact_phone: '',
        address: '',
    })

    useEffect(() => {
        if (rawSettings) {
            setFormData({
                association_name: rawSettings.association_name || '',
                contact_email: rawSettings.contact_email || '',
                contact_phone: rawSettings.contact_phone || '',
                address: rawSettings.address || '',
            })
            setLogo(rawSettings.association_logo)
        }
    }, [rawSettings])

    const handleLogoUpload = (files: File[]) => {
        if (files.length > 0) {
            setUploading(true)
            const file = files[0]
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64Logo = reader.result as string
                setLogo(base64Logo)
                setUploading(false)
                toast.success('Logo preview updated. Save to apply changes.')
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        const success = await updateSettings({
            ...formData,
            association_logo: logo
        })
        setSaving(false)
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
            <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Association Settings</h2>
                <p className="text-base font-medium text-gray-500">Update your association&apos;s basic info, logo, and contact details.</p>
            </div>

            <Card className="p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B0000] rounded-full blur-[100px] opacity-[0.03] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                    <div className="w-full md:w-56 shrink-0 flex flex-col items-center gap-4">
                        <Upload 
                            showList={false} 
                            uploadLimit={1} 
                            onChange={handleLogoUpload}
                            className="w-full"
                        >
                            <div className="w-full aspect-square rounded-3xl bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-2 text-center group cursor-pointer hover:bg-gray-100 transition-all overflow-hidden relative">
                                {logo ? (
                                    <img src={logo} alt="Association Logo" className="w-full h-full object-contain p-4" />
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <UploadCloud className={`w-7 h-7 ${uploading ? 'animate-pulse text-gray-300' : 'text-[#8B0000]'}`} />
                                        </div>
                                        <p className="text-sm font-bold capitalize tracking-tight text-[#8B0000]">Change Logo</p>
                                        <p className="text-xs font-bold text-gray-400 mt-1 capitalize">PNG or SVG only</p>
                                    </>
                                )}
                                {logo && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-xs font-bold">Replace Logo</p>
                                    </div>
                                )}
                            </div>
                        </Upload>
                        <p className="text-xs font-black text-gray-400 capitalize tracking-tight text-center">Appears on invoices, dashboard and email headers.</p>
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold capitalize tracking-tight text-gray-400">Association Official Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input 
                                        value={formData.association_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, association_name: e.target.value }))}
                                        className="pl-11 h-12 rounded-xl focus:ring-[#8B0000]/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold capitalize tracking-tight text-gray-400">Official Physical Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input 
                                        value={formData.address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                        className="pl-11 h-12 rounded-xl focus:ring-[#8B0000]/10 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold capitalize tracking-tight text-gray-400">Official Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input 
                                            value={formData.contact_email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                                            className="pl-11 h-12 rounded-xl focus:ring-[#8B0000]/10 font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold capitalize tracking-tight text-gray-400">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input 
                                            value={formData.contact_phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                                            className="pl-11 h-12 rounded-xl focus:ring-[#8B0000]/10 font-bold"
                                        />
                                    </div>
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
                                Save Association Info
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex items-center gap-4 p-5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 border border-blue-200 flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold text-lg">i</span>
                </div>
                <p className="text-sm font-medium text-blue-800/70 dark:text-blue-400/70 leading-relaxed">
                    Changes made here will be instantly applied to the member dashboard, all official invoice exports, and automated email communications.
                </p>
            </div>
        </div>
    )
}
