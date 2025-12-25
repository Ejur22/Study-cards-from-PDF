# smartcards
Команды запуска:
uvicorn app.main:app --reload
npm run dev


1️⃣ Запуск локальной LLM (Ollama)
1.1 Проверка, что Ollama установлен

В терминале:

ollama --version


Если версия выводится — отлично.

1.2 Проверка, что модель скачана
ollama list


Ты должен увидеть, например:

mistral


Если нет — скачай:

ollama pull mistral

1.3 Запуск Ollama

⚠️ Важно: Ollama должен быть ЗАПУЩЕН постоянно

ollama serve


По умолчанию:

http://localhost:11434

1.4 Проверка, что LLM реально отвечает
curl http://localhost:11434/api/generate \
  -d '{
    "model": "mistral",
    "prompt": "Привет",
    "stream": false
  }'


Если получаешь ответ — LLM работает ✅

❗ ВАЖНО ПРО URL

В твоём коде:

LLM_URL = "http://ollama:11434/api/generate"

ЕСЛИ ты НЕ используешь Docker

➡️ Нужно изменить на:

LLM_URL = "http://localhost:11434/api/generate"


Иначе backend не найдёт Ollama.

2️⃣ Запуск Backend (FastAPI)
2.1 Виртуальное окружение
python -m venv venv
source venv/bin/activate   # Linux / macOS
venv\Scripts\activate      # Windows

2.2 Установка зависимостей
pip install -r requirements.txt


Убедись, что есть:

fastapi

uvicorn

sqlalchemy

asyncpg / aiosqlite

python-jose

passlib[bcrypt]

httpx

2.3 Проверка .env

Убедись, что есть:

DATABASE_URL=sqlite+aiosqlite:///./test.db
SECRET_KEY=supersecret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60


(для начала SQLite — идеально)

2.4 Запуск backend
uvicorn app.main:app --reload


Открой:
👉 http://localhost:8000/docs

Если Swagger открылся — backend жив ✅

3️⃣ Проверка backend БЕЗ frontend (ОЧЕНЬ ВАЖНО)
3.1 Регистрация пользователя

Swagger → POST /auth/register

{
  "email": "test@test.com",
  "password": "123456",
  "full_name": "Test User"
}


Ожидаешь: 200 OK

3.2 Логин

POST /auth/login

⚠️ Форма, не JSON:

username: test@test.com

password: 123456

Ответ:

{
  "access_token": "...",
  "token_type": "bearer"
}


👉 СКОПИРУЙ access_token

3.3 Авторизация в Swagger

Нажми Authorize
Вставь:

Bearer <TOKEN>

3.4 Проверка загрузки PDF

POST /groups/upload

type: file

выбери любой PDF

Если всё работает:

{
  "group_id": "...",
  "filename": "...",
  "message": "File processed successfully"
}


❗ Если тут зависает — проблема в LLM.

3.5 Проверка flashcards

GET /flashcards/group/{group_id}

Ты должен увидеть массив вопросов с options и correct_index.

4️⃣ Проверка записи данных в БД
4.1 Если SQLite

Файл:

test.db


Открыть можно:

DB Browser for SQLite

TablePlus

DBeaver

Таблицы:

users

groups

flashcards

Проверь:

group появился

flashcards связаны с group_id

4.2 Быстрый SQL чек
SELECT * FROM flashcards;
SELECT * FROM groups;

5️⃣ Запуск Frontend (React)
5.1 Установка зависимостей
cd frontend
npm install

5.2 .env
VITE_API_BASE=http://localhost:8000

5.3 Запуск
npm run dev


Обычно:
👉 http://localhost:5173

6️⃣ Полный сценарий теста (End-to-End)

Открываешь frontend

Регистрируешься

Логинишься

Загружаешь PDF

Backend:

сохраняет group

запускает LLM

сохраняет flashcards

Frontend:

получает вопросы

показывает Quiz

Проходишь тест

Смотришь историю