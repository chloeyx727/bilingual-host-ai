import {
  Radar, RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts'
import { AssessmentOut, DIMENSION_LABELS_ZH } from '../types'

export default function RadarChart({ assessment }: { assessment: AssessmentOut }) {
  const data = [
    { name: DIMENSION_LABELS_ZH.cultural_accuracy || '文化准确性', score: assessment.cultural_accuracy_score, full: 100 },
    { name: DIMENSION_LABELS_ZH.viewpoint_stance || '观点立场', score: assessment.viewpoint_stance_score, full: 100 },
    { name: DIMENSION_LABELS_ZH.argument_development || '论据展开', score: assessment.argument_development_score, full: 100 },
    { name: DIMENSION_LABELS_ZH.cross_cultural_translation || '文化转译', score: assessment.cross_cultural_translation_score, full: 100 },
    { name: DIMENSION_LABELS_ZH.audience_awareness || '受众意识', score: assessment.audience_awareness_score, full: 100 },
    { name: DIMENSION_LABELS_ZH.logical_coherence || '逻辑连贯', score: assessment.logical_coherence_score, full: 100 },
    { name: DIMENSION_LABELS_ZH.narrative_structure || '叙事结构', score: assessment.narrative_structure_score, full: 100 },
    { name: DIMENSION_LABELS_ZH.off_topic_detection || '跑题检测', score: assessment.off_topic_detection_score, full: 100 },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ReRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
        <Radar
          name="得分"
          dataKey="score"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  )
}
