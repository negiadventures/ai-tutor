from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from app.file_utils import process_file
from app.llm_utils import generate_quiz
from app.crud import save_document_and_chapters
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from app.db import get_db
from fastapi import Depends
from sqlalchemy.orm import Session

from app.models import Document, Chapter

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Invalid file type")

    document_data = await process_file(file, db)

    if document_data["already_exists"]:
        # return {"status": "exists", "document_id": document_data["document_id"]}
        return {
            "status": "existing",
            "book": document_data["title"],
            "document_id": document_data["document_id"],
            "chapters": document_data["chapters"],
        }

    doc_id = save_document_and_chapters(db, document_data)

    return {
        "status": "processed",
        "book": document_data["title"],
        "document_id": doc_id,
        "chapters": document_data["chapters"],
    }


@app.post("/generate-quiz/")
async def generate_quiz_by_book_and_chapter(
        book: str = Query(...),
        chapter_number: int = Query(...),
        db: Session = Depends(get_db)
):
    document = db.query(Document).filter(Document.title == book).first()
    if not document:
        raise HTTPException(404, detail="Book not found")

    chapters = db.query(Chapter).filter(Chapter.document_id == document.id).all()
    if chapter_number > len(chapters):
        raise HTTPException(404, detail="Chapter not found")

    chapter = chapters[chapter_number - 1]  # 0-indexed
    return generate_quiz(chapter.id, db)
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)