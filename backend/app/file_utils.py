import hashlib
import docx
import os
from app.crud import document_exists_in_db
from sqlalchemy.orm import Session
import re
from app.vectorize import extract_chapter_contents_from_bytes, extract_chapter_headings_with_page_numbers_from_bytes

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def hash_content(content):
    if isinstance(content, str):
        content = content.encode("utf-8")
    return hashlib.sha256(content).hexdigest()

def extract_author(file_path: str) -> str:
    # Example placeholder logic
    return "Unknown Author"

def extract_title(data: str) -> str:
    """Extracts title from file name without extension."""
    return "Unknown Title"

def save_file(doc_hash, file_ext, content):
    filename = f"{doc_hash}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(content)


async def process_file(file, db: Session):
    content = await file.read()
    file_ext = file.filename.split(".")[-1].lower()

    if file_ext == "pdf":
        #TODO: old text = extract_text_from_pdf(content)
        # chapter_headings = extract_chapter_headings_with_page_numbers_from_bytes(content)
        pass

    elif file_ext == "docx":
        text = extract_text_from_docx(content)
    else:
        raise ValueError("Unsupported file type")

    chapter_headings = extract_chapter_headings_with_page_numbers_from_bytes(content)

    chapters = extract_chapter_contents_from_bytes(content, chapter_headings)

    # chapters = split_into_chapters(text)
    # chapters = ai_split_into_chapters(text)
    print(chapters)
    doc_title = extract_title("")
    doc_author = extract_author("")
    doc_hash = hash_content(content)
    # Check if doc already exists
    existing_doc = document_exists_in_db(db, doc_title, doc_author)
    if existing_doc:
        print({"already_exists": True, "document_id": existing_doc.id})
        return {
            "document_id": existing_doc.id,
            "already_exists": True,
            "document_hash": existing_doc.document_hash,
            "title": existing_doc.title,
            "author": existing_doc.author,
            "chapters": existing_doc.chapters,
        }


    for ch in chapters:
        ch["hash"] = hash_content(ch["content"])

    # Upload file to S3 (optional)
    # TODO: upload_to_s3(file.filename, content)

    save_file(doc_hash,file_ext, content)

    return {
        "already_exists": False,
        "document_hash": doc_hash,
        "title": doc_title,
        "author": doc_author,
        "chapters": chapters,
    }
# def extract_text_from_pdf(binary_data):
#     doc = fitz.open(stream=binary_data, filetype="pdf")
#     return "\n".join(page.get_text() for page in doc)

def extract_text_from_docx(binary_data):
    with open("/tmp/tmp.docx", "wb") as f:
        f.write(binary_data)
    doc = docx.Document("/tmp/tmp.docx")
    return "\n".join(p.text for p in doc.paragraphs)

def split_into_chapters(text: str):
    # Match section headers like Chapter, Lesson, Unit with numbers or roman numerals
    pattern = re.compile(r"\b(Chapter|Lesson|Unit)\s+([0-9IVXLC]+)\b", re.IGNORECASE)
    matches = list(pattern.finditer(text))

    chapters = []
    for i, match in enumerate(matches):
        start = match.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        section_type = match.group(1).capitalize()
        section_number = match.group(2)
        title = f"{section_type} {section_number}"
        content = text[start:end].strip()
        chapters.append({"title": title, "content": content, "section_type": section_type})

    return chapters