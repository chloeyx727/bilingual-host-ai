import { Routes, Route, NavLink } from 'react-router-dom'
import { Mic, BarChart3, FileText } from 'lucide-react'
import HomePage from './pages/HomePage'
import QuestionsPage from './pages/QuestionsPage'
import PracticePage from './pages/PracticePage'
import AssessmentPage from './pages/AssessmentPage'
import DashboardPage from './pages/DashboardPage'
import SpeechPracticePage from './pages/SpeechPracticePage'
import SpeechResultPage from './pages/SpeechResultPage'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
    isActive
      ? 'bg-white/90 text-gray-900 shadow-sm'
      : 'text-gray-500 hover:text-gray-700 hover:bg-white/40'
  }`

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航——极简 */}
      <header className="sticky top-0 z-20 bg-[#faf8f5]/85 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold transition-all duration-300 group-hover:scale-105"
              style={{ background: 'var(--shu-red)' }}
            >
              蜀
            </div>
            <span className="text-base font-bold tracking-tight text-gray-800">
              巴蜀文化 · 双语主持
            </span>
          </NavLink>
          <nav className="flex items-center gap-1" style={{ background: 'rgba(0,0,0,0.02)', padding: 3, borderRadius: 14 }}>
            <NavLink to="/questions" end className={navLinkClass}>
              <FileText size={15} /> 文字测评
            </NavLink>
            <NavLink to="/speech-practice" className={navLinkClass}>
              <Mic size={15} /> 录音测评
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              <BarChart3 size={15} /> 仪表盘
            </NavLink>
          </nav>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 w-full">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/practice/:questionId" element={<PracticePage />} />
            <Route path="/assessment/:practiceId" element={<AssessmentPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/speech-practice" element={<SpeechPracticePage />} />
            <Route path="/speech-result/:practiceId" element={<SpeechResultPage />} />
          </Routes>
        </div>
      </main>

      {/* 底部——单行居中 */}
      <footer className="py-6 text-center">
        <p className="text-xs tracking-wide" style={{ color: 'var(--ink-light)' }}>
          巴蜀文化国际传播 · 双语主持教学智能体
        </p>
      </footer>
    </div>
  )
}

export default App
