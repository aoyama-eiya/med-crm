import { useState, useEffect } from 'react'

export default function Simulator() {
    const [isOpen, setIsOpen] = useState(true)
    const [messages, setMessages] = useState<Array<{ type: 'bot' | 'user', text: string }>>([
        { type: 'bot', text: 'こんにちは！Med Clinicへようこそ。' }
    ])
    const [activeTab, setActiveTab] = useState('tab1')

    useEffect(() => {
        // Listen for simulation events
        const handleVisit = () => {
            setMessages(prev => [...prev, { type: 'bot', text: '本日はご来院ありがとうございました。\nお薬の効き目はいかがですか？\n体調に変化があれば無理せずご連絡ください。' }])
            setIsOpen(true)
        }

        const handleBooking = () => {
            setMessages(prev => [...prev, { type: 'user', text: '[予約サイトへアクセス]' }])
            // Simulation of external action
            setTimeout(() => {
                setMessages(prev => [...prev, { type: 'bot', text: 'Webでのご予約ありがとうございます。\nお待ちしております。' }])
            }, 1000)
            setIsOpen(true)
        }

        const handleCall = () => {
            setMessages(prev => [...prev, { type: 'user', text: '[電話発信: 03-1234-5678]' }])
            setIsOpen(true)
        }

        window.addEventListener('simulate-visit', handleVisit)
        window.addEventListener('simulate-booking', handleBooking)
        return () => {
            window.removeEventListener('simulate-visit', handleVisit)
            window.removeEventListener('simulate-booking', handleBooking)
        }
    }, [])

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-20 h-20 bg-[#0061A4] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50 border-[6px] border-white ring-1 ring-gray-200"
                title="シミュレーターを開く"
            >
                <span className="material-symbols-rounded text-4xl">smartphone</span>
            </button>
        )
    }

    return (
        <div className="fixed bottom-8 right-8 w-[340px] h-[680px] bg-black rounded-[3.5rem] shadow-2xl border-[10px] border-gray-900 overflow-hidden z-50 animate-slide-up flex flex-col font-sans mb-4 mr-4">
            {/* Device Frame */}
            <div className="absolute top-0 w-full h-8 bg-black z-20 flex justify-center">
                <div className="w-36 h-6 bg-black rounded-b-2xl"></div>
            </div>

            {/* Header */}
            <div className="h-24 bg-[#202936] text-white flex items-end px-4 pb-3 z-10 shadow-sm flex-shrink-0">
                <span className="material-symbols-rounded text-xl cursor-not-allowed text-gray-400">arrow_back_ios</span>
                <div className="flex-1 text-center">
                    <p className="font-bold text-sm">Med Clinic Bot</p>
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-[10px] text-gray-400">LINE公式アカウント</span>
                    </div>
                </div>
                <span className="material-symbols-rounded text-xl cursor-not-allowed text-gray-400">menu</span>
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-10 right-5 w-8 h-8 flex items-center justify-center bg-gray-700/50 rounded-full text-white hover:bg-gray-600 transition-colors"
                >
                    <span className="material-symbols-rounded text-lg">close</span>
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-[#7289DA] overflow-y-auto p-3 space-y-4 scrollbar-hide pb-20">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                        {msg.type === 'bot' && (
                            <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 border border-gray-200"></div>
                        )}
                        <div
                            className={`max-w-[70%] p-3 text-xs leading-relaxed shadow-sm ${msg.type === 'user'
                                    ? 'bg-[#8de055] text-gray-900 rounded-2xl rounded-tr-none'
                                    : 'bg-white text-gray-900 rounded-2xl rounded-tl-none py-2'
                                }`}
                        >
                            {msg.text.split('\n').map((line, k) => (
                                <span key={k}>{line}<br /></span>
                            ))}
                        </div>
                    </div>
                ))}
                {/* Dummy spacing */}
                <div className="h-4"></div>
            </div>

            {/* Rich Menu (Fixed Bottom) */}
            <div className="h-[220px] bg-[#F2F2F7] flex flex-col flex-shrink-0 border-t border-gray-300">
                {/* Tab Bar (2 Tabs) */}
                <div className="h-10 flex bg-white border-b border-gray-200 shadow-sm z-10">
                    {['メニューA', 'メニューB'].map((tab, i) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(i === 0 ? 'tab1' : 'tab2')}
                            className={`flex-1 text-[11px] font-bold transition-colors ${(activeTab === 'tab1' && i === 0) || (activeTab === 'tab2' && i === 1)
                                    ? 'text-[#00B900] border-b-2 border-[#00B900] bg-green-50'
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Menu Content */}
                <div className="flex-1 p-1 bg-white">
                    {activeTab === 'tab1' && (
                        <div className="w-full h-full grid grid-cols-3 gap-1">
                            <button className="bg-white border border-gray-200 rounded flex flex-col items-center justify-center active:bg-gray-100 transition-colors" onClick={() => window.dispatchEvent(new CustomEvent('simulate-booking'))}>
                                <span className="material-symbols-rounded text-3xl text-gray-700 mb-1">calendar_month</span>
                                <span className="text-[10px] font-bold text-gray-600">予約</span>
                            </button>
                            <button className="bg-white border border-gray-200 rounded flex flex-col items-center justify-center active:bg-gray-100 transition-colors" onClick={() => setMessages(prev => [...prev, { type: 'user', text: '[電話発信]' }])}>
                                <span className="material-symbols-rounded text-3xl text-gray-700 mb-1">call</span>
                                <span className="text-[10px] font-bold text-gray-600">電話</span>
                            </button>
                            <button className="bg-white border border-gray-200 rounded flex flex-col items-center justify-center active:bg-gray-100 transition-colors" onClick={() => window.open('https://google.com', '_blank')}>
                                <span className="material-symbols-rounded text-3xl text-gray-700 mb-1">info</span>
                                <span className="text-[10px] font-bold text-gray-600">当院について</span>
                            </button>

                            {/* 2nd Row */}
                            <button className="bg-white border border-gray-200 rounded flex flex-col items-center justify-center active:bg-gray-100 transition-colors">
                                <span className="material-symbols-rounded text-3xl text-gray-700 mb-1">vaccines</span>
                                <span className="text-[10px] font-bold text-gray-600">予防接種</span>
                            </button>
                            <button className="bg-white border border-gray-200 rounded flex flex-col items-center justify-center active:bg-gray-100 transition-colors">
                                <span className="material-symbols-rounded text-3xl text-gray-700 mb-1">help</span>
                                <span className="text-[10px] font-bold text-gray-600">Q&A</span>
                            </button>
                            <button className="bg-white border border-gray-200 rounded flex flex-col items-center justify-center active:bg-gray-100 transition-colors">
                                <span className="material-symbols-rounded text-3xl text-gray-700 mb-1">account_circle</span>
                                <span className="text-[10px] font-bold text-gray-600">マイページ</span>
                            </button>
                        </div>
                    )}
                    {activeTab !== 'tab1' && (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs bg-gray-50 rounded border border-dashed border-gray-200 p-4 text-center">
                            <span className="material-symbols-rounded text-3xl mb-2 opacity-50">widgets</span>
                            サブメニュー<br />(シミュレーション未設定)
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
