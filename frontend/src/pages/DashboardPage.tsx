import { useState, useEffect } from 'react'
import { TrendingUp, Target, Layers, AlertTriangle } from 'lucide-react'
import { api } from '../api/client'
import { DashboardData, DIMENSION_LABELS_ZH, MODULE_LABELS } from '../types'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

const PIE_COLORS = ['#f59e0b', '#10b981', '#6366f1', '#f97316', '#ef4444']

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { api.getDashboard(1).then(setData).catch(console.error).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="flex items-center justify-center py-28"><div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" /></div>
  if (!data || data.total_practices === 0) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <div className="text-7xl mb-5">📊</div>
        <p className="text-gray-500 font-semibold text-lg">还没有练习记录</p>
        <p className="text-sm text-gray-400 mt-1">完成一次练习后，这里将展示你的成长轨迹</p>
      </div>
    )
  }

  const radarData = Object.entries(data.radar_scores).map(([k, v]) => ({ name: (DIMENSION_LABELS_ZH[k] || k).slice(0, 4), score: v, full: 100 }))
  const pieData = Object.entries(data.grade_distribution).filter(([, v]) => v > 0).map(([k, v]) => ({ name: k, value: v }))
  const moduleData = Object.entries(data.module_coverage).map(([k, v]) => ({ name: (MODULE_LABELS[k] || k).replace(/[^一-龥]/g, '').slice(0, 6), count: v }))
  const trendData = data.trend_data.filter((t: any) => t.score !== null)

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-indigo-500 rounded-full" />
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">成长追踪仪表盘</h2>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '总练习', value: data.total_practices, unit: '次', icon: Layers, color: 'text-indigo-600 bg-indigo-50' },
          { label: '综合均分', value: data.average_score, unit: '分', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
          { label: '薄弱维度', value: data.weak_dimensions.length, unit: '个', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
          { label: '覆盖模块', value: Object.keys(data.module_coverage).length, unit: '个', icon: Target, color: 'text-violet-600 bg-violet-50' },
        ].map(item => (
          <div key={item.label} className="card text-center hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3`}>
              <item.icon size={18} />
            </div>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{item.value}<span className="text-sm text-gray-400 font-medium ml-0.5">{item.unit}</span></p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      {/* 雷达 + 等级 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-1">八维能力雷达</h3>
          <p className="text-xs text-gray-400 mb-3">历史练习各维度均分</p>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#f3f4f6" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#d1d5db' }} />
              <Radar name="均分" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.12} strokeWidth={2.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-1">等级分布</h3>
          <p className="text-xs text-gray-400 mb-3">S/A/B/C/D 占比</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} innerRadius={55}
                  label={({ name, value }) => `${name} (${value})`}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % 5]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-gray-400 py-16 text-sm">暂无数据</p>}
        </div>
      </div>

      {/* 趋势 + 模块 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-1">成长曲线</h3>
          <p className="text-xs text-gray-400 mb-3">综合得分随时间变化</p>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-gray-400 py-16 text-sm">暂无数据</p>}
        </div>
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-1">模块覆盖</h3>
          <p className="text-xs text-gray-400 mb-3">各文化模块练习频次</p>
          {moduleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={moduleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-gray-400 py-16 text-sm">暂无数据</p>}
        </div>
      </div>

      {data.weak_dimensions.length > 0 && (
        <div className="card border-l-[3px] border-l-rose-500 bg-rose-50/40">
          <h3 className="font-bold text-gray-900 mb-1">🔴 薄弱维度预警</h3>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-rose-600">{data.weak_dimensions.map(k => DIMENSION_LABELS_ZH[k] || k).join('、')}</span> 均分低于 60，建议针对性加强练习
          </p>
        </div>
      )}
    </div>
  )
}
