"""语音评测 API 路由"""
import json
import base64
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.practice import Practice
from ..models.assessment import Assessment
from ..models.user import Student
from ..schemas.assessment import VoiceEvaluateRequest
from ..agents.speech_agent import evaluate_bilingual

router = APIRouter()


class SpeechOnlyRequest(BaseModel):
    """纯录音评测请求（可选配参考文稿）"""
    audio_cn_base64: str = ""
    audio_en_base64: str = ""
    text_cn: str = ""
    text_en: str = ""


@router.post("/speech-only", response_model=dict)
async def speech_only_evaluate(
    data: SpeechOnlyRequest,
    db: Session = Depends(get_db),
):
    """独立录音评测：仅上传音频，无需文稿，一键提交"""
    if not data.audio_cn_base64 and not data.audio_en_base64:
        raise HTTPException(status_code=400, detail="请至少上传一段录音")

    cn_bytes = b""
    en_bytes = b""
    try:
        if data.audio_cn_base64:
            cn_bytes = base64.b64decode(data.audio_cn_base64)
        if data.audio_en_base64:
            en_bytes = base64.b64decode(data.audio_en_base64)
    except Exception:
        raise HTTPException(status_code=400, detail="音频数据格式错误")

    # 确保有演示学生
    student = db.query(Student).first()
    if not student:
        student = Student(nickname="演示学生")
        db.add(student)
        db.flush()

    # 创建最小练习记录（无文稿）
    practice = Practice(
        student_id=student.id,
        question_id=0,  # 独立录音评测无关联题目
        script_zh="",
        script_en="",
        word_count_zh=0,
        word_count_en=0,
        duration_seconds=0,
    )
    db.add(practice)
    db.flush()

    # 创建 assessment 记录
    assessment = Assessment(practice_id=practice.id)
    db.add(assessment)
    db.flush()

    # 调用讯飞语音评测（有文稿用跟读模式，无文稿用自由表达模式）
    result = await evaluate_bilingual(
        audio_cn_bytes=cn_bytes,
        audio_en_bytes=en_bytes,
        text_cn=data.text_cn or "",
        text_en=data.text_en or "",
    )

    # 存储结果
    assessment.voice_result = json.dumps(result, ensure_ascii=False)
    db.commit()

    return {
        "practice_id": practice.id,
        "status": "completed",
        "voice_result": result,
    }


@router.post("/speech-evaluate", response_model=dict)
async def evaluate_speech(
    data: VoiceEvaluateRequest,
    db: Session = Depends(get_db),
):
    """提交录音进行语音评测（搭配已有文稿）"""
    practice = db.query(Practice).filter(Practice.id == data.practice_id).first()
    if not practice:
        raise HTTPException(status_code=404, detail=f"练习记录 {data.practice_id} 不存在")

    cn_bytes = b""
    en_bytes = b""
    try:
        if data.audio_cn_base64:
            cn_bytes = base64.b64decode(data.audio_cn_base64)
        if data.audio_en_base64:
            en_bytes = base64.b64decode(data.audio_en_base64)
    except Exception:
        raise HTTPException(status_code=400, detail="音频数据格式错误")

    result = await evaluate_bilingual(
        audio_cn_bytes=cn_bytes,
        audio_en_bytes=en_bytes,
        text_cn=practice.script_zh or "",
        text_en=practice.script_en or "",
    )

    assessment = db.query(Assessment).filter(Assessment.practice_id == data.practice_id).first()
    if assessment:
        assessment.voice_result = json.dumps(result, ensure_ascii=False)
        db.commit()

    return {
        "practice_id": data.practice_id,
        "status": "completed",
        "voice_result": result,
    }


@router.get("/speech-result/{practice_id}", response_model=dict)
def get_speech_result(practice_id: int, db: Session = Depends(get_db)):
    """获取纯录音评测结果"""
    assessment = db.query(Assessment).filter(Assessment.practice_id == practice_id).first()
    if not assessment or not assessment.voice_result:
        raise HTTPException(status_code=404, detail="语音评测结果不存在")
    try:
        return json.loads(assessment.voice_result)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="解析评测结果失败")
