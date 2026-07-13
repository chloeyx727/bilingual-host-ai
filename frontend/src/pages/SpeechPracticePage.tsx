import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Loader2, Mic, Send } from 'lucide-react'
import { api } from '../api/client'
import VoiceRecorder from '../components/VoiceRecorder'
import { SPEECH_SCRIPTS, SpeechScript } from '../data/speechScripts'

const categories = [...new Set(SPEECH_SCRIPTS.map(script => script.category))]

export default function SpeechPracticePage() {
  const { scriptId } = useParams<{ scriptId?: string }>()
  const selectedScript = useMemo(
    () => SPEECH_SCRIPTS.find(script => script.id === scriptId) || null,
    [scriptId],
  )

  if (!selectedScript) return <SpeechScriptSelectionPage />
  return <SpeechRecordingPage script={selectedScript} />
}

function SpeechScriptSelectionPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate('/')} className="btn-ghost text-sm">
        <ArrowLeft size={15} /> 返回首页
      </button>

      <div className="card bg-gradient-to-br from-violet-50 to-white border-violet-100/50">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 shrink-0">
            <Mic size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">录音专项测评</h2>
            <p className="text-sm text-gray-500">先选择一篇巴蜀文化双语文稿，再分别完成中文和英文录音测评。</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map(category => (
          <section key={category}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                <FileText size={14} className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900">{category}</h3>
              <span className="text-xs text-gray-400">
                {SPEECH_SCRIPTS.filter(script => script.category === category).length} 篇
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SPEECH_SCRIPTS.filter(script => script.category === category).map(script => (
                <button
                  key={script.id}
                  type="button"
                  onClick={() => navigate(`/speech-practice/${script.id}`)}
                  className="card text-left hover:border-violet-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{script.title}</h4>
                      <p className="text-xs text-gray-400">{script.categoryEn}</p>
                    </div>
                    <span className="text-xs font-semibold text-violet-600 shrink-0">开始录制</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function SpeechRecordingPage({ script }: { script: SpeechScript }) {
  const navigate = useNavigate()
  const [audioCnBase64, setAudioCnBase64] = useState('')
  const [audioEnBase64, setAudioEnBase64] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!audioCnBase64 && !audioEnBase64) {
      setError('请至少完成一段录音')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const result = await api.speechOnly({
        audio_cn_base64: audioCnBase64,
        audio_en_base64: audioEnBase64,
        text_cn: script.textCn,
        text_en: script.textEn,
      })
      navigate(`/speech-result/${result.practice_id}`)
    } catch (err: any) {
      setError(err.message || '提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate('/speech-practice')} className="btn-ghost text-sm">
        <ArrowLeft size={15} /> 返回选题
      </button>

      <div className="card bg-gradient-to-br from-violet-50 to-white border-violet-100/50">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 shrink-0">
            <Mic size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{script.title}</h2>
            <p className="text-sm text-gray-500">{script.category} · {script.categoryEn}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="card border-l-[3px] border-l-rose-400 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900">中文录音</h3>
            <p className="text-xs text-gray-400 mt-1">朗读下方中文文稿，完成后可播放、重录或提交测评。</p>
          </div>
          <div className="bg-rose-50/60 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">{script.textCn}</div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <VoiceRecorder label="中文" lang="zh-CN" onAudioReady={setAudioCnBase64} />
          </div>
        </section>

        <section className="card border-l-[3px] border-l-blue-400 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900">English Recording</h3>
            <p className="text-xs text-gray-400 mt-1">Read the English script below, then play back, re-record, or submit.</p>
          </div>
          <div className="bg-blue-50/60 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">{script.textEn}</div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <VoiceRecorder label="English" lang="en-US" onAudioReady={setAudioEnBase64} />
          </div>
        </section>
      </div>

      <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-3.5 shadow-sm">
        <span className="text-sm text-gray-400">
          {audioCnBase64 || audioEnBase64 ? '录音已准备，可提交测评' : '请先完成中文或英文录音'}
        </span>
        <div className="flex items-center gap-3">
          {error && <span className="text-sm text-rose-500 font-medium">{error}</span>}
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> 测评中...
              </>
            ) : (
              <>
                <Send size={16} /> 提交测评
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
