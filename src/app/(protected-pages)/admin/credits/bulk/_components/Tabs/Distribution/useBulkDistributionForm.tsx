import { useState } from 'react'
import { useAppDispatch } from '@/store'
import {
    bulkDistribution,
    fetchBulkCreditsStats,
} from '@/store/slices/bulkCredits'
import { toast, Notification } from '@/components/ui'
import type { BulkDistributionFormData, DistributionType } from '../../../types'
import * as XLSX from 'xlsx'

export function useBulkDistributionForm() {
    const dispatch = useAppDispatch()
    const [totalAmount, setTotalAmount] = useState('')
    const [distributionType, setDistributionType] = useState<DistributionType>('equal')
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [template, setTemplate] = useState<string | null>(null)
    const [purpose, setPurpose] = useState('')
    const [groupName, setGroupName] = useState('')
    const [recipient, setRecipient] = useState('')
    const [message, setMessage] = useState('')
    const [quickRecipients, setQuickRecipients] = useState<any[]>([])

    // New state for parsed data
    const [parsedRecipients, setParsedRecipients] = useState<any[]>([])
    const [parsedTotalAmount, setParsedTotalAmount] = useState<number>(0)

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
            const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv')

            if (!isExcel && !isCsv) {
                toast.push(
                    <Notification type="warning" className="border-none p-0 bg-transparent">
                        <p className="text-sm font-bold">Please upload a valid CSV or Excel file</p>
                    </Notification>,
                    { placement: 'top-center' }
                )
                return
            }

            setUploadedFile(file)

            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const data = e.target?.result
                    const workbook = XLSX.read(data, { type: 'binary' })
                    const sheetName = workbook.SheetNames[0]
                    const sheet = workbook.Sheets[sheetName]
                    // Smart Header Detection
                    const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]
                    let headerRowIndex = 0
                    let maxMatches = 0
                    const KEYWORDS = ['email', 'tag', 'identifier', 'user', 'username', 'recipient', 'qorebit tag', 'name', 'amount']

                    for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
                        const row = rawRows[i]
                        let matches = 0
                        if (Array.isArray(row)) {
                            row.forEach((cell: any) => {
                                if (typeof cell === 'string') {
                                    const val = cell.toLowerCase()
                                    if (KEYWORDS.some(k => val.includes(k))) {
                                        matches++
                                    }
                                }
                            })
                        }

                        if (matches > maxMatches) {
                            maxMatches = matches
                            headerRowIndex = i
                        }
                    }

                    const rawData = XLSX.utils.sheet_to_json(sheet, { range: headerRowIndex })

                    // Filter valid rows
                    const jsonData: any[] = rawData.filter((row: any) => {
                        const keys = Object.keys(row);
                        return keys.some(k => row[k] !== undefined && String(row[k]).trim() !== '');
                    });

                    if (jsonData.length === 0) {
                        toast.push(
                            <Notification type="warning" className="border-none p-0 bg-transparent">
                                <p className="text-sm font-bold">File appears to be empty</p>
                            </Notification>
                        )
                        return
                    }

                    setParsedRecipients(jsonData)

                    // Try to calculate total amount if 'Amount' column exists
                    let calculatedTotal = 0
                    let hasAmountColumn = false

                    jsonData.forEach((row: any) => {
                        // Check for common amount keys (case insensitive logic would be better but simple for now)
                        const amount = row['Amount'] || row['amount'] || row['AMOUNT']
                        if (amount) {
                            hasAmountColumn = true
                            const val = parseFloat(amount.toString().replace(/,/g, ''))
                            if (!isNaN(val)) {
                                calculatedTotal += val
                            }
                        }
                    })

                    if (hasAmountColumn) {
                        setParsedTotalAmount(calculatedTotal)
                        setTotalAmount(calculatedTotal.toString())
                        setDistributionType('custom') // Switch to custom/weighted if amounts detected
                    } else {
                        setParsedTotalAmount(0)
                        // Don't auto-set total amount for equal split, user sets it
                    }

                    toast.push(
                        <Notification type="success" className="border-none p-0 bg-transparent">
                            <p className="text-sm font-bold">File parsed: {jsonData.length} valid rows found</p>
                        </Notification>,
                        { placement: 'top-center' }
                    )

                } catch (error) {
                    console.error("Error parsing file:", error)
                    toast.push(
                        <Notification type="danger" className="border-none p-0 bg-transparent">
                            <p className="text-sm font-bold">Failed to parse file</p>
                        </Notification>
                    )
                }
            }
            reader.readAsBinaryString(file)
        }
    }

    const resetForm = () => {
        setTotalAmount('')
        setUploadedFile(null)
        setDistributionType('equal')
        setGroupName('')
        setPurpose('')
        setTemplate(null)
    }

    const handleSubmit = async () => {
        if (!totalAmount || !uploadedFile) {
            toast.push(
                <Notification type="warning" className="border-none p-0 bg-transparent">
                    <p className="text-sm font-bold">Please upload a file and enter total amount</p>
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        try {
            const formData: BulkDistributionFormData = {
                totalAmount: parseFloat(totalAmount),
                distributionType,
                recipients: [],
                groupName,
                purpose,
            }

            await dispatch(bulkDistribution(formData)).unwrap()

            toast.push(
                <Notification type="success" className="border-none p-0 bg-transparent">
                    <div className="flex flex-col gap-1">
                        <p className="font-black text-[10px] text-emerald-600">Distribution Successful</p>
                        <p className="text-sm font-bold">
                            ₦{parseFloat(totalAmount).toLocaleString()} distributed successfully
                        </p>
                    </div>
                </Notification>,
                { placement: 'top-center' }
            )

            resetForm()
            dispatch(fetchBulkCreditsStats())
        } catch (error: any) {
            toast.push(
                <Notification type="danger" className="border-none p-0 bg-transparent">
                    <div className="flex flex-col gap-1">
                        <p className="font-black text-[10px] text-rose-600">Distribution Failed</p>
                        <p className="text-sm font-bold">{error || 'Please try again'}</p>
                    </div>
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    return {
        totalAmount,
        setTotalAmount,
        distributionType,
        setDistributionType,
        uploadedFile,
        handleFileUpload,
        template,
        setTemplate,
        purpose,
        setPurpose,
        groupName,
        setGroupName,
        recipient,
        setRecipient,
        message,
        setMessage,
        quickRecipients,
        setQuickRecipients,
        parsedRecipients,
        parsedTotalAmount,
        handleSubmit,
        resetForm
    }
}
