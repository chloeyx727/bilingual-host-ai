// ========== 题目 ==========
export interface QuestionOut {
  id: number
  title_zh: string
  title_en: string
  type: string
  module: string
  language_direction: string
  scenario: string | null
  target_audience: string | null
  difficulty: number
  knowledge_tags: string | null
  is_ai_generated: boolean
}

export interface KnowledgeCard {
  id: string
  title_zh: string
  title_en: string
  module: string
  type: string
  content: Record<string, any>
  relevance_score: number
}

export interface QuestionDetail extends QuestionOut {
  knowledge_cards: KnowledgeCard[]
}

// ========== 练习 ==========
export interface PracticeSubmit {
  student_id: number
  question_id: number
  script_zh: string
  script_en: string
  duration_seconds: number
}

export interface PracticeHistoryItem {
  id: number
  question_title: string
  question_type: string
  overall_grade: string | null
  overall_score: number | null
  submitted_at: string | null
}

// ========== 评析 ==========
export interface DimensionResult {
  dimension_key: string
  dimension_name_zh: string
  dimension_name_en: string
  score: number
  feedback: string
  issues: Issue[]
  suggestions: string[]
  summary: string
}

export interface Issue {
  location: string
  problem: string
  suggestion?: string
  correction?: string
  severity?: string
  reason?: string
}

export interface VoiceResult {
  total_score: number
  accuracy_score: number
  fluency_score: number
  integrity_score: number
  words: Array<{ word: string; score: number; pronunciation: boolean }>
  error: string | null
  language: string
  category: string
}

export interface AssessmentOut {
  id: number
  practice_id: number
  overall_grade: string
  overall_score: number
  cultural_accuracy_score: number
  viewpoint_stance_score: number
  argument_development_score: number
  cross_cultural_translation_score: number
  audience_awareness_score: number
  logical_coherence_score: number
  narrative_structure_score: number
  off_topic_detection_score: number
  highlights: string[]
  improvements: string[]
  dimensions: DimensionResult[]
  voice_result: {
    chinese: VoiceResult | null
    english: VoiceResult | null
    combined_score: number
  } | null
  created_at: string | null
}

// ========== 仪表盘 ==========
export interface DashboardData {
  student_id: number
  total_practices: number
  average_score: number
  grade_distribution: Record<string, number>
  radar_scores: Record<string, number>
  trend_data: TrendPoint[]
  module_coverage: Record<string, number>
  weak_dimensions: string[]
}

export interface TrendPoint {
  date: string
  practice_id: number
  score: number | null
  grade: string | null
}

// ========== 常量映射 ==========
export const MODULE_LABELS: Record<string, string> = {
  natural_heritage: '🏔️ 自然遗产',
  history: '📜 历史文脉',
  intangible_heritage: '🎭 非遗技艺',
  city_spirit: '🏙️ 城市精神',
  contemporary: '🚀 当代创新',
  cultural_comparison: '🌍 文化比较',
}

export const TYPE_LABELS: Record<string, string> = {
  cultural_explanation: '文化解说题',
  impromptu_bridge: '即兴串场题',
  cross_cultural_commentary: '跨文化评论题',
  interview: '访谈应对题',
  crisis_rescue: '危机救场题',
  debate: '观点辩论题',
}

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: '⭐',
  2: '⭐⭐',
  3: '⭐⭐⭐',
  4: '⭐⭐⭐⭐',
  5: '⭐⭐⭐⭐⭐',
}

export const DIMENSION_LABELS_ZH: Record<string, string> = {
  cultural_accuracy: '文化准确性',
  viewpoint_stance: '观点与立场',
  argument_development: '论据展开',
  cross_cultural_translation: '文化转译质量',
  audience_awareness: '受众意识',
  logical_coherence: '逻辑连贯',
  narrative_structure: '叙事结构',
  off_topic_detection: '跑题检测',
}

export const GRADE_COLORS: Record<string, string> = {
  S: 'bg-yellow-500 text-white',
  A: 'bg-emerald-500 text-white',
  B: 'bg-blue-500 text-white',
  C: 'bg-orange-500 text-white',
  D: 'bg-red-500 text-white',
}
