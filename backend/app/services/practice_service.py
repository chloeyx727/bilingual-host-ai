"""练习服务"""
import json
from sqlalchemy.orm import Session
from ..models.practice import Practice
from ..models.question import Question
from ..models.assessment import Assessment
from ..models.user import Student
from ..schemas.practice import PracticeSubmitRequest, PracticeOut, PracticeHistoryItem


def submit_practice(db: Session, data: PracticeSubmitRequest) -> Practice:
    """提交练习文稿"""
    # 验证学生存在
    student = db.query(Student).filter(Student.id == data.student_id).first()
    if not student:
        raise ValueError(f"学生 {data.student_id} 不存在")

    # 验证题目存在
    question = db.query(Question).filter(Question.id == data.question_id).first()
    if not question:
        raise ValueError(f"题目 {data.question_id} 不存在")

    # 计算字数
    word_count_zh = len(data.script_zh.replace(" ", "")) if data.script_zh else 0
    word_count_en = len(data.script_en.split()) if data.script_en else 0

    practice = Practice(
        student_id=data.student_id,
        question_id=data.question_id,
        script_zh=data.script_zh,
        script_en=data.script_en,
        word_count_zh=word_count_zh,
        word_count_en=word_count_en,
        duration_seconds=data.duration_seconds,
    )
    db.add(practice)
    db.commit()
    db.refresh(practice)
    return practice


def get_practice(db: Session, practice_id: int) -> Practice:
    """获取练习详情"""
    practice = db.query(Practice).filter(Practice.id == practice_id).first()
    if not practice:
        raise ValueError(f"练习记录 {practice_id} 不存在")
    return practice


def get_student_practices(db: Session, student_id: int, limit: int = 20) -> list[PracticeHistoryItem]:
    """获取学生练习历史（含评析等级）"""
    practices = (
        db.query(Practice)
        .filter(Practice.student_id == student_id)
        .order_by(Practice.submitted_at.desc())
        .limit(limit)
        .all()
    )

    items = []
    for p in practices:
        question = db.query(Question).filter(Question.id == p.question_id).first()
        assessment = db.query(Assessment).filter(Assessment.practice_id == p.id).first()

        items.append(PracticeHistoryItem(
            id=p.id,
            question_title=question.title_zh if question else "",
            question_type=question.type if question else "",
            overall_grade=assessment.overall_grade if assessment else None,
            overall_score=assessment.overall_score if assessment else None,
            submitted_at=p.submitted_at,
        ))

    return items


def ensure_demo_student(db: Session) -> int:
    """确保存在演示用学生账号，返回学生ID"""
    student = db.query(Student).first()
    if not student:
        student = Student(nickname="演示学生")
        db.add(student)
        db.commit()
        db.refresh(student)
    return student.id
