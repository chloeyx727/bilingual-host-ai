Page({
  data: {
    title: '',
    assessment: null,
    dimensions: []
  },

  onLoad() {
    const payload = wx.getStorageSync('latestTextAssessment')
    if (!payload || !payload.response) {
      wx.showToast({ title: '暂无文字测评结果', icon: 'none' })
      return
    }

    const assessment = payload.response.assessment || null
    this.setData({
      title: payload.question && payload.question.title_zh ? payload.question.title_zh : '文字测评',
      assessment,
      dimensions: assessment && assessment.dimensions ? assessment.dimensions : []
    })
  },

  again() {
    wx.navigateTo({
      url: '/pages/textQuestions/textQuestions'
    })
  },

  home() {
    wx.reLaunch({
      url: '/pages/home/home'
    })
  }
})
