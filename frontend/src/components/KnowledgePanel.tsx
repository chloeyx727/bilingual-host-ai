import { useState } from 'react'
import { ChevronDown, ChevronRight, BookOpen, Lightbulb, AlertTriangle } from 'lucide-react'
import { KnowledgeCard } from '../types'

export default function KnowledgePanel({ knowledgeCards }: { knowledgeCards: KnowledgeCard[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const toggle = (id: string) => { const n = new Set(expanded); n.has(id) ? n.delete(id) : n.add(id); setExpanded(n) }

  return (
    <div className="card sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
          <BookOpen size={14} className="text-indigo-600" />
        </div>
        <h3 className="font-semibold text-sm text-gray-900">知识辅助</h3>
        <span className="text-xs text-gray-400 ml-auto">{knowledgeCards.length} 条</span>
      </div>

      {knowledgeCards.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">暂无关联知识卡片</p>
      ) : (
        <div className="space-y-1.5 max-h-[55vh] overflow-y-auto">
          {knowledgeCards.map(card => (
            <div key={card.id} className="rounded-xl border border-gray-100 overflow-hidden">
              <button onClick={() => toggle(card.id)}
                className="w-full flex items-start gap-2 p-3 text-left hover:bg-gray-50 transition-colors">
                {expanded.has(card.id) ? <ChevronDown size={14} className="text-gray-400 mt-0.5 shrink-0" /> : <ChevronRight size={14} className="text-gray-400 mt-0.5 shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">{card.title_zh}</p>
                  <p className="text-xs text-gray-400 truncate">{card.title_en}</p>
                </div>
              </button>
              {expanded.has(card.id) && (
                <div className="px-3 pb-3 space-y-2 text-xs">
                  {card.content?.summary_zh && <p className="text-gray-600 leading-relaxed">{card.content.summary_zh as string}</p>}
                  {Array.isArray(card.content?.key_facts) && (
                    <div>
                      <span className="font-medium text-gray-500 flex items-center gap-1 mb-1"><Lightbulb size={11} />关键事实</span>
                      <ul className="text-gray-600 space-y-0.5">{(card.content.key_facts as any[]).slice(0, 3).map((f: any, i: number) => <li key={i} className="pl-3">· {f.zh || f}</li>)}</ul>
                    </div>
                  )}
                  {Array.isArray(card.content?.misunderstandings) && (card.content.misunderstandings as any[]).length > 0 && (
                    <div>
                      <span className="font-medium text-amber-600 flex items-center gap-1 mb-1"><AlertTriangle size={11} />注意避免</span>
                      <ul className="text-amber-700 space-y-0.5">{(card.content.misunderstandings as any[]).slice(0, 2).map((m: any, i: number) => <li key={i} className="pl-3">⚠ {m.myth}: {m.fact}</li>)}</ul>
                    </div>
                  )}
                  {Array.isArray(card.content?.narrative_angles) && (
                    <div>
                      <span className="font-medium text-indigo-600">💡 叙事角度</span>
                      <ul className="text-gray-600 space-y-0.5 mt-0.5">{(card.content.narrative_angles as string[]).slice(0, 2).map((a: string, i: number) => <li key={i} className="pl-3">→ {a}</li>)}</ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
