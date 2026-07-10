const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://bilingual-host-ai-api.onrender.com/api'
).replace(/\/$/, '')

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

// ========== 题目 ==========
export const api = {
  getQuestions: (params?: { module?: string; type?: string; difficulty?: number }) => {
    const qs = new URLSearchParams()
    if (params?.module) qs.set('module', params.module)
    if (params?.type) qs.set('type', params.type)
    if (params?.difficulty) qs.set('difficulty', String(params.difficulty))
    qs.set('limit', '200')  // 加载全部题目
    const query = qs.toString()
    return request<any[]>(`/questions${query ? '?' + query : ''}`)
  },

  getQuestionDetail: (id: number) =>
    request<any>(`/questions/${id}`),

  // ========== 练习 ==========
  submitPractice: (data: { student_id: number; question_id: number; script_zh: string; script_en: string; duration_seconds: number }) =>
    request<any>('/practices', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getPracticeHistory: (studentId: number = 1) =>
    request<any[]>(`/practices?student_id=${studentId}`),

  // ========== 评析 ==========
  getAssessment: (practiceId: number) =>
    request<any>(`/assessments/${practiceId}`),

  retryAssessment: (practiceId: number) =>
    request<any>(`/assessments/${practiceId}/retry`, { method: 'POST' }),

  // ========== 语音评测 ==========
  evaluateSpeech: (data: { practice_id: number; audio_cn_base64?: string; audio_en_base64?: string }) =>
    request<any>('/speech-evaluate', { method: 'POST', body: JSON.stringify(data) }),

  speechOnly: (data: { audio_cn_base64: string; audio_en_base64: string; text_cn?: string; text_en?: string }) =>
    request<any>('/speech-only', { method: 'POST', body: JSON.stringify(data) }),

  getSpeechResult: (practiceId: number) =>
    request<any>(`/speech-result/${practiceId}`),

  // ========== 仪表盘 ==========
  getDashboard: (studentId: number = 1) =>
    request<any>(`/dashboard/${studentId}`),
}
