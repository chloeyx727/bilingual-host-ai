"""练习相关 API 路由"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.practice import PracticeSubmitRequest, PracticeOut, PracticeHistoryItem
from ..services.practice_service import submit_practice, get_practice, get_student_practices, ensure_demo_student
from ..services.assessment_service import assess_practice

router = APIRouter()


@router.post("/practices", response_model=dict)
async def submit_and_assess(
    data: PracticeSubmitRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """提交练习文稿并触发AI评析"""
    # 自动获取或创建演示学生
    data.student_id = ensure_demo_student(db)

    try:
        practice = submit_practice(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 同步执行AI评析（等待完成再返回）
    try:
        assessment = await assess_practice(db, practice.id)
        return {
            "practice_id": practice.id,
            "status": "completed",
            "assessment": assessment.model_dump(),
        }
    except Exception as e:
        return {
            "practice_id": practice.id,
            "status": "submitted_no_assessment",
            "error": str(e),
        }


@router.get("/practices/{practice_id}", response_model=PracticeOut)
def get_practice_detail(practice_id: int, db: Session = Depends(get_db)):
    """获取练习详情"""
    try:
        practice = get_practice(db, practice_id)
        return PracticeOut.model_validate(practice)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/practices", response_model=list[PracticeHistoryItem])
def list_practices(
    student_id: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    """获取学生练习历史"""
    return get_student_practices(db, student_id=student_id, limit=limit)
