"""FastAPI 应用入口"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import APP_TITLE, APP_VERSION, CORS_ORIGINS
from .database import init_db
from .routers import questions, practice, assessment, dashboard, speech


def create_app() -> FastAPI:
    app = FastAPI(title=APP_TITLE, version=APP_VERSION)

    # CORS 中间件
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 注册路由
    app.include_router(questions.router, prefix="/api", tags=["题目"])
    app.include_router(practice.router, prefix="/api", tags=["练习"])
    app.include_router(assessment.router, prefix="/api", tags=["评析"])
    app.include_router(dashboard.router, prefix="/api", tags=["成长追踪"])
    app.include_router(speech.router, prefix="/api", tags=["语音评测"])

    @app.on_event("startup")
    def on_startup():
        init_db()

    @app.get("/")
    def root():
        return {"message": f"欢迎使用{APP_TITLE}", "version": APP_VERSION}

    @app.get("/api/health")
    def health_check():
        return {"status": "ok"}

    return app


app = create_app()
