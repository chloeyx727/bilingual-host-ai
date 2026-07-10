const GRADE_CONFIG: Record<string, { label: string; bg: string; text: string; ring: string }> = {
  S: { label: '卓越 Outstanding', bg: 'bg-amber-500', text: 'text-white', ring: 'ring-amber-200' },
  A: { label: '优秀 Excellent', bg: 'bg-emerald-500', text: 'text-white', ring: 'ring-emerald-200' },
  B: { label: '良好 Good', bg: 'bg-blue-500', text: 'text-white', ring: 'ring-blue-200' },
  C: { label: '待提升 Developing', bg: 'bg-orange-500', text: 'text-white', ring: 'ring-orange-200' },
  D: { label: '基础 Foundational', bg: 'bg-rose-500', text: 'text-white', ring: 'ring-rose-200' },
}

export default function GradeBadge({ grade }: { grade: string }) {
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG.B
  return (
    <div className="inline-flex flex-col items-center">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-extrabold shadow-lg ring-4 ${cfg.bg} ${cfg.text} ${cfg.ring}`}>
        {grade}
      </div>
      <span className="text-xs text-gray-400 mt-2 font-medium">{cfg.label}</span>
    </div>
  )
}
