"""成长追踪仪表盘服务"""
import json
from collections import Counter
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.practice import Practice
from ..models.question import Question
from ..models.assessment import Assessment
from ..schemas.assessment import DashboardData


def get_dashboard(db: Session, student_id: int) -> DashboardData:
    """生成学生成长仪表盘数据"""
    # 获取该学生所有练习
    practices = (
        db.query(Practice)
        .filter(Practice.student_id == student_id)
        .filter(Practice.question_id > 0)
        .order_by(Practice.submitted_at.asc())
        .all()
    )

    total = len(practices)

    if total == 0:
        return DashboardData(
            student_id=student_id,
            total_practices=0,
            average_score=0,
            grade_distribution={"S": 0, "A": 0, "B": 0, "C": 0, "D": 0},
            radar_scores={},
            trend_data=[],
            module_coverage={},
            weak_dimensions=[],
        )

    # 获取评析数据
    practice_ids = [p.id for p in practices]
    assessments = (
        db.query(Assessment)
        .filter(Assessment.practice_id.in_(practice_ids))
        .all()
    )
    assessment_map = {a.practice_id: a for a in assessments}

    # 等级分布
    grade_counter = Counter()
    for a in assessments:
        grade_counter[a.overall_grade] += 1

    # 综合平均分
    scores = [a.overall_score for a in assessments if a.overall_score]
    average_score = sum(scores) / len(scores) if scores else 0

    # 八维平均分
    dimension_keys = [
        "cultural_accuracy", "viewpoint_stance", "argument_development",
        "cross_cultural_translation", "audience_awareness", "logical_coherence",
        "narrative_structure", "off_topic_detection",
    ]
    radar_scores = {}
    for key in dimension_keys:
        col = f"{key}_score"
        dim_scores = [getattr(a, col, 0) for a in assessments if getattr(a, col, 0)]
        radar_scores[key] = round(sum(dim_scores) / len(dim_scores), 1) if dim_scores else 0

    # 成长趋势
    trend_data = []
    for p in practices:
        a = assessment_map.get(p.id)
        trend_data.append({
            "date": str(p.submitted_at.date()) if p.submitted_at else "",
            "practice_id": p.id,
            "score": a.overall_score if a else None,
            "grade": a.overall_grade if a else None,
        })

    # 模块覆盖度
    question_ids = [p.question_id for p in practices]
    questions = db.query(Question).filter(Question.id.in_(question_ids)).all()
    q_map = {q.id: q for q in questions}
    module_counter = Counter()
    for p in practices:
        q = q_map.get(p.question_id)
        if q:
            module_counter[q.module] += 1

    # 薄弱维度（平均分 < 60）
    weak = [k for k, v in radar_scores.items() if v < 60]

    return DashboardData(
        student_id=student_id,
        total_practices=total,
        average_score=round(average_score, 1),
        grade_distribution={
            "S": grade_counter.get("S", 0),
            "A": grade_counter.get("A", 0),
            "B": grade_counter.get("B", 0),
            "C": grade_counter.get("C", 0),
            "D": grade_counter.get("D", 0),
        },
        radar_scores=radar_scores,
        trend_data=trend_data[-30:],  # 最近30次
        module_coverage=dict(module_counter),
        weak_dimensions=weak,
    )
