import { QuestionOut, MODULE_LABELS, TYPE_LABELS, DIFFICULTY_LABELS } from '../types'

const badgeStyles: Record<string, { bg: string; color: string }> = {
  cultural_explanation: { bg: 'var(--shu-red-light)', color: 'var(--shu-red)' },
  impromptu_bridge: { bg: 'var(--gilt-light)', color: '#8b6f3f' },
  cross_cultural_commentary: { bg: 'var(--qingcheng-light)', color: 'var(--qingcheng)' },
  interview: { bg: 'var(--shu-red-light)', color: 'var(--shu-red)' },
  crisis_rescue: { bg: 'var(--shu-red-light)', color: 'var(--shu-red)' },
  debate: { bg: 'var(--qingcheng-light)', color: 'var(--qingcheng)' },
}

export default function QuestionCard({ question, onClick }: { question: QuestionOut; onClick: () => void }) {
  const s = badgeStyles[question.type] || badgeStyles.cultural_explanation

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer group p-6"
      style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="badge text-xs" style={{ background: s.bg, color: s.color }}>
          {TYPE_LABELS[question.type] || question.type}
        </span>
        <span className="text-xs" style={{ color: 'var(--ink-light)' }}>
          {DIFFICULTY_LABELS[question.difficulty] || '⭐'}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 leading-snug line-clamp-2 group-hover:text-opacity-80 transition-colors">
        {question.title_zh}
      </h3>
      <p className="text-xs line-clamp-1 mb-3" style={{ color: 'var(--ink-light)' }}>
        {question.title_en}
      </p>
      <div className="flex items-center gap-2 pt-3 border-t border-black/5">
        <span className="text-xs font-medium" style={{ color: 'var(--ink-light)' }}>
          {MODULE_LABELS[question.module] || question.module}
        </span>
        {question.target_audience && (
          <span className="text-xs" style={{ color: 'var(--ink-light)', opacity: 0.6 }}>
            · {question.target_audience}
          </span>
        )}
      </div>
    </div>
  )
}
