const { getScriptById } = require('../../data/speechScripts')
const { uploadSpeech } = require('../../utils/api')

const recorder = wx.getRecorderManager()

function readFileBase64(filePath) {
  return wx.getFileSystemManager().readFileSync(filePath, 'base64')
}

function base64SizeMb(base64) {
  return base64.length * 0.75 / 1024 / 1024
}

function showError(title, error) {
  wx.showModal({
    title,
    content: error && error.message ? error.message : String(error || '未知错误'),
    showCancel: false
  })
}

Page({
  data: {
    script: {},
    recording: false,
    activeLang: '',
    cnPath: '',
    enPath: '',
    cnBase64: '',
    enBase64: '',
    cnStatus: '未录制',
    enStatus: 'Not recorded',
    submitting: ''
  },

  onLoad(options) {
    const script = getScriptById(options.id)
    if (!script) {
      wx.showToast({ title: '文稿不存在', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 800)
      return
    }
    this.setData({ script })
    this.bindRecorder()
  },

  bindRecorder() {
    recorder.onStart(() => {
      const isChinese = this.data.activeLang === 'cn'
      this.setData({
        recording: true,
        cnStatus: isChinese ? '录音中' : this.data.cnStatus,
        enStatus: isChinese ? this.data.enStatus : 'Recording'
      })
    })

    recorder.onStop((res) => {
      const filePath = res.tempFilePath
      const lang = this.data.activeLang
      try {
        const base64 = readFileBase64(filePath)
        if (lang === 'cn') {
          this.setData({
            recording: false,
            activeLang: '',
            cnPath: filePath,
            cnBase64: base64,
            cnStatus: '已录制'
          })
        } else {
          this.setData({
            recording: false,
            activeLang: '',
            enPath: filePath,
            enBase64: base64,
            enStatus: 'Recorded'
          })
        }
      } catch (error) {
        this.setData({ recording: false, activeLang: '' })
        showError('读取录音失败', error)
      }
    })

    recorder.onError((error) => {
      const isChinese = this.data.activeLang === 'cn'
      this.setData({
        recording: false,
        activeLang: '',
        cnStatus: isChinese ? '录音失败' : this.data.cnStatus,
        enStatus: isChinese ? this.data.enStatus : 'Failed'
      })
      showError('无法启动录音', error)
    })
  },

  startChinese() {
    this.startRecord('cn')
  },

  startEnglish() {
    this.startRecord('en')
  },

  startRecord(lang) {
    wx.authorize({
      scope: 'scope.record',
      complete: () => {
        this.setData({ activeLang: lang })
        recorder.start({
          duration: 30000,
          sampleRate: 16000,
          numberOfChannels: 1,
          encodeBitRate: 96000,
          format: 'wav',
          frameSize: 50
        })
      }
    })
  },

  stopRecord() {
    recorder.stop()
  },

  playChinese() {
    this.play(this.data.cnPath)
  },

  playEnglish() {
    this.play(this.data.enPath)
  },

  play(filePath) {
    if (!filePath) return
    const audio = wx.createInnerAudioContext()
    audio.src = filePath
    audio.play()
    audio.onEnded(() => audio.destroy())
    audio.onError((error) => {
      audio.destroy()
      showError('播放失败，请重新录制', error)
    })
  },

  submitChinese() {
    this.submit('cn')
  },

  submitEnglish() {
    this.submit('en')
  },

  async submit(lang) {
    const isChinese = lang === 'cn'
    const filePath = isChinese ? this.data.cnPath : this.data.enPath
    const audio = isChinese ? this.data.cnBase64 : this.data.enBase64
    if (!filePath || !audio) {
      wx.showToast({ title: isChinese ? '请先录制中文' : 'Please record first', icon: 'none' })
      return
    }
    if (base64SizeMb(audio) > 4) {
      wx.showModal({
        title: '录音过长',
        content: '当前录音文件较大，请控制在 30 秒内重新录制后再上传。',
        showCancel: false
      })
      return
    }

    this.setData({ submitting: lang })
    wx.showLoading({ title: '测评中' })
    try {
      const response = await uploadSpeech(filePath, {
        lang: isChinese ? 'cn' : 'en',
        text_cn: isChinese ? this.data.script.textCn : '',
        text_en: isChinese ? '' : this.data.script.textEn
      })

      wx.setStorageSync('latestSpeechResult', {
        title: this.data.script.title,
        lang,
        practiceId: response.practice_id,
        result: response.voice_result
      })

      wx.navigateTo({
        url: '/pages/result/result'
      })
    } catch (error) {
      showError('上传测评失败', error)
    } finally {
      wx.hideLoading()
      this.setData({ submitting: '' })
    }
  }
})
