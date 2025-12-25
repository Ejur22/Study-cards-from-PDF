import httpx, asyncio

async def test():
    async with httpx.AsyncClient() as c:
        r = await c.post(
            "http://localhost:11434/api/generate",
            json={"model": "mistral", "prompt": "Привет", "stream": False},
        )
        print("STATUS:", r.status_code)
        print("HEADERS:", r.headers)
        print("TEXT:", repr(r.text))

asyncio.run(test())
