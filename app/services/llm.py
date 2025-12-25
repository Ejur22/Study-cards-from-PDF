import json
import re

import httpx

LLM_URL = "http://localhost:11434/api/generate"
MODEL = "mistral" #""phi3


async def generate_flashcards(text: str, retries=2):
    for attempt in range(retries + 1):
        try:
            return await call_llm_once(text)
        except Exception as e:
            print(f"LLM FAILED attempt {attempt+1}: {e}")
            if attempt == retries:
                return []


async def call_llm_once(text: str):
    # prompt = f"""
    # Верни JSON массив вопросов.

    # Формат:
    # [
    # {{
    #     "question": "Вопрос",
    #     "options": ["A", "B", "C", "D"],
    #     "correct_index": 0
    # }}
    # ]

    # Правила:
    # - ТОЛЬКО JSON
    # - options всегда 4
    # - correct_index от 0 до 3
    # - язык русский
    # - если не получается — []

    # Текст:
    # {text}
    # """

    prompt = f"""
    Тебе дан текст. Создай для него вопросы с ЧЕТЫРЬМЯ вариантами ответа,
    где ТОЛЬКО ОДИН вариант правильный.

    Ты — сервис, который возвращает ТОЛЬКО JSON массив.
    НЕ пиши комментарии, markdown, пояснения, ```.

    ФОРМАТ СТРОГИЙ:

    [
    {{
        "question": "строка",
        "options": ["вариант1", "вариант2", "вариант3", "вариант4"],
        "correct_index": 0
    }}
    ]
    
    ТРЕБОВАНИЯ:
    - options ВСЕГДА длины 4
    - correct_index — число от 0 до 3
    - ключи ТОЛЬКО: question, options, correct_index
    - язык ответа — ТОЛЬКО РУССКИЙ
    - если не можешь — верни []

    ТЕКСТ:
    {text}
    """
    async with httpx.AsyncClient(timeout=300) as client:
        response = await client.post(
            LLM_URL,
            json={
                "model": MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.1},
            },
        )

    data = response.json()
    print("RAW DATA FULL:", data)
    raw = data.get("response", "")

    print("LLM RAW:")
    print(raw)

    return safe_parse_json(raw)



def safe_parse_json(text: str):
    text = text.strip()
    print('strip: ', text)
    # Убираем только ``` и ```json, если они есть
    text = text.replace("```json", "").replace("```", "")
    print('replace: ', text)
    try:
        print ("json.loads(text): ", json.loads(text))
        return json.loads(text)
    except Exception as e:
        print("❌ JSON PARSE FAIL", e)
        print("RAW TEXT:", text)
        return []


"""
def safe_parse_json(text: str):
    text = text.strip()

    # убираем блоки ```
    text = re.sub(r"```.*?```", "", text, flags=re.DOTALL)

    # убираем ```json отдельные
    text = text.replace("```json", "").replace("```", "")

    # выбрасываем всё вне массива
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if not match:
        print("⚠️ NONE JSON → fallback []")
        return []

    json_text = match.group()

    # чистка мусора типа static_json:
    json_text = re.sub(r"static_json\s*:", "", json_text)

    try:
        return json.loads(json_text)
    except Exception as e:
        print("❌ JSON PARSE FAIL", e)
        print(json_text)
        return []
"""