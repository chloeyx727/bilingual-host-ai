const { getQuestions } = require('../../utils/api')

const moduleLabelMap = {
  natural_heritage: '自然遗产',
  history: '历史文脉',
  intangible_heritage: '非遗技艺',
  city_spirit: '城市精神',
  contemporary: '当代创新',
  cultural_comparison: '文化比较'
}

const typeLabelMap = {
  cultural_explanation: '文化解说题',
  impromptu_bridge: '即兴串场',
  cross_cultural_commentary: '跨文化评论',
  interview: '访谈应对',
  crisis_rescue: '危机救场',
  debate: '观点辩论'
}

const moduleOptions = [
  { label: '全部模块', value: '' },
  { label: '自然遗产', value: 'natural_heritage' },
  { label: '历史文脉', value: 'history' },
  { label: '非遗技艺', value: 'intangible_heritage' },
  { label: '城市精神', value: 'city_spirit' },
  { label: '文化比较', value: 'cultural_comparison' }
]

const typeOptions = [
  { label: '全部题型', value: '' },
  { label: '文化解说题', value: 'cultural_explanation' },
  { label: '即兴串场', value: 'impromptu_bridge' },
  { label: '跨文化评论', value: 'cross_cultural_commentary' },
  { label: '访谈应对', value: 'interview' },
  { label: '危机救场', value: 'crisis_rescue' },
  { label: '观点辩论', value: 'debate' }
]

const difficultyOptions = [
  { label: '全部难度', value: 0 },
  { label: '1级', value: 1 },
  { label: '2级', value: 2 },
  { label: '3级', value: 3 },
  { label: '4级', value: 4 },
  { label: '5级', value: 5 }
]

function stars(difficulty) {
  const count = Math.max(1, Math.min(5, Number(difficulty || 2)))
  return '★★★★★'.slice(0, count)
}

function targetLabel(question) {
  return question.target_audience || question.language_direction || '双语主持训练'
}

Page({
  data: {
    loading: true,
    error: '',
    questions: [],
    filteredQuestions: [],
    filterModule: '',
    filterType: '',
    filterDifficulty: 0,
    moduleOptions,
    typeOptions,
    difficultyOptions
  },

  onLoad() {
    this.loadQuestions()
  },

  async loadQuestions() {
    this.setData({ loading: true, error: '' })
    try {
      const questions = (await getQuestions()).map((question) => ({
        ...question,
        moduleLabel: moduleLabelMap[question.module] || question.module || '文化模块',
        typeLabel: typeLabelMap[question.type] || question.type || '题型',
        stars: stars(question.difficulty),
        targetLabel: targetLabel(question)
      }))
      this.setData({ questions }, () => this.applyFilters())
    } catch (error) {
      this.setData({ error: error.message || '题目加载失败，请检查后端服务' })
    } finally {
      this.setData({ loading: false })
    }
  },

  changeModule(event) {
    this.setData({
      filterModule: event.currentTarget.dataset.value || ''
    }, () => this.applyFilters())
  },

  changeType(event) {
    this.setData({
      filterType: event.currentTarget.dataset.value || ''
    }, () => this.applyFilters())
  },

  changeDifficulty(event) {
    this.setData({
      filterDifficulty: Number(event.currentTarget.dataset.value || 0)
    }, () => this.applyFilters())
  },

  applyFilters() {
    const filteredQuestions = this.data.questions.filter((question) => {
      const matchModule = !this.data.filterModule || question.module === this.data.filterModule
      const matchType = !this.data.filterType || question.type === this.data.filterType
      const matchDifficulty = !this.data.filterDifficulty || Number(question.difficulty || 0) === this.data.filterDifficulty
      return matchModule && matchType && matchDifficulty
    })
    this.setData({ filteredQuestions })
  },

  goHome() {
    wx.navigateBack({
      fail: () => wx.reLaunch({ url: '/pages/home/home' })
    })
  },

  selectQuestion(event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/textPractice/textPractice?id=${id}`
    })
  }
})
