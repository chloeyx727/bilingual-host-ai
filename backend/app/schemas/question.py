"""题目相关 Pydantic 模型"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class QuestionOut(BaseModel):
    id: int
    title_zh: str
    title_en: str
    type: str
    module: str
    language_direction: Optional[str] = "bilingual"
    scenario: Optional[str] = None
    target_audience: Optional[str] = None
    difficulty: int = 2
    knowledge_tags: Optional[str] = None
    is_ai_generated: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QuestionDetail(QuestionOut):
    knowledge_cards: list[dict] = []  # 关联的知识卡片


class QuestionGenerateRequest(BaseModel):
    module: str
    type: str
    difficulty: int = 2
    language_direction: str = "bilingual"
    target_audience: Optional[str] = None


class QuestionGenerateResponse(BaseModel):
    title_zh: str
    title_en: str
    scenario: Optional[str] = None
