"""练习相关 Pydantic 模型"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PracticeSubmitRequest(BaseModel):
    student_id: int
    question_id: int
    script_zh: Optional[str] = ""
    script_en: Optional[str] = ""
    duration_seconds: int = 0


class PracticeOut(BaseModel):
    id: int
    student_id: int
    question_id: int
    script_zh: Optional[str] = None
    script_en: Optional[str] = None
    word_count_zh: int = 0
    word_count_en: int = 0
    duration_seconds: int = 0
    submitted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PracticeHistoryItem(BaseModel):
    id: int
    question_title: str
    question_type: str
    overall_grade: Optional[str] = None
    overall_score: Optional[float] = None
    submitted_at: Optional[datetime] = None
