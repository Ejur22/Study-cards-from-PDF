"""
QUICK START - Запуск тестов за 2 минуты

Этот файл содержит пошаговые инструкции для быстрого запуска тестов.
"""

# ==================== QUICK START GUIDE ====================

## ШАГ 1: Установка зависимостей
# ====================================

# Backend зависимости (Python)
cd c:\Fullstack_project\Study-cards-from-PDF
pip install -r requirements-dev.txt

# Frontend зависимости (Node.js)
cd frontend/"StudyCards App with Registration"
npm install

## ШАГ 2: Запуск backend тестов
# ====================================

cd c:\Fullstack_project\Study-cards-from-PDF

# Все тесты (самый распространённый вариант)
pytest

# Результат:
# ✅ tests/unit/test_auth_service.py::TestPasswordHashing::test_hash_password_creates_different_hashes PASSED
# ✅ tests/unit/test_auth_service.py::TestPasswordHashing::test_verify_password_correct PASSED
# ... (всего ~25 тестов)
# ======================== 25 passed in 2.34s ========================

# Только unit тесты (быстрые)
pytest -m unit

# Только интеграционные тесты
pytest -m integration

# С отчётом покрытия кода
pytest --cov=app --cov-report=term-missing

# Результат:
# app/services/auth_service.py              85%
# app/core/security.py                      92%
# app/routers/auth.py                       88%
# ... (и так далее)
# ================= 89% coverage ================

## ШАГ 3: Запуск frontend unit тестов
# ====================================

cd frontend/"StudyCards App with Registration"

# Все unit тесты Vitest
npm test

# Результат:
# ✅ src/__tests__/unit/LoginForm.test.jsx (5 tests) 234ms
# ✅ src/__tests__/unit/AuthContext.test.jsx (3 tests) 156ms
# ... (всего ~20 тестов)
# ======================== 20 passed (0.5s) ========================

# С live UI панелью (очень удобно для разработки!)
npm run test:ui
# Откроется браузер с интерактивным UI где видны все тесты

## ШАГ 4: Запуск E2E тестов (необходимо чтобы backend был запущен)
# ====================================

# В первом терминале - запустить backend
cd c:\Fullstack_project\Study-cards-from-PDF
python app/main.py

# Во втором терминале - запустить E2E тесты
cd frontend/"StudyCards App with Registration"

# Интерактивный Cypress UI (удобно для разработки)
npm run test:e2e

# Или headless режим для CI
npm run test:e2e:ci

# Результат:
# ✅ cypress/e2e/authentication.cy.js (5 tests) 45s
# ✅ cypress/e2e/quiz-workflow.cy.js (4 tests) 60s
# ✅ cypress/e2e/error-handling.cy.js (2 tests) 20s
# ======================== 11 passed (2m 5s) ========================


# ==================== ПРИМЕРЫ ЧАСТО ИСПОЛЬЗУЕМЫХ КОМАНД ====================

## Быстрый check (35 секунд)
pytest -m unit --tb=short -q

## Full test suite (2 минуты)
pytest && npm run test:e2e:ci

## Continuous development (watch режим)
pytest-watch         # Terminal 1: Переозапускает при изменении файлов
npm test -- --watch  # Terminal 2: Unit тесты с watch

## Перед commit (убеждаемся что ничего не сломали)
pytest --lf          # Запуск последних failed тестов
npm test             # Unit тесты
# Если всё зелёно - делаем commit

## Перед pull request
pytest --cov=app --cov-report=term-missing  # Backend coverage
npm run test:coverage                       # Frontend coverage
npm run test:e2e:ci                         # E2E smoke tests

## Отладка конкретного теста
pytest tests/unit/test_auth_service.py::TestPasswordHashing::test_hash_password_creates_different_hashes -v -s

## Отладка E2E теста
npx cypress open
# Откроется интерактивный режим, кликаешь на нужный тест и видишь что происходит


# ==================== ОСНОВНЫЕ ОТЧЁТЫ ====================

## Test Report (текстовый вывод)
pytest -v --tb=short

## Coverage Report (HTML)
pytest --cov=app --cov-report=html
start htmlcov/index.html  # Windows
open htmlcov/index.html   # Mac

## Failed Tests Report
pytest --tb=long | tee test_report.txt

## Test Performance Report
pytest --durations=10
# Показывает 10 медленнейших тестов


# ==================== CI/CD ====================

## Локальное тестирование перед push
# Скрипт: test-all.sh

#!/bin/bash
echo "🧪 Running backend unit tests..."
pytest -m unit -q

echo "🧪 Running backend integration tests..."
pytest -m integration -q

echo "📊 Checking coverage..."
pytest --cov=app --cov-fail-under=70 -q

echo "🎨 Running frontend tests..."
cd frontend/"StudyCards App with Registration"
npm test -- --run

echo "✅ All tests passed!"

# Запуск:
bash test-all.sh


# ==================== TROUBLESHOOTING ====================

## Проблема: ImportError при запуске тестов
Решение: Убедитесь что в корне проекта есть pytest.ini и requirements-dev.txt установлены

## Проблема: E2E тесты падают с "Connection refused"
Решение: Убедитесь что backend запущен: python app/main.py

## Проблема: Тесты падают иногда (flaky tests)
Решение: Увеличьте timeout в тестах, используйте sleep/wait

## Проблема: Coverage не считается правильно
Решение: pytest --cov=app --cov-report=term-missing

## Проблема: Node modules не найдены
Решение: npm install в директории frontend/"StudyCards App with Registration"


# ==================== РЕЗУЛЬТАТЫ КОТОРЫЕ ДОЛЖНЫ БЫТЬ ====================

Если тесты настроены правильно, вы должны видеть:

✅ Backend:
   - ~25 unit тестов за < 2 сек
   - ~15 интеграционных тестов за < 5 сек
   - Покрытие ~85%+

✅ Frontend:
   - ~20 unit тестов за < 1 сек
   - Покрытие критичных компонентов ~70%+

✅ E2E:
   - ~11 сценариев за < 3 минут
   - Все основные workflow'ы покрыты


# ==================== NEXT STEPS ====================

После настройки базовых тестов:

1. ✅ Просмотрите TESTING_COMPREHENSIVE_GUIDE.md для деталей
2. ✅ Посмотрите примеры в FRONTEND_TESTS_EXAMPLES.md
3. ✅ Добавьте GitHub Actions workflow для автоматического тестирования
4. ✅ Настройте pre-commit hooks для запуска тестов перед commit

Полезные команды в package.json:
"test": "vitest"
"test:ui": "vitest --ui"
"test:coverage": "vitest --coverage"
"test:e2e": "cypress open"
"test:e2e:ci": "cypress run"
