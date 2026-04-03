'use client'

import { useState, useEffect } from 'react'
import { Settings, Bot } from 'lucide-react'
import { Button, Spinner } from '@/components/ui'
import ModelSettings from './_components/ModelSettings'
import PromptInput from './_components/PromptInput'
import AIResponse from './_components/AIResponse'
import type { Model } from './types'
import { AIEngineService, InsufficientCreditsError } from '@/services/AIEngineService'
import type { AIModel } from '@/@types/aiEngine'
import { NAIRA_TO_USD_RATE } from '@/constants/currency.constant'

// Helper function to convert AIModel to Model with display properties
const convertToDisplayModel = (aiModel: AIModel): Model => {
    // Determine speed based on model name
    let speed = 'Medium'
    if (aiModel.name.toLowerCase().includes('mini') || aiModel.name.toLowerCase().includes('3.5')) {
        speed = 'Fast'
    } else if (aiModel.name.toLowerCase().includes('gpt-4') && !aiModel.name.toLowerCase().includes('turbo')) {
        speed = 'Slow'
    }

    // Determine quality based on model
    let quality = 'Good'
    if (aiModel.name.toLowerCase().includes('opus') || aiModel.name.toLowerCase().includes('gpt-4')) {
        quality = 'High'
    }

    // Format cost
    const cost = aiModel.is_free
        ? '🎁 FREE'
        : `₦${((aiModel.pricing.input + aiModel.pricing.output) / 2 * 25 / 1000).toFixed(1)}/1k tokens`

    return {
        id: aiModel.id,
        name: aiModel.name,
        cost,
        speed,
        quality,
        is_free: aiModel.is_free,
        provider: aiModel.provider,
        pricing: aiModel.pricing,
    }
}

export default function AIPlaygroundView() {
    const [models, setModels] = useState<Model[]>([])
    const [isLoadingModels, setIsLoadingModels] = useState(true)
    const [selectedModel, setSelectedModel] = useState('')
    const [prompt, setPrompt] = useState('')
    const [response, setResponse] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [temperature, setTemperature] = useState(0.7)
    const [maxTokens, setMaxTokens] = useState(1014)
    const [usage, setUsage] = useState<{ totalTokens: number; promptTokens: number; completionTokens: number } | null>(null)
    const [showSettings, setShowSettings] = useState(false)

    // Fetch available models on mount
    useEffect(() => {
        const fetchModels = async () => {
            try {
                setIsLoadingModels(true)
                const result = await AIEngineService.getAvailableModels()
                const displayModels = result.models.map(convertToDisplayModel)
                setModels(displayModels)

                // Set default model to first free model or first model
                const defaultModel = displayModels.find(m => m.is_free) || displayModels[0]
                if (defaultModel) {
                    setSelectedModel(defaultModel.id)
                }
            } catch (error) {
                console.error('Failed to fetch models:', error)
                // Set fallback models
                setModels([{
                    id: 'gpt-4o-mini',
                    name: 'GPT-4o Mini',
                    cost: '🎁 FREE',
                    speed: 'Fast',
                    quality: 'Good',
                    is_free: true,
                    provider: 'OpenAI',
                }])
                setSelectedModel('gpt-4o-mini')
            } finally {
                setIsLoadingModels(false)
            }
        }

        fetchModels()
    }, [])

    const handleSubmit = async () => {
        if (!prompt.trim()) return
        setIsLoading(true)
        setResponse('')

        try {
            const result = await AIEngineService.chatCompletion({
                messages: [{ role: 'user', content: prompt }],
                model: selectedModel,
                temperature: temperature,
                maxTokens: maxTokens,
            })

            if (result.usage) {
                setUsage(result.usage)
            }

            if (result.choices && result.choices.length > 0) {
                setResponse(result.choices[0].message.content)
            } else {
                setResponse('Received an empty response from the AI.')
            }
        } catch (error: any) {
            console.error('AI Request failed:', error)
            let errorMessage = 'Failed to get response from AI. Please try again.'

            if (error instanceof InsufficientCreditsError) {
                errorMessage = `Insufficient credits. Current balance: ₦${(error.currentBalance * NAIRA_TO_USD_RATE).toFixed(2)}. Please top up your wallet.`
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail
            }

            setResponse(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const selectedModelName =
        models.find((m) => m.id === selectedModel)?.name || selectedModel

    if (isLoadingModels) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Spinner size={40} />
                    <p className="mt-4 text-muted-foreground">Loading models...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-950/50 -m-4 sm:-m-8 p-4 sm:p-8">
            <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-700 font-sans">
                {/* Enterprise Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 pb-2 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-3 lg:space-y-1">
                        <div className="flex items-center gap-3 sm:gap-4 mb-2">
                            <span className="text-[9px] sm:text-[10px] font-black text-primary whitespace-nowrap">Intelligence</span>
                            <div className="h-px w-8 sm:w-12 bg-primary/20" />
                            <span className="text-[9px] sm:text-[10px] font-black text-gray-400 whitespace-nowrap">Playground</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 shrink-0">
                                <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                            </div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-950 dark:text-white leading-none">
                                AI Playground
                            </h1>
                        </div>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 lg:pl-[3.25rem] font-medium max-w-2xl leading-relaxed mt-1">
                            Experiment with different AI models, adjust parameters, and test prompts.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        {/* Settings toggle — only visible on mobile */}
                        <Button
                            variant="plain"
                            onClick={() => setShowSettings(!showSettings)}
                            className="lg:hidden h-11 px-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl shadow-lg text-gray-500 hover:text-primary transition-all flex items-center gap-2 group flex-1"
                        >
                            <Settings className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                            <span className="font-bold text-[12px]">{showSettings ? 'Hide Settings' : 'Show Settings'}</span>
                        </Button>
                        <Button
                            variant="plain"
                            size="lg"
                            className="hidden lg:flex h-14 px-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-none text-gray-500 hover:text-primary transition-all hover:scale-105 active:scale-95 items-center gap-3 group w-auto"
                        >
                            <Settings className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                            <span className="font-bold text-[13px]">Expert Settings</span>
                        </Button>
                    </div>
                </div>


                {/* Background Decoration */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
                        {/* Settings Panel — always visible on lg+, collapsible on mobile */}
                        <div className={`${showSettings ? 'block' : 'hidden'} lg:block`}>
                            <ModelSettings
                                models={models}
                                selectedModel={selectedModel}
                                setSelectedModel={setSelectedModel}
                                temperature={temperature}
                                setTemperature={setTemperature}
                                maxTokens={maxTokens}
                                setMaxTokens={setMaxTokens}
                            />
                        </div>

                        <div className={`col-span-1 lg:col-span-3 space-y-6 sm:space-y-8 ${showSettings ? 'hidden lg:block' : 'block'}`}>
                            <PromptInput
                                prompt={prompt}
                                setPrompt={setPrompt}
                                handleSubmit={handleSubmit}
                                isLoading={isLoading}
                            />

                            <AIResponse
                                response={response}
                                isLoading={isLoading}
                                selectedModelName={selectedModelName}
                                maxTokens={maxTokens}
                                usage={usage}
                                modelPricing={models.find(m => m.id === selectedModel)?.pricing}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
