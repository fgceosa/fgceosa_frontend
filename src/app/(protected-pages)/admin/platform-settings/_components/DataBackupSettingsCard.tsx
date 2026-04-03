import { Button, Card, Checkbox, Input, Select } from '@/components/ui'
import { Database } from 'lucide-react'
import type { DataBackupCardProps } from '../types'
import { EXPORT_FORMAT_OPTIONS } from '../types'

export default function DataBackupSettingsCard({
    value,
    onChange,
}: DataBackupCardProps) {
    const handleBackupNow = () => {
        console.log('Manual backup triggered')
        // TODO: Implement actual backup trigger
    }

    return (
        <Card bordered>
            <div className="space-y-5">
                <div>
                    <h3 className="flex items-center text-primary font-semibold gap-2">
                        <Database className="w-5 h-5" />
                        Data & Backup
                    </h3>
                    <p className="text-sm text-gray-600">
                        Database backup and export configuration
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium">
                                Automatic Backup
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                                Enable daily automated database backups
                            </p>
                        </div>
                        <Checkbox
                            checked={value.autoBackup}
                            onChange={(checked: boolean) =>
                                onChange({ ...value, autoBackup: checked })
                            }
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Backup Retention (days)
                        </label>
                        <Input
                            type="number"
                            min={7}
                            max={365}
                            value={value.retentionDays}
                            onChange={(e) =>
                                onChange({
                                    ...value,
                                    retentionDays: parseInt(e.target.value) || 30,
                                })
                            }
                            placeholder="30"
                        />
                        <p className="text-xs text-gray-500">
                            How long to keep backup files (7-365 days)
                        </p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Data Export Format
                        </label>
                        <Select
                            value={value.exportFormat}
                            onChange={(format) =>
                                onChange({
                                    ...value,
                                    exportFormat: format as 'json' | 'csv' | 'xml',
                                })
                            }
                            options={EXPORT_FORMAT_OPTIONS}
                        />
                        <p className="text-xs text-gray-500">
                            Format for manual data exports
                        </p>
                    </div>

                    <div className="pt-2 border-t">
                        <Button
                            variant="default"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={handleBackupNow}
                        >
                            <Database className="w-4 h-4" />
                            Create Backup Now
                        </Button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Manually trigger a full database backup
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    )
}
