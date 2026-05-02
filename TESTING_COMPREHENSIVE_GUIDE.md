"""
COMPREHENSIVE TESTING GUIDE - Study Cards MVP

Этот документ содержит полное руководство по запуску и организации тестов
для backend и frontend приложения Study Cards.
"""

# ==================== СТРУКТУРА ТЕСТОВОГО ПРОЕКТА ====================

## Backend Tests (Python/pytest)
tests/
├── conftest.py                          # Глобальные fixtures
├── unit/
│   ├── __init__.py
│   ├── test_auth_service.py             # Тесты для AuthService
│   ├── test_security.py                 # Тесты для hash_password, verify_password
│   ├── test_models.py                   # Тесты для ORM моделей
│   └── test_schemas.py                  # Тесты для Pydantic schemas
├── integration/
│   ├── __init__.py
│   ├── test_auth_endpoints.py           # Тесты для /auth/* endpoints
│   ├── test_group_endpoints.py          # Тесты для /groups/* endpoints
│   ├── test_flashcard_endpoints.py      # Тесты для /flashcards/* endpoints
│   └── test_upload_endpoints.py         # Тесты для /upload/* endpoints
└── e2e/                                 # (Будут использоваться Cypress из frontend)

## Frontend Tests (React/Vitest/Cypress)
frontend/StudyCards App with Registration/
├── src/__tests__/
│   ├── setup.js                         # Setup файл для vitest
│   ├── unit/
│   │   ├── AuthContext.test.jsx         # Тесты для auth контекста
│   │   ├── utils/
│   │   │   └── validators.test.js       # Тесты для функций валидации
│   │   └── components/
│   │       ├── LoginForm.test.jsx       # Unit тесты компонента
│   │       ├── HistoryPage.test.jsx
│   │       └── MainScreen.test.jsx
│   ├── integration/
│   │   ├── AuthFlow.test.jsx            # Интеграционные сценарии
│   │   ├── QuizFlow.test.jsx
│   │   └── FileUpload.test.jsx
│   └── mocks/
│       ├── handlers.js                  # MSW mock handlers
│       └── server.js                    # MSW server
├── cypress/
│   ├── e2e/
│   │   ├── authentication.cy.js         # E2E тесты логина/регистрации
│   │   ├── quiz-workflow.cy.js          # E2E тесты главного workflow
│   │   └── error-handling.cy.js         # E2E тесты обработки ошибок
│   ├── fixtures/
│   │   ├── sample.pdf                   # Тестовый PDF файл
│   │   ├── invalid.txt                  # Файл для тестирования ошибок
│   │   └── auth.json                    # Данные аутентификации
│   └── support/
│       └── commands.js                  # Пользовательские Cypress команды
├── vitest.config.js                     # Конфиг Vitest
└── cypress.config.js                    # Конфиг Cypress

pytest.ini                                # Конфиг pytest для backend
requirements-dev.txt                      # Dev зависимости


# ==================== УСТАНОВКА ЗАВИСИМОСТЕЙ ====================

## Backend (Python)
cd c:\Fullstack_project\Study-cards-from-PDF
pip install -r requirements-dev.txt

# Или вручную:
pip install pytest pytest-asyncio pytest-cov pytest-xdist
pip install httpx factory-boy faker freezegun
pip install pytest-mock

## Frontend (Node.js)
cd frontend/"StudyCards App with Registration"
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  vitest \
  @vitest/ui \
  jsdom \
  cypress \
  msw


# ==================== ЗАПУСК ТЕСТОВ ====================

# === BACKEND TESTS ===

# Все тесты
pytest

# Unit тесты только
pytest -m unit

# Integration тесты только
pytest -m integration

# Конкретный файл
pytest tests/unit/test_auth_service.py

# Конкретный тест
pytest tests/unit/test_auth_service.py::TestPasswordHashing::test_hash_password_creates_different_hashes

# С verbose выводом
pytest -v

# С покрытием кода
pytest --cov=app --cov-report=html

# Параллельное выполнение (быстрее)
pytest -n auto

# Watch режим (перезапуск на изменение файлов)
pytest-watch

# Только failed тесты
pytest --lf

# Стоп на первой ошибке
pytest -x

# === FRONTEND TESTS ===

# Unit тесты (Vitest)
npm test

# Unit тесты с UI
npm run test:ui

# Unit тесты + coverage
npm run test:coverage

# Unit тесты в watch режиме
npm test -- --watch

# E2E тесты интерактивно (Cypress)
npm run test:e2e

# E2E тесты в headless режиме (CI)
npm run test:e2e:ci

# Запуск конкретного E2E файла
npx cypress run --spec "cypress/e2e/authentication.cy.js"


# ==================== ТЕСТИРОВАНИЕ С DOCKER ====================

# Запуск backend в Docker для тестирования
docker-compose -f docker-compose.test.yml up --build

# Запуск тестов в контейнере
docker exec study-cards-api pytest -v

# Комбинированное тестирование (backend + frontend)
docker-compose -f docker-compose.test.yml up --build
npm run test:e2e:ci


# ==================== CI/CD ИНТЕГРАЦИЯ (GitHub Actions) ====================

# Файл: .github/workflows/tests.yml

