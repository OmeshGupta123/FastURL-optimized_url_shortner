from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, url, users
from . import models
from .database import engine
from .config import settings
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schema is initialized on startup
    models.Base.metadata.create_all(bind=engine)
    yield

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="FastURL",
    description="High-performance URL shortener with FastAPI, PostgreSQL, and Redis",
    version="1.0.0",
    lifespan=lifespan
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Enable CORS to allow requests from Postman, browsers, and frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)   
app.include_router(users.router)
app.include_router(url.router)

@app.get("/health")
def health():
    return {"status": "healthy"}