/**
 * TestTopUpButton Component
 *
 * FOR LOCAL DEVELOPMENT ONLY
 * Provides a quick way to add credits to your wallet without Monnify
 * Uses Redux Toolkit for state management
 *
 * Usage:
 * import TestTopUpButton from '@/components/template/TestTopUpButton'
 *
 * <TestTopUpButton />
 */

'use client'

import React, { useState } from 'react'
import { useWalletRedux } from '@/hooks/useWalletRedux'
import { BiMoney } from 'react-icons/bi'

interface TestTopUpButtonProps {
    onSuccess?: (amount: number) => void
    onError?: (error: string) => void
}

const TestTopUpButton: React.FC<TestTopUpButtonProps> = ({ onSuccess, onError }) => {
    const { testTopUp, isLoading } = useWalletRedux({ fetchOnMount: false })
    const [amount, setAmount] = useState<number>(5000)
    const [showInput, setShowInput] = useState<boolean>(false)

    const presetAmounts = [1000, 5000, 10000, 25000]

    const handleTestTopUp = async (topUpAmount?: number) => {
        const finalAmount = topUpAmount || amount

        try {
            await testTopUp(finalAmount)

            // Show success message
            if (onSuccess) {
                onSuccess(finalAmount)
            } else {
                alert(`✅ Successfully added ₦${finalAmount.toLocaleString()} to your wallet!`)
            }

            // Reset form
            setShowInput(false)
            setAmount(5000)
        } catch (error: any) {
            const errorMessage = error?.response?.data?.detail || error?.message || 'Test top-up failed'

            if (onError) {
                onError(errorMessage)
            } else {
                alert(`❌ Error: ${errorMessage}`)
            }
        }
    }

    return (
        <div className="border border-yellow-400 bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
                <BiMoney className="w-5 h-5 text-yellow-600" />
                <h3 className="font-bold text-yellow-800">Test Top-Up (Dev Only)</h3>
            </div>

            <p className="text-sm text-yellow-700 mb-4">
                Instantly add credits to your wallet for testing. This only works in local/development mode.
            </p>

            {!showInput ? (
                <div className="flex flex-wrap gap-2">
                    {presetAmounts.map((presetAmount) => (
                        <button
                            key={presetAmount}
                            onClick={() => handleTestTopUp(presetAmount)}
                            disabled={isLoading}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Adding...' : `₦${presetAmount.toLocaleString()}`}
                        </button>
                    ))}
                    <button
                        onClick={() => setShowInput(true)}
                        disabled={isLoading}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
                    >
                        Custom Amount
                    </button>
                </div>
            ) : (
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        min={100}
                        step={100}
                        className="border border-gray-300 rounded px-3 py-2 flex-1"
                        placeholder="Amount (₦)"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleTestTopUp()}
                        disabled={isLoading || amount < 100}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Adding...' : 'Add'}
                    </button>
                    <button
                        onClick={() => {
                            setShowInput(false)
                            setAmount(5000)
                        }}
                        disabled={isLoading}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {amount < 100 && showInput && (
                <p className="text-xs text-red-600 mt-2">Minimum amount is ₦100</p>
            )}
        </div>
    )
}

export default TestTopUpButton
