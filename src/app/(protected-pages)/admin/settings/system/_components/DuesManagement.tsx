import React, { useState, useEffect, useCallback } from 'react'
import { Calendar, Plus, Edit3, Trash2, Check, X, Wallet, ArrowRight } from 'lucide-react'
import { Card, Button, Input, Select, DatePicker, Notification, toast, Tag } from '@/components/ui'
import Loading from '@/components/shared/Loading'
import CreateDuesModal from './CreateDuesModal'
import EditDuesModal from './EditDuesModal'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiGetDues, apiCreateDue, apiUpdateDue, apiDeleteDue, type Due } from '@/services/DuesService'

export default function DuesManagement() {
    const [dues, setDues] = useState<Due[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editingDue, setEditingDue] = useState<Due | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const fetchDues = useCallback(async () => {
        try {
            setLoading(true)
            const response = await apiGetDues()
            if (response) {
                setDues(response)
            }
        } catch (error) {
            console.error('Failed to fetch dues:', error)
            toast.error('Failed to load dues')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDues()
    }, [fetchDues])

    const handleToggleActive = async (due: Due) => {
        try {
            const success = await apiUpdateDue(due.id, { is_active: !due.is_active })
            if (success) {
                setDues(dues.map(d => d.id === due.id ? { ...d, is_active: !due.is_active } : d))
                toast.success('Dues status updated successfully')
            }
        } catch (error) {
            toast.error('Failed to update dues status')
        }
    }

    const handleCreateConfirm = async (data: any) => {
        try {
            const newDue = await apiCreateDue({
                title: data.title,
                amount: Number(data.amount),
                due_date: data.dueDate,
                description: data.description,
                is_active: true
            })
            if (newDue) {
                setDues([newDue, ...dues])
                setIsAdding(false)
                toast.success(`${newDue.title} created and assigned to all members`)
            }
        } catch (error) {
            toast.error('Failed to create dues')
        }
    }

    const handleEditConfirm = async (data: any) => {
        try {
            const updated = await apiUpdateDue(data.id, {
                title: data.title,
                amount: Number(data.amount),
                due_date: data.dueDate,
                description: data.description,
                is_active: data.isActive
            })
            if (updated) {
                setDues(dues.map(d => d.id === data.id ? updated : d))
                setIsEditing(false)
                setEditingDue(null)
                toast.success(`${data.title} updated successfully`)
            }
        } catch (error) {
            toast.error('Failed to update dues')
        }
    }

    const handleDelete = async () => {
        if (!deletingId) return
        
        try {
            const response = await apiDeleteDue(deletingId)
            if (response) {
                setDues(dues.filter(d => d.id !== deletingId))
                toast.success('Due deleted successfully')
            }
        } catch (error) {
            toast.error('Failed to delete due')
        } finally {
            setDeleteDialogOpen(false)
            setDeletingId(null)
        }
    }

    if (loading) {
        return <Loading loading={true} />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Dues Management</h2>
                    <p className="text-[13px] font-medium text-gray-500">Configure global dues and payment expectations for members.</p>
                </div>
                <Button 
                    variant="solid" 
                    size="sm" 
                    onClick={() => setIsAdding(true)}
                    className="h-12 px-8 bg-[#8B0000] text-white rounded-2xl font-black text-[10px] capitalize shadow-lg shadow-[#8B0000]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create New Dues
                </Button>
            </div>

            <CreateDuesModal 
                isOpen={isAdding} 
                onClose={() => setIsAdding(false)} 
                onConfirm={handleCreateConfirm} 
            />

            <EditDuesModal 
                isOpen={isEditing} 
                onClose={() => setIsEditing(false)} 
                onConfirm={handleEditConfirm}
                data={editingDue ? {
                    ...editingDue,
                    dueDate: editingDue.due_date,
                    isActive: editingDue.is_active
                } : null}
            />

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                type="danger"
                title="Delete Due"
                children="Are you sure you want to delete this due? This action cannot be undone and will remove it from all member records."
                confirmButtonColor="red-600"
            />

            <div className="grid grid-cols-1 gap-4">
                {dues.length === 0 ? (
                    <Card className="p-12 border-dashed border-2 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <Wallet className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">No Dues Found</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">You haven't created any dues yet. Click the button above to get started.</p>
                    </Card>
                ) : (
                    dues.map((due) => (
                        <Card 
                            key={due.id} 
                            className={`p-6 bg-white dark:bg-gray-800 rounded-[2rem] border transition-all duration-300 group hover:shadow-xl ${
                                due.is_active ? 'border-gray-100 dark:border-gray-700 shadow-sm' : 'border-gray-100 dark:border-gray-800 opacity-60'
                            }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${
                                        due.is_active ? 'bg-[#8B0000]/5 border-[#8B0000]/10 text-[#8B0000]' : 'bg-gray-100 border-gray-200 text-gray-400'
                                    }`}>
                                        <Wallet className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{due.title}</h3>
                                            {due.is_active ? (
                                                <Tag className="bg-emerald-100 text-emerald-600 border-emerald-200 text-xs font-bold capitalize px-2 py-0.5 rounded-lg">Active</Tag>
                                            ) : (
                                                <Tag className="bg-gray-100 text-gray-500 border-gray-200 text-xs font-bold capitalize px-2 py-0.5 rounded-lg">Inactive</Tag>
                                            )}
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 line-clamp-1">{due.description}</p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-400 capitalize tracking-tight">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Due: {new Date(due.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                            <div className="text-sm font-bold text-[#8B0000] capitalize tracking-tight">
                                                ₦{Number(due.amount).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button 
                                        size="sm" 
                                        variant="plain" 
                                        className={`rounded-xl px-4 h-10 text-sm font-bold capitalize tracking-tight transition-all ${
                                            due.is_active 
                                                ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/10' 
                                                : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/10'
                                        }`}
                                        onClick={() => handleToggleActive(due)}
                                    >
                                        {due.is_active ? (
                                            <div className="flex items-center gap-2"><X className="w-3.5 h-3.5" /> Deactivate</div>
                                        ) : (
                                            <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5" /> Activate</div>
                                        )}
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="plain" 
                                        className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                        onClick={() => {
                                            setEditingDue(due)
                                            setIsEditing(true)
                                        }}
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="plain" 
                                        className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-600 transition-colors"
                                        onClick={() => {
                                            setDeletingId(due.id)
                                            setDeleteDialogOpen(true)
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <Card className="p-6 bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-[2rem]">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                        <ArrowRight className="w-5 h-5 text-emerald-600 rotate-[-45deg]" />
                    </div>
                    <div>
                        <h4 className="text-base font-black text-emerald-900 dark:text-emerald-400 capitalize tracking-tight mb-1">Impact Analysis</h4>
                        <p className="text-sm font-medium text-emerald-800/70 dark:text-emerald-400/70 leading-relaxed">
                            Active dues are instantly visible to all members. Changes to the amount or due date will reflect on individual member dashboards immediately. Historical records of paid dues remain unaffected.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
