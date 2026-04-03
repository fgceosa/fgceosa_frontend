import { Card, Button, Badge, Switcher, Progress } from '@/components/ui'
import { Settings, AlertTriangle } from 'lucide-react'
import { providers } from '@/mock/apiProvider'
import type { Provider } from '../types'

const ApiProvidersList = () => {
    return (
        <div className="grid gap-6">
            {providers.map((provider: Provider) => (
                <Card
                    key={provider.id}
                    className="shadow-medium hover:shadow-strong transition-all duration-200"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-medium">
                                <Settings className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-primary font-medium">
                                    {provider.name}
                                </h4>
                                <p className="">{provider.models.join(', ')}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Badge
                                content={provider.status}
                                innerClass="shadow-soft"
                                badgeStyle={{
                                    backgroundColor:
                                        provider.status === 'Connected'
                                            ? '#10B981'
                                            : '#EF4444',
                                    color: '#fff',
                                }}
                            />
                            <Badge
                                content={
                                    <>
                                        {provider.health === 'Warning' && (
                                            <AlertTriangle className="w-3 h-3 mr-1 inline" />
                                        )}
                                        {provider.health}
                                    </>
                                }
                                innerClass="shadow-soft"
                                badgeStyle={{
                                    backgroundColor:
                                        provider.health === 'Healthy'
                                            ? '#10B981'
                                            : '#FBBF24',
                                    color: '#fff',
                                }}
                            />
                            <Switcher defaultChecked className="shadow-soft" />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <p className="font-medium text-primary mb-1">
                                Monthly Requests
                            </p>
                            <h4 className="font-bold text-primary">
                                {provider.requests}
                            </h4>
                        </div>
                        <div>
                            <p className="font-medium text-primary mb-1">
                                Monthly Cost
                            </p>
                            <h4 className="font-bold text-primary">
                                {provider.cost}
                            </h4>
                        </div>
                        <div>
                            <p className="font-medium text-primary mb-1">
                                Uptime
                            </p>
                            <div className="space-y-2">
                                <Progress
                                    percent={provider.uptime}
                                    showInfo={false}
                                    className="h-2 shadow-soft"
                                />
                                <p className="text-primary">
                                    {provider.uptime}%
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-primary mb-1">
                                Markup
                            </p>
                            <h4 className="font-bold text-success">
                                {provider.markup}
                            </h4>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                        {['Configure', 'View Logs', 'Test Connection'].map(
                            (label) => (
                                <Button
                                    key={label}
                                    variant="default"
                                    size="sm"
                                    className="shadow-soft hover:shadow-medium transition-all duration-200"
                                >
                                    {label}
                                </Button>
                            ),
                        )}
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default ApiProvidersList
