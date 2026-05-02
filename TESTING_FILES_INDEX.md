"""
TESTING FILES INDEX - Указатель всех созданных файлов тестирования

Используйте этот файл для быстрого поиска нужной информации
"""

# ==================== СТРУКТУРА ДОКУМЕНТАЦИИ ====================

## 📚 ГЛАВНЫЕ ДОКУМЕНТЫ

1. 📖 TESTING_QUICK_START.md
   ├─ Что: Быстрый старт за 2 минуты
   ├─ Используйте когда: Хотите быстро запустить тесты
   ├─ Ключевые разделы:
   │  ├─ ШАГ 1-4: Пошаговая установка и запуск
   │  ├─ ПРИМЕРЫ КОМАНД: Часто используемые
   │  └─ TROUBLESHOOTING: Решение проблем
   └─ Размер: ~200 строк

2. 📖 TESTING_COMPREHENSIVE_GUIDE.md
   ├─ Что: Полное руководство по тестированию
   ├─ Используйте когда: Нужна подробная информация
   ├─ Ключевые разделы:
   │  ├─ СТРУКТУРА: Папки и файлы
   │  ├─ УСТАНОВКА: Для backend и frontend
   │  ├─ ЗАПУСК: Все команды
   │  ├─ CI/CD: GitHub Actions пример
   │  ├─ BEST PRACTICES: 7 правил тестирования
   │  ├─ ОТЛАДКА: Как найти проблемы
   │  └─ МЕТРИКИ: Coverage требования
   └─ Размер: ~400 строк

3. 📖 TESTING_STATUS.md
   ├─ Что: Текущий статус реализации тестирования
   ├─ Используйте когда: Хотите знать что уже сделано
   ├─ Ключевые разделы:
   │  ├─ РЕАЛИЗОВАННЫЕ КОМПОНЕНТЫ: Список с статусом ✅
   │  ├─ КОМАНДЫ ДЛЯ ЗАПУСКА: Что и как запускать
   │  ├─ ПОКРЫТИЕ СЦЕНАРИЕВ: Бизнес-случаи
   │  ├─ ОСТАЛОСЬ: TODO список
   │  ├─ КОД. СТРУКТУРА: Файлы после реализации
   │  └─ МЕТРИКИ: Статистика
   └─ Размер: ~400 строк

4. 📖 TESTING_IMPLEMENTATION_SUMMARY.md
   ├─ Что: Summary всего что было реализовано
   ├─ Используйте когда: Хотите overview всего проекта
   ├─ Ключевые разделы:
   │  ├─ STATS: Числа и факты
   │  ├─ СОЗДАННЫЕ ФАЙЛЫ: Что и где
   │  ├─ ИНСТРУКЦИИ ПО ЗАПУСКУ: Примеры с результатами
   │  ├─ ПОКРЫТЫЕ СЦЕНАРИИ: Список всех тестов
   │  ├─ WORKFLOW ДЛЯ РАЗРАБОТЧИКОВ: Как работать
   │  ├─ GIT HOOKS: Pre-commit
   │  ├─ CI/CD: GitHub Actions пример
   │  └─ NEXT STEPS: Что делать дальше
   └─ Размер: ~400 строк

5. 📖 FRONTEND_TESTS_EXAMPLES.md
   ├─ Что: Примеры фронтенд тестов с пояснениями
   ├─ Используйте когда: Пишете новые React тесты
   ├─ Ключевые разделы:
   │  ├─ СТРУКТУРА: Папки для фронтенда
   │  ├─ 4 ПРИМЕРА: Unit, Integration, E2E
   │  ├─ ЗАПУСК: Как запускать фронтенд тесты
   │  └─ BEST PRACTICES: 7 правил для React
   └─ Размер: ~300 строк

6. 📖 FRONTEND_TEST_SETUP.md
   ├─ Что: Setup инструкции для фронтенда
   ├─ Используйте когда: Установка фронтенд зависимостей
   └─ Размер: ~30 строк


# ==================== ФАЙЛЫ ИНФРАСТРУКТУРЫ ====================

## 🔧 КОНФИГИ И FIXTURE'Ы

7. ⚙️ pytest.ini
   ├─ Путь: c:\Fullstack_project\Study-cards-from-PDF\pytest.ini
   ├─ Что: Конфиг для pytest
   ├─ Содержит:
   │  ├─ asyncio_mode: auto (для async тестов)
   │  ├─ markers: unit, integration, auth, file, api, slow
   │  ├─ addopts: улучшенный вывод
   │  └─ testpaths: где искать тесты
   └─ Размер: ~20 строк

8. 📋 requirements-dev.txt
   ├─ Путь: c:\Fullstack_project\Study-cards-from-PDF\requirements-dev.txt
   ├─ Что: Dev зависимости для backend
   ├─ Содержит:
   │  ├─ pytest, pytest-asyncio, pytest-cov
   │  ├─ pytest-xdist (параллельное выполнение)
   │  ├─ httpx (async HTTP)
   │  ├─ factory-boy, faker (тестовые данные)
   │  └─ freezegun (тестирование времени)
   └─ Использование: pip install -r requirements-dev.txt

