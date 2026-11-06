from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128, description="Password must be between 6 and 128 characters")
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
    original_url: str = Field(..., max_length=2048, description="Target destination URL")

    @field_validator("original_url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        url_str = v.strip()
        if not (url_str.startswith("http://") or url_str.startswith("https://")):
            raise ValueError("URL must start with http:// or https://")
        return url_str

class URLCreate(URLBase):
    pass

class URLResponse(URLBase):
    id: int
    short_code: str
    created_at: datetime
    clicks: int
    model_config = ConfigDict(from_attributes=True)