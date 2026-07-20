function buildAdvice(score) {
  if (score >= 85) return '表现稳定，继续保持清晰的吐字和自然的语流节奏。'
  if (score >= 70) return '基础较好，可以重点练习停连、重音和句尾收束。'
  if (score >= 50) return '建议放慢语速，先保证每个音节饱满，再提升整体流畅度。'
  return '本次录音质量偏低，请确认麦克风权限、环境噪声和录音时长后重试。'
}

Page({
  data: {
    title: '',
    score: 0,
    detail: null,
    langLabel: '',
    fallback: false,
    advice: ''
  },

  onLoad() {
    const payload = wx.getStorageSync('latestSpeechResult')
    if (!payload || !payload.result) {
      wx.showToast({ title: '暂无评测结果', icon: 'none' })
      return
    }

    const detail = payload.lang === 'cn' ? payload.result.chinese : payload.result.english
    const score = detail ? Math.round(Number(detail.total_score || 0)) : Math.round(Number(payload.result.combined_score || 0))
    this.setData({
      title: payload.title || '录音测评',
      score,
      detail,
      langLabel: payload.lang === 'cn' ? '中文录音' : 'English Recording',
      fallback: Boolean(detail && detail.fallback),
      advice: buildAdvice(score)
    })
  },

  backToScripts() {
    wx.navigateTo({
      url: '/pages/scripts/scripts'
    })
  },

  backHome() {
    wx.reLaunch({
      url: '/pages/home/home'
    })
  }
})
