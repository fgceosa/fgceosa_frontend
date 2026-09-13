import React, { useState, useRef } from 'react'
import { Dialog, Button } from '@/components/ui'
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle } from 'lucide-react'
import { apiBulkImportUsers } from '@/services/admin/users/userService'
import { useAppDispatch } from '@/store/hook'
import { fetchUsers } from '@/store/slices/admin/users'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

export default function BulkImportModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const dispatch = useAppDispatch()
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [result, setResult] = useState<{ success: number, failed: number, errors: string[] } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
            setResult(null)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0]
            if (droppedFile.name.endsWith('.csv')) {
                setFile(droppedFile)
                setResult(null)
            } else {
                toast.push(<Notification type="danger" title="Error">Only CSV files are supported</Notification>)
            }
        }
    }

    const downloadTemplate = () => {
        const csvContent = "data:text/csv;charset=utf-8,FirstName,LastName,Email,PhoneNumber,Set,House,Gender,City,Country\n"
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "fgceosa_members_template.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleUpload = async () => {
        if (!file) return
        setIsUploading(true)
        try {
            const data = await apiBulkImportUsers(file)
            setResult({ success: data.success_count, failed: data.failed_count, errors: data.errors })
            dispatch(fetchUsers({ pageIndex: 1, pageSize: 10 }))
            if (data.success_count > 0) {
                toast.push(<Notification type="success" title="Import Complete">{data.success_count} members imported successfully</Notification>)
            }
        } catch (error: any) {
            toast.push(<Notification type="danger" title="Error">{error.message || 'Failed to upload CSV'}</Notification>)
        } finally {
            setIsUploading(false)
        }
    }

    const reset = () => {
        setFile(null)
        setResult(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const closeAll = () => {
        reset()
        onClose()
    }

    return (
        <Dialog isOpen={isOpen} onClose={closeAll} width={600} className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl">
            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Bulk Import Members</h2>
                        <p className="text-sm font-medium text-gray-500">Upload a CSV file containing member records. Existing emails will be skipped.</p>
                    </div>
                    <Button size="sm" variant="plain" onClick={downloadTemplate} className="text-[#8B0000] bg-red-50 hover:bg-red-100 flex gap-2 font-bold h-9 border-none">
                        <Download size={16} /> Template
                    </Button>
                </div>

                {result ? (
                    <div className="space-y-6">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-green-100 text-green-600">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Import Completed</h3>
                            <div className="flex gap-8 mt-2">
                                <div className="text-center">
                                    <p className="text-3xl font-black text-green-600">{result.success}</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Imported</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-black text-rose-600">{result.failed}</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skipped</p>
                                </div>
                            </div>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 rounded-xl p-4 max-h-40 overflow-y-auto">
                                <h4 className="text-sm font-bold text-rose-800 dark:text-rose-400 mb-2 flex items-center gap-2">
                                    <AlertCircle size={16} /> Skipped Rows ({result.errors.length})
                                </h4>
                                <ul className="text-xs text-rose-700/80 dark:text-rose-300/80 space-y-1 list-disc pl-4">
                                    {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <Button className="flex-1 h-12 font-bold bg-[#8B0000] text-white hover:bg-red-900" onClick={closeAll}>Done</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div 
                            onDragOver={(e) => e.preventDefault()} 
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${file ? 'border-[#8B0000] bg-red-50/50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                            
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${file ? 'bg-[#8B0000] text-white shadow-lg shadow-red-900/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                <FileSpreadsheet size={32} strokeWidth={1.5} />
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                {file ? file.name : "Click or drag CSV here"}
                            </h3>
                            <p className="text-sm font-medium text-gray-500">
                                {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports flexible columns. 'Email' is required."}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="plain" className="flex-1 h-12 font-bold text-gray-500 hover:bg-gray-100 border-none" onClick={closeAll}>Cancel</Button>
                            <Button 
                                className="flex-1 h-12 font-bold bg-[#8B0000] text-white hover:bg-red-900 shadow-lg shadow-red-900/20 disabled:opacity-50" 
                                disabled={!file || isUploading} 
                                loading={isUploading}
                                onClick={handleUpload}
                            >
                                <Upload className="mr-2" size={18} /> Import Data
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Dialog>
    )
}
