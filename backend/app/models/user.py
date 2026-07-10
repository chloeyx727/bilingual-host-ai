"""学生模型"""
from sqlalchemy import Column, Integer, String, DateTime, func
from ..database import Base


class Student(Base):
    __tablename__ = "student"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nickname = Column(String(50), nullable=False, default="匿名学生")
    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<Student(id={self.id}, nickname='{self.nickname}')>"
