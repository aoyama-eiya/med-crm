'use client'

import { useState, useEffect } from 'react'

const TABS = [
    { id: 'tab1', label: 'メニューA (メイン)', icon: 'home' },
    { id: 'tab2', label: 'メニューB (サブ)', icon: 'widgets' },
]

// Templates without 'list'
const TEMPLATES = [
    { id: 'grid-3x2', name: '標準 (6ボタン)', icon: 'grid_view' },
    { id: 'large-1', name: '強調 (1特大+2小)', icon: 'ad_units' },
]

export default function RichMenus() {
    const [useTabs, setUseTabs] = useState(true)
    const [activeTab, setActiveTab] = useState('tab1')
    const [currentTemplate, setCurrentTemplate] = useState('grid-3x2')
    const [isRotated, setIsRotated] = useState(false) // For Large template orientation

    // Selection State
    const [selectedSlot, setSelectedSlot] = useState<number | null>(0)
    const [slotConfigs, setSlotConfigs] = useState<Record<string, { type: string, label: string, value: string }>>({
        'tab1-0': { type: 'web', label: '予約サイト', value: 'https://example.com' },
        'tab1-1': { type: 'tel', label: '電話予約', value: '03-1234-5678' }
    })

    // Persist for Live Preview
    const [mounted, setMounted] = useState(false)

    // Load initially
    useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem('richMenuConfig')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setCurrentTemplate(parsed.template || 'grid-3x2')
                setSlotConfigs(parsed.slots || {})
                setUseTabs(parsed.useTabs ?? true)
                setActiveTab(parsed.activeTab || 'tab1')
                setIsRotated(parsed.isRotated ?? false)
            } catch (e) { }
        }
    }, [])

    // Save on change
    useEffect(() => {
        if (!mounted) return
        const config = {
            template: currentTemplate,
            slots: slotConfigs,
            useTabs,
            activeTab,
            isRotated
        }
        localStorage.setItem('richMenuConfig', JSON.stringify(config))
        // Dispatch event for other components
        window.dispatchEvent(new Event('storage-rich-menu'))
    }, [currentTemplate, slotConfigs, useTabs, activeTab, isRotated, mounted])

    // Helper
    const getCurrentConfig = () => {
        if (selectedSlot === null) return { type: 'web', label: '', value: '' }
        const key = `${activeTab}-${selectedSlot}`
        return slotConfigs[key] || { type: 'web', label: 'ボタン #' + (selectedSlot + 1), value: '' }
    }

    const updateConfig = (field: string, value: string) => {
        if (selectedSlot === null) return
        const key = `${activeTab}-${selectedSlot}`
        setSlotConfigs(prev => ({
            ...prev,
            [key]: { ...getCurrentConfig(), [field]: value }
        }))
    }

    // Grid Logic
    const getGridClass = () => {
        if (currentTemplate === 'grid-3x2') return 'grid-cols-3 grid-rows-2'
        if (currentTemplate === 'large-1') {
            return isRotated ? 'grid-cols-2 grid-rows-2' : 'grid-cols-2 grid-rows-2'
        }
        return 'grid-cols-3 grid-rows-2'
    }

    // Determine span for the large item (index 0)
    const getSpanClass = (index: number) => {
        if (currentTemplate === 'large-1') {
            if (index === 0) {
                return isRotated ? 'row-span-2 w-full h-full' : 'col-span-2 w-full h-full'
            }
        }
        return ''
    }

    const gridClass = getGridClass()
    const buttonCount = currentTemplate === 'grid-3x2' ? 6 : 3

    return (
        <div className="h-full flex flex-col gap-6">

            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-mac-text">リッチメニュー設定</h2>
                </div>
                <button className="bg-mac-accent text-white px-6 py-2.5 font-bold shadow-sm hover:opacity-90 flex items-center gap-2 transition-all">
                    設定を公開
                </button>
            </header>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">

                {/* Left Column: Config */}
                <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto pr-2">

                    <section className="bg-white p-6 border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2 text-mac-text text-sm uppercase tracking-wide">
                                <span className="w-5 h-5 bg-mac-accent text-white flex items-center justify-center text-xs">1</span>
                                基本設定
                            </h3>
                            <div className="flex items-center gap-px bg-gray-100 p-0.5 border border-gray-200">
                                <button
                                    onClick={() => setUseTabs(false)}
                                    className={`px-4 py-1.5 text-xs font-bold transition-all ${!useTabs ? 'bg-white shadow-sm text-mac-text' : 'text-gray-500 hover:bg-black/5'}`}
                                >
                                    タブなし
                                </button>
                                <button
                                    onClick={() => setUseTabs(true)}
                                    className={`px-4 py-1.5 text-xs font-bold transition-all ${useTabs ? 'bg-white shadow-sm text-mac-text' : 'text-gray-500 hover:bg-black/5'}`}
                                >
                                    タブあり
                                </button>
                            </div>
                        </div>

                        {useTabs && (
                            <div className="flex gap-2">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-3 px-3 border transition-all flex items-center justify-center gap-2 text-sm ${activeTab === tab.id
                                            ? 'border-mac-accent bg-blue-50 text-mac-accent font-bold'
                                            : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                                            }`}
                                    >
                                        <span className="material-symbols-rounded text-lg">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Template Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            {TEMPLATES.map(t => (
                                <div key={t.id} className="flex flex-col gap-2">
                                    <button
                                        onClick={() => setCurrentTemplate(t.id)}
                                        className={`py-4 px-4 border text-left flex flex-col items-center gap-2 transition-all ${currentTemplate === t.id
                                            ? 'border-mac-accent bg-blue-50 text-mac-accent'
                                            : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                                            }`}
                                    >
                                        <span className="material-symbols-rounded text-3xl">{t.icon}</span>
                                        <span className="text-xs font-bold">{t.name}</span>
                                    </button>

                                    {/* Orientation Toggle for Large Template */}
                                    {t.id === 'large-1' && currentTemplate === 'large-1' && (
                                        <button
                                            onClick={() => setIsRotated(!isRotated)}
                                            className="text-xs font-bold text-mac-accent flex items-center justify-center gap-1 hover:underline py-1"
                                        >
                                            <span className="material-symbols-rounded text-sm">rotate_right</span>
                                            向きを変更 ({isRotated ? '縦割り' : '横割り'})
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="flex-1 bg-white p-6 border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col gap-4">
                        <h3 className="font-bold flex items-center gap-2 text-mac-text text-sm uppercase tracking-wide">
                            <span className="w-5 h-5 bg-indigo-500 text-white flex items-center justify-center text-xs">2</span>
                            ボタン設定
                        </h3>

                        {selectedSlot !== null ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-bold text-mac-accent bg-blue-50 p-2 inline-block">
                                    <span className="material-symbols-rounded text-lg">touch_app</span>
                                    選択中: ボタン #{selectedSlot + 1}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5 ">アクションタイプ</label>
                                        <div className="relative">
                                            <select
                                                value={getCurrentConfig().type}
                                                onChange={(e) => updateConfig('type', e.target.value)}
                                                className="w-full appearance-none bg-white border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-mac-accent outline-none rounded-none"
                                            >
                                                <option value="web">Webサイトを開く</option>
                                                <option value="tel">電話をかける</option>
                                                <option value="text">メッセージ送信</option>
                                            </select>
                                            <span className="absolute right-3 top-3.5 pointer-events-none text-gray-400 material-symbols-rounded">expand_more</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1.5">ボタンラベル</label>
                                        <input
                                            type="text"
                                            value={getCurrentConfig().label}
                                            onChange={(e) => updateConfig('label', e.target.value)}
                                            className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-mac-accent outline-none"
                                            placeholder="ボタン名"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">
                                        {getCurrentConfig().type === 'tel' ? '電話番号' : getCurrentConfig().type === 'web' ? 'URL' : '送信テキスト'}
                                    </label>
                                    <input
                                        type={getCurrentConfig().type === 'tel' ? 'tel' : 'text'}
                                        value={getCurrentConfig().value}
                                        onChange={(e) => updateConfig('value', e.target.value)}
                                        placeholder={getCurrentConfig().type === 'tel' ? '03-1234-5678' : 'https://...'}
                                        className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-mac-accent outline-none font-mono"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
                                <p className="text-sm font-bold">右側のプレビューからボタンを選択してください</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Column: Preview (LINE Style) */}
                <div className="lg:col-span-5 flex flex-col h-full bg-[#8cabd9] p-6 shadow-inner border border-gray-200 relative overflow-hidden items-center justify-center">

                    {/* Phone Mockup Frame */}
                    <div className="w-[300px] h-[600px] bg-white shadow-2xl flex flex-col relative flex-shrink-0 border-4 border-[#333]">
                        {/* Screen */}
                        <div className="bg-[#8cabd9] w-full h-full flex flex-col relative isolate overflow-hidden">

                            {/* Fake StatusBar */}
                            <div className="h-6 w-full flex justify-between px-4 items-center bg-[#2c3e50]/20 z-20 text-[10px] text-white font-bold backdrop-blur-sm">
                                <span>9:41</span>
                                <div className="flex gap-1">
                                    <span className="material-symbols-rounded text-[10px]">wifi</span>
                                    <span className="material-symbols-rounded text-[10px]">battery_full</span>
                                </div>
                            </div>

                            {/* LINE Header */}
                            <div className="h-12 bg-[#232d36]/90 w-full z-10 flex items-center px-4 text-white shadow-sm border-b border-white/5 gap-3 backdrop-blur-md">
                                <span className="material-symbols-rounded text-lg">arrow_back_ios</span>
                                <span className="text-sm font-bold flex-1">Med CRM 公式</span>
                                <span className="material-symbols-rounded text-lg">search</span>
                                <span className="material-symbols-rounded text-lg">menu</span>
                            </div>

                            {/* Chat Content */}
                            <div className="flex-1 p-3 space-y-4 overflow-y-auto bg-[#8cabd9]">
                                <div className="flex gap-2 items-end">
                                    <div className="w-8 h-8 rounded-full bg-gray-300 border border-white flex-shrink-0"></div>
                                    <div className="bg-white p-3 rounded-xl rounded-tl-none text-xs text-[#1d1d1f] shadow-sm max-w-[75%] leading-relaxed relative bubble-arrow">
                                        <p>メニューからご希望のアクションを選択してください。</p>
                                        <span className="text-[9px] text-gray-400 absolute -bottom-4 right-0">9:41</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rich Menu Area */}
                            <div className="bg-white flex flex-col w-full z-20 border-t border-gray-300 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
                                {/* Tab Bar at top of menu ?? Usually customizable. We put simulate tab bar */}
                                {useTabs && (
                                    <div className="flex border-b border-gray-200 bg-[#F5F5F5] h-10">
                                        {TABS.map((tab) => (
                                            <div
                                                key={tab.id}
                                                className={`flex-1 flex items-center justify-center text-[11px] font-bold cursor-pointer relative ${activeTab === tab.id
                                                    ? 'text-[#1d1d1f] bg-white'
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
                                    <div className={`w-full h-full grid gap-px bg-gray-200 border-2 border-transparent p-px ${gridClass}`}>
                                        {Array.from({ length: buttonCount }).map((_, i) => {
                                            const conf = slotConfigs[`${activeTab}-${i}`]
                                            const isSelected = selectedSlot === i
                                            const span = getSpanClass(i)

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedSlot(i)}
                                                    className={`relative bg-white hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-1 group overflow-hidden ${span} ${isSelected
                                                        ? 'ring-2 ring-mac-accent z-10'
                                                        : ''
                                                        }`}
                                                >
                                                    <span className={`material-symbols-rounded text-2xl ${isSelected ? 'text-mac-accent' : 'text-gray-400'}`}>
                                                        {conf?.type === 'tel' ? 'call' : conf?.type === 'web' ? 'public' : 'smart_button'}
                                                    </span>
                                                    <span className={`text-[10px] font-bold truncate w-full px-1 text-center ${isSelected ? 'text-mac-accent' : 'text-[#1d1d1f]'}`}>
                                                        {conf?.label || `Btn ${i + 1}`}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Bottom Bar mockup */}
                                <div className="h-12 bg-white flex items-center justify-between px-4 border-t border-gray-200">
                                    <span className="material-symbols-rounded text-2xl text-gray-400">keyboard</span>
                                    <div className="flex-1 mx-3 h-8 bg-gray-100 rounded-full flex items-center px-3 text-gray-400 text-xs">メッセージを入力</div>
                                    <span className="material-symbols-rounded text-2xl text-gray-400">mic</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-xs font-bold text-white drop-shadow-md">プレビュー (LINE Mockup)</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
