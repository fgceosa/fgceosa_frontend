import type { Period } from './types'

export const options: { value: Period; label: string }[] = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'annually', label: 'Annualy' },
]
