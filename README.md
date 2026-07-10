# 巴蜀文化双语主持教学智能体 🎙️

基于 AI 的《英语主持与传播》课程双语主持练习与评析系统。以巴蜀文化为核心内容载体，训练学生在跨文化语境下的中英双语主持与即兴表达能力。

## 核心理念

> **AI 评内容逻辑，教师评表达温度。**

🤖 AI 负责：文化准确性 · 观点立场 · 论据展开 · 文化转译质量 · 受众意识 · 逻辑连贯 · 叙事结构 · 跑题检测

👩‍🏫 教师负责：语音节奏 · 情感温度 · 台风仪态 · 表演指导与人文陪伴

## 快速启动

### 1. 环境准备

- Python 3.11+
- Node.js 18+
- DeepSeek API Key

### 2. 后端启动

```bash
cd backend
pip install -r requirements.txt

# 编辑 .env 文件，填入你的 DEEPSEEK_API_KEY

python run.py
# 访问 http://localhost:8000/docs 查看 API 文档
```

### 3. 前端启动

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:5173
```

### 4. 使用流程

1. 打开 http://localhost:5173
2. 在首页选择一道练习题目
3. 阅读知识辅助卡片，编写中英双语主持文稿
4. 提交后等待 AI 评析（约30-60秒）
5. 查看八维评析报告和等级
6. 在仪表盘追踪能力成长

## 项目结构

```
bilingual-host-ai/
├── backend/                 # FastAPI 后端
│   ├── app/
│   │   ├── agents/          # AI Agent（评析工作流）
│   │   ├── knowledge/       # 知识库（ChromaDB + JSON种子数据）
│   │   ├── models/          # SQLAlchemy 数据模型
│   │   ├── prompts/         # 八维评析 System Prompt
│   │   ├── routers/         # API 路由
│   │   ├── schemas/         # Pydantic 请求/响应模型
│   │   └── services/        # 业务逻辑
│   └── run.py
├── frontend/                # React + Vite + TypeScript 前端
│   └── src/
│       ├── api/             # API 客户端
│       ├── components/      # 可复用组件
│       ├── pages/           # 页面组件
│       └── types/           # TypeScript 类型定义
└── README.md
```

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | React 18 + Vite + TypeScript + Tailwind CSS + Recharts |
| 后端 | FastAPI + SQLAlchemy + SQLite |
| 向量库 | ChromaDB |
| AI | DeepSeek API (deepseek-chat) |

## 知识库覆盖

MVP 阶段覆盖巴蜀文化三大模块：
- 🏔️ 自然遗产（大熊猫栖息地、九寨沟、黄龙、峨眉山等）
- 📜 历史文脉（三星堆、金沙遗址、三国文化、杜甫草堂等）
- 🎭 非遗技艺（川剧变脸、蜀绣、川菜、自贡灯会等）
