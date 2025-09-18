import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def generate_sql_from_prompt(prompt: str) -> str:
    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    system_prompt = """
You are an assistant that converts natural language into SQL queries.
Rules:
- The database has ONE table called `customers`.
- Columns: customer_id, name, gender, location.
- ONLY return a valid SQL query.
- Do NOT return explanations, markdown, or extra text.
- Do NOT use other column names (like city, age, email, phone_number).
- Example:
User: Show all male customers
Assistant: SELECT * FROM customers WHERE gender = 'Male';
"""

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()

    sql_query = response.json()["choices"][0]["message"]["content"].strip()
    return sql_query
