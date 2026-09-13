import React, { useState, useRef } from 'react'
import { Dialog } from '@/components/ui'
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle, X } from 'lucide-react'
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
        <Dialog
            isOpen={isOpen}
            width={650}
            onClose={closeAll}
            closable={false}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
            <div className="p-8 sm:p-10">
                {/* Header Section */}
                <div className="mb-10 relative flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
                            <FileSpreadsheet className="w-7 h-7 text-[#8B0000]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Bulk Import</h2>
                            <p className="text-[11px] font-black text-gray-400 mt-2 tracking-[0.2em]">Upload CSV Member List</p>
                        </div>
                    </div>
                    <button
                        onClick={closeAll}
                        className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center group"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                </div>

                {result ? (
                    <div className="space-y-10">
                        <div className="bg-gray-50/50 dark:bg-gray-800/20 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center shadow-inner">
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-green-100">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-4">Import Completed</h3>
                            <div className="flex gap-10">
                                <div className="text-center">
                                    <p className="text-4xl font-black text-green-600">{result.success}</p>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">Imported</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl font-black text-rose-600">{result.failed}</p>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">Skipped</p>
                                </div>
                            </div>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="bg-rose-50/30 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/30 rounded-2xl p-5 max-h-40 overflow-y-auto shadow-inner">
                                <h4 className="text-[11px] font-black text-rose-800 dark:text-rose-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
                                    <AlertCircle size={14} /> Skipped Rows ({result.errors.length})
                                </h4>
                                <ul className="text-xs text-rose-700/80 dark:text-rose-300/80 space-y-2 list-disc pl-5 font-medium">
                                    {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="pt-4 flex gap-4">
                            <button
                                onClick={closeAll}
                                className="w-full h-14 bg-[#8B0000] text-white font-black capitalize tracking-[0.2em] text-[11px] rounded-2xl shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center border-none"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-10">
                        <div 
                            onDragOver={(e) => e.preventDefault()} 
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${file ? 'border-[#8B0000] bg-red-50/50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30'}`}
                        >
                            <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                            
                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 transition-all shadow-inner border ${file ? 'bg-white text-[#8B0000] border-red-100' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700'}`}>
                                <FileSpreadsheet className="w-10 h-10" />
                            </div>
                            
                            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight mb-2">
                                {file ? file.name : "Click or drag CSV here"}
                            </h3>
                            <p className="text-[11px] font-black text-gray-400 tracking-widest uppercase">
                                {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports flexible columns. 'Email' is required."}
                            </p>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <button 
                                onClick={downloadTemplate}
                                className="flex items-center gap-2 text-[11px] font-black text-[#8B0000] tracking-widest uppercase hover:text-red-900 transition-colors"
                            >
                                <Download size={14} /> Download Template
                            </button>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                onClick={closeAll}
                                disabled={isUploading}
                                className="flex-1 h-14 rounded-2xl border-none text-[11px] font-black text-gray-400 dark:text-gray-500 capitalize tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all font-mono"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!file || isUploading}
                                className="flex-[2] h-14 bg-[#8B0000] text-white font-black capitalize tracking-[0.2em] text-[11px] rounded-2xl shadow-[0_12px_24px_-10px_rgba(139,0,0,0.5)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 border-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100 group"
                            >
                                <Upload className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                                <span>{isUploading ? 'Importing...' : 'Import Data'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Dialog>
    )
}
