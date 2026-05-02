import React from 'react'
import { Dialog, Button, toast } from '@/components/ui'
import { CheckCircle2, Download, Mail } from 'lucide-react'
import Logo from '@/components/template/Logo'
import { jsPDF } from 'jspdf'
import useSystemSettings from '@/utils/hooks/useSystemSettings'

export default function InvoiceModal({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any }) {
    const { settings } = useSystemSettings()
    
    if (!data) return null

    const handleDownload = async () => {
        const doc = new jsPDF()
        const brandMaroon = '#8B0000'
        
        const loadImage = (url: string): Promise<string> => {
            return new Promise((resolve) => {
                const img = new Image()
                img.crossOrigin = 'Anonymous'
                img.src = url
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    canvas.width = img.width
                    canvas.height = img.height
                    const ctx = canvas.getContext('2d')
                    ctx?.drawImage(img, 0, 0)
                    resolve(canvas.toDataURL('image/png'))
                }
            })
        }

        const logoBase64 = await loadImage('/img/logo/fgceosa_logo.jpeg')
        
        doc.setFillColor(brandMaroon)
        doc.rect(0, 0, 210, 50, 'F')
        
        if (logoBase64) {
            doc.setFillColor(255, 255, 255)
            doc.roundedRect(18, 8, 44, 34, 4, 4, 'F')
            doc.addImage(logoBase64, 'PNG', 20, 10, 40, 30)
        }
        
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(22)
        doc.setFont('helvetica', 'bold')
        doc.text('OFFICIAL PAYMENT RECEIPT', 190, 28, { align: 'right' })
        
        doc.setTextColor(50, 50, 50)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text('INVOICE NUMBER', 20, 65)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(data?.invoiceId || data?.ref || 'N/A', 20, 72)
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text('PAYMENT DATE', 140, 65)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(data?.date || 'N/A', 140, 72)
        
        doc.setFillColor(236, 253, 245)
        doc.roundedRect(20, 85, 50, 10, 2, 2, 'F')
        doc.setTextColor(5, 150, 105)
        doc.setFontSize(9)
        doc.text(`${data?.status || 'PAID'} SUCCESSFULLY`, 45, 91.5, { align: 'center' })
        
        doc.setDrawColor(230, 230, 230)
        doc.line(20, 105, 190, 105)
        
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text('MEMBER INFORMATION', 20, 120)
        
        doc.setTextColor(30, 30, 30)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text(data?.member || 'Verified Member', 20, 132)
        
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.text(data?.email || 'N/A', 20, 140)
        
        doc.setFillColor(249, 250, 251)
        doc.roundedRect(20, 155, 170, 50, 5, 5, 'F')
        
        doc.setTextColor(brandMaroon)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text('PAYMENT DETAILS', 30, 170)
        
        doc.setTextColor(80, 80, 80)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.text(data?.description || 'Annual Subscription Contribution', 30, 182)
        doc.text(`Channel: ${data?.method || 'Online Channel'}`, 30, 190)
        
        doc.setTextColor(30, 30, 30)
        doc.setFontSize(22)
        doc.setFont('helvetica', 'bold')
        const amount = data?.amount || data?.paid || '0'
        doc.text(`NGN ${amount.toLocaleString()}`, 180, 190, { align: 'right' })
        
        doc.setTextColor(150, 150, 150)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'italic')
        doc.text(`Thank you for your tireless support of ${settings.associationName}.`, 105, 240, { align: 'center' })
        doc.text('This is a computer generated receipt and requires no signature.', 105, 247, { align: 'center' })
        
        doc.save(`${data?.invoiceId || 'invoice'}.pdf`)
        toast.success('Professional PDF receipt downloaded')
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={720}
            className="p-0 border-none bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all"
        >
            <div className="p-8 sm:p-12 pb-0">
                <div className="flex justify-between items-start mb-12">
                    <div className="space-y-4">
                        <Logo logoWidth={130} logoHeight={58} className="mb-2" />
                        <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 w-max">
                            <p className="text-[9px] font-black text-gray-400 capitalize tracking-[0.3em] leading-none">Official Payment Receipt</p>
                        </div>
                    </div>
                    <div className="text-right space-y-2">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter capitalize leading-none">Invoice</h2>
                        <p className="text-[11px] font-black text-gray-400 capitalize tracking-widest leading-none">{data.invoiceId || data.ref}</p>
                        <div className="pt-2">
                            <span className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black capitalize tracking-widest border border-emerald-100 shadow-sm">
                                {data.status || 'Paid'} Successfully
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 mb-12 pb-12 border-b border-gray-100 dark:border-gray-800">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-gray-400 capitalize tracking-widest pl-1">Member Information</p>
                        <div className="space-y-1">
                            <h4 className="text-base font-black text-gray-900 dark:text-white capitalize leading-tight">{data.member || 'Member Name'}</h4>
                            <p className="text-[12px] font-bold text-gray-500">{data.email || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 capitalize tracking-widest pl-1">Payment Date</p>
                            <p className="text-sm font-black text-gray-900 dark:text-white capitalize">{data.date}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 capitalize tracking-widest pl-1">Transaction ID</p>
                            <p className="text-sm font-black text-gray-900 dark:text-white font-mono tracking-tighter ">{data.invoiceId || data.ref}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <p className="text-[10px] font-black text-gray-400 capitalize tracking-widest mb-6 pl-1">Payment Details</p>
                    <div className="bg-gray-50/50 dark:bg-gray-800/10 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-inner">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h5 className="text-[15px] font-black text-gray-900 dark:text-white capitalize tracking-tight">{data.description || 'Annual Subscription'}</h5>
                                    <p className="text-[11px] font-black text-gray-400 mt-1 capitalize tracking-widest">Via {data.method || 'Online'} Channel</p>
                                </div>
                            </div>
                            <span className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">₦{(data.amount || data.paid || 0).toLocaleString()}</span>
                        </div>
                        <div className="pt-6 mt-6 border-t border-gray-200/50 dark:border-gray-700 flex justify-between items-center">
                            <span className="text-[11px] font-black text-gray-400 capitalize tracking-[0.2em]">Total Amount Paid</span>
                            <span className="text-2xl font-black text-[#8B0000] dark:text-red-400 uppercase tracking-tighter shadow-sm">₦{(data.amount || data.paid || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center pb-12">
                    <p className="text-[13px] font-bold text-gray-400 max-w-md mx-auto leading-relaxed">Thank you for your contribution. Your support ensures the continued growth of {settings.associationName}.</p>
                </div>
            </div>

            <div className="mt-auto p-8 sm:px-12 bg-gray-50/20 dark:bg-gray-900/10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-6 border-t border-gray-100 dark:border-gray-800">
                <Button 
                    variant="plain" 
                    onClick={onClose}
                    className="h-14 px-8 rounded-2xl font-black text-[11px] capitalize tracking-[0.2em] text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex-1 sm:flex-none justify-center border-none font-mono"
                >
                    Cancel
                </Button>
                <div className="flex gap-4 w-full sm:w-auto">
                    <Button 
                        onClick={handleDownload}
                        className="h-14 px-10 bg-[#8B0000] hover:bg-[#700000] text-white hover:text-white rounded-2xl font-black text-[11px] capitalize tracking-[0.2em] shadow-xl shadow-[#8B0000]/20 hover:-translate-y-1 transition-all flex gap-3 justify-center items-center flex-1 sm:flex-none border-none group"
                    >
                        <Download className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                        Download PDF
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}
