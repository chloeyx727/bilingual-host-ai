import { useState, useRef, useCallback } from 'react'
import { Mic, Square, Play, Trash2, AlertCircle } from 'lucide-react'

export default function VoiceRecorder({ label, lang, onAudioReady }: {
  label: string; lang: 'zh-CN' | 'en-US'; onAudioReady: (b64: string) => void
}) {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState('')
  const mrRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = useCallback(async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mt = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm'
      const mr = new MediaRecorder(stream, { mimeType: mt })
      mrRef.current = mr; chunksRef.current = []

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        try {
          onAudioReady(await blobToPcm16Base64(blob))
          setAudioUrl(URL.createObjectURL(blob))
        } catch {
          onAudioReady('')
          setAudioUrl(null)
          setError('音频转换失败，请重新录制')
        } finally {
          stream.getTracks().forEach(t => t.stop())
        }
      }
      mr.onerror = () => { setError('录音失败'); setRecording(false); stream.getTracks().forEach(t => t.stop()) }
      mr.start(); setRecording(true); setAudioUrl(null); setDuration(0)
      const start = Date.now()
      timerRef.current = window.setInterval(() => setDuration(Math.floor((Date.now() - start) / 1000)), 200)
    } catch (e: any) {
      if (e.name === 'NotAllowedError') setError('麦克风权限被拒绝')
      else if (e.name === 'NotFoundError') setError('未检测到麦克风')
      else setError('无法启动录音')
    }
  }, [onAudioReady])

  const stopRecording = useCallback(() => { mrRef.current?.stop(); setRecording(false); clearInterval(timerRef.current) }, [])
  const playAudio = () => { if (audioRef.current) { audioRef.current.play(); setPlaying(true); audioRef.current.onended = () => setPlaying(false) } }
  const discard = () => { setAudioUrl(null); onAudioReady(''); setError('') }

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 w-12 shrink-0">{label}</span>

        {!audioUrl ? (
          <button onClick={recording ? stopRecording : startRecording} type="button"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              recording
                ? 'bg-rose-100 text-rose-600 shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-600 shadow-sm'
            }`}>
            {recording ? <><Square size={11} /> 停止 {formatTime(duration)}</> : <><Mic size={11} /> 录音</>}
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <button onClick={playAudio} type="button"
              className={`p-1.5 rounded-lg text-xs transition-all ${playing ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600'}`}>
              <Play size={12} /></button>
            <button onClick={discard} type="button"
              className="p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
              <Trash2 size={12} /></button>
            <button onClick={startRecording} type="button"
              className="p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition-all" title="重录">
              <Mic size={12} /></button>
            <span className="text-xs text-emerald-600 font-semibold ml-1">已录制 {formatTime(duration)}</span>
          </div>
        )}
      </div>
      {error && <div className="flex items-center gap-1 mt-1.5 ml-14 text-xs text-rose-500"><AlertCircle size={11} /> {error}</div>}
      {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}
    </div>
  )
}

function formatTime(s: number) { const m = Math.floor(s / 60); const sec = s % 60; return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` }

async function blobToPcm16Base64(blob: Blob, targetSampleRate = 16000) {
  const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioContextCtor) throw new Error('AudioContext is not supported')

  const audioContext = new AudioContextCtor()
  try {
    const audioBuffer = await audioContext.decodeAudioData(await blob.arrayBuffer())
    const mono = mixToMono(audioBuffer)
    const resampled = resampleLinear(mono, audioBuffer.sampleRate, targetSampleRate)
    return bytesToBase64(floatToPcm16(resampled))
  } finally {
    if (typeof audioContext.close === 'function') await audioContext.close()
  }
}

function mixToMono(audioBuffer: AudioBuffer) {
  const mono = new Float32Array(audioBuffer.length)
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
    const data = audioBuffer.getChannelData(channel)
    for (let i = 0; i < data.length; i += 1) mono[i] += data[i] / audioBuffer.numberOfChannels
  }
  return mono
}

function resampleLinear(input: Float32Array, sourceSampleRate: number, targetSampleRate: number) {
  if (sourceSampleRate === targetSampleRate) return input
  const ratio = sourceSampleRate / targetSampleRate
  const output = new Float32Array(Math.max(1, Math.round(input.length / ratio)))

  for (let i = 0; i < output.length; i += 1) {
    const sourceIndex = i * ratio
    const left = Math.floor(sourceIndex)
    const right = Math.min(left + 1, input.length - 1)
    const weight = sourceIndex - left
    output[i] = input[left] * (1 - weight) + input[right] * weight
  }

  return output
}

function floatToPcm16(samples: Float32Array) {
  const bytes = new Uint8Array(samples.length * 2)
  const view = new DataView(bytes.buffer)
  for (let i = 0; i < samples.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
  }
  return bytes
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...Array.from(bytes.subarray(i, i + chunkSize)))
  }
  return btoa(binary)
}
