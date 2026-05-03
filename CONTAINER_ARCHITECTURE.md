# Containerization Architecture for Study Cards from PDF

## 1. Сервисы приложения

- **frontend**
  - React-приложение в `frontend/StudyCards App with Registration`
  - Сборка выполняется в Node.js
  - Статические файлы обслуживаются Nginx
- **backend**
  - FastAPI-приложение на Python
  - Выполняет бизнес-логику, аутентификацию, работу с базой и загрузку PDF
- **db**
  - PostgreSQL 16
  - Хранит пользователей, группы, карточки и токены
- **minio**
  - Локальный S3-совместимый объектный сторедж
  - Используется для сохранения загруженных PDF-файлов
- **reverse-proxy**
  - Nginx как внешний шлюз
  - Проксирует запросы `/api/` к backend и остальные запросы к frontend

## 2. Сетевая схема

Все сервисы работают в единой Docker-сети `studycards_network`.

- `reverse-proxy` доступен извне на `http://localhost`
- `reverse-proxy` направляет запросы:
  - `/api/` → `backend:8000`
  - `/` → `frontend:80`
- `backend` обращается к `db` и `minio` по DNS-сервисам:
  - `db:5432`
  - `minio:9000`

## 3. Образы и тома

- **Образы**
  - backend собирается из `dockerfile`
  - frontend собирается из `frontend/StudyCards App with Registration/Dockerfile`
- **Тома**
  - `postgres_data` для PostgreSQL
  - `minio_data` для хранения объектов MinIO

## 4. Конфигурация через переменные окружения

- `.env.example` содержит шаблон переменных
- `.env` должен храниться только локально и не попадать в репозиторий
- backend и сервисы используют `env_file: .env`

## 5. Запуск и проверка

- `docker compose up -d --build`
- `docker compose ps`
- `docker compose logs -f backend`
- `curl -f http://localhost/`

## 6. CI/CD

- GitHub Actions выполняет:
  - установку зависимостей Python и Node
  - запуск `pytest`
  - сборку фронтенда `npm run build`
  - сборку Docker-образов
- Автоматическое деплой-окружение можно подключить через SSH-секреты `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`.
