from typing import Optional, Dict, Any

from app.core.config import settings


class RandomFactsService:
    """Сервис для работы с Random Facts API"""

    def __init__(self):
        self.base_url = "https://uselessfacts.jsph.pl"

    def get_random_fact(self, language: str = "en") -> Optional[Dict[str, Any]]:
        """
        Получить случайный факт

        Args:
            language: Язык факта ('en' или 'de')

        Returns:
            Dict с фактом или None при ошибке
        """
        # Временный мок для тестирования
        return {
            "id": "test-123",
            "text": "Это тестовый факт для проверки работы API",
            "source": "test",
            "language": language
        }

    def get_fact_of_the_day(self, language: str = "en") -> Optional[Dict[str, Any]]:
        """
        Получить факт дня

        Args:
            language: Язык факта ('en' или 'de')

        Returns:
            Dict с фактом или None при ошибке
        """
        # Временный мок для тестирования
        return {
            "id": "test-today-123",
            "text": "Это тестовый факт дня",
            "source": "test",
            "language": language
        }
                )
                response.raise_for_status()

                data = response.json()
                return {
                    "id": data.get("id"),
                    "text": data.get("text"),
                    "source": data.get("source", "uselessfacts"),
                    "language": data.get("language", language)
                }

        except httpx.HTTPStatusError as e:
            print(f"HTTP error: {e.response.status_code}")
            return None
        except Exception as e:
            print(f"Error fetching fact of the day: {e}")
            return None


# Singleton instance
random_facts_service = RandomFactsService()