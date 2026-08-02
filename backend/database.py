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

engine = create_engine(database_url)

def get_db():
    with Session(engine) as session :
        yield session
        
DBDependency = Annotated[Session, Depends(get_db)]
    