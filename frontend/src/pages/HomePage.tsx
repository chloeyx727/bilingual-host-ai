import { useNavigate } from 'react-router-dom'
import { FileText, Mic, BarChart3, ChevronRight } from 'lucide-react'

const cards = [
  {
    key: 'text',
    title: '文字内容测评',
    subtitle: 'Content Assessment',
    desc: '选择题型，撰写中英双语主持稿，AI 从八个维度深度评析内容逻辑与文化准确度',
    icon: FileText,
    gradient: 'linear-gradient(135deg, #faf8f5 0%, #f5edea 100%)',
    border: 'rgba(181,91,76,0.12)',
    iconBg: 'var(--shu-red-light)',
    iconColor: 'var(--shu-red)',
    path: '/questions',
    highlight: false,
  },
  {
    key: 'speech',
    title: '录音专项测评',
    subtitle: 'Speech Assessment',
    desc: '从巴蜀文化双语文稿中选择朗读，讯飞 AI 即时评测中英文发音准确度、流利度与完整度',
    icon: Mic,
    gradient: 'linear-gradient(135deg, #faf8f5 0%, #faf7f1 50%, #f5edea 100%)',
    border: 'rgba(196,168,124,0.25)',
    iconBg: 'var(--gilt-light)',
    iconColor: '#8b6f3f',
    path: '/speech-practice',
    highlight: true,
  },
  {
    key: 'dashboard',
    title: '成长追踪仪表盘',
    subtitle: 'Dashboard',
    desc: '八维能力雷达、等级分布、成长曲线、薄弱维度预警——数据驱动你的主持能力进阶',
    icon: BarChart3,
    gradient: 'linear-gradient(135deg, #faf8f5 0%, #edf2f2 100%)',
    border: 'rgba(61,90,92,0.12)',
    iconBg: 'var(--qingcheng-light)',
    iconColor: 'var(--qingcheng)',
    path: '/dashboard',
    highlight: false,
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {/* 主标题区 */}
      <div className="text-center mb-14 animate-fade-in animate-fade-in-1">
        <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--ink-light)' }}>
          Bilingual Hosting · AI Tutor
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: 'var(--ink)', fontFamily: "'Noto Serif SC', serif" }}>
          巴蜀文化双语主持
        </h1>
        <p className="text-lg md:text-xl font-light" style={{ color: 'var(--ink-light)' }}>
          教学智能体
        </p>
      </div>

      {/* 三张功能卡片 */}
      <div className="w-full max-w-2xl space-y-5">
        {cards.map((card, i) => (
          <div
            key={card.key}
            onClick={() => navigate(card.path)}
            className={`animate-fade-in animate-fade-in-${i + 1} relative overflow-hidden rounded-3xl cursor-pointer group`}
            style={{
              background: card.gradient,
              border: `1.5px solid ${card.border}`,
              boxShadow: card.highlight
                ? '0 2px 24px rgba(196,168,124,0.18), 0 1px 3px rgba(0,0,0,0.04)'
                : '0 1px 3px rgba(0,0,0,0.03)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* 录音卡片特殊标记 */}
            {card.highlight && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'var(--gilt-light)', color: '#8b6f3f' }}>
                  推荐
                </span>
              </div>
            )}

            <div className="relative p-7 md:p-8 flex items-start gap-5">
              {/* 图标 */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500"
                style={{ background: card.iconBg }}
              >
                <card.icon size={24} style={{ color: card.iconColor }} />
              </div>

              {/* 文字 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--ink)' }}>
                    {card.title}
                  </h2>
                  <span className="text-xs font-medium" style={{ color: 'var(--ink-light)' }}>
                    {card.subtitle}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--ink-light)' }}>
                  {card.desc}
                </p>
                <div
                  className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all duration-300"
                  style={{ color: card.iconColor }}
                >
                  进入 <ChevronRight size={15} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
