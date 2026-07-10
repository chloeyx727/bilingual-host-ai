"""题目模型"""
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, func
from ..database import Base


class Question(Base):
    __tablename__ = "question"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title_zh = Column(Text, nullable=False)
    title_en = Column(Text, nullable=False)
    type = Column(String(30), nullable=False)  # cultural_explanation | impromptu_bridge | cross_cultural_commentary | interview | crisis_rescue | debate
    module = Column(String(30), nullable=False)  # natural_heritage | history | intangible_heritage | city_spirit | contemporary | cultural_comparison
    language_direction = Column(String(10), default="bilingual")  # zh_to_en | en_to_zh | bilingual
    scenario = Column(Text, nullable=True)  # 场景描述 JSON
    target_audience = Column(String(50), nullable=True)
    difficulty = Column(Integer, default=2)
    knowledge_tags = Column(Text, nullable=True)  # JSON 数组，关联知识点ID
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<Question(id={self.id}, type='{self.type}', module='{self.module}')>"
