import { useQuery } from '@tanstack/react-query'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts'
import { fetchDashboardStats, fetchDashboardTrends, fetchDashboardAnalysis } from '../lib/api'

// Mock Data
const mockStats = {
    total_patients: 1256,
    active_patients: 1143,
    today_visits: 42,
    today_messages: 128,
    month_messages: 3584,
}

// macOS Palette
const COLORS = ['#007AFF', '#5E5CE6', '#30B0C7', '#FF2D55']

export default function Dashboard() {
    const { data: stats } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: fetchDashboardStats,
        placeholderData: mockStats,
    })

    const { data: trends } = useQuery({
        queryKey: ['dashboard-trends'],
        queryFn: () => fetchDashboardTrends(14),
    })

    const { data: analysis } = useQuery({
        queryKey: ['dashboard-analysis'],
        queryFn: fetchDashboardAnalysis,
    })

    const statCards = [
        { label: '友だち登録数', value: stats?.total_patients, icon: 'diversity_1', color: 'bg-blue-500 text-white' },
        { label: 'アクティブ患者', value: stats?.active_patients, icon: 'sentiment_very_satisfied', color: 'bg-indigo-500 text-white' },
        { label: '本日の来院', value: stats?.today_visits, icon: 'event_available', color: 'bg-cyan-500 text-white' },
        { label: '月間配信数', value: stats?.month_messages, icon: 'forward_to_inbox', color: 'bg-pink-500 text-white' },
    ]

    const reservationData = analysis ? [
        { name: 'LINE予約', value: analysis.reservations.line_rich_menu },
        { name: 'Web予約', value: analysis.reservations.web },
        { name: '電話予約', value: analysis.reservations.tel },
    ] : []

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in pr-2">
            {/* Cards Row (Fixed height) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="group relative overflow-hidden glass-panel p-6 rounded-3xl transition-all duration-300 hover:bg-white/40"
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex flex-col justify-center">
                                <p className="text-sm font-bold text-[#1d1d1f]/60 tracking-wide mb-1 opacity-80">{card.label}</p>
                                <p className="text-4xl font-extrabold text-[#1d1d1f] tracking-tight drop-shadow-sm">{card.value?.toLocaleString()}</p>
                            </div>
                            <div className={`w-16 h-16 flex items-center justify-center rounded-2xl shadow-lg shadow-black/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${card.color}`}>
                                <span className="material-symbols-rounded text-4xl drop-shadow-md">{card.icon}</span>
                            </div>
                        </div>
                        {/* Background Gradient Blob */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                    </div>
                ))}
            </div>

            {/* Charts Grid (Fills remaining height) */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Charts) */}
                <div className="lg:col-span-2 flex flex-col gap-6 h-full min-h-0">

                    {/* Genre Chart */}
                    <div className="flex-1 min-h-0 glass-panel p-6 rounded-3xl flex flex-col">
                        <h3 className="text-lg font-bold text-[#1d1d1f] flex items-center gap-2 mb-2 flex-shrink-0">
                            <span className="material-symbols-rounded text-[#007AFF]">analytics</span>
                            配信ジャンル別 返信率
                        </h3>
                        <div className="flex-1 min-h-0 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analysis?.genre_performance || []} layout="vertical" margin={{ left: 40, right: 20, top: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis type="number" stroke="#86868b" unit="%" tick={{ fontSize: 11 }} />
                                    <YAxis type="category" dataKey="genre" stroke="#1d1d1f" width={100} tick={{ fontSize: 13, fontWeight: 500 }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                                        contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', padding: '12px' }}
                                    />
                                    <Bar dataKey="reply_rate" name="返信率" radius={[0, 8, 8, 0]} barSize={24}>
                                        {(analysis?.genre_performance || []).map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Visit Trends Chart */}
                    <div className="flex-1 min-h-0 glass-panel p-6 rounded-3xl flex flex-col">
                        <h3 className="text-lg font-bold text-[#1d1d1f] flex items-center gap-2 mb-2 flex-shrink-0">
                            <span className="material-symbols-rounded text-[#5E5CE6]">show_chart</span>
                            来院数トレンド
                        </h3>
                        <div className="flex-1 min-h-0 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trends?.daily_visits || []} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} stroke="#86868b" tick={{ fontSize: 11 }} />
                                    <YAxis stroke="#86868b" tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="count" stroke="#007AFF" strokeWidth={4} dot={{ r: 4, fill: '#007AFF', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Right Column (Pie & Actions) */}
                <div className="flex flex-col gap-6 h-full min-h-0">

                    {/* Pie Chart */}
                    <div className="flex-1 min-h-0 glass-panel p-6 rounded-3xl flex flex-col">
                        <h3 className="text-lg font-bold text-[#1d1d1f] mb-2 flex-shrink-0">予約経路</h3>
                        <div className="flex-1 min-h-0 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={reservationData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="60%"
                                        outerRadius="80%"
                                        paddingAngle={6}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {reservationData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '11px', color: '#1d1d1f' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                <span className="text-4xl font-extrabold text-[#1d1d1f] drop-shadow-sm">
                                    {reservationData.reduce((a, b) => a + b.value, 0)}
                                </span>
                                <span className="text-[10px] font-bold text-[#1d1d1f]/50 uppercase tracking-widest mt-1">Total</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-panel p-6 rounded-3xl flex flex-col gap-3 flex-shrink-0">
                        <h3 className="text-xs font-bold text-[#1d1d1f]/50 uppercase tracking-widest mb-1">Demo Actions</h3>
                        <button
                            className="w-full bg-white/50 hover:bg-white text-[#007AFF] font-bold py-3.5 px-4 rounded-2xl border border-white/60 transition-all flex items-center justify-center gap-2 group backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                            onClick={() => window.dispatchEvent(new CustomEvent('simulate-visit'))}
                        >
                            <span className="material-symbols-rounded group-hover:scale-110 transition-transform">input</span>
                            来院をテスト
                        </button>
                        <button
                            className="w-full bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                            onClick={() => window.dispatchEvent(new CustomEvent('simulate-booking'))}
                        >
                            <span className="material-symbols-rounded group-hover:scale-110 transition-transform">calendar_add_on</span>
                            予約発生テスト
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
