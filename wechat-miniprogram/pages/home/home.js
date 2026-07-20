Page({
  goText() {
    wx.navigateTo({
      url: '/pages/textQuestions/textQuestions'
    })
  },

  goSpeech() {
    wx.navigateTo({
      url: '/pages/scripts/scripts'
    })
  },

  goDashboard() {
    wx.navigateTo({
      url: '/pages/dashboard/dashboard'
    })
  }
})
