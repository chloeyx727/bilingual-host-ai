"""评析 Agent：八维并行评析 + 综合汇总"""
import json
import time
from .base import call_deepseek_with_retry, run_parallel_calls
from ..prompts.assessment import DIMENSION_META, AGGREGATION_PROMPT


def _build_dimension_prompt(dim: dict, script_zh: str, script_en: str, question_context: str, knowledge_text: str = "", target_audience: str = "") -> str:
    """构建单个维度的完整 System Prompt"""
    prompt_template = dim["prompt"]
    return prompt_template.format(
        script_zh=script_zh or "（无中文文稿）",
        script_en=script_en or "（无英文文稿）",
        question_context=question_context,
        retrieved_knowledge=knowledge_text or "（无特定知识参考）",
        target_audience=target_audience or "国际通用受众",
    )


async def run_assessment_pipeline(
    script_zh: str,
    script_en: str,
    question_context: str,
    knowledge_entries: list[dict] = None,
    target_audience: str = "",
) -> dict:
    """
    执行完整的评析流水线：
    1. 并行调用8个维度评析
    2. 汇总生成综合报告
    3. 返回结构化结果

    Args:
        script_zh: 中文文稿
        script_en: 英文文稿
        question_context: 题目上下文（题目标题+要求）
        knowledge_entries: 从ChromaDB检索到的知识条目
        target_audience: 目标受众描述

    Returns:
        完整的评析结果字典
    """
    # 构建知识文本（供Prompt使用）
    knowledge_text = ""
    if knowledge_entries:
        parts = []
        for entry in knowledge_entries:
            content = entry.get("content", {})
            parts.append(f"## {entry.get('title_zh', '')} ({entry.get('title_en', '')})")
            parts.append(content.get("summary_zh", ""))
            parts.append(content.get("summary_en", ""))
            for fact in content.get("key_facts", []):
                parts.append(f"- {fact.get('zh', '')} / {fact.get('en', '')}")
            for mis in content.get("misunderstandings", []):
                parts.append(f"[常见误解] {mis.get('myth', '')} → 事实: {mis.get('fact', '')}")
        knowledge_text = "\n".join(parts)

    # Step 1: 并行调用8个维度
    start_time = time.time()

    tasks = []
    for dim in DIMENSION_META:
        tasks.append({
            "system_prompt": _build_dimension_prompt(
                dim, script_zh, script_en, question_context, knowledge_text, target_audience
            ),
            "user_message": f"请对以下主持文稿进行「{dim['name_zh']}」维度的评析，并按JSON格式输出结果。",
            "label": dim["key"],
        })

    dimension_results = await run_parallel_calls(tasks)
    elapsed = time.time() - start_time
    print(f"[INFO] 八维并行评析完成，耗时 {elapsed:.1f}s")

    # Step 2: 整理维度结果
    dimensions = []
    dimension_scores = {}
    for i, result in enumerate(dimension_results):
        dim_meta = DIMENSION_META[i]
        score = result.get("score", 0)
        if isinstance(score, str):
            try:
                score = int(score)
            except ValueError:
                score = 0
        dimension_scores[dim_meta["key"]] = max(0, min(100, score))
        dimensions.append({
            "key": dim_meta["key"],
            "name_zh": dim_meta["name_zh"],
            "name_en": dim_meta["name_en"],
            "score": dimension_scores[dim_meta["key"]],
            "feedback": result.get("summary", ""),
            "issues": result.get("issues", []),
            "suggestions": result.get("suggestions", []),
            "raw_result": result,
        })

    # Step 3: 综合汇总
    # 用简洁格式汇总八维结果
    dim_summary = ""
    for d in dimensions:
        dim_summary += f"- {d['name_zh']}({d['name_en']}): {d['score']}分 - {d['feedback']}\n"

    aggregation_prompt = AGGREGATION_PROMPT.format(
        dimension_results=dim_summary,
        script_zh=script_zh or "",
        script_en=script_en or "",
        question_context=question_context,
    )

    aggregation_result = await call_deepseek_with_retry(
        system_prompt=aggregation_prompt,
        user_message="请基于以上八维评析结果，生成综合评析报告（JSON格式）。",
    )

    # Step 4: 组装最终结果
    overall_score = sum(dimension_scores.values()) / len(dimension_scores)

    return {
        "overall_grade": aggregation_result.get("overall_grade", "B"),
        "overall_score": round(overall_score, 1),
        "dimension_scores": dimension_scores,
        "dimensions": dimensions,
        "highlights": aggregation_result.get("highlights", []),
        "improvements": aggregation_result.get("improvements", []),
        "summary_zh": aggregation_result.get("summary_zh", ""),
        "summary_en": aggregation_result.get("summary_en", ""),
        "elapsed_seconds": round(elapsed, 1),
    }
