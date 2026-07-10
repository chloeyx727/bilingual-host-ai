import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { api } from '../api/client'
import { QuestionOut, MODULE_LABELS, TYPE_LABELS, DIFFICULTY_LABELS } from '../types'
import QuestionCard from '../components/QuestionCard'

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionOut[]>([])
  const [loading, setLoading] = useState(true)
  const [filterModule, setFilterModule] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterDiff, setFilterDiff] = useState('')
  const navigate = useNavigate()

  useEffect(() => { loadQuestions() }, [filterModule, filterType, filterDiff])

  async function loadQuestions() {
    setLoading(true)
    try {
      const params: any = {}
      if (filterModule) params.module = filterModule
      if (filterType) params.type = filterType
      if (filterDiff) params.difficulty = Number(filterDiff)
      const data = await api.getQuestions(params)
      setQuestions(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  return (
    <div className="animate-fade-in space-y-8">
      <button onClick={() => navigate('/')} className="btn-ghost text-sm">
        <ArrowLeft size={15} /> 返回首页
      </button>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--ink)' }}>
          文字内容测评
        </h2>
        <p className="text-sm" style={{ color: 'var(--ink-light)' }}>
          选择题型，撰写中英双语主持稿，AI 从八个维度深度评析
        </p>
      </div>

      {/* 筛选栏 */}
      <div className="flex items-center gap-3">
        <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="select-field">
          <option value="">全部模块</option>
          {Object.entries(MODULE_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="select-field">
          <option value="">全部题型</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
        </select>
        <select value={filterDiff} onChange={e => setFilterDiff(e.target.value)} className="select-field">
          <option value="">全部难度</option>
          {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
        </select>
        <span className="text-xs ml-auto" style={{ color: 'var(--ink-light)' }}>{questions.length} 题</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (<div key={i} className="card animate-shimmer h-40" />))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questions.map(q => (<QuestionCard key={q.id} question={q} onClick={() => navigate(`/practice/${q.id}`)} />))}
        </div>
      )}
    </div>
  )
}
