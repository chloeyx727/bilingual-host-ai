import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Loader2, ArrowLeft, FileText, Mic } from 'lucide-react'
import { api } from '../api/client'
import VoiceRecorder from '../components/VoiceRecorder'
import { SPEECH_SCRIPTS, SpeechScript } from '../data/speechScripts'

const categories = [...new Set(SPEECH_SCRIPTS.map(s => s.category))]

export default function SpeechPracticePage() {
  const navigate = useNavigate()
  const [selectedScript, setSelectedScript] = useState<SpeechScript | null>(null)
  const [audioCnBase64, setAudioCnBase64] = useState('')
  const [audioEnBase64, setAudioEnBase64] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showScripts, setShowScripts] = useState(true)

  async function handleSubmit() {
    if (!audioCnBase64 && !audioEnBase64) { setError('请至少录制一段录音'); return }
    setSubmitting(true); setError('')
    try {
      const result = await api.speechOnly({
        audio_cn_base64: audioCnBase64, audio_en_base64: audioEnBase64,
        text_cn: selectedScript?.textCn || '', text_en: selectedScript?.textEn || '',
      })
      navigate(`/speech-result/${result.practice_id}`)
    } catch (e: any) { setError(e.message || '提交失败') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate('/')} className="btn-ghost text-sm"><ArrowLeft size={15} /> 返回首页</button>

      <div className="card bg-gradient-to-br from-violet-50 to-white border-violet-100/50">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 shrink-0">
            <Mic size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">录音专项测评</h2>
            <p className="text-sm text-gray-500">选择一篇巴蜀文化文稿朗读录制，AI 评测你的发音准确度、流利度和完整度</p>
          </div>
        </div>
      </div>

      {/* 文稿选择 */}
      <div className="card">
        <button onClick={() => setShowScripts(!showScripts)}
          className="flex items-center gap-2 font-bold text-gray-900 w-full">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
            <FileText size={14} className="text-indigo-600" />
          </div>
          📝 朗读文稿 {showScripts ? '▾' : '▸'}
          {selectedScript && <span className="text-sm text-indigo-600 font-medium ml-2">· {selectedScript.title}</span>}
        </button>
        {showScripts && (
          <div className="mt-4 space-y-4">
            {categories.map(cat => (
              <div key={cat}>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{cat}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {SPEECH_SCRIPTS.filter(s => s.category === cat).map(script => (
                    <button key={script.id} onClick={() => { setSelectedScript(script); setAudioCnBase64(''); setAudioEnBase64('') }}
                      className={`text-left p-3 rounded-xl border text-sm transition-all ${
                        selectedScript?.id === script.id
                          ? 'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-300 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                      <span className="font-medium text-gray-800">{script.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 文稿预览 + 录音 */}
      {selectedScript && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card border-l-[3px] border-l-rose-400">
              <h3 className="font-bold text-sm text-gray-900 mb-3">🇨🇳 中文文稿</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedScript.textCn}</p>
            </div>
            <div className="card border-l-[3px] border-l-blue-400">
              <h3 className="font-bold text-sm text-gray-900 mb-3">🇬🇧 English Script</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedScript.textEn}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-gray-50/50">
              <h3 className="font-bold text-sm text-gray-900 mb-3">🎤 中文录音</h3>
              <VoiceRecorder label="中文" lang="zh-CN" onAudioReady={setAudioCnBase64} />
            </div>
            <div className="card bg-gray-50/50">
              <h3 className="font-bold text-sm text-gray-900 mb-3">🎤 English Recording</h3>
              <VoiceRecorder label="English" lang="en-US" onAudioReady={setAudioEnBase64} />
            </div>
          </div>
        </>
      )}

      {!selectedScript && (
        <div className="card text-center text-gray-400 py-12">
          <Mic size={36} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">请先选择一篇朗读文稿</p>
        </div>
      )}

      {selectedScript && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{audioCnBase64 || audioEnBase64 ? '✅ 录音就绪' : '请录制音频'}</span>
          <div className="flex items-center gap-3">
            {error && <span className="text-sm text-rose-500 font-medium">{error}</span>}
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> 评测中...</> : <><Send size={16} /> 提交评测</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
