'use client'

import { useState } from 'react'

export default function Settings() {
    const [clinicInfo, setClinicInfo] = useState({
        name: '歯科クリニック東京',
        address: '東京都新宿区西新宿1-1-1',
        phone: '03-1234-5678',
        url: 'https://dental-tokyo.example.com',
        email: 'info@dental-tokyo.example.com'
    })

    const [lineConfig, setLineConfig] = useState({
        channelId: '1657000000',
        channelSecret: '****************',
        liffId: '1657000000-AbcdeFg'
    })

    const [hours, setHours] = useState([
        { day: '月', am: '09:00-13:00', pm: '14:30-19:00', open: true },
        { day: '火', am: '09:00-13:00', pm: '14:30-19:00', open: true },
        { day: '水', am: '09:00-13:00', pm: '14:30-18:00', open: true },
        { day: '木', am: '-', pm: '-', open: false },
        { day: '金', am: '09:00-13:00', pm: '14:30-19:00', open: true },
        { day: '土', am: '09:00-13:00', pm: '14:00-17:00', open: true },
        { day: '日', am: '-', pm: '-', open: false },
    ])

    return (
        <div className="h-full flex flex-col gap-6 pb-20">
            <header className="flex items-center justify-between py-2 border-b border-gray-200">
                <h1 className="text-xl font-bold text-mac-text flex items-center gap-2">
                    <span className="material-symbols-rounded text-mac-accent">settings</span>
                    設定
                </h1>
                <button className="bg-mac-accent text-white px-5 py-2 font-bold shadow-sm hover:opacity-90 transition-all text-sm">
                    保存する
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Clinic Info & Hours */}
                <div className="lg:col-span-7 space-y-8">

                    {/* Clinic Info */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-mac-text border-l-4 border-mac-accent pl-3 uppercase tracking-wider">
                            クリニック基本情報
                        </h3>
                        <div className="bg-white p-6 border border-gray-300 shadow-sm space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">クリニック名</label>
                                    <input
                                        type="text"
                                        value={clinicInfo.name}
                                        onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                                        className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-mac-accent outline-none font-bold text-mac-text"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">電話番号</label>
                                    <input
                                        type="tel"
                                        value={clinicInfo.phone}
                                        onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                                        className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-mac-accent outline-none font-mono tracking-wide"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">住所</label>
                                <input
                                    type="text"
                                    value={clinicInfo.address}
                                    onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                                    className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-mac-accent outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Webサイト</label>
                                    <input
                                        type="url"
                                        value={clinicInfo.url}
                                        onChange={(e) => setClinicInfo({ ...clinicInfo, url: e.target.value })}
                                        className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-mac-accent outline-none text-blue-600 underline"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5">通知用メールアドレス</label>
                                    <input
                                        type="email"
                                        value={clinicInfo.email}
                                        onChange={(e) => setClinicInfo({ ...clinicInfo, email: e.target.value })}
                                        className="w-full bg-white border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-mac-accent outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Opening Hours */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-mac-text border-l-4 border-teal-500 pl-3 uppercase tracking-wider">
                            診療時間設定
                        </h3>
                        <div className="bg-white border border-gray-300 shadow-sm overflow-x-auto">
                            <table className="w-full text-sm text-left min-w-[320px]">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 font-bold text-gray-500">曜日</th>
                                        <th className="px-4 py-2 font-bold text-gray-500">診療状況</th>
                                        <th className="px-4 py-2 font-bold text-gray-500">午前</th>
                                        <th className="px-4 py-2 font-bold text-gray-500">午後</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {hours.map((h, i) => (
                                        <tr key={h.day} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-bold text-mac-text bg-gray-50/50">{h.day}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => {
                                                        const newHours = [...hours];
                                                        newHours[i].open = !newHours[i].open;
                                                        setHours(newHours);
                                                    }}
                                                    className={`px-3 py-1 text-xs font-bold border transition-all ${h.open ? 'bg-white border-green-500 text-green-600' : 'bg-gray-100 border-gray-300 text-gray-400'}`}
                                                >
                                                    {h.open ? '診療日' : '休診日'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    disabled={!h.open}
                                                    type="text"
                                                    value={h.am}
                                                    onChange={(e) => {
                                                        const newHours = [...hours];
                                                        newHours[i].am = e.target.value;
                                                        setHours(newHours);
                                                    }}
                                                    className="w-24 bg-transparent border-b border-gray-300 focus:border-mac-accent outline-none text-center font-mono disabled:text-gray-300"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    disabled={!h.open}
                                                    type="text"
                                                    value={h.pm}
                                                    onChange={(e) => {
                                                        const newHours = [...hours];
                                                        newHours[i].pm = e.target.value;
                                                        setHours(newHours);
                                                    }}
                                                    className="w-24 bg-transparent border-b border-gray-300 focus:border-mac-accent outline-none text-center font-mono disabled:text-gray-300"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Right Column: LINE API & Account */}
                <div className="lg:col-span-5 space-y-8">

                    {/* LINE Configuration */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-mac-text border-l-4 border-[#06C755] pl-3 uppercase tracking-wider">
                            LINE連携設定 (Messaging API)
                        </h3>
                        <div className="bg-white p-6 border border-gray-300 shadow-sm space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">Channel ID</label>
                                <input
                                    type="text"
                                    value={lineConfig.channelId}
                                    readOnly
                                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-600 font-mono outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">Channel Secret</label>
                                <input
                                    type="password"
                                    value={lineConfig.channelSecret}
                                    readOnly
                                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-600 font-mono outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">LIFF ID</label>
                                <input
                                    type="text"
                                    value={lineConfig.liffId}
                                    readOnly
                                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-600 font-mono outline-none"
                                />
                            </div>
                            <div className="pt-2 text-right">
                                <button className="text-xs font-bold text-mac-accent hover:underline">
                                    連携情報を更新する
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Account / Subscription */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-mac-text border-l-4 border-indigo-500 pl-3 uppercase tracking-wider">
                            契約プラン
                        </h3>

                        <div className="bg-white p-6 border border-gray-300 shadow-sm flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                    <span className="material-symbols-rounded text-2xl">verified_user</span>
                                </div>
                                <div>
                                    <p className="text-base font-bold text-mac-text">プレミアムプラン</p>
                                    <p className="text-xs text-gray-500 mt-1">次回更新: 2026/02/28</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 border border-gray-300 font-bold hover:bg-gray-50 text-mac-text transition-all shadow-sm text-xs">
                                変更
                            </button>
                        </div>
                    </section>

                    {/* System Info */}
                    <div className="pt-8 text-center space-y-4">
                        <p className="text-xs text-gray-400">Ver 1.2.0 (Build 20260204)</p>
                        <button className="text-red-500 text-xs font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
                            <span className="material-symbols-rounded text-sm">logout</span>
                            ログアウト
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
