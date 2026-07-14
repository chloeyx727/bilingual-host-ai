import { useNavigate } from 'react-router-dom'
import { FileText, Mic, BarChart3, ChevronRight } from 'lucide-react'

const cards = [
  {
    key: 'text',
    title: '文字内容测评',
    subtitle: 'Content Assessment',
    desc: '双语主持稿内容评析',
    icon: FileText,
    panel: 'rgba(181, 91, 76, 0.82)',
    border: 'rgba(245, 205, 190, 0.38)',
    iconBg: 'rgba(255,255,255,0.16)',
    iconColor: '#fff2eb',
    path: '/questions',
    highlight: false,
  },
  {
    key: 'speech',
    title: '录音专项测评',
    subtitle: 'Speech Assessment',
    desc: '中英文录音分项测评',
    icon: Mic,
    panel: 'rgba(196, 168, 124, 0.9)',
    border: 'rgba(255, 239, 198, 0.62)',
    iconBg: 'rgba(42, 36, 24, 0.17)',
    iconColor: '#fff8df',
    path: '/speech-practice',
    highlight: true,
  },
  {
    key: 'dashboard',
    title: '成长追踪仪表盘',
    subtitle: 'Dashboard',
    desc: '能力雷达与成长数据',
    icon: BarChart3,
    panel: 'rgba(61, 90, 92, 0.86)',
    border: 'rgba(192, 218, 216, 0.36)',
    iconBg: 'rgba(255,255,255,0.14)',
    iconColor: '#e9f4f2',
    path: '/dashboard',
    highlight: false,
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div
      className="relative -mx-6 -my-8 min-h-[calc(100vh-4rem)] overflow-hidden px-5 py-10 md:px-8"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(8, 12, 13, 0.62), rgba(8, 12, 13, 0.78)), url('/assets/sichuan-opera-face-bg.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,248,229,0.15),transparent_34%),linear-gradient(90deg,rgba(12,18,19,0.3),rgba(12,18,19,0.08),rgba(12,18,19,0.3))]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] max-w-3xl flex-col items-center justify-center">
        <div className="mb-10 text-center animate-fade-in animate-fade-in-1">
          <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#dac8a4]">
            Bilingual Hosting · AI Tutor
          </p>
          <h1 className="mb-3 text-4xl font-semibold tracking-normal text-[#fbf5ea] md:text-5xl" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            巴蜀文化双语主持
          </h1>
          <p className="text-base font-light tracking-[0.18em] text-[#ded4c4] md:text-lg">
            教学智能体
          </p>
        </div>

        <div className="w-full space-y-4">
        {cards.map((card, i) => (
          <button
            key={card.key}
            onClick={() => navigate(card.path)}
            className={`animate-fade-in animate-fade-in-${i + 1} group relative w-full overflow-hidden rounded-[28px] text-left transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#e8d6a8] ${
              card.highlight ? 'scale-[1.02]' : ''
            }`}
            style={{
              background: card.panel,
              border: `1.5px solid ${card.border}`,
              boxShadow: card.highlight
                ? '0 22px 56px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.1)'
                : '0 12px 34px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.13] via-white/[0.05] to-transparent" />
            {card.highlight && (
              <span className="absolute right-5 top-5 rounded-full bg-[#2e2818]/20 px-3 py-1 text-xs font-semibold text-[#fff8df]">
                推荐
              </span>
            )}

            <div className="relative flex items-center gap-5 p-6 md:p-7">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105"
                style={{ background: card.iconBg }}
              >
                <card.icon size={24} style={{ color: card.iconColor }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-xl font-semibold tracking-normal text-white">
                    {card.title}
                  </h2>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/72">
                    {card.subtitle}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/82">
                  {card.desc}
                </p>
              </div>
              <ChevronRight size={21} className="shrink-0 text-white/78 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>
        ))}
        </div>

        <p className="mt-10 text-center text-xs tracking-[0.18em] text-[#e6dcc8]/86">
          巴蜀文化国际传播・双语主持教学智能体
        </p>
      </div>
    </div>
  )
}
