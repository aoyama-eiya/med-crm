'use client'

import { useState, useEffect } from 'react'

const TABS = [
    { id: 'tab1', label: 'メニューA', icon: 'home' },
    { id: 'tab2', label: 'メニューB', icon: 'widgets' },
]

export default function LivePreview() {
    const [isOpen, setIsOpen] = useState(false)
    const [config, setConfig] = useState<any>(null)

    // Load config
    const loadConfig = () => {
        try {
            const saved = localStorage.getItem('richMenuConfig')
            if (saved) {
                setConfig(JSON.parse(saved))
            } else {
                // Default fallback
                setConfig({
                    template: 'grid-3x2',
                    slots: {},
                    useTabs: true,
                    activeTab: 'tab1',
                    isRotated: false
                })
            }
        } catch (e) {
            console.error('Failed to load live preview config', e)
        }
    }

    useEffect(() => {
        loadConfig()
        const handler = () => loadConfig()
        window.addEventListener('storage-rich-menu', handler)
        return () => window.removeEventListener('storage-rich-menu', handler)
    }, [])

    // Internal state for tabs
    const [previewTab, setPreviewTab] = useState('tab1')
    useEffect(() => {
        if (config?.activeTab) {
            // Respect config initial tab, but allow switching
        }
    }, [config])

    if (!config) return null

    // Grid Logic
    const currentTemplate = config.template || 'grid-3x2'
    const isRotated = config.isRotated ?? false
    const buttonCount = currentTemplate === 'grid-3x2' ? 6 : 3

    const getGridClass = () => {
        if (currentTemplate === 'grid-3x2') return 'grid-cols-3 grid-rows-2'
        if (currentTemplate === 'large-1') {
            return isRotated ? 'grid-cols-2 grid-rows-2' : 'grid-cols-2 grid-rows-2'
        }
        return 'grid-cols-3 grid-rows-2'
    }

    const getSpanClass = (index: number) => {
        if (currentTemplate === 'large-1' && index === 0) {
            return isRotated ? 'row-span-2 w-full h-full' : 'col-span-2 w-full h-full'
        }
        return ''
    }

    const slotConfigs = config.slots || {}
    const activeTab = previewTab

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">

            {/* Popup Window */}
            {isOpen && (
                <div className="mb-4 w-[300px] bg-white rounded-3xl shadow-2xl border-4 border-[#333] overflow-hidden animate-slide-up origin-bottom-right">
                    {/* Mock Phone Header */}
                    <div className="bg-[#232d36] h-10 flex items-center justify-between px-4 text-white">
                        <span className="text-xs font-bold">Med CRM</span>
                        <div className="flex gap-1">
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
                                <span className="material-symbols-rounded text-base">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="h-[500px] bg-[#8cabd9] flex flex-col relative">
                        {/* Chat Area */}
                        <div className="flex-1 p-3 overflow-y-auto space-y-4">
                            <div className="flex gap-2 items-end">
                                <div className="w-8 h-8 rounded-full bg-gray-300 border border-white flex-shrink-0"></div>
                                <div className="bg-white p-3 rounded-xl rounded-tl-none text-xs text-[#1d1d1f] shadow-sm max-w-[85%] leading-relaxed">
                                    <p>現在設定中のリッチメニューです。<br />実際の動作を確認できます。</p>
                                </div>
                            </div>
                            {/* Hint */}
                            <div className="flex justify-center">
                                <span className="bg-black/20 text-white px-2 py-1 rounded-full text-[10px]">自動更新中</span>
                            </div>
                        </div>

                        {/* Rich Menu Area */}
                        <div className="bg-white flex flex-col w-full z-20 border-t border-gray-300 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
                            {/* Tabs */}
                            {config.useTabs && (
                                <div className="flex border-b border-gray-200 bg-[#F5F5F5] h-10">
                                    {TABS.map((tab) => (
                                        <div
                                            key={tab.id}
                                            onClick={() => setPreviewTab(tab.id)}
                                            className={`flex-1 flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors ${previewTab === tab.id
                                                    ? 'text-[#1d1d1f] bg-white border-b-2 border-transparent' // Active styling
                                                    : 'text-gray-500 hover:bg-gray-100'
                                                }`}
                                        >
                                            {tab.label.split(' ')[0]}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Grid */}
                            <div className="aspect-[4/3] w-full bg-white relative">
                                <div className={`w-full h-full grid gap-px bg-gray-200 border-2 border-transparent p-px ${getGridClass()}`}>
                                    {Array.from({ length: buttonCount }).map((_, i) => {
                                        const conf = slotConfigs[`${activeTab}-${i}`]
                                        const span = getSpanClass(i)
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => alert(`Button ${i + 1} clicked: ${conf?.label || 'Empty'}\nAction: ${conf?.type || 'web'} -> ${conf?.value || 'empty'}`)}
                                                className={`relative bg-white active:bg-gray-100 transition-all flex flex-col items-center justify-center gap-1 group overflow-hidden ${span}`}
                                            >
                                                <span className="material-symbols-rounded text-2xl text-mac-accent">
                                                    {conf?.type === 'tel' ? 'call' : conf?.type === 'web' ? 'public' : 'smart_button'}
                                                </span>
                                                <span className="text-[9px] font-bold truncate w-full px-1 text-center text-[#1d1d1f]">
                                                    {conf?.label || `Btn ${i + 1}`}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-mac-text text-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all border-2 border-white/20"
                title="モバイルプレビュー"
            >
                <span className="material-symbols-rounded text-2xl">{isOpen ? 'close' : 'smartphone'}</span>
            </button>
        </div>
    )
}
