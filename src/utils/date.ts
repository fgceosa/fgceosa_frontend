import useSystemSettings from './hooks/useSystemSettings'
import dayjs from 'dayjs'

export function useFormattedDate() {
    const { settings } = useSystemSettings()
    
    const formatDate = (date: string | Date | number) => {
        if (!date) return 'N/A'
        // Simulate using the setting from system preferences
        // In a real app, this would map settings.dateFormat to dayjs format
        return dayjs(date).format(settings.dateFormat)
    }

    return { formatDate }
}

export function formatDate(date: string | Date | number, format = 'DD/MM/YYYY') {
    if (!date) return 'N/A'
    return dayjs(date).format(format)
}
