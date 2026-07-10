"""评析结果模型"""
from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey, func
from ..database import Base


class Assessment(Base):
    __tablename__ = "assessment"

    id = Column(Integer, primary_key=True, autoincrement=True)
    practice_id = Column(Integer, ForeignKey("practice.id"), nullable=False, unique=True)
    overall_grade = Column(String(2), nullable=True)  # S / A / B / C / D
    overall_score = Column(Float, nullable=True)

    # 八个维度分数 (0-100)
    cultural_accuracy_score = Column(Integer, nullable=True)
    viewpoint_stance_score = Column(Integer, nullable=True)
    argument_development_score = Column(Integer, nullable=True)
    cross_cultural_translation_score = Column(Integer, nullable=True)
    audience_awareness_score = Column(Integer, nullable=True)
    logical_coherence_score = Column(Integer, nullable=True)
    narrative_structure_score = Column(Integer, nullable=True)
    off_topic_detection_score = Column(Integer, nullable=True)

    # 详细反馈 (JSON 字符串)
    highlights = Column(Text, nullable=True)
    improvements = Column(Text, nullable=True)
    dimension_feedback = Column(Text, nullable=True)

    # 语音评测结果 (JSON: {chinese, english, combined_score})
    voice_result = Column(Text, nullable=True)

    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<Assessment(id={self.id}, grade='{self.overall_grade}', score={self.overall_score})>"
