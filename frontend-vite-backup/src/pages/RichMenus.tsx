import { useState } from 'react'

const TABS = [
    { id: 'tab1', label: 'メニューA (メイン)', icon: 'home' },
    { id: 'tab2', label: 'メニューB (サブ)', icon: 'widgets' },
]

const TEMPLATES = [
    { id: 'grid-3x2', name: '標準 (6ボタン)', icon: 'grid_view', grid: 'grid-cols-3 grid-rows-2' },
    { id: 'large-1', name: '強調 (1特大+2小)', icon: 'ad_units', grid: 'grid-cols-2 grid-rows-2' }, // Simplified for demo
    { id: 'list', name: 'リスト型', icon: 'view_list', grid: 'grid-cols-1 grid-rows-4' },
]

export default function RichMenus() {
    const [useTabs, setUseTabs] = useState(true)
    const [activeTab, setActiveTab] = useState('tab1')
    const [currentTemplate, setCurrentTemplate] = useState('grid-3x2')

    // Selection State
    const [selectedSlot, setSelectedSlot] = useState<number | null>(0)
    const [slotConfigs, setSlotConfigs] = useState<Record<string, { type: string, label: string, value: string }>>({
        'tab1-0': { type: 'web', label: '予約サイト', value: 'https://example.com' },
        'tab1-1': { type: 'tel', label: '電話予約', value: '03-1234-5678' }
    })

    // Helper to get/set config
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

    // Get current template grid
    const currentGridClass = TEMPLATES.find(t => t.id === currentTemplate)?.grid || 'grid-cols-3 grid-rows-2'
    const buttonCount = currentTemplate === 'grid-3x2' ? 6 : currentTemplate === 'large-1' ? 3 : 4

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in text-[#1d1d1f] pr-2">

            {/* Header */}
            <header className="flex items-center justify-between flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">リッチメニュー設定</h2>
                    <p className="text-sm text-white/80 mt-1 font-medium drop-shadow-sm">LINEトーク画面のメニューをカスタマイズ</p>
                </div>
                <button className="bg-white/80 hover:bg-white text-[#007AFF] px-6 py-2.5 rounded-full font-bold shadow-lg backdrop-blur-md transition-all flex items-center gap-2 border border-white/50">
                    <span className="material-symbols-rounded">publish</span>
                    設定を公開
                </button>
            </header>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">

                {/* Left Column: Config (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">

                    {/* 1. Basic Settings */}
                    <section className="glass-panel p-5 rounded-3xl flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2 text-[#1d1d1f]">
                                <span className="w-6 h-6 rounded bg-[#5E5CE6] text-white flex items-center justify-center text-sm shadow-sm">1</span>
                                基本設定
                            </h3>
                            <div className="flex items-center gap-1 bg-black/5 p-1 rounded-full border border-black/5">
                                <button
                                    onClick={() => setUseTabs(false)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!useTabs ? 'bg-white shadow-md text-[#1d1d1f]' : 'text-[#1d1d1f]/50 hover:bg-white/30'}`}
                                >
                                    タブなし
                                </button>
                                <button
                                    onClick={() => setUseTabs(true)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${useTabs ? 'bg-white shadow-md text-[#1d1d1f]' : 'text-[#1d1d1f]/50 hover:bg-white/30'}`}
                                >
                                    タブあり (2枚)
                                </button>
                            </div>
                        </div>

                        {useTabs && (
                            <div className="flex gap-2">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                                                ? 'border-[#007AFF] bg-[#007AFF]/10 text-[#007AFF] font-bold shadow-inner'
                                                : 'border-transparent bg-white/50 hover:bg-white/80 text-[#1d1d1f]/70'
                                            }`}
                                    >
                                        <span className="material-symbols-rounded">{tab.icon}</span>
                                        <span className="text-sm">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Template Selection */}
                        <div className="grid grid-cols-3 gap-2">
                            {TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setCurrentTemplate(t.id)}
                                    className={`py-3 px-4 rounded-xl border text-left flex items-center gap-2 transition-all ${currentTemplate === t.id
                                            ? 'border-[#007AFF] bg-[#007AFF] text-white shadow-lg'
                                            : 'border-transparent bg-white/50 hover:bg-white/80 text-[#1d1d1f]/70'
                                        }`}
                                >
                                    <span className="material-symbols-rounded text-xl">{t.icon}</span>
                                    <span className="text-xs font-bold">{t.name}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 2. Button Action Editor */}
                    <section className="flex-1 glass-panel p-5 rounded-3xl flex flex-col gap-4">
                        <h3 className="font-bold flex items-center gap-2 text-[#1d1d1f]">
                            <span className="w-6 h-6 rounded bg-[#30B0C7] text-white flex items-center justify-center text-sm shadow-sm">2</span>
                            ボタン設定
                        </h3>

                        {selectedSlot !== null ? (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex items-center gap-2 text-sm font-bold text-[#007AFF] bg-[#007AFF]/10 p-2 rounded-lg inline-block border border-[#007AFF]/20">
                                    <span className="material-symbols-rounded text-lg">touch_app</span>
                                    選択中: ボタン #{selectedSlot + 1}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-[#1d1d1f]/60 mb-1.5 uppercase tracking-wide">アクションタイプ</label>
                                        <div className="relative">
                                            <select
                                                value={getCurrentConfig().type}
                                                onChange={(e) => updateConfig('type', e.target.value)}
                                                className="w-full appearance-none bg-white/60 border border-white/40 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#007AFF] outline-none shadow-sm backdrop-blur-sm transition-all"
                                            >
                                                <option value="web">Webサイトを開く</option>
                                                <option value="tel">電話をかける</option>
                                                <option value="text">メッセージ送信</option>
                                            </select>
                                            <span className="absolute right-3 top-3 pointer-events-none text-[#1d1d1f]/50 material-symbols-rounded">expand_more</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#1d1d1f]/60 mb-1.5 uppercase tracking-wide">ボタンラベル</label>
                                        <input
                                            type="text"
                                            value={getCurrentConfig().label}
                                            onChange={(e) => updateConfig('label', e.target.value)}
                                            className="w-full bg-white/60 border border-white/40 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#007AFF] outline-none shadow-sm backdrop-blur-sm transition-all placeholder-[#1d1d1f]/30"
                                            placeholder="ボタン名"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#1d1d1f]/60 mb-1.5 uppercase tracking-wide">
                                        {getCurrentConfig().type === 'tel' ? '電話番号' : getCurrentConfig().type === 'web' ? 'URL' : '送信テキスト'}
                                    </label>
                                    <input
                                        type={getCurrentConfig().type === 'tel' ? 'tel' : 'text'}
                                        value={getCurrentConfig().value}
                                        onChange={(e) => updateConfig('value', e.target.value)}
                                        placeholder={getCurrentConfig().type === 'tel' ? '03-1234-5678' : 'https://...'}
                                        className="w-full bg-white/60 border border-white/40 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#007AFF] outline-none shadow-sm backdrop-blur-sm transition-all font-mono placeholder-[#1d1d1f]/30"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-[#1d1d1f]/40 gap-2">
                                <span className="material-symbols-rounded text-4xl">touch_app</span>
                                <p className="text-sm font-bold">右側のプレビューからボタンを選択してください</p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Right Column: Preview & Interactive Canvas (5 cols) */}
                <div className="lg:col-span-5 flex flex-col h-full bg-white/40 rounded-3xl p-6 shadow-xl border border-white/40 backdrop-blur-2xl relative">
                    <h3 className="font-bold mb-6 text-center text-[#1d1d1f] drop-shadow-sm">レイアウト・プレビュー</h3>

                    {/* Phone Mockup Frame */}
                    <div className="w-[280px] h-[560px] mx-auto bg-[#1d1d1f] rounded-[3rem] p-3 shadow-2xl border-[4px] border-[#3a3a3c] flex flex-col relative flex-shrink-0 ring-1 ring-white/20">
                        {/* Screen */}
                        <div className="bg-[#8cabd9] w-full h-full rounded-[2.2rem] overflow-hidden flex flex-col relative isolate">

                            {/* Fake StatusBar */}
                            <div className="h-6 w-full flex justify-between px-6 items-center pt-2 z-20 text-[10px] text-white font-bold">
                                <span>9:41</span>
                                <div className="flex gap-1">
                                    <span className="material-symbols-rounded text-[10px]">signal_cellular_alt</span>
                                    <span className="material-symbols-rounded text-[10px]">wifi</span>
                                    <span className="material-symbols-rounded text-[10px]">battery_full</span>
                                </div>
                            </div>

                            {/* Fake Header */}
                            <div className="relative h-12 bg-[#2c3e50]/90 w-full z-10 flex items-center justify-center text-white font-bold shadow-sm backdrop-blur-sm border-b border-white/10">
                                <span className="text-xs">Med CRM Bot</span>
                                <span className="absolute left-4 material-symbols-rounded text-sm">arrow_back_ios</span>
                            </div>

                            {/* Chat Content */}
                            <div className="flex-1 p-3 space-y-3 overflow-hidden bg-[#7289DA]/10">
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white shadow-sm"></div>
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none text-[10px] max-w-[80%] shadow-sm leading-relaxed text-[#1d1d1f]">
                                        メニューをタップして操作を選択してください。<br />
                                        ご不明な点は電話予約ボタンから。
                                    </div>
                                </div>
                            </div>

                            {/* Menu Overlay */}
                            <div className="bg-white flex flex-col h-[220px] z-20 border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] transition-all duration-300">
                                {/* Tab Bar */}
                                {useTabs && (
                                    <div className="h-9 flex border-b border-gray-100 bg-[#F9F9F9]">
                                        {TABS.map((tab) => (
                                            <div
                                                key={tab.id}
                                                className={`flex-1 flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer relative ${activeTab === tab.id
                                                        ? 'text-[#06C755]'
                                                        : 'text-[#C7C7CC] hover:bg-gray-50'
                                                    }`}
                                            >
                                                {tab.label.split(' ')[0]}
                                                {activeTab === tab.id && <div className="absolute bottom-0 w-full h-0.5 bg-[#06C755]" />}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Dynamic Grid Content */}
                                <div className="flex-1 p-1 bg-white">
                                    <div className={`w-full h-full grid gap-1 ${currentGridClass}`}>
                                        {Array.from({ length: buttonCount }).map((_, i) => {
                                            const conf = slotConfigs[`${activeTab}-${i}`]
                                            const isSelected = selectedSlot === i
                                            // Handle large item spanning if needed
                                            const spanClass = (currentTemplate === 'large-1' && i === 0) ? 'row-span-2' : ''

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setSelectedSlot(i)}
                                                    className={`relative rounded-lg border transition-all flex flex-col items-center justify-center gap-1 group ${isSelected
                                                            ? 'bg-blue-50 border-[#007AFF] z-10 ring-1 ring-[#007AFF]'
                                                            : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-md'
                                                        } ${spanClass}`}
                                                >
                                                    <span className={`material-symbols-rounded text-2xl transition-transform group-hover:scale-110 ${isSelected ? 'text-[#007AFF]' : 'text-gray-400'}`}>
                                                        {conf?.type === 'tel' ? 'call' : conf?.type === 'web' ? 'public' : 'smart_button'}
                                                    </span>
                                                    <span className={`text-[9px] font-bold ${isSelected ? 'text-[#007AFF]' : 'text-gray-500'}`}>
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

                    <div className="mt-4 text-center">
                        <p className="text-xs font-bold text-[#1d1d1f]/50">画面をタップしてアクションを割り当て</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
