"""评析服务：协调 Agent 工作流 + 数据持久化"""
import json
from sqlalchemy.orm import Session
from ..models.practice import Practice
from ..models.question import Question
from ..models.assessment import Assessment
from ..agents.assessment_agent import run_assessment_pipeline
from ..knowledge.retriever import retrieve_for_question
from ..schemas.assessment import AssessmentOut, DimensionResult


async def assess_practice(db: Session, practice_id: int) -> AssessmentOut:
    """
    对指定练习进行 AI 评析并持久化结果

    流程: 获取练习数据 → 知识检索 → 八维评析 → 聚合 → 存储 → 返回
    """
    # 1. 获取练习和题目数据
    practice = db.query(Practice).filter(Practice.id == practice_id).first()
    if not practice:
        raise ValueError(f"练习记录 {practice_id} 不存在")

    question = db.query(Question).filter(Question.id == practice.question_id).first()
    if not question:
        raise ValueError(f"题目 {practice.question_id} 不存在")

    # 2. 检查是否已有评析结果（避免重复）
    existing = db.query(Assessment).filter(Assessment.practice_id == practice_id).first()
    if existing:
        return _build_assessment_out(existing)

    # 3. 知识检索
    tags = []
    if question.knowledge_tags:
        try:
            tags = json.loads(question.knowledge_tags)
        except json.JSONDecodeError:
            pass
    knowledge_entries = retrieve_for_question(tags, n_results=5)

    # 4. 构建题目上下文
    question_context = f"题目标题：{question.title_zh}\n题型：{question.type}\n场景：{question.scenario or '无'}\n目标受众：{question.target_audience or '国际通用受众'}"

    # 5. 执行评析流水线
    result = await run_assessment_pipeline(
        script_zh=practice.script_zh or "",
        script_en=practice.script_en or "",
        question_context=question_context,
        knowledge_entries=knowledge_entries,
        target_audience=question.target_audience or "",
    )

    # 6. 持久化评析结果
    assessment = Assessment(
        practice_id=practice_id,
        overall_grade=result["overall_grade"],
        overall_score=result["overall_score"],
        cultural_accuracy_score=result["dimension_scores"].get("cultural_accuracy", 0),
        viewpoint_stance_score=result["dimension_scores"].get("viewpoint_stance", 0),
        argument_development_score=result["dimension_scores"].get("argument_development", 0),
        cross_cultural_translation_score=result["dimension_scores"].get("cross_cultural_translation", 0),
        audience_awareness_score=result["dimension_scores"].get("audience_awareness", 0),
        logical_coherence_score=result["dimension_scores"].get("logical_coherence", 0),
        narrative_structure_score=result["dimension_scores"].get("narrative_structure", 0),
        off_topic_detection_score=result["dimension_scores"].get("off_topic_detection", 0),
        highlights=json.dumps(result.get("highlights", []), ensure_ascii=False),
        improvements=json.dumps(result.get("improvements", []), ensure_ascii=False),
        dimension_feedback=json.dumps(result.get("dimensions", []), ensure_ascii=False),
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return _build_assessment_out(assessment)


def get_assessment(db: Session, practice_id: int) -> AssessmentOut:
    """获取已有的评析结果"""
    assessment = db.query(Assessment).filter(Assessment.practice_id == practice_id).first()
    if not assessment:
        raise ValueError(f"练习 {practice_id} 的评析结果不存在，请先执行评析")
    return _build_assessment_out(assessment)


def _build_assessment_out(assessment: Assessment) -> AssessmentOut:
    """将数据库模型转为输出模型"""
    highlights = []
    improvements = []
    dimensions = []

    if assessment.highlights:
        try:
            highlights = json.loads(assessment.highlights)
        except json.JSONDecodeError:
            pass

    if assessment.improvements:
        try:
            improvements = json.loads(assessment.improvements)
        except json.JSONDecodeError:
            pass

    if assessment.dimension_feedback:
        try:
            dims_data = json.loads(assessment.dimension_feedback)
            for d in dims_data:
                # 映射 agent 输出的字段名到 Pydantic schema 字段名
                dimensions.append(DimensionResult(
                    dimension_key=d.get("key", d.get("dimension_key", "")),
                    dimension_name_zh=d.get("name_zh", d.get("dimension_name_zh", "")),
                    dimension_name_en=d.get("name_en", d.get("dimension_name_en", "")),
                    score=d.get("score", 0),
                    feedback=d.get("feedback", d.get("summary", "")),
                    issues=d.get("issues", []),
                    suggestions=d.get("suggestions", []),
                    summary=d.get("summary", d.get("feedback", "")),
                ))
        except (json.JSONDecodeError, TypeError):
            pass

    # 解析语音评测结果
    voice_result = None
    if assessment.voice_result:
        try:
            voice_result = json.loads(assessment.voice_result)
        except (json.JSONDecodeError, TypeError):
            pass

    return AssessmentOut(
        id=assessment.id,
        practice_id=assessment.practice_id,
        overall_grade=assessment.overall_grade or "B",
        overall_score=assessment.overall_score or 0,
        cultural_accuracy_score=assessment.cultural_accuracy_score or 0,
        viewpoint_stance_score=assessment.viewpoint_stance_score or 0,
        argument_development_score=assessment.argument_development_score or 0,
        cross_cultural_translation_score=assessment.cross_cultural_translation_score or 0,
        audience_awareness_score=assessment.audience_awareness_score or 0,
        logical_coherence_score=assessment.logical_coherence_score or 0,
        narrative_structure_score=assessment.narrative_structure_score or 0,
        off_topic_detection_score=assessment.off_topic_detection_score or 0,
        highlights=highlights,
        improvements=improvements,
        dimensions=dimensions,
        voice_result=voice_result,
        created_at=assessment.created_at,
    )
