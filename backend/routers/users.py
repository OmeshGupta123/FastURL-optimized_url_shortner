from .. import models, schemas, utils
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

#Create users
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
@limiter.limit("1500/minute")
def create_user(request: Request, user:schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = utils.get_password_hash(user.password)
    
    existing_user = db.query(models.User).filter(user.email == models.User.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    user.password = hashed_password
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user) 
    return new_user

#Get user by id
@router.get("/{id}", response_model=schemas.UserOut) 
@limiter.limit("1500/minute")
def create_user(request: Request, id: int, db: Session = Depends(get_db)):
    user_query = db.query(models.User).filter(models.User.id == id)
    find_user = user_query.first()
    if not find_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User not found!")
    return find_user