'use client'

import { useState } from 'react'

// Mock Scenarios based on user request - Removed Test Result
const DEFAULT_SCENARIOS = [
    {
        id: 'welcome',
        name: '初回友だち追加時あいさつ',
        category: 'greeting',
        enabled: true,
        trigger: 'LINE友だち登録時',
        delay: '即時',
        message: 'はじめまして！メディカルCRMクリニックです。\nご予約はリッチメニューから簡単に行えます。\n不明な点はお電話でも承っております。'
    },
    {
        id: 'after-pollen',
        name: '【花粉症】受診後アフターフォロー',
        category: 'after-care',
        enabled: true,
        trigger: '受診タグ: 花粉症',
        delay: '受診から1日後',
        message: '昨日はご来院ありがとうございました。\n処方されたお薬の効果はいかがでしょうか？\nもし眠気が強い場合は、お薬の変更も可能ですのでご相談ください。'
    },
    {
        id: 'after-vaccine',
        name: '【ワクチン】接種後体調確認',
        category: 'after-care',
        enabled: true,
        trigger: '受診タグ: ワクチン接種',
        delay: '接種から1日後',
        message: 'ワクチン接種お疲れ様でした。\n本日は腕の痛みや発熱などの副反応はいかがでしょうか？\n水分を多めにとって、無理せずお過ごしください。'
    },
    {
        id: 'after-cold',
        name: '【風邪・発熱】受診後のお伺い',
        category: 'after-care',
        enabled: true,
        trigger: '受診タグ: 風邪, 発熱',
        delay: '受診から2日後',
        message: 'その後、体調はいかがでしょうか？\nお薬が合わない場合や、熱が下がらない場合は再度ご来院ください。'
    },
    {
        id: 'seasonal-pollen',
        name: '【季節】花粉症シーズン到来のお知らせ',
        category: 'seasonal',
        enabled: true,
        trigger: '過去の受診タグ: 花粉症 (1年前)',
        delay: '2月1日 10:00',
        message: '今年の花粉シーズンが近づいてきました。\n昨シーズンご来院された患者様へお送りしています。\n早めの投薬で症状を抑えることができます。Web予約よりお待ちしております。'
    },
]

