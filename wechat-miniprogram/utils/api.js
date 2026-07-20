function baseUrl() {
  return getApp().globalData.apiBaseUrl.replace(/\/$/, '')
}

function formatErrorPayload(data) {
  if (!data) return ''
  if (typeof data === 'string') return data
  if (data.detail) {
    return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
  }
  if (data.message) return data.message
  return JSON.stringify(data)
}

function request(path, options) {
  const config = options || {}
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl()}${path}`,
      method: config.method || 'GET',
      data: config.data || {},
      timeout: config.timeout || 300000,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          return
        }
        const detail = formatErrorPayload(res.data)
        reject(new Error(detail || `HTTP ${res.statusCode}`))
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络请求失败'))
      }
    })
  })
}

function speechOnly(data) {
  return request('/speech-only', {
    method: 'POST',
    data,
    timeout: 300000
  })
}

function uploadSpeech(filePath, formData) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${baseUrl()}/speech-upload`,
      filePath,
      name: 'audio',
      formData: formData || {},
      timeout: 300000,
      success(res) {
        let data = res.data
        try {
          data = typeof data === 'string' ? JSON.parse(data) : data
        } catch (error) {
          reject(new Error(res.data || '上传返回数据解析失败'))
          return
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data)
          return
        }
        reject(new Error(formatErrorPayload(data) || `HTTP ${res.statusCode}`))
      },
      fail(err) {
        reject(new Error(err.errMsg || '录音上传失败'))
      }
    })
  })
}

function getQuestions() {
  return request('/questions?limit=200')
}

function getQuestionDetail(id) {
  return request(`/questions/${id}`)
}

function submitPractice(data) {
  return request('/practices', {
    method: 'POST',
    data,
    timeout: 300000
  })
}

function getDashboard(studentId) {
  return request(`/dashboard/${studentId || 1}`)
}

module.exports = {
  request,
  speechOnly,
  uploadSpeech,
  getQuestions,
  getQuestionDetail,
  submitPractice,
  getDashboard
}
