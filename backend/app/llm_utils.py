import os
from openai import OpenAI
from app.crud import get_chapter_by_id, save_questions_for_chapter
import json

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_quiz(chapter_id: int, db):


    chapter = get_chapter_by_id(db, chapter_id)
    if not chapter:
        return {"error": "Chapter not found"}

    prompt = f"""
You're an expert tutor. Generate a JSON list of questions based on this chapter. Return in this format:

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
    "answer": "Encapsulation is..."
  }},
  ...
]

Chapter content:
{chapter.content[:3500]}
"""
    prompt += chapter.content[:3500]  # truncate to avoid token overflow

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    try:
        # print(response)
        questions_text = response.choices[0].message.content
        questions = json.loads(questions_text)
        save_questions_for_chapter(db, chapter_id, questions)
        return {"chapter_id": chapter_id, "questions": questions}
    except Exception as e:
        return {"error": f"Failed to parse LLM response: {str(e)}"}



# def ai_split_into_chapters(text: str):
#     prompt = f"""
# You're an intelligent document analyzer. Your task is to split a textbook or study material into well-defined chapters or units. Each chapter should have:
# - A title
# - Its full content
# - A section type: one of Chapter, Unit, or Lesson
#
# Example output:
# [
#   {{
#     "title": "Chapter 1: Introduction to Biology",
#     "section_type": "Chapter",
#     "content": "Full text for this chapter..."
#   }},
#   ...
# ]
#
# Now split this document:
#
# {text[:12000]}  # limit input to avoid token overflow
# """
#
#     response = client.chat.completions.create(
#         model="gpt-4-0613",
#         messages=[{"role": "user", "content": prompt}],
#         temperature=0.3
#     )
#
#     try:
#         structured = eval(response.choices[0].message.content)
#         return structured
#     except Exception as e:
#         return {"error": f"Failed to parse AI response: {str(e)}"}