name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          python -m pip install -r requirements-dev.txt
      
      - name: Run backend tests
        run: pytest --cov=app --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd frontend/"StudyCards App with Registration" && npm install
      
      - name: Run unit tests
        run: cd frontend/"StudyCards App with Registration" && npm test
      
      - name: Start backend
        run: python app/main.py &
      
      - name: Wait for backend
        run: sleep 5
      
      - name: Run E2E tests
        run: cd frontend/"StudyCards App with Registration" && npm run test:e2e:ci


# ==================== ОРГАНИЗАЦИЯ ТЕСТОВЫХ ДАННЫХ ====================

## fixtures (conftest.py)
Глобальные fixtures для всех тестов:

@pytest.fixture
async def test_db():
    """In-memory SQLite база для тестов"""
    return DatabaseSession()

@pytest.fixture
async def test_user(test_db):
    """Пользователь для тестирования"""
    user = User(email="test@test.com", ...)
    async with test_db() as session:
        session.add(user)
        await session.commit()
    return user

@pytest.fixture
async def authenticated_client(client, test_user):
    """HTTP клиент с установленным токеном"""
    token = AuthService.create_access_token({"sub": test_user.email})
    client.cookies.set("access_token", token)
    return client

## Factory pattern (для создания тестовых данных)
Используем factory-boy для создания вариаций данных:

class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = User
        sqlalchemy_session = session

    email = factory.Faker('email')
    password = 'password123'
    full_name = factory.Faker('name')
    role = 'user'

# Создание тестовых данных
user1 = UserFactory.create()
user2 = UserFactory.create(role='admin')
users = UserFactory.create_batch(10)


# ==================== ПОКРЫТИЕ КОДА (Coverage) ====================

# Backend coverage
pytest --cov=app --cov-report=html --cov-report=term-missing

# Открыть HTML отчет
start htmlcov/index.html

# Frontend coverage
npm run test:coverage

# Минимальные требования
# Backend: 70% покрытие
# Frontend: 60% покрытие критических компонентов


# ==================== BEST PRACTICES ====================

## 1. Именование тестов
✅ test_login_with_valid_credentials()
✅ test_password_hashing_creates_different_hashes()
❌ test_works()
❌ test_123()

## 2. Структура теста (AAA паттерн)
def test_example():
    # ARRANGE - подготовка данных
    user = UserFactory.create()
    
    # ACT - выполнение действия
    response = login(user.email, "password")
    
    # ASSERT - проверка результата
    assert response.status_code == 200

## 3. Один assertion за тест (когда возможно)
✅ def test_login_returns_200():
     assert response.status_code == 200

❌ def test_login():
     assert response.status_code == 200
     assert response.json()["access_token"]
     assert response.cookies["refresh_token"]

## 4. Используйте marks для организации
@pytest.mark.unit
@pytest.mark.auth
def test_login():
    ...

# Запуск:
pytest -m "auth and unit"

## 5. Изолируйте тесты
✅ Каждый тест использует свежую БД
✅ Мокируйте внешние зависимости (API)
✅ Не пишите тесты которые зависят друг от друга

❌ Глобальное состояние между тестами
❌ Реальные HTTP запросы к внешним сервисам
❌ test_2 зависит от test_1

## 6. Тестируйте edge cases
✅ test_password_empty()
✅ test_password_very_long()
✅ test_email_with_special_characters()
✅ test_concurrent_login_attempts()

## 7. Используйте fixtures для DRY (Don't Repeat Yourself)
✅ @pytest.fixture
   def authenticated_user(test_db):
       return create_and_auth_user()

❌ def test_feature():
     user = create_and_auth_user()
     ...
   def test_another_feature():
     user = create_and_auth_user()
     ...


# ==================== ОТЛАДКА ТЕСТОВ ====================

# Запуск с выводом print statements
pytest -s

# Запуск с дебагером
pytest --pdb

# Запуск с трассировкой
pytest --trace

# Пропуск тестов
@pytest.mark.skip
def test_not_ready():
    pass

# Условный пропуск
@pytest.mark.skipif(os.name == 'nt', reason="Не работает на Windows")
def test_unix_only():
    pass

# Ожидаемая ошибка
@pytest.mark.xfail
def test_not_implemented():
    assert False


# ==================== МЕТРИКИ КАЧЕСТВА ====================

Цели тестирования MVP:

📊 Coverage
- Backend: 70% (все критичные части)
- Frontend: 60% (компоненты, контексты)
- Focus: Unit (40%), Integration (30%), E2E (30%)

⏱️ Test Speed
- Unit: < 100 ms
- Integration: < 1 s
- E2E: < 30 s per test

🎯 Quality Gates
- ✅ Все unit тесты проходят
- ✅ Все integration тесты проходят
- ✅ Все E2E smoke tests проходят
- ✅ Покрытие >= 70%
- ✅ Нет flaky тестов (случайные падения)

📈 Regression Testing
- Перед каждым деплоем
- Полный набор тестов должен пройти
- Никаких пропусков или xfails в master


# ==================== ПОЛЕЗНЫЕ КОМАНДЫ ====================

# Найти медленные тесты
pytest --durations=10

# Запустить последние failed тесты
pytest --lf

# Пересчитать параметры для fixture
pytest --fixtures

# Показать доступные markers
pytest --markers

# Проверить синтаксис тестов
pytest --collect-only

# Сравнение двух test runs
pytest --tb=short

# Разные форматы вывода
pytest -v                  # Verbose
pytest --tb=short          # Короткий traceback
pytest -q                  # Очень кратко