export default function AutoMessages() {
    const [activeScenarioId, setActiveScenarioId] = useState('welcome')
    const [scenarios, setScenarios] = useState(DEFAULT_SCENARIOS)

    const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0]

    const toggleScenario = (id: string) => {
        setScenarios(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
    }

    const updateMessage = (text: string) => {
        setScenarios(prev => prev.map(s => s.id === activeScenarioId ? { ...s, message: text } : s))
    }

    return (
        <div className="h-full flex flex-col gap-6">
            <header className="flex items-center justify-between py-2 border-b border-gray-200">
                <h1 className="text-xl font-bold text-mac-text flex items-center gap-2">
                    <span className="material-symbols-rounded text-mac-accent">schedule_send</span>
                    自動メッセージ管理
                </h1>
                <button className="bg-mac-accent text-white px-5 py-2 font-bold shadow-sm hover:opacity-90 flex items-center gap-2 transition-all text-sm">
                    <span className="material-symbols-rounded text-lg">add</span>
                    新規シナリオ作成
                </button>
            </header>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">

                {/* Left: List */}
                <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-2">
                    <div className="bg-white border border-gray-300 shadow-sm flex flex-col">
                        <div className="p-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                            稼働中のシナリオ
                        </div>
                        <div className="divide-y divide-gray-100">
                            {scenarios.map((s) => (
                                <div
                                    key={s.id}
                                    onClick={() => setActiveScenarioId(s.id)}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-all flex items-center justify-between group ${activeScenarioId === s.id ? 'bg-blue-50 border-l-4 border-l-mac-accent' : 'border-l-4 border-l-transparent'}`}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold border ${categoryColor(s.category)}`}>
                                                {categoryLabel(s.category)}
                                            </span>
                                            {s.enabled ? (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    ON
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-gray-400">OFF</span>
                                            )}
                                        </div>
                                        <p className="text-sm font-bold text-mac-text group-hover:text-mac-accent transition-colors">{s.name}</p>
                                        <p className="text-xs text-gray-400 mt-1 truncate">{s.trigger} / {s.delay}</p>
                                    </div>
                                    <span className="material-symbols-rounded text-gray-300 group-hover:text-mac-accent">chevron_right</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Detail Editor */}
                <div className="lg:col-span-7 flex flex-col h-full bg-white border border-gray-300 shadow-sm relative">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                        <div>
                            <span className={`px-2 py-1 text-[10px] font-bold border mb-2 inline-block ${categoryColor(activeScenario.category)}`}>
                                {categoryLabel(activeScenario.category)}
                            </span>
                            <h2 className="text-lg font-bold text-mac-text">{activeScenario.name}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-gray-500">稼働スイッチ</label>
                            <button
                                onClick={() => toggleScenario(activeScenario.id)}
                                className={`w-12 h-6 rounded-full p-1 transition-all ${activeScenario.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${activeScenario.enabled ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* Trigger Conditions */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-mac-text border-l-4 border-mac-accent pl-2">配信条件 (トリガー)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">対象ターゲット</label>
                                    <div className="w-full bg-gray-50 border border-gray-300 p-2 text-sm font-bold text-mac-text">
                                        {activeScenario.trigger}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">配信タイミング</label>
                                    <div className="w-full bg-gray-50 border border-gray-300 p-2 text-sm font-bold text-mac-text">
                                        {activeScenario.delay}
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                <span className="material-symbols-rounded text-sm">info</span>
                                電子カルテ連携により、患者の来院情報・処方情報と紐づけて判定されます。
                            </p>
                        </div>

                        {/* Message Content */}
                        <div className="flex-1 flex flex-col min-h-[300px]">
                            <h3 className="text-sm font-bold text-mac-text border-l-4 border-mac-accent pl-2 mb-3">メッセージ内容</h3>
                            <div className="flex-1 border border-gray-300 bg-gray-50 p-4 flex gap-4">
                                {/* Preview */}
                                <div className="w-[240px] flex-shrink-0 bg-white border border-gray-200 shadow-sm p-2">
                                    <div className="text-[10px] text-gray-400 text-center mb-2">LINE画面プレビュー</div>
                                    <div className="flex gap-2">
                                        <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
                                        <div className="bg-[#efffde] p-2 rounded-lg text-xs text-black border border-gray-100 whitespace-pre-wrap leading-relaxed shadow-sm">
                                            {activeScenario.message}
                                        </div>
                                    </div>
                                </div>

                                {/* Editor */}
                                <div className="flex-1 flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 mb-1">送信テキスト編集</label>
                                    <textarea
                                        value={activeScenario.message}
                                        onChange={(e) => updateMessage(e.target.value)}
                                        className="flex-1 w-full border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-mac-accent outline-none font-medium resize-none leading-relaxed"
                                    />
                                    <div className="mt-2 text-xs text-gray-400">
                                        ※ {`{患者名}`} などの変数は自動置換されます。
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

function categoryLabel(cat: string) {
    switch (cat) {
        case 'greeting': return 'あいさつ'
        case 'after-care': return 'アフターケア'
        case 'seasonal': return '季節・リマインド'
        default: return 'その他' // Removed Test Result
    }
}

function categoryColor(cat: string) {
    switch (cat) {
        case 'greeting': return 'bg-green-50 text-green-600 border-green-200'
        case 'after-care': return 'bg-blue-50 text-blue-600 border-blue-200'
        case 'seasonal': return 'bg-orange-50 text-orange-600 border-orange-200'
        default: return 'bg-gray-50 text-gray-600 border-gray-200'
    }
}
