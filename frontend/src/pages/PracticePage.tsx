import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Loader2, Send } from 'lucide-react'
import { api } from '../api/client'
import { QuestionDetail } from '../types'
import KnowledgePanel from '../components/KnowledgePanel'
import WritingEditor from '../components/WritingEditor'

export default function PracticePage() {
  const { questionId } = useParams<{ questionId: string }>()
  const navigate = useNavigate()
  const [question, setQuestion] = useState<QuestionDetail | null>(null)
  const [scriptZh, setScriptZh] = useState('')
  const [scriptEn, setScriptEn] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [timerOn, setTimerOn] = useState(false)

  useEffect(() => {
    if (questionId) {
      api.getQuestionDetail(Number(questionId)).then(setQuestion).catch(console.error)
    }
  }, [questionId])

  useEffect(() => {
    let interval: number | undefined
    if (timerOn) {
      interval = window.setInterval(() => setSeconds((value: number) => value + 1), 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerOn])

  async function handleSubmit() {
    if (!scriptZh.trim() && !scriptEn.trim()) {
      setError('请至少填写中文或英文文稿')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const result = await api.submitPractice({
        student_id: 1,
        question_id: Number(questionId),
        script_zh: scriptZh,
        script_en: scriptEn,
        duration_seconds: seconds,
      })
      if (result.practice_id) navigate(`/assessment/${result.practice_id}`)
    } catch (err: any) {
      setError(err.message || '提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center py-28">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2 space-y-5">
        <button onClick={() => navigate('/')} className="btn-ghost text-sm">
          <ArrowLeft size={15} /> 返回选题
        </button>

        <div className="card bg-gradient-to-br from-white to-indigo-50/30 border-indigo-100/40">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-indigo">{TYPE_LABELS[question.type] || question.type}</span>
            <span className="badge-amber">{MODULE_LABELS[question.module] || question.module}</span>
            <span className="text-xs text-gray-400">{'★'.repeat(question.difficulty || 2)}</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1.5">{question.title_zh}</h2>
          <p className="text-sm text-gray-500 mb-3">{question.title_en}</p>
          {question.scenario && (
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3.5 text-sm text-amber-800 leading-relaxed">
              <span className="font-semibold">场景</span> {question.scenario}
            </div>
          )}
        </div>

        <div className="card">
          <WritingEditor
            label="中文主持稿"
            placeholder="在此输入你的中文主持文稿..."
            value={scriptZh}
            onChange={setScriptZh}
            onFocus={() => setTimerOn(true)}
          />
        </div>

        <div className="card">
          <WritingEditor
            label="English Script"
            placeholder="Write your English hosting script here..."
            value={scriptEn}
            onChange={setScriptEn}
            onFocus={() => setTimerOn(true)}
          />
        </div>

        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-3.5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={17} />
              <span className="font-mono text-lg font-bold tabular-nums">{formatTime(seconds)}</span>
            </div>
            <div className="text-xs text-gray-400">
              中文 {scriptZh.replace(/\s/g, '').length} 字 · 英文 {scriptEn.trim() ? scriptEn.trim().split(/\s+/).length : 0} 词
            </div>
          </div>
          <div className="flex items-center gap-3">
            {error && <span className="text-sm text-rose-500 font-medium">{error}</span>}
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> 评析中...
                </>
              ) : (
                <>
                  <Send size={16} /> 提交评析
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <KnowledgePanel knowledgeCards={question.knowledge_cards || []} />
      </div>
    </div>
  )
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

const TYPE_LABELS: Record<string, string> = {
  cultural_explanation: '文化解说',
  impromptu_bridge: '即兴串场',
  cross_cultural_commentary: '跨文化评论',
  interview: '访谈应对',
  crisis_rescue: '危机救场',
  debate: '观点辩论',
}

const MODULE_LABELS: Record<string, string> = {
  natural_heritage: '自然遗产',
  history: '历史文脉',
  intangible_heritage: '非遗技艺',
  city_spirit: '城市精神',
  contemporary: '当代创新',
  cultural_comparison: '文化比较',
}
