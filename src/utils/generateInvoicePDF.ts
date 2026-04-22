import { jsPDF } from 'jspdf'
import dayjs from 'dayjs'

interface InvoiceData {
    invoiceId: string
    date: string
    status: string
    member: string
    email: string
    method: string
    paid: string
    ref: string
}

interface SystemSettings {
    associationName: string
    logoUrl?: string
}

export const generateInvoicePDF = async (data: InvoiceData, settings: SystemSettings) => {
    const doc = new jsPDF()
    const brandMaroon = '#8B0000'
    
    // Function to load image
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
            img.onerror = () => resolve('')
        })
    }

    const logoBase64 = await loadImage('/img/logo/fgceosa-logo.png')
    
    // Header Bar
    doc.setFillColor(brandMaroon)
    doc.rect(0, 0, 210, 50, 'F')
    
    // Add Logo Container
    if (logoBase64) {
        doc.setFillColor(255, 255, 255)
        doc.roundedRect(18, 8, 44, 34, 4, 4, 'F')
        doc.addImage(logoBase64, 'PNG', 20, 10, 40, 30)
    }
    
    // Brand Title
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('OFFICIAL PAYMENT RECEIPT', 190, 28, { align: 'right' })
    
    // Reset Text Color
    doc.setTextColor(50, 50, 50)
    
    // Invoice Info
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('INVOICE NUMBER', 20, 65)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(data?.invoiceId || 'N/A', 20, 72)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('PAYMENT DATE', 140, 65)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(data?.date || 'N/A', 140, 72)
    
    // Status Badge
    doc.setFillColor(236, 253, 245)
    doc.roundedRect(20, 85, 50, 10, 2, 2, 'F')
    doc.setTextColor(5, 150, 105)
    doc.setFontSize(9)
    doc.text(`${(data?.status || 'PAID').toUpperCase()} SUCCESSFULLY`, 45, 91.5, { align: 'center' })
    
    // Divider
    doc.setDrawColor(230, 230, 230)
    doc.line(20, 105, 190, 105)
    
    // Member Details
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('MEMBER INFORMATION', 20, 120)
    
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(data?.member || 'N/A', 20, 132)
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(data?.email || 'N/A', 20, 140)
    
    // Transaction Box
    doc.setFillColor(249, 250, 251)
    doc.roundedRect(20, 155, 170, 50, 5, 5, 'F')
    
    doc.setTextColor(brandMaroon)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYMENT DETAILS', 30, 170)
    
    doc.setTextColor(80, 80, 80)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Annual Dues Subscription', 30, 182)
    doc.text(`Channel: ${data?.method || 'N/A'}`, 30, 190)
    
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(`NGN ${data?.paid || '0'}`, 180, 190, { align: 'right' })
    
    // Footer Note
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.text(`Thank you for your tireless support of the ${settings.associationName} community.`, 105, 240, { align: 'center' })
    doc.text('This is a computer generated receipt and requires no signature.', 105, 247, { align: 'center' })
    
    doc.save(`${data?.invoiceId || 'invoice'}.pdf`)
}
