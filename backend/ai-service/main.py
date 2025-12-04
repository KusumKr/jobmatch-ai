from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional

# In a real deployment, you would initialize models here:
# - sentence-transformers for embeddings
# - trained regression model for salary prediction
# - OpenAI / Llama client for chat + resume suggestions

app = FastAPI(title="JobMatch AI Service", version="1.0.0")


class ResumeAnalyzeRequest(BaseModel):
    # Text-based input (used by some endpoints)
    resumeText: Optional[str] = None
    jobDescription: Optional[str] = None

    # File-based input (used by /api/candidate/upload-resume)
    fileBase64: Optional[str] = None
    fileName: Optional[str] = None


class SalaryPredictRequest(BaseModel):
    role: str
    experience: float
    skills: List[str]
    location: str


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str


class AssistantChatRequest(BaseModel):
    messages: List[ChatMessage]
    userRole: str


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai-service"}


@app.post("/resume/analyze")
async def analyze_resume(body: ResumeAnalyzeRequest):
    """
    Stub implementation that supports both text and file-based inputs.

    The Node backend's /api/candidate/upload-resume route expects the
    following response fields:
      - text: str
      - skills: List[str]
      - experienceYears: float
      - embedding: List[float]
    """

    # In a real implementation, you would:
    # - decode fileBase64 (if provided)
    # - extract text from PDF/DOCX
    # - run NLP models to detect skills and experience
    # - generate an embedding with sentence-transformers

    # For now we just return a deterministic, dummy payload.
    dummy_text = body.resumeText or "Parsed resume text for file: {}".format(
        body.fileName or "unknown"
    )
    dummy_skills = ["React", "TypeScript", "Node.js"]
    dummy_experience = 5.0
    dummy_embedding = [0.1, 0.2, 0.3, 0.4]

    return {
        "text": dummy_text,
        "skills": dummy_skills,
        "experienceYears": dummy_experience,
        "embedding": dummy_embedding,
    }


@app.post("/salary/predict")
async def predict_salary(body: SalaryPredictRequest):
    # TODO: load and use a trained regression model
    base = 60000 + body.experience * 4000
    return {
        "currency": "USD",
        "min": int(base * 0.9),
        "max": int(base * 1.2),
        "confidence": 0.76,
    }


@app.post("/assistant/chat")
async def assistant_chat(body: AssistantChatRequest):
    # TODO: call OpenAI / Llama with a carefully crafted system prompt
    last_user_message = next((m.content for m in reversed(body.messages) if m.role == "user"), "")
    reply = f"Thanks for your question about: '{last_user_message[:80]}...'. In production, this response would come from an LLM."
    return {"reply": reply}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


