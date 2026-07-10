"""练习记录模型"""
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, func
from ..database import Base


class Practice(Base):
    __tablename__ = "practice"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("student.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("question.id"), nullable=False)
    script_zh = Column(Text, nullable=True)
    script_en = Column(Text, nullable=True)
    word_count_zh = Column(Integer, default=0)
    word_count_en = Column(Integer, default=0)
    duration_seconds = Column(Integer, default=0)
    submitted_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<Practice(id={self.id}, student_id={self.student_id})>"
