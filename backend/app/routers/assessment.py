"""评析相关 API 路由"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.assessment import AssessmentOut
from ..services.assessment_service import get_assessment, assess_practice

router = APIRouter()


@router.get("/assessments/{practice_id}", response_model=AssessmentOut)
def get_practice_assessment(practice_id: int, db: Session = Depends(get_db)):
    """获取练习的评析结果"""
    try:
        return get_assessment(db, practice_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/assessments/{practice_id}/retry", response_model=AssessmentOut)
async def retry_assessment(practice_id: int, db: Session = Depends(get_db)):
    """重新评析（覆盖旧结果）"""
    try:
        # 删除旧评析
        from ..models.assessment import Assessment
        old = db.query(Assessment).filter(Assessment.practice_id == practice_id).first()
        if old:
            db.delete(old)
            db.commit()

        return await assess_practice(db, practice_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
