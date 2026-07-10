import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RefreshCw, ArrowLeft, Sparkles, Mic } from 'lucide-react'
import { api } from '../api/client'
import { AssessmentOut } from '../types'
import GradeBadge from '../components/GradeBadge'
import RadarChart from '../components/RadarChart'
import DimensionFeedback from '../components/DimensionFeedback'

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

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">{icon}</div>
      <div>
        <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  )
}

export default function AssessmentPage() {
  const { practiceId } = useParams<{ practiceId: string }>()
  const navigate = useNavigate()
  const [assessment, setAssessment] = useState<AssessmentOut | null>(null)
  const [loading, setLoading] = useState(true)
  const [retrying, setRetrying] = useState(false)

  useEffect(() => { if (practiceId) loadAssessment() }, [practiceId])

  async function loadAssessment() {
    setLoading(true)
    try { setAssessment(await api.getAssessment(Number(practiceId))) } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function handleRetry() {
    setRetrying(true)
    try { setAssessment(await api.retryAssessment(Number(practiceId))) } catch (e) { console.error(e) }
    finally { setRetrying(false) }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 animate-fade-in">
        <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
        <p className="text-gray-600 font-semibold text-lg">AI 正在深度评析</p>
        <p className="text-sm text-gray-400 mt-1">八维并行分析中，预计 30–60 秒</p>
      </div>
    )
  }

  if (!assessment) return <div className="text-center py-20 text-gray-400 font-medium">评析数据不存在</div>

  const hasVoice = assessment.voice_result &&
    ((assessment.voice_result.chinese && !assessment.voice_result.chinese.error) ||
     (assessment.voice_result.english && !assessment.voice_result.english.error))

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <button onClick={() => navigate('/')} className="btn-ghost text-sm">
        <ArrowLeft size={15} /> 返回
      </button>

      {/* ========== 综合等级 ========== */}
      <div className="card text-center py-10 bg-gradient-to-b from-white to-gray-50/50">
        <GradeBadge grade={assessment.overall_grade} />
        <p className="text-5xl font-extrabold text-gray-900 mt-5 tracking-tighter">
          {assessment.overall_score}<span className="text-lg text-gray-400 font-medium"> / 100</span>
        </p>
        <button onClick={handleRetry} disabled={retrying}
          className="btn-ghost text-xs mt-4 text-gray-400 hover:text-indigo-600">
          <RefreshCw size={12} className={retrying ? 'animate-spin' : ''} /> 重新评析
        </button>
      </div>

      {/* ========== 八维雷达图 ========== */}
      <div className="card">
        <SectionHeader icon={<Sparkles size={14} className="text-indigo-500" />} title="八维能力雷达" subtitle="八个维度得分可视化" />
        <RadarChart assessment={assessment} />
      </div>

      {/* ========== 语音评测（如果有） ========== */}
      {hasVoice && (
        <div className="card border-l-[3px] border-l-violet-500 bg-gradient-to-r from-violet-50/30 to-white">
          <SectionHeader icon={<Mic size={14} className="text-violet-500" />} title="语音评测" subtitle="讯飞 AI 引擎" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessment.voice_result!.chinese && !assessment.voice_result!.chinese.error && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-3">🇨🇳 中文发音</h4>
                <div className="space-y-2.5">
                  <VoiceScoreBar label="总分" score={assessment.voice_result!.chinese.total_score} />
                  <VoiceScoreBar label="准确度" score={assessment.voice_result!.chinese.accuracy_score} />
                  <VoiceScoreBar label="流利度" score={assessment.voice_result!.chinese.fluency_score} />
                  <VoiceScoreBar label="完整度" score={assessment.voice_result!.chinese.integrity_score} />
                </div>
              </div>
            )}
            {assessment.voice_result!.english && !assessment.voice_result!.english.error && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-3">🇬🇧 English</h4>
                <div className="space-y-2.5">
                  <VoiceScoreBar label="Total" score={assessment.voice_result!.english.total_score} />
                  <VoiceScoreBar label="Accuracy" score={assessment.voice_result!.english.accuracy_score} />
                  <VoiceScoreBar label="Fluency" score={assessment.voice_result!.english.fluency_score} />
                  <VoiceScoreBar label="Complete" score={assessment.voice_result!.english.integrity_score} />
                </div>
              </div>
            )}
          </div>
          {assessment.voice_result!.combined_score > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
              <span className="text-sm text-gray-500">综合语音分</span>
              <span className="text-3xl font-extrabold text-violet-600">{assessment.voice_result!.combined_score}</span>
              <span className="text-sm text-gray-400">/ 100</span>
            </div>
          )}
        </div>
      )}

      {/* ========== 亮点 & 改进 ========== */}
      {(assessment.highlights.length > 0 || assessment.improvements.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessment.highlights.length > 0 && (
            <div className="card border-l-[3px] border-l-emerald-500">
              <h3 className="font-bold text-sm text-gray-900 mb-3">✅ 亮点</h3>
              <ul className="space-y-2">
                {assessment.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="text-emerald-500 shrink-0 mt-0.5">✦</span> {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {assessment.improvements.length > 0 && (
            <div className="card border-l-[3px] border-l-amber-500">
              <h3 className="font-bold text-sm text-gray-900 mb-3">⚠️ 待改进</h3>
              <ul className="space-y-2">
                {assessment.improvements.map((imp, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                    <span className="text-amber-500 shrink-0 mt-0.5">▶</span> {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ========== 逐维反馈 ========== */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Sparkles size={14} className="text-indigo-500" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">逐维详细反馈</h3>
            <p className="text-xs text-gray-400">每个维度独立评析，点击展开查看详情</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {assessment.dimensions.map(dim => <DimensionFeedback key={dim.dimension_key} dimension={dim} />)}
        </div>
      </div>
    </div>
  )
}
