"""题目相关 API 路由"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.question import QuestionOut, QuestionDetail, QuestionGenerateRequest, QuestionGenerateResponse
from ..services.question_service import get_questions, get_question_detail, seed_questions

router = APIRouter()


@router.get("/questions", response_model=list[QuestionOut])
def list_questions(
    module: str = Query(None, description="文化模块"),
    type: str = Query(None, description="题型"),
    difficulty: int = Query(None, description="难度 1-5"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """获取题目列表，支持按模块/题型/难度筛选"""
    # 自动初始化种子数据
    seed_questions(db)
    return get_questions(db, module=module, type=type, difficulty=difficulty, skip=skip, limit=limit)


@router.get("/questions/{question_id}", response_model=QuestionDetail)
def get_question(question_id: int, db: Session = Depends(get_db)):
    """获取题目详情，包含关联知识卡片"""
    try:
        return get_question_detail(db, question_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
