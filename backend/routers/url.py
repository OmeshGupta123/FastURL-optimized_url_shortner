
from .. import models, schemas, oauth2, utils, cache
from fastapi import APIRouter, HTTPException, Depends, status, BackgroundTasks, Request
from ..database import get_db, DBDependency, engine
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.orm import Session
import string
import secrets
from datetime import datetime, timezone
from fastapi.responses import RedirectResponse

router = APIRouter(
    prefix="/urls",
    tags=['URLs']
)

limiter = Limiter(key_func=get_remote_address)

def generate_short_code(length: int = 6) -> str:
    chars = string.ascii_letters + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))

def update_click_count(short_code: str):
    """Background task to update click count in database using its own isolated session"""
    with Session(engine) as db:
        url = db.query(models.URL).filter(models.URL.short_code == short_code).first()
        if url:
            redis_clicks = cache.get_clicks(short_code)
            url.clicks = redis_clicks
            db.commit()

# Create a short URL
@router.post("/", response_model=schemas.URLResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("120/minute")
def create_short_url(
    request: Request, 
    url: schemas.URLCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(oauth2.get_current_user)
):
    # Generate unique short code with retry limit
    for _ in range(10):
        short_code = generate_short_code()
        if not db.query(models.URL).filter(models.URL.short_code == short_code).first():
            break
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not generate unique short code. Please try again."
        )

    db_url = models.URL(
        original_url=str(url.original_url),
        short_code=short_code,
        user_id=current_user.id,
        created_at=datetime.now(timezone.utc)
    )
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    
    # Invalidate user's URLs cache
    cache.invalidate_user_urls_cache(current_user.id)
    
    return db_url

# Get all URLs for the current user
@router.get("/", response_model=list[schemas.URLResponse])
def get_urls(db: Session = Depends(get_db), current_user: models.User = Depends(oauth2.get_current_user)):
    cache_key = f"user_urls:{current_user.id}"
    cached_urls = cache.get_cache(cache_key)
    if cached_urls:
        return cached_urls
    
    # If not in cache, get from database
    urls = db.query(models.URL).filter(models.URL.user_id == current_user.id).order_by(models.URL.created_at.desc()).all()
    
    urls_data = [
        {
            "id": url.id, 
            "original_url": url.original_url, 
            "short_code": url.short_code, 
            "created_at": url.created_at.isoformat() if hasattr(url.created_at, 'isoformat') else str(url.created_at), 
            "clicks": url.clicks
        } 
        for url in urls
    ]
    cache.set_cache(cache_key, urls_data, ttl=3600)
    
    return urls

# Redirect short URL
@router.get("/r/{short_code}", response_class=RedirectResponse)
def redirect_short_url(short_code: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    cache_key = f"short_url:{short_code}"
    cached_url = cache.get_cache(cache_key)
    
    if cached_url:
        # Increment click count in Redis (instant)
        cache.increment_clicks(short_code)
        # Schedule background task to sync to database with isolated session
        background_tasks.add_task(update_click_count, short_code)
        return RedirectResponse(url=cached_url["original_url"], status_code=307)
    
    # Get from database
    url = db.query(models.URL).filter(models.URL.short_code == short_code).first()
    if not url:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Short URL not found")
    
    result = {"original_url": url.original_url}
    
    # Increment click count in Redis
    cache.increment_clicks(short_code)
    
    # Cache for 24 hours (URLs don't change often)
    cache.set_cache(cache_key, result, ttl=86400)
    
    # Schedule background task to sync to database with isolated session
    background_tasks.add_task(update_click_count, short_code)
    
    return RedirectResponse(url=url.original_url, status_code=307)