9. 🔌 tests/conftest.py
   ├─ Путь: c:\Fullstack_project\Study-cards-from-PDF\tests\conftest.py
   ├─ Что: Global fixtures для всех backend тестов
   ├─ Fixtures:
   │  ├─ test_db: in-memory SQLite
   │  ├─ client: AsyncClient
   │  ├─ test_user: обычный пользователь
   │  ├─ test_admin_user: admin пользователь
   │  ├─ authenticated_client: авторизованный клиент
   │  ├─ test_group: группа для тестов
   │  └─ test_flashcards: вопросы для тестов
   └─ Размер: ~150 строк

10. 📐 vitest.config.js
    ├─ Путь: frontend/StudyCards App with Registration/vitest.config.js
    ├─ Что: Конфиг для frontend unit тестов
    ├─ Содержит:
    │  ├─ environment: jsdom
    │  ├─ globals: true (describe, it, expect)
    │  ├─ coverage: 70% requirement
    │  ├─ setupFiles: setup.js
    │  └─ aliases: для импортов
    └─ Размер: ~50 строк

11. 🧩 cypress.config.js
    ├─ Путь: frontend/StudyCards App with Registration/cypress.config.js
    ├─ Что: Конфиг для E2E тестов
    ├─ Содержит:
    │  ├─ baseUrl: http://localhost:5173
    │  ├─ viewportSize: 1280x720
    │  ├─ video: true (запись тестов)
    │  ├─ screenshotOnRunFailure: true
    │  └─ defaultCommandTimeout: 10000
    └─ Размер: ~40 строк


# ==================== BACKEND ТЕСТЫ ====================

## 🧪 UNIT ТЕСТЫ

12. ✅ tests/unit/test_auth_service.py
    ├─ Путь: c:\Fullstack_project\Study-cards-from-PDF\tests\unit\test_auth_service.py
    ├─ Что: Unit тесты для AuthService
    ├─ Тест-классы (5):
    │  ├─ TestPasswordHashing (4 теста)
    │  ├─ TestAccessTokenGeneration (3 теста)
    │  ├─ TestRefreshTokenGeneration (2 теста)
    │  ├─ TestTokenVerification (3 теста)
    │  └─ TestCookieSettings (1 тест)
    ├─ Всего тестов: 13
    ├─ Запуск:
    │  ├─ pytest tests/unit/test_auth_service.py
    │  ├─ pytest -m unit
    │  └─ pytest tests/unit/test_auth_service.py::TestPasswordHashing -v
    └─ Размер: ~200 строк

## 📊 ИНТЕГРАЦИОННЫЕ ТЕСТЫ

