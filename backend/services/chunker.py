import uuid
from PyPDF2 import PdfReader

def chunk_pdf(path, max_words=500, journal="unknown", publish_year=0):
    reader = PdfReader(path)
    chunks = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        words = text.split()
        for start in range(0, len(words), max_words):
            chunk_words = words[start:start+max_words]
            chunk_text = " ".join(chunk_words)
            if not chunk_text.strip():
                continue
            chunks.append({
                "id": str(uuid.uuid4()),
                "source_doc_id": path.split("/")[-1],
                "section_heading": f"page_{i+1}",
                "journal": journal,
                "publish_year": publish_year,
                "attributes": [],
                "usage_count": 0,
                "text": chunk_text
            })
    return chunks
