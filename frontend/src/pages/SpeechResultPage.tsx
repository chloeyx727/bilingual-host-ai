import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { api } from '../api/client'

function VoiceScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-xs text-gray-500 w-16">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${Math.min(100, score)}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-8 text-right tabular-nums">{score}</span>
    </div>
  )
}

export default function SpeechResultPage() {
  const { practiceId } = useParams<{ practiceId: string }>()
  const navigate = useNavigate()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (practiceId) api.getSpeechResult(Number(practiceId)).then(setResult).catch(console.error).finally(() => setLoading(false))
  }, [practiceId])

  if (loading) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <div className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto mb-5" />
        <p className="text-gray-500 font-medium">加载评测结果</p>
      </div>
    )
  }

  if (!result) return <div className="text-center py-20 text-gray-400">结果不存在</div>

  const hasCn = result.chinese && !result.chinese.error
  const hasEn = result.english && !result.english.error
  const hasFallback = Boolean(result.chinese?.fallback || result.english?.fallback)

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate('/speech-practice')} className="btn-ghost text-sm"><ArrowLeft size={15} /> 返回录音测评</button>

      <div className="card text-center py-8 bg-gradient-to-br from-violet-50 to-white border-violet-100/50">
        <h2 className="text-xl font-bold text-gray-900 mb-1">🎙️ 录音评测结果</h2>
        <p className="text-4xl font-extrabold text-violet-600 mt-3">
          {result.combined_score}<span className="text-base text-gray-400 font-medium"> / 100</span>
        </p>
        {hasFallback && (
          <p className="text-xs text-amber-600 mt-3">
            讯飞语音评测暂不可用，当前显示本机录音质量测试分。
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasCn && (
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">🇨🇳 中文发音</h3>
            <div className="space-y-3">
              <VoiceScoreBar label="总分" score={result.chinese.total_score} />
              <VoiceScoreBar label="准确度" score={result.chinese.accuracy_score} />
              <VoiceScoreBar label="流利度" score={result.chinese.fluency_score} />
              <VoiceScoreBar label="完整度" score={result.chinese.integrity_score} />
            </div>
          </div>
        )}
        {hasEn && (
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">🇬🇧 English</h3>
            <div className="space-y-3">
              <VoiceScoreBar label="Total" score={result.english.total_score} />
              <VoiceScoreBar label="Accuracy" score={result.english.accuracy_score} />
              <VoiceScoreBar label="Fluency" score={result.english.fluency_score} />
              <VoiceScoreBar label="Complete" score={result.english.integrity_score} />
            </div>
          </div>
        )}
      </div>

      {!hasCn && !hasEn && <div className="card text-center text-gray-400 py-8">评测未完成，请返回重试</div>}

      <div className="text-center">
        <button onClick={() => navigate('/speech-practice')} className="btn-secondary"><RotateCcw size={14} /> 再次录音</button>
      </div>
    </div>
  )
}