13. ✅ tests/integration/test_auth_endpoints.py
    ├─ Путь: c:\Fullstack_project\Study-cards-from-PDF\tests\integration\test_auth_endpoints.py
    ├─ Что: Integration тесты для /auth/* endpoints
    ├─ Тест-классы (4):
    │  ├─ TestAuthenticationEndpoints (8 тестов)
    │  ├─ TestTokenRefresh (2 теста)
    │  ├─ TestPasswordValidation (2 теста)
    │  └─ TestRoleBasedAccess (2 теста)
    ├─ Всего тестов: 14
    ├─ Запуск:
    │  ├─ pytest tests/integration/test_auth_endpoints.py
    │  ├─ pytest -m integration
    │  └─ pytest tests/integration/test_auth_endpoints.py::TestAuthenticationEndpoints::test_login_successful -v
    └─ Размер: ~250 строк

14. ✅ tests/integration/test_group_endpoints.py
    ├─ Путь: c:\Fullstack_project\Study-cards-from-PDF\tests\integration\test_group_endpoints.py
    ├─ Что: Integration тесты для /groups/* и /flashcards/* endpoints
    ├─ Тест-классы (3):
    │  ├─ TestGroupManagement (6 тестов)
    │  ├─ TestGroupFiltering (2 теста)
    │  └─ TestFlashcards (9 тестов)
    ├─ Всего тестов: 17
    ├─ Запуск:
    │  ├─ pytest tests/integration/test_group_endpoints.py
    │  ├─ pytest -m integration
    │  └─ pytest tests/integration/test_group_endpoints.py::TestGroupManagement -v
    └─ Размер: ~280 строк


# ==================== FRONTEND E2E ТЕСТЫ ====================

## 🎯 E2E CYPRESS

15. ✅ cypress/e2e/authentication.cy.js
    ├─ Путь: frontend/StudyCards App with Registration/cypress/e2e/authentication.cy.js
    ├─ Что: E2E тесты для регистрации, логина, выхода
    ├─ Тест-группы (3):
    │  ├─ Registration Flow (3 теста)
    │  ├─ Login Flow (4 теста)
    │  └─ Session Persistence (1 тест)
    ├─ Всего тестов: ~12
    ├─ Запуск:
    │  ├─ npm run test:e2e (интерактивно)
    │  ├─ npm run test:e2e:ci (headless)
    │  └─ npx cypress run --spec "cypress/e2e/authentication.cy.js"
    └─ Размер: ~120 строк

16. ✅ cypress/e2e/quiz-workflow.cy.js
    ├─ Путь: frontend/StudyCards App with Registration/cypress/e2e/quiz-workflow.cy.js
    ├─ Что: E2E тесты для основного workflow (PDF -> Quiz -> Results)
    ├─ Тест-группы (3):
    │  ├─ Quiz Workflow (5 тестов)
    │  ├─ Error Handling (2 теста)
    │  └─ History Page (3 теста)
    ├─ Всего тестов: ~15
    ├─ Запуск:
    │  ├─ npm run test:e2e
    │  └─ npm run test:e2e:ci
    └─ Размер: ~200 строк


# ==================== КАКОЙ ФАЙЛ ДЛЯ КАКИХ ЦЕЛЕЙ ====================

## ❓ Я хочу...

### 🚀 Быстро запустить тесты
1. Прочитать: TESTING_QUICK_START.md
2. Запустить: pytest && npm run test:e2e

### 📚 Понять как работает тестирование
1. Прочитать: TESTING_COMPREHENSIVE_GUIDE.md
2. Посмотреть примеры: tests/unit/test_auth_service.py
3. Запустить: pytest -v

### 🔍 Проверить что покрыто тестами
1. Посмотреть: TESTING_STATUS.md (раздел "ПОКРЫТИЕ БИЗНЕС-СЦЕНАРИЕВ")
2. Запустить: pytest --cov=app

### 💻 Написать новый тест
1. Изучить: TESTING_COMPREHENSIVE_GUIDE.md (раздел "BEST PRACTICES")
2. Копировать структуру из: tests/unit/test_auth_service.py или tests/integration/test_auth_endpoints.py
3. Использовать fixtures из: tests/conftest.py

### 🧪 Написать фронтенд тест
1. Изучить: FRONTEND_TESTS_EXAMPLES.md
2. Структура из: cypress/e2e/authentication.cy.js

### 📊 Проверить coverage
1. Запустить: pytest --cov=app --cov-report=html
2. Открыть: htmlcov/index.html

### 🐛 Найти баг в тесте
1. Прочитать: TESTING_COMPREHENSIVE_GUIDE.md (раздел "ОТЛАДКА")
2. Запустить: pytest tests/unit/test_auth_service.py::TestPasswordHashing -v -s --pdb

### 🚚 Добавить CI/CD
1. Посмотреть: TESTING_IMPLEMENTATION_SUMMARY.md (раздел "CI/CD PIPELINE")
2. Скопировать: .github/workflows/tests.yml

### 📈 Мониторить метрики
1. Смотреть: TESTING_STATUS.md (раздел "МЕТРИКИ")
2. Запустить: pytest --cov=app --cov-report=term-missing


# ==================== СТАТИСТИКА ФАЙЛОВ ====================

Всего создано:
- 📖 Документация: 6 файлов (~2000 строк)
- ⚙️ Конфиги: 4 файла (~150 строк)
- 🧪 Backend тесты: 3 файла (~450 строк, 31 тест)
- 🎯 Frontend тесты: 2 файла (~300 строк, 27 тестов)

Итого: 15 файлов, ~2900 строк кода


# ==================== БЫСТРЫЙ РЕФЕР ====================

Команды которые нужно помнить:

# Backend
pytest                         # Все тесты
pytest -v                      # С verbose
pytest -m unit                 # Только unit
pytest -m integration          # Только integration
pytest --cov=app              # С coverage
pytest -x                      # Стоп на первой ошибке
pytest --lf                    # Последние failed

# Frontend
npm test                        # Unit тесты
npm run test:ui               # Unit с UI
npm run test:coverage         # Unit + coverage
npm run test:e2e              # E2E (interactive)
npm run test:e2e:ci           # E2E (headless)

# Комбинированные
pytest && npm run test:e2e    # Все тесты (backend + E2E)


# ==================== ДИАГРАММА СВЯЗЕЙ ====================

TESTING_QUICK_START.md
    ↓
    └─> TESTING_COMPREHENSIVE_GUIDE.md
        ├─> TESTING_STATUS.md
        ├─> tests/conftest.py
        ├─> tests/unit/test_auth_service.py
        ├─> tests/integration/test_auth_endpoints.py
        └─> tests/integration/test_group_endpoints.py

FRONTEND_TESTS_EXAMPLES.md
    ↓
    └─> FRONTEND_TEST_SETUP.md
        ├─> vitest.config.js
        ├─> cypress.config.js
        ├─> cypress/e2e/authentication.cy.js
        └─> cypress/e2e/quiz-workflow.cy.js

TESTING_IMPLEMENTATION_SUMMARY.md
    └─> [Точка входа для понимания всего проекта]
