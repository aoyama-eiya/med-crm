import { useState } from 'react'

export default function Settings() {
    const [clinicInfo, setClinicInfo] = useState({
        name: 'メディカルクリニック東京',
        address: '東京都新宿区西新宿...',
        phone: '03-1234-5678',
        url: 'https://example.com'
    })

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20 pr-2">
            <header className="pb-4 border-b border-white/20">
                <h2 className="text-3xl font-bold text-[#1d1d1f] font-sans drop-shadow-sm">設定</h2>
                <p className="text-[#1d1d1f]/60 mt-1 font-medium">クリニック情報の管理とシステム設定</p>
            </header>

            {/* Clinic Profile Section */}
            <section className="space-y-4">
                <h3 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <span className="material-symbols-rounded text-[#007AFF]">storefront</span>
                    クリニック情報
                </h3>

                <div className="glass-panel p-6 rounded-3xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-[#1d1d1f]/60 mb-2 ml-1">クリニック名</label>
                            <input
                                type="text"
                                value={clinicInfo.name}
                                onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                                className="w-full bg-white/40 border border-white/40 rounded-2xl px-4 py-3 text-sm font-bold text-[#1d1d1f] focus:ring-2 focus:ring-[#007AFF] outline-none shadow-inner transition-all backdrop-blur-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#1d1d1f]/60 mb-2 ml-1">電話番号</label>
                            <input
                                type="tel"
                                value={clinicInfo.phone}
                                onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                                className="w-full bg-white/40 border border-white/40 rounded-2xl px-4 py-3 text-sm font-bold text-[#1d1d1f] focus:ring-2 focus:ring-[#007AFF] outline-none shadow-inner transition-all backdrop-blur-sm font-mono"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#1d1d1f]/60 mb-2 ml-1">住所</label>
                        <input
                            type="text"
                            value={clinicInfo.address}
                            onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                            className="w-full bg-white/40 border border-white/40 rounded-2xl px-4 py-3 text-sm font-bold text-[#1d1d1f] focus:ring-2 focus:ring-[#007AFF] outline-none shadow-inner transition-all backdrop-blur-sm"
                        />
                    </div>
                </div>
            </section>

            {/* Account / Subscription */}
            <section className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <span className="material-symbols-rounded text-[#5E5CE6]">credit_card</span>
                    アカウント・請求
                </h3>

                <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#00C6FF] to-[#0072FF] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <span className="material-symbols-rounded text-3xl drop-shadow-md">verified_user</span>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-[#1d1d1f]">プレミアムプラン (トライアル)</p>
                            <p className="text-xs text-[#1d1d1f]/60 mt-1">次回更新日: 2026/02/28</p>
                        </div>
                    </div>
                    <button className="px-6 py-2.5 rounded-full bg-white/50 border border-white/40 font-bold hover:bg-white text-[#007AFF] transition-all shadow-sm hover:shadow-md">
                        プラン変更
                    </button>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="pt-8">
                <button className="w-full py-4 rounded-2xl border border-red-500/20 text-[#FF3B30] font-bold hover:bg-[#FF3B30]/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                    <span className="material-symbols-rounded">logout</span>
                    ログアウト
                </button>
            </section>
        </div>
    )
}
