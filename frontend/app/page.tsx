'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts'
import { useState, useEffect } from 'react'

// Mock Data Generators
const generateStats = (multiplier: number) => ({
  total_patients: 1256 + Math.floor(Math.random() * 100),
  active_patients: 1143 + Math.floor(Math.random() * 50),
  today_visits: 42 * multiplier,
  today_messages: 128 * multiplier,
  month_messages: 3584,
})

const generateTrends = (days: number, isForecast = false) => {
  const data = Array.from({ length: days }).map((_, i) => ({
    date: `2024-02-${String(i + 1).padStart(2, '0')}`,
    actual: Math.floor(Math.random() * 40) + 30,
    forecast: null as number | null
  }))

  if (isForecast) {
    // Add future 5 days
    for (let i = 0; i < 5; i++) {
      data.push({
        date: `2024-02-${String(days + i + 1).padStart(2, '0')} (予測)`,
        actual: null as any,
        forecast: Math.floor(Math.random() * 20) + 50 + (i * 5) // Trending up
      })
    }
  }
  return data
}

const COLORS = ['#007AFF', '#5E5CE6', '#30B0C7', '#FF2D55']

export default function Dashboard() {
  const [period, setPeriod] = useState(7)
  const [stats, setStats] = useState(generateStats(1))
  const [trends, setTrends] = useState(generateTrends(7))
  const [isSimulating, setIsSimulating] = useState(false)

  // Update data when period changes
  useEffect(() => {
    setStats(generateStats(period === 7 ? 1 : 1.5))
    setTrends(generateTrends(period, isSimulating))
  }, [period, isSimulating])

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  const handleSimulate = () => {
    setIsSimulating(!isSimulating)
  }

  const handleReport = () => {
    window.print()
  }

  const statCards = [
    { label: '友だち登録数', value: stats.total_patients, icon: 'diversity_1', color: 'text-blue-600' },
    { label: 'アクティブ患者', value: stats.active_patients, icon: 'sentiment_very_satisfied', color: 'text-indigo-600' },
    { label: '期間内来院', value: stats.today_visits * period, icon: 'event_available', color: 'text-cyan-600' },
    { label: '月間配信数', value: stats.month_messages, icon: 'forward_to_inbox', color: 'text-pink-600' },
  ]

  const reservationData = [
    { name: 'LINE予約', value: 65 }, { name: 'Web予約', value: 25 }, { name: '電話予約', value: 10 },
  ]

  const genreData = [
    { genre: '定期検診', reply_rate: 45 }, { genre: '予防接種', reply_rate: 30 },
    { genre: 'キャンペーン', reply_rate: 15 }, { genre: 'その他', reply_rate: 10 },
  ]

  if (!isMounted) return null

  return (
    <div className="h-full flex flex-col gap-6 print:block print:w-full print:h-auto print:overflow-visible">

      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-gray-200 print:hidden">
        <h1 className="text-xl font-bold text-mac-text flex items-center gap-2">
          <span className="material-symbols-rounded text-mac-accent">dashboard</span>
          ダッシュボード
        </h1>
        <div className="flex gap-4">
          <div className="flex bg-gray-100 p-1 border border-gray-200">
            <button
              onClick={() => setPeriod(7)}
              className={`px-4 py-1.5 text-xs font-bold transition-all ${period === 7 ? 'bg-white text-mac-text shadow-sm border border-gray-200' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              直近7日
            </button>
            <button
              onClick={() => setPeriod(30)}
              className={`px-4 py-1.5 text-xs font-bold transition-all ${period === 30 ? 'bg-white text-mac-text shadow-sm border border-gray-200' : 'text-gray-500 hover:bg-gray-200'}`}
            >
              直近30日
            </button>
          </div>
          <button
            onClick={handleReport}
            className="px-4 py-1.5 bg-mac-accent text-white text-xs font-bold shadow-sm hover:opacity-90 flex items-center gap-1"
          >
            <span className="material-symbols-rounded text-sm">picture_as_pdf</span>
            レポート (PDF)
          </button>
        </div>
      </div>

      {/* Report Header (Print Only) */}
      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">クリニック診療レポート</h1>
        <p className="text-center text-gray-500">期間: {period === 7 ? '直近7日間' : '直近30日間'}</p>
      </div>

      {/* Cards Row - Large Fonts, No Border Icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white px-6 py-6 border border-gray-300 shadow-sm hover:border-mac-accent cursor-pointer transition-all group flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{card.label}</p>
              <p className="text-4xl font-extrabold text-mac-text tracking-tight group-hover:text-mac-accent transition-colors">{card.value.toLocaleString()}</p>
            </div>
            <span className={`material-symbols-rounded text-5xl opacity-80 ${card.color} group-hover:scale-110 transition-transform`}>{card.icon}</span>
          </div>
        ))}
      </div>

      {/* Charts Grid - Expanded Height */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-4">

        {/* Main Trends (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">

          {/* Line Chart */}
          <div className="flex-[3] min-h-[400px] bg-white p-6 border border-gray-300 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-mac-text border-l-4 border-blue-500 pl-3">来院数推移 {isSimulating && <span className="text-purple-600 ml-2 text-sm">(AI予測モード)</span>}</h3>
              {/* Simulator Toggle */}
              <button
                onClick={handleSimulate}
                className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition-all print:hidden ${isSimulating ? 'bg-purple-100 text-purple-700 border border-purple-300 ring-2 ring-purple-100' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
              >
                <span className="material-symbols-rounded text-lg">{isSimulating ? 'auto_awesome' : 'model_training'}</span>
                {isSimulating ? '予測シミュレーション中' : 'AI来院予測を実行'}
              </button>
            </div>
            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <XAxis dataKey="date" tickFormatter={(v) => v.split(' ')[0].slice(5)} stroke="#86868B" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#86868B" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{ borderRadius: '0px', border: '1px solid #E5E5E5', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line name="実績値" type="linear" dataKey="actual" stroke="#007AFF" strokeWidth={3} dot={{ r: 4, fill: '#007AFF' }} activeDot={{ r: 6 }} />
                  {isSimulating && (
                    <Line name="AI予測値" type="monotone" dataKey="forecast" stroke="#9333ea" strokeDasharray="5 5" strokeWidth={3} dot={{ r: 4, fill: '#9333ea' }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex-[2] min-h-[300px] bg-white p-6 border border-gray-300 shadow-sm flex flex-col break-inside-avoid">
            <h3 className="text-lg font-bold text-mac-text mb-4 border-l-4 border-indigo-500 pl-3">ジャンル別メッセージ反応率</h3>
            <div className="flex-1 min-h-0 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genreData} layout="vertical" margin={{ left: 40, right: 20, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E5E5" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="genre" stroke="#1d1d1f" width={100} tick={{ fontSize: 13, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#F5F5F7' }} contentStyle={{ borderRadius: '0px', border: '1px solid #E5E5E5' }} />
                  <Bar dataKey="reply_rate" barSize={24}>
                    {genreData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) - Pie Only (Actions merged/removed) */}
        <div className="lg:col-span-4 flex flex-col gap-6 min-h-0">

          {/* Pie Chart */}
          <div className="h-[400px] bg-white p-6 border border-gray-300 shadow-sm flex flex-col break-inside-avoid">
            <h3 className="text-lg font-bold text-mac-text mb-4 border-l-4 border-cyan-500 pl-3">予約経路</h3>
            <div className="flex-1 min-h-0 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reservationData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {reservationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '0px', border: '1px solid #E5E5E5' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="square" iconSize={12} wrapperStyle={{ fontSize: '11px', color: '#1D1D1F' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-4xl font-extrabold text-mac-text">
                  {reservationData.reduce((a, b) => a + b.value, 0)}
                </span>
                <span className="text-xs text-gray-400 uppercase mt-1">Total</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
