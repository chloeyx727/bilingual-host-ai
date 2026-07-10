"""评析相关 Pydantic 模型"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DimensionResult(BaseModel):
    dimension_key: str
    dimension_name_zh: str
    dimension_name_en: str
    score: int  # 0-100
    feedback: str
    issues: list[dict] = []
    suggestions: list[str] = []
    summary: str = ""


class VoiceResult(BaseModel):
    total_score: float = 0
    accuracy_score: float = 0
    fluency_score: float = 0
    integrity_score: float = 0
    words: list[dict] = []
    error: Optional[str] = None
    language: str = ""
    category: str = ""


class VoiceEvaluateRequest(BaseModel):
    practice_id: int
    audio_cn_base64: Optional[str] = ""
    audio_en_base64: Optional[str] = ""


class AssessmentOut(BaseModel):
    id: int
    practice_id: int
    overall_grade: str  # S/A/B/C/D
    overall_score: float

    # 八维分数
    cultural_accuracy_score: int
    viewpoint_stance_score: int
    argument_development_score: int
    cross_cultural_translation_score: int
    audience_awareness_score: int
    logical_coherence_score: int
    narrative_structure_score: int
    off_topic_detection_score: int

    # 详细反馈
    highlights: list[str] = []
    improvements: list[str] = []
    dimensions: list[DimensionResult] = []

    # 语音评测结果
    voice_result: Optional[dict] = None

    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DashboardData(BaseModel):
    student_id: int
    total_practices: int
    average_score: float
    grade_distribution: dict  # {"S": 2, "A": 5, "B": 10, "C": 3, "D": 1}
    radar_scores: dict  # 八维平均分
    trend_data: list[dict]  # [{date, score}, ...]
    module_coverage: dict  # 各模块练习次数
    weak_dimensions: list[str]  # 薄弱维度列表
