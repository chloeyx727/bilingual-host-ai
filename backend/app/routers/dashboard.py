"""成长追踪 API 路由"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.assessment import DashboardData
from ..services.dashboard_service import get_dashboard

router = APIRouter()


@router.get("/dashboard/{student_id}", response_model=DashboardData)
def get_student_dashboard(student_id: int, db: Session = Depends(get_db)):
    """获取学生成长仪表盘数据"""
    return get_dashboard(db, student_id)
