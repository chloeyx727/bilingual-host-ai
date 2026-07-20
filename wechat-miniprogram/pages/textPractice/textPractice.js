const { getQuestionDetail, submitPractice } = require('../../utils/api')

function countEnglishWords(value) {
  const text = value.trim()
  return text ? text.split(/\s+/).length : 0
}

function parseContent(content) {
  if (!content) return {}
  if (typeof content === 'string') {
    try {
      return JSON.parse(content)
    } catch (error) {
      return { summary_zh: content }
    }
  }
  return content
}

function normalizeTextItem(item) {
  if (!item) return ''
  if (typeof item === 'string') return item
  if (item.zh) return item.zh
  if (item.fact && item.myth) return `${item.myth}：${item.fact}`
  if (item.fact) return item.fact
  return JSON.stringify(item)
}

function normalizeKnowledgeCard(card, index) {
  const content = parseContent(card.content)
  return {
    id: String(card.id || index),
    titleZh: card.title_zh || card.title || '知识卡片',
    titleEn: card.title_en || '',
    summaryZh: content.summary_zh || content.summary || '',
    keyFacts: Array.isArray(content.key_facts) ? content.key_facts.map(normalizeTextItem).filter(Boolean) : [],
    misunderstandings: Array.isArray(content.misunderstandings) ? content.misunderstandings.map(normalizeTextItem).filter(Boolean) : [],
    narrativeAngles: Array.isArray(content.narrative_angles) ? content.narrative_angles.map(normalizeTextItem).filter(Boolean) : [],
    expanded: false
  }
}

Page({
  data: {
    questionId: 0,
    question: {},
    knowledgeCards: [],
    scriptZh: '',
    scriptEn: '',
    zhCount: 0,
    enCount: 0,
    loading: true,
    submitting: false,
    error: '',
    startedAt: 0
  },

  onLoad(options) {
    this.setData({
      questionId: Number(options.id || 0),
      startedAt: Date.now()
    })
    this.loadQuestion()
  },

  async loadQuestion() {
    try {
      const question = await getQuestionDetail(this.data.questionId)
      const knowledgeCards = (question.knowledge_cards || []).map(normalizeKnowledgeCard)
      this.setData({ question, knowledgeCards })
    } catch (error) {
      wx.showToast({ title: error.message || '题目加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  toggleKnowledge(event) {
    const index = Number(event.currentTarget.dataset.index)
    const knowledgeCards = this.data.knowledgeCards.map((card, currentIndex) => ({
      ...card,
      expanded: currentIndex === index ? !card.expanded : card.expanded
    }))
    this.setData({ knowledgeCards })
  },

  onZhInput(event) {
    const value = event.detail.value
    this.setData({
      scriptZh: value,
      zhCount: value.replace(/\s/g, '').length
    })
  },

  onEnInput(event) {
    const value = event.detail.value
    this.setData({
      scriptEn: value,
      enCount: countEnglishWords(value)
    })
  },

  async submit() {
    if (!this.data.scriptZh.trim() && !this.data.scriptEn.trim()) {
      this.setData({ error: '请至少填写中文或英文文稿' })
      return
    }

    this.setData({ submitting: true, error: '' })
    wx.showLoading({ title: '评测中' })
    try {
      const duration = Math.max(1, Math.round((Date.now() - this.data.startedAt) / 1000))
      const response = await submitPractice({
        student_id: 1,
        question_id: this.data.questionId,
        script_zh: this.data.scriptZh,
        script_en: this.data.scriptEn,
        duration_seconds: duration
      })

      wx.setStorageSync('latestTextAssessment', {
        question: this.data.question,
        response
      })

      wx.navigateTo({
        url: '/pages/textResult/textResult'
      })
    } catch (error) {
      this.setData({ error: error.message || '提交失败，请稍后重试' })
    } finally {
      wx.hideLoading()
      this.setData({ submitting: false })
    }
  }
})
