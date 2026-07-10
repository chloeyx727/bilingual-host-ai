import { useState, useRef, useCallback } from 'react'

interface SpeechRecognitionHook {
  isListening: boolean
  isSupported: boolean
  startListening: (lang?: string) => void
  stopListening: () => void
  transcript: string
  error: string | null
}

export function useSpeechRecognition(onResult: (text: string, isFinal: boolean) => void): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  // 检查浏览器支持
  const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  const isSupported = !!SpeechRecognitionAPI

  const startListening = useCallback((lang: string = 'zh-CN') => {
    if (!isSupported) {
      setError('您的浏览器不支持语音识别，请使用 Chrome 或 Edge')
      return
    }

    setError(null)

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = lang
    recognition.continuous = true      // 持续监听
    recognition.interimResults = true  // 返回中间结果
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      if (final) {
        onResult(final, true)
      }
      if (interim) {
        onResult(interim, false)
      }
    }

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error)
      if (event.error === 'no-speech') {
        // 静默处理，不报错
      } else if (event.error === 'aborted') {
        // 用户主动停止
      } else {
        setError(`语音识别错误: ${event.error}`)
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isSupported, onResult])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript: '',
    error,
  }
}
