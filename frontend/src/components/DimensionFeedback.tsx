import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { DimensionResult } from '../types'

export default function DimensionFeedback({ dimension }: { dimension: DimensionResult }) {
  const [expanded, setExpanded] = useState(false)
  const color = dimension.score >= 80 ? 'bg-emerald-500' : dimension.score >= 60 ? 'bg-blue-500' : dimension.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <div className="card">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            {expanded ? <ChevronDown size={15} className="text-gray-400" /> : <ChevronRight size={15} className="text-gray-400" />}
            <h4 className="font-semibold text-sm text-gray-900">{dimension.dimension_name_zh}</h4>
          </div>
          <span className="text-xs text-gray-400">{dimension.dimension_name_en}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${dimension.score}%` }} />
          </div>
          <span className={`text-sm font-bold tabular-nums ${dimension.score >= 80 ? 'text-emerald-600' : dimension.score >= 60 ? 'text-blue-600' : dimension.score >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>
            {dimension.score}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1.5">{dimension.summary || dimension.feedback}</p>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2.5 text-xs">
          {dimension.issues?.length > 0 && (
            <div>
              <span className="font-semibold text-amber-600">问题定位</span>
              {dimension.issues.map((issue, i) => (
                <div key={i} className="mt-1.5 pl-2.5 border-l-2 border-amber-200 text-gray-600">
                  <span className="text-amber-700 font-medium">📍 {issue.location}</span>
                  <p className="mt-0.5">{issue.problem}</p>
                  {(issue.correction || issue.suggestion) && <p className="text-emerald-600 mt-0.5">💡 {issue.correction || issue.suggestion}</p>}
                </div>
              ))}
            </div>
          )}
          {dimension.suggestions?.length > 0 && (
            <div>
              <span className="font-semibold text-indigo-600">改进建议</span>
              <ul className="text-gray-600 mt-0.5 space-y-0.5">
                {dimension.suggestions.map((s, i) => <li key={i} className="pl-2">→ {s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
