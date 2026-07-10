import { useState, useCallback, useRef } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

interface Props {
  label: string; placeholder: string; value: string
  onChange: (v: string) => void; onFocus?: () => void
  speechLang?: string
}

export default function WritingEditor({ label, placeholder, value, onChange, onFocus, speechLang }: Props) {
  const [interimText, setInterimText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isChinese = label.includes('中文') || label.includes('Chinese')
  const lang = speechLang || (isChinese ? 'zh-CN' : 'en-US')

  const wordCount = (label.includes('English') || label.toLowerCase().includes('english'))
    ? (value.trim() ? value.trim().split(/\s+/).length : 0)
    : value.replace(/\s/g, '').length

  const handleSpeechResult = useCallback((text: string, isFinal: boolean) => {
    if (isFinal) { onChange(value ? value + text : text); setInterimText('') }
    else { setInterimText(text) }
  }, [value, onChange])

  const { isListening, isSupported, startListening, stopListening, error } = useSpeechRecognition(handleSpeechResult)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-sm text-gray-800">{label}</label>
          {isSupported && (
            <button
              onClick={() => { if (isListening) stopListening(); else { textareaRef.current?.focus(); startListening(lang) } }}
              type="button"
              className={`p-1.5 rounded-lg transition-all ${
                isListening ? 'bg-rose-100 text-rose-500 animate-pulse' : 'text-gray-300 hover:text-indigo-500 hover:bg-indigo-50'
              }`}
              title={isListening ? '停止' : '语音输入'}
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isListening && <span className="text-xs text-rose-500 font-medium animate-pulse">● 聆听中</span>}
          {error && <span className="text-xs text-rose-400">{error}</span>}
          <span className="text-xs text-gray-400 tabular-nums">{wordCount} 字</span>
        </div>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef} value={value}
          onChange={e => onChange(e.target.value)} onFocus={onFocus}
          placeholder={isListening ? '🎤 正在聆听...' : placeholder}
          rows={10}
          className={`w-full px-4 py-3.5 rounded-xl border-2 resize-none text-sm leading-relaxed transition-all duration-150
            placeholder:text-gray-300
            ${isListening
              ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-50'
              : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50'
            }`}
        />
        {isListening && interimText && (
          <div className="absolute bottom-2 left-4 right-4 px-3 py-2 bg-white/90 backdrop-blur text-sm text-gray-400 italic rounded-lg border border-gray-100 pointer-events-none">
            {interimText}
          </div>
        )}
      </div>
    </div>
  )
}
