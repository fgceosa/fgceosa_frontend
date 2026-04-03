import { Table, Card } from '@/components/ui'
import RegistryTableRow from './RegistryTableRow'
import type { RegistryModel } from '../types'
import { VscServer } from 'react-icons/vsc'

const { THead, TBody, Th, Tr } = Table

interface RegistryTableProps {
    data: RegistryModel[]
    loading: boolean
}

const RegistryTable = ({ data, loading }: RegistryTableProps) => {
    return (
        <Card className="p-0 shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 transition-all">
            <div className="p-6 md:p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10">
                <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Model Registry</h3>
                    <p className="text-sm font-bold text-gray-400 mt-1">Manage all registered AI models</p>
                </div>
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                    <VscServer className="w-5 h-5 text-primary" />
                </div>
            </div>

            <div className="p-6 md:p-8">
                <div className="overflow-x-auto">
                    <Table className="w-full min-w-[1200px]">
                        <THead className="bg-gray-50/50 dark:bg-gray-800/30">
                            <Tr>
                                <Th className="px-6 py-5 text-left rounded-l-2xl text-[10px] font-black text-gray-400">AI Model</Th>
                                <Th className="px-6 py-5 text-left text-[10px] font-black text-gray-400">Provider</Th>
                                <Th className="px-6 py-5 text-left text-[10px] font-black text-gray-400">Memory Capacity</Th>
                                <Th className="px-6 py-5 text-left text-[10px] font-black text-gray-400">Cost (1k tokens)</Th>
                                <Th className="px-6 py-5 text-center text-[10px] font-black text-gray-400">Status</Th>
                                <Th className="px-6 py-5 text-center text-[10px] font-black text-gray-400">Availability</Th>
                                < Th className="px-6 py-5 text-center rounded-r-2xl text-[10px] font-black text-gray-400">Actions</Th>
                            </Tr>
                        </THead>
                        <TBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <Tr key={i} className="animate-pulse">
                                        <td colSpan={8} className="px-6 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                                                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full max-w-[200px]" />
                                            </div>
                                        </td>
                                    </Tr>
                                ))
                            ) : data.length > 0 ? (
                                data.map(model => (
                                    <RegistryTableRow
                                        key={model.id}
                                        model={model}
                                    />
                                ))
                            ) : (
                                <Tr>
                                    <td colSpan={8} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                                <VscServer className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-400 font-bold text-[10px]">No models registered in the library</p>
                                        </div>
                                    </td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </div>
            </div>
        </Card>
    )
}

export default RegistryTable
