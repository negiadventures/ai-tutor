import json
import logging
import os
import re

from openai import OpenAI
from app.crud import get_chapter_by_id, save_questions_for_chapter

logger = logging.getLogger(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def _parse_llm_json(text: str) -> list:
    """Parse JSON from LLM response, stripping markdown code fences if present."""
    # Strip ```json ... ``` or ``` ... ``` wrappers
    text = text.strip()
    match = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    if match:
        text = match.group(1).strip()
    return json.loads(text)


def generate_quiz(chapter_id: int, db):
    chapter = get_chapter_by_id(db, chapter_id)
    if not chapter:
        return {"error": "Chapter not found"}

    # Truncate to avoid token overflow; content is included once in the prompt
    content_snippet = chapter.content[:3500]

    prompt = f"""
You're an expert tutor. Generate a JSON list of 5 questions based on this chapter. Return ONLY valid JSON in this format:

[
  {{
    "type": "mcq",
    "question": "What does OOP stand for?",
    "options": ["Operating Object Programming", "Optional Object Programming", "Oriented Object Programming", "Object-Oriented Programming"],
    "answer": "Object-Oriented Programming"
  }},
  {{
    "type": "subjective",
    "question": "Explain the concept of encapsulation.",
    "answer": "Encapsulation is the bundling of data and methods that operate on that data within a single unit."
  }}
]

Chapter content:
{content_snippet}
"""

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )

    try:
        questions_text = response.choices[0].message.content
        questions = _parse_llm_json(questions_text)
        save_questions_for_chapter(db, chapter_id, questions)
        return {"chapter_id": chapter_id, "questions": questions}
    except Exception as e:
        logger.error("Failed to parse LLM response: %s", e)
        return {"error": f"Failed to parse LLM response: {str(e)}"}