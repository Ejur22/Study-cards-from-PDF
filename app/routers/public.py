"""
Маршруты для публичного API (доступны без аутентификации).
Включает словарь, robots.txt, sitemap.xml и другие SEO endpoints.
"""

from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import PlainTextResponse
from typing import List
import logging
from app.services.dictionary_service import (
    fetch_word_data,
    get_word_definition,
    get_schema_org_word
)

router = APIRouter()
logger = logging.getLogger(__name__)


# ==================== Dictionary API ====================

@router.get("/api/dictionary/word-of-day")
async def get_word_of_day():
    """
    Получить слово дня с определением и примером.
    Доступно без аутентификации.
    
    Returns:
        {
            "word": "Синергия",
            "definition": "взаимодействие...",
            "example": "...",
            "part_of_speech": "существительное",
            "schema": {...}  # JSON-LD
        }
    """
    try:
        word_data = await fetch_word_data()
        if not word_data:
            raise HTTPException(status_code=503, detail="Dictionary service unavailable")
        
        # Добавляем schema.org микроразметку
        schema = get_schema_org_word(word_data)
        
        return {
            **word_data,
            "schema": schema
        }
    except Exception as e:
        logger.error(f"Error in word_of_day endpoint: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch word of day")


@router.get("/api/dictionary/search/{word}")
async def search_word(word: str):
    """
    Поиск определения для конкретного слова.
    """
    if not word or len(word) < 2:
        raise HTTPException(status_code=400, detail="Word must be at least 2 characters")
    
    definition = await get_word_definition(word)
    if not definition:
        raise HTTPException(status_code=404, detail=f"Word '{word}' not found")
    
    schema = get_schema_org_word(definition)
    return {
        **definition,
        "schema": schema
    }


# ==================== SEO endpoints ====================

@router.get("/robots.txt", response_class=PlainTextResponse)
async def robots_txt():
    """
    robots.txt для SEO-индексации.
    Разрешает поиск на публичные страницы, запрещает на защищённые.
    """
    return """User-agent: *
Allow: /
Allow: /api/dictionary/
Disallow: /api/groups/
Disallow: /api/flashcards/
Disallow: /api/users/
Disallow: /auth/
Disallow: /api/auth/

# Указываем sitemap
Sitemap: https://studycards.app/sitemap.xml

# Crawl delay для уменьшения нагрузки
Crawl-delay: 1
"""


@router.get("/sitemap.xml", response_class=PlainTextResponse)
async def sitemap_xml():
    """
    sitemap.xml для SEO-индексации.
    Содержит все публичные маршруты с приоритетом.
    """
    sitemap = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Главная страница - наивысший приоритет -->
  <url>
    <loc>https://studycards.app/</loc>
    <lastmod>2024-04-04T00:00:00Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- API словаря - публичный контент -->
  <url>
    <loc>https://studycards.app/api/dictionary/word-of-day</loc>
    <lastmod>2024-04-04T00:00:00Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Защищённые страницы (не индексируются) -->
  <!-- /quiz, /results, /history, /users - скрыты от поиска -->
  
</urlset>
"""
    return sitemap


@router.get("/.well-known/security.txt", response_class=PlainTextResponse)
async def security_txt():
    """
    security.txt для уведомления об уязвимостях.
    """
    return """Contact: security@studycards.app
Expires: 2025-04-04T00:00:00Z
Preferred-Languages: ru
"""


# ==================== Error handling для SEO ====================

@router.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def catch_all(full_path: str):
    """
    Обработчик для несуществующих маршрутов.
    Возвращает 404 для поисковых систем.
    """
    raise HTTPException(
        status_code=404,
        detail=f"Endpoint /{full_path} not found"
    )
