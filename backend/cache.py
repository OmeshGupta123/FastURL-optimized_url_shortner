import redis
import json
from typing import Optional
from backend.config import settings

if settings.redis_url:
    redis_client = redis.from_url(
        settings.redis_url,
        decode_responses=True,
        socket_connect_timeout=2,
        socket_timeout=2
    )
else:
    redis_client = redis.Redis(
        host=settings.redis_host,
        port=settings.redis_port,
        password=settings.redis_password if settings.redis_password else None,
        db=0,
        decode_responses=True,
        socket_connect_timeout=2,
        socket_timeout=2
    )

def get_cache(key: str) -> Optional[dict]:
    try:
        data = redis_client.get(key)
        if data:
            return json.loads(data)
        return None
    except redis.RedisError:
        return None

def set_cache(key: str, value: dict, ttl: int = 3600) -> bool:
    try:
        redis_client.setex(key, ttl, json.dumps(value))
        return True
    except redis.RedisError:
        return False

def delete_cache(key: str) -> bool:
    try:
        redis_client.delete(key)
        return True
    except redis.RedisError:
        return False

def invalidate_user_urls_cache(user_id: int) -> bool:
    return delete_cache(f"user_urls:{user_id}")

def increment_clicks(short_code: str) -> int:
    try:
        key = f"clicks:{short_code}"
        return redis_client.incr(key)
    except redis.RedisError:
        return 0

def get_clicks(short_code: str) -> int:
    try:
        key = f"clicks:{short_code}"
        clicks = redis_client.get(key)
        return int(clicks) if clicks else 0
    except redis.RedisError:
        return 0
