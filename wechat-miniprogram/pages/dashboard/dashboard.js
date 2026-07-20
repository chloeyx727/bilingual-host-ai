const { getDashboard } = require('../../utils/api')

const dimensionOrder = [
  'cultural_accuracy',
  'viewpoint_stance',
  'argument_development',
  'cross_cultural_translation',
  'audience_awareness',
  'logical_coherence',
  'narrative_structure',
  'off_topic_detection'
]

const dimensionLabels = {
  cultural_accuracy: '文化准确',
  viewpoint_stance: '观点立场',
  argument_development: '论证展开',
  cross_cultural_translation: '跨文化',
  audience_awareness: '受众意识',
  logical_coherence: '逻辑连贯',
  narrative_structure: '叙事结构',
  off_topic_detection: '扣题程度'
}

const moduleLabels = {
  natural_heritage: '自然遗产',
  history: '历史文脉',
  intangible_heritage: '非遗技艺',
  city_spirit: '城市精神',
  contemporary: '当代创新',
  cultural_comparison: '文化比较'
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Number(value || 0)))
}

function mapModules(source) {
  return Object.entries(source || {}).map(([key, value]) => ({
    key,
    label: moduleLabels[key] || key,
    count: value
  }))
}

Page({
  data: {
    loading: true,
    error: '',
    hasData: false,
    dashboard: null,
    weakCount: 0,
    moduleCount: 0,
    gradeItems: [],
    radarItems: [],
    moduleItems: [],
    weakItems: [],
    weakText: ''
  },

  onReady() {
    this.radarReady = true
    if (this.data.radarItems.length) {
      this.drawRadar(this.data.radarItems)
    }
  },

  onLoad() {
    this.loadDashboard()
  },

  async loadDashboard() {
    this.setData({ loading: true, error: '' })
    try {
      const dashboard = await getDashboard(1)
      const total = Number(dashboard.total_practices || 0)
      const gradeDistribution = dashboard.grade_distribution || {}
      const maxGrade = Math.max(1, ...Object.values(gradeDistribution).map((value) => Number(value || 0)))
      const gradeItems = ['S', 'A', 'B', 'C', 'D'].map((grade) => {
        const count = Number(gradeDistribution[grade] || 0)
        return {
          grade,
          count,
          percent: Math.round((count / maxGrade) * 100)
        }
      })
      const radarScores = dashboard.radar_scores || {}
      const radarItems = dimensionOrder.map((key) => ({
        key,
        label: dimensionLabels[key],
        score: clampScore(radarScores[key])
      }))
      const moduleItems = mapModules(dashboard.module_coverage)
      const weakItems = (dashboard.weak_dimensions || []).map((key) => dimensionLabels[key] || key)

      this.setData({
        dashboard,
        hasData: total > 0,
        weakCount: weakItems.length,
        moduleCount: moduleItems.length,
        gradeItems,
        radarItems,
        moduleItems,
        weakItems,
        weakText: weakItems.join('、')
      }, () => {
        if (total > 0 && this.radarReady) {
          setTimeout(() => this.drawRadar(radarItems), 80)
        }
      })
    } catch (error) {
      this.setData({ error: error.message || '仪表盘加载失败，请检查后端服务' })
    } finally {
      this.setData({ loading: false })
    }
  },

  drawRadar(items) {
    if (!items || !items.length) return
    const ctx = wx.createCanvasContext('radarCanvas', this)
    const width = 320
    const height = 280
    const centerX = width / 2
    const centerY = 132
    const radius = 82
    const count = items.length

    ctx.clearRect(0, 0, width, height)
    ctx.setLineWidth(1)
    ctx.setFontSize(11)

    for (let level = 4; level >= 1; level -= 1) {
      const currentRadius = radius * level / 4
      ctx.beginPath()
      for (let index = 0; index < count; index += 1) {
        const angle = Math.PI * 2 * index / count - Math.PI / 2
        const x = centerX + Math.cos(angle) * currentRadius
        const y = centerY + Math.sin(angle) * currentRadius
        if (index === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.setStrokeStyle(level === 4 ? 'rgba(28, 74, 72, 0.24)' : 'rgba(28, 74, 72, 0.12)')
      ctx.stroke()
    }

    items.forEach((item, index) => {
      const angle = Math.PI * 2 * index / count - Math.PI / 2
      const axisX = centerX + Math.cos(angle) * radius
      const axisY = centerY + Math.sin(angle) * radius
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(axisX, axisY)
      ctx.setStrokeStyle('rgba(28, 74, 72, 0.14)')
      ctx.stroke()

      const labelRadius = radius + 28
      const labelX = centerX + Math.cos(angle) * labelRadius
      const labelY = centerY + Math.sin(angle) * labelRadius
      ctx.setFillStyle('#53605b')
      ctx.setTextAlign(labelX < centerX - 12 ? 'right' : labelX > centerX + 12 ? 'left' : 'center')
      ctx.fillText(item.label, labelX, labelY + 4)
    })

    ctx.beginPath()
    items.forEach((item, index) => {
      const angle = Math.PI * 2 * index / count - Math.PI / 2
      const valueRadius = radius * clampScore(item.score) / 100
      const x = centerX + Math.cos(angle) * valueRadius
      const y = centerY + Math.sin(angle) * valueRadius
      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.setFillStyle('rgba(157, 91, 85, 0.22)')
    ctx.fill()
    ctx.setStrokeStyle('#9b5b55')
    ctx.setLineWidth(2)
    ctx.stroke()

    items.forEach((item, index) => {
      const angle = Math.PI * 2 * index / count - Math.PI / 2
      const valueRadius = radius * clampScore(item.score) / 100
      const x = centerX + Math.cos(angle) * valueRadius
      const y = centerY + Math.sin(angle) * valueRadius
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.setFillStyle('#9b5b55')
      ctx.fill()
    })

    ctx.draw()
  },

  goPractice() {
    wx.navigateTo({
      url: '/pages/textQuestions/textQuestions'
    })
  }
})
