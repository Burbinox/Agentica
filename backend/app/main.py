from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import SQLModel
from app.database import engine
from app import models  # noqa: F401 — registers all models with SQLModel metadata
from app.routes.tickets import router as tickets_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(tickets_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
