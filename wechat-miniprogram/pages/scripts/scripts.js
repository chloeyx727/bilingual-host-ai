const { getGroupedScripts } = require('../../data/speechScripts')

Page({
  data: {
    groups: []
  },

  onLoad() {
    this.setData({
      groups: getGroupedScripts()
    })
  },

  selectScript(event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/record/record?id=${id}`
    })
  }
})
