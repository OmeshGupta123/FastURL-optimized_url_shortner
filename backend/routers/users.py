from .. import models, schemas, utils, oauth2
from fastapi import FastAPI, Response, HTTPException, Depends, APIRouter, status, Request
from ..database import get_db
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter(
    prefix="/users",
    tags=['Users']
)

limiter = Limiter(key_func=get_remote_address)

# Create users
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
@limiter.limit("20/minute")
def create_user(request: Request, user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = utils.get_password_hash(user.password)
    
    existing_user = db.query(models.User).filter(user.email == models.User.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    user.password = hashed_password
    new_user = models.User(**user.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user) 
    return new_user

# Get user by id (only accessible by the authenticated user)
@router.get("/{id}", response_model=schemas.UserOut) 
@limiter.limit("60/minute")
def get_user(
    request: Request, 
    id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(oauth2.get_current_user)
):
    if current_user.id != id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user"
        )
    return current_user