"""
Сервис для интеграции с API словарей.
Используем API Яндекс.Словари для получения слова дня с определением и примерами.
"""

import asyncio
import httpx
import os
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import logging
import random

logger = logging.getLogger(__name__)

# Яндекс.Словари API
YANDEX_DICT_API_URL = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup"
YANDEX_API_KEY = os.getenv("YANDEX_API_KEY")
TIMEOUT = 5  # секунд


class DictionaryCache:
    """Простой кэш для слова дня."""
    def __init__(self):
        self.word_data: Optional[Dict[str, Any]] = None
        self.last_update: Optional[datetime] = None
        self.cache_duration = timedelta(hours=24)
    
    def is_expired(self) -> bool:
        """Проверка истечения кэша."""
        if not self.last_update:
            return True
        return datetime.now() - self.last_update > self.cache_duration
    
    def get(self) -> Optional[Dict[str, Any]]:
        """Получить результат из кэша."""
        if not self.is_expired():
            return self.word_data
        return None
    
    def set(self, data: Dict[str, Any]):
        """Установить кэш."""
        self.word_data = data
        self.last_update = datetime.now()


# Глобальный кэш для слова дня
_word_cache = DictionaryCache()

# Русские слова для демонстрации (альтернатива если API недоступен)
FALLBACK_WORDS = [
    {
        "word": "Синергия",
        "definition": "взаимодействие двух или более элементов, при котором достигается эффект превосходящий сумму эффектов воздействия каждого элемента в отдельности",
        "example": "Синергия команды позволила достичь лучших результатов.",
        "part_of_speech": "существительное"
    },
    {
        "word": "Эврика",
        "definition": "восклицание радости по поводу совершённого открытия, находки; успешного решения чего-либо",
        "example": "После долгих поисков он воскликнул: эврика!",
        "part_of_speech": "междометие"
    },
    {
        "word": "Парадокс",
        "definition": "явление, кажущееся противоречащим общепринятым представлениям; противоречие в суждении или высказывании",
        "example": "История знает немало парадоксов.",
        "part_of_speech": "существительное"
    },
    {
        "word": "Амбивалентность",
        "definition": "одновременное наличие двух противоположных чувств, взглядов, отношений",
        "example": "Его амбивалентность к работе мешала ему двигаться вперёд.",
        "part_of_speech": "существительное"
    },
    {
        "word": "Филантроп",
        "definition": "человек, который занимается благотворительностью, помогает нуждающимся",
        "example": "Известный филантроп пожертвовал миллионы на образование.",
        "part_of_speech": "существительное"
    },
]


async def fetch_word_data() -> Optional[Dict[str, Any]]:
    """
    Получить данные о слове дня.
    Сначала выбирает случайное слово, потом получает его определение через API.
    
    Returns:
        Dict с полями: word, definition, example, part_of_speech
    """
    try:
        # Проверяем кэш
        cached = _word_cache.get()
        if cached:
            logger.info("Using cached word data")
            return cached
        
        # Выбираем случайное слово
        word = random.choice(FALLBACK_WORDS)["word"]
        
        # Получаем определение через API
        result = await _fetch_from_yandex_api(word)
        if result:
            _word_cache.set(result)
            logger.info(f"Fetched word data from API: {result['word']}")
            return result
        
        # Если API не сработал, используем fallback
        logger.warning("API failed, using fallback word")
        return _get_fallback_word()
            
    except asyncio.TimeoutError:
        logger.warning("Dictionary API timeout, using fallback")
        return _get_fallback_word()
    except Exception as e:
        logger.error(f"Error fetching word data: {e}")
        return _get_fallback_word()


async def _fetch_from_yandex_api(word: str) -> Optional[Dict[str, Any]]:
    """
    Получить определение слова из Яндекс.Словаря.
    
    Args:
        word: слово для поиска
    
    Returns:
        Dict с форматом: {word, definition, example, part_of_speech} или None
    """
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            params = {
                "key": YANDEX_API_KEY,
                "text": word,
                "lang": "ru-en"  # русско-английский словарь
            }
            
            response = await client.get(YANDEX_DICT_API_URL, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            # Парсим ответ от API
            if not data.get("def"):
                logger.warning(f"No definitions found for word: {word}")
                return None
            
            # Берём первое определение
            definition_data = data["def"][0]
            word_text = definition_data.get("text", word)
            
            # Получаем часть речи
            part_of_speech = ""
            if definition_data.get("pos"):
                part_of_speech = definition_data.get("pos", "")
            
            # Получаем определение и пример
            definition = ""
            example = ""
            
            if definition_data.get("tr"):  # tr - переводы/определения
                translation_data = definition_data["tr"][0]
                definition = translation_data.get("text", "")
                
                # Пытаемся получить пример
                if translation_data.get("ex"):
                    example_data = translation_data["ex"][0]
                    example = example_data.get("text", "")
            
            result = {
                "word": word_text,
                "definition": definition or "Определение не найдено",
                "example": example or f"Пример использования слова '{word_text}'",
                "part_of_speech": part_of_speech or "существительное"
            }
            
            return result
            
    except httpx.HTTPError as e:
        logger.error(f"HTTP error fetching from Yandex API: {e}")
        return None
    except Exception as e:
        logger.error(f"Error parsing Yandex API response: {e}")
        return None


def _get_fallback_word() -> Dict[str, Any]:
    """Получить фиксированное слово при недоступности API."""
    import random
    word_data = random.choice(FALLBACK_WORDS)
    _word_cache.set(word_data)
    return word_data


async def get_word_definition(word: str) -> Optional[Dict[str, Any]]:
    """
    Получить определение конкретного слова через API или из fallback.
    
    Args:
        word: слово для поиска
    
    Returns:
        Dict с определением или None
    """
    try:
        if not word or len(word) < 2:
            return None
        
        # Сначала пытаемся через API
        result = await _fetch_from_yandex_api(word)
        if result:
            return result
        
        # Если API не сработал, проверяем fallback список
        word_lower = word.lower()
        for w in FALLBACK_WORDS:
            if w["word"].lower() == word_lower:
                return w
        
        return None
        
    except Exception as e:
        logger.error(f"Error getting definition for {word}: {e}")
        return None


# JSON-LD структурированные данные для микроразметки
def get_schema_org_word(word_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Генерирует JSON-LD для слова (schema.org).
    """
    return {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": word_data.get("word", ""),
        "description": word_data.get("definition", ""),
        "mainEntity": {
            "@type": "Thing",
            "name": word_data.get("word")
        },
        "identifier": {
            "@type": "PropertyValue",
            "name": "word",
            "value": word_data.get("word")
        }
    }