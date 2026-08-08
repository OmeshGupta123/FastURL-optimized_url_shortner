from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session
from fastapi import Depends
import os
from dotenv import load_dotenv
from backend.config import settings
from typing import Annotated

load_dotenv()

database_url = settings.database_url

class Base(DeclarativeBase):
    pass

engine = create_engine(
    database_url,
    pool_size=20,       # Default 5, we need 20 
    max_overflow=40,    # Default 10, we need 40
    pool_timeout=30
    )

def get_db():
    with Session(engine) as session :
        yield session
        
DBDependency = Annotated[Session, Depends(get_db)]
    