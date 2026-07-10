"""应用配置管理"""
import os
from dotenv import load_dotenv

load_dotenv()

# DeepSeek API 配置（兼容 OpenAI SDK）
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "your-api-key-here")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

# 数据库配置
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./bilingual_host.db")

# ChromaDB 配置
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_data")
CHROMA_COLLECTION_NAME = "bashu_culture_knowledge"

# 知识库种子数据目录
KNOWLEDGE_SEED_DIR = os.path.join(os.path.dirname(__file__), "knowledge", "seed_data")

# 讯飞语音评测 API 配置
IFLYTEK_APP_ID = os.getenv("IFLYTEK_APP_ID", "")
IFLYTEK_API_KEY = os.getenv("IFLYTEK_API_KEY", "")
IFLYTEK_API_SECRET = os.getenv("IFLYTEK_API_SECRET", "")
IFLYTEK_ISE_URL = os.getenv("IFLYTEK_ISE_URL", "https://ise-api.xfyun.cn/v2/open-ise")

# 应用配置
APP_TITLE = "巴蜀文化双语主持教学智能体"
APP_VERSION = "0.1.0"


def _parse_csv_env(name: str, default: list[str]) -> list[str]:
    value = os.getenv(name, "")
    if not value.strip():
        return default
    return [item.strip().rstrip("/") for item in value.split(",") if item.strip()]


CORS_ORIGINS = _parse_csv_env(
    "CORS_ORIGINS",
    ["http://localhost:5173", "http://localhost:3000"],
)
