from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    model_config = ConfigDict(from_attributes=True)

class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[int] = None

class URLBase(BaseModel):
    original_url:str

class URLCreate(URLBase):
    pass

class URLResponse(URLBase):
    id: int
    short_code: str
    created_at: datetime
    clicks: int
    model_config = ConfigDict(from_attributes=True)