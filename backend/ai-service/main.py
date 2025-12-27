from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
import base64
import io
import re
import os

# Resume parsing imports
try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

try:
    from docx import Document
    import docx2txt
except ImportError:
    Document = None
    docx2txt = None

# NLP and ML imports
try:
    from sentence_transformers import SentenceTransformer
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError:
    SentenceTransformer = None
    np = None
    cosine_similarity = None

try:
    import spacy
except ImportError:
    spacy = None

# Initialize models (lazy loading)
_embedding_model = None
_nlp_model = None

def get_embedding_model():
    """Lazy load sentence transformer model"""
    global _embedding_model
    if _embedding_model is None:
        try:
            # Using a lightweight model for faster inference
            _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            print(f"Warning: Could not load embedding model: {e}")
            _embedding_model = None
    return _embedding_model

def get_nlp_model():
    """Lazy load spaCy model"""
    global _nlp_model
    if _nlp_model is None:
        try:
            # Try to load English model, fallback to small if medium not available
            try:
                _nlp_model = spacy.load("en_core_web_sm")
            except OSError:
                # If model not found, try to download it
                print("Warning: spaCy model not found. Install with: python -m spacy download en_core_web_sm")
                _nlp_model = None
        except Exception as e:
            print(f"Warning: Could not load NLP model: {e}")
            _nlp_model = None
    return _nlp_model

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


class MatchRequest(BaseModel):
    jobEmbedding: List[float]
    candidateEmbedding: List[float]
    jobSkills: List[str]
    candidateSkills: List[str]


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF using PyMuPDF"""
    if fitz is None:
        raise ImportError("PyMuPDF (fitz) not installed. Install with: pip install pymupdf")
    
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        raise Exception(f"Error parsing PDF: {str(e)}")


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX"""
    if docx2txt is None:
        raise ImportError("docx2txt not installed. Install with: pip install docx2txt")
    
    try:
        # Use docx2txt for better text extraction
        text = docx2txt.process(io.BytesIO(file_bytes))
        return text
    except Exception as e:
        # Fallback to python-docx
        if Document is not None:
            try:
                doc = Document(io.BytesIO(file_bytes))
                text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
                return text
            except Exception as e2:
                raise Exception(f"Error parsing DOCX: {str(e2)}")
        raise Exception(f"Error parsing DOCX: {str(e)}")


def parse_resume_file(file_base64: str, file_name: str) -> str:
    """Parse resume file (PDF or DOCX) and extract text"""
    try:
        file_bytes = base64.b64decode(file_base64)
        file_ext = os.path.splitext(file_name.lower())[1]
        
        if file_ext == '.pdf':
            return extract_text_from_pdf(file_bytes)
        elif file_ext in ['.docx', '.doc']:
            return extract_text_from_docx(file_bytes)
        else:
            raise ValueError(f"Unsupported file type: {file_ext}. Supported: .pdf, .docx")
    except Exception as e:
        raise Exception(f"Failed to parse resume file: {str(e)}")


def extract_skills_from_text(text: str) -> List[str]:
    """Extract skills from resume text using NLP and keyword matching"""
    skills = []
    
    # Common technical skills keywords
    skill_keywords = {
        'programming': ['python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala', 'r', 'matlab'],
        'web': ['html', 'css', 'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'spring', 'asp.net', 'laravel'],
        'database': ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite', 'dynamodb', 'cassandra'],
        'cloud': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd', 'devops'],
        'data': ['pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn', 'pyspark', 'hadoop', 'kafka'],
        'tools': ['git', 'github', 'gitlab', 'jira', 'confluence', 'slack', 'agile', 'scrum'],
        'mobile': ['ios', 'android', 'react native', 'flutter', 'xamarin'],
        'design': ['figma', 'adobe', 'sketch', 'ui/ux', 'photoshop', 'illustrator']
    }
    
    text_lower = text.lower()
    
    # Extract using keyword matching
    for category, keywords in skill_keywords.items():
        for keyword in keywords:
            if keyword.lower() in text_lower:
                # Capitalize properly
                skill_name = keyword.title() if len(keyword) > 2 else keyword.upper()
                if skill_name not in skills:
                    skills.append(skill_name)
    
    # Use spaCy for entity recognition if available
    nlp = get_nlp_model()
    if nlp:
        try:
            doc = nlp(text)
            # Extract technical terms (nouns that might be skills)
            for token in doc:
                if token.pos_ in ['NOUN', 'PROPN'] and len(token.text) > 2:
                    # Check if it looks like a technology name
                    if token.text.isalnum() and token.text[0].isupper():
                        if token.text not in skills and len(token.text) < 30:
                            skills.append(token.text)
        except Exception as e:
            print(f"Error in spaCy processing: {e}")
    
    # Remove duplicates and return top skills
    unique_skills = list(dict.fromkeys(skills))  # Preserves order
    return unique_skills[:20]  # Return top 20 skills


def extract_experience_years(text: str) -> float:
    """Extract years of experience from resume text"""
    # Patterns to match experience
    patterns = [
        r'(\d+)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)',
        r'(?:experience|exp)[:\s]+(\d+)\+?\s*(?:years?|yrs?)',
        r'(\d+)\+?\s*(?:years?|yrs?)\s+(?:in|with)',
    ]
    
    text_lower = text.lower()
    years_found = []
    
    for pattern in patterns:
        matches = re.findall(pattern, text_lower, re.IGNORECASE)
        for match in matches:
            try:
                years = float(match)
                if 0 <= years <= 50:  # Reasonable range
                    years_found.append(years)
            except ValueError:
                continue
    
    # Also try to extract from job duration patterns
    duration_pattern = r'(\d{4})\s*[-–]\s*(\d{4}|present|current)'
    matches = re.findall(duration_pattern, text, re.IGNORECASE)
    if matches:
        # Calculate total years from job durations
        total_years = 0
        current_year = 2024
        for start, end in matches:
            try:
                start_year = int(start)
                if end.lower() in ['present', 'current']:
                    end_year = current_year
                else:
                    end_year = int(end)
                total_years += (end_year - start_year) / 12  # Convert months to years
            except ValueError:
                continue
        if total_years > 0:
            years_found.append(total_years)
    
    if years_found:
        return max(years_found)  # Return the highest found
    return 0.0


def generate_embedding(text: str) -> List[float]:
    """Generate embedding vector for text using sentence-transformers"""
    model = get_embedding_model()
    if model is None:
        # Fallback: return a dummy embedding of correct dimension (384 for all-MiniLM-L6-v2)
        return [0.0] * 384
    
    try:
        embedding = model.encode(text, convert_to_numpy=True)
        return embedding.tolist()
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return [0.0] * 384


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ai-service",
        "models_loaded": {
            "embedding": get_embedding_model() is not None,
            "nlp": get_nlp_model() is not None
        }
    }


@app.post("/resume/analyze")
async def analyze_resume(body: ResumeAnalyzeRequest):
    """
    Analyze resume and extract text, skills, experience, and embedding.
    
    Supports both file-based (base64) and text-based inputs.
    """
    try:
        # Extract text from file or use provided text
        if body.fileBase64 and body.fileName:
            text = parse_resume_file(body.fileBase64, body.fileName)
        elif body.resumeText:
            text = body.resumeText
        else:
            return {
                "error": "Either fileBase64/fileName or resumeText must be provided",
                "text": "",
                "skills": [],
                "experienceYears": 0.0,
                "embedding": [0.0] * 384,
            }
        
        # Extract skills and experience
        skills = extract_skills_from_text(text)
        experience_years = extract_experience_years(text)
        
        # Generate embedding
        embedding = generate_embedding(text)
        
        return {
            "text": text,
            "skills": skills,
            "experienceYears": experience_years,
            "embedding": embedding,
        }
    except Exception as e:
        print(f"Error in analyze_resume: {e}")
        return {
            "error": str(e),
            "text": body.resumeText or "",
            "skills": [],
            "experienceYears": 0.0,
            "embedding": [0.0] * 384,
        }


@app.post("/resume/compare")
async def compare_resume(body: ResumeAnalyzeRequest):
    """
    Compare resume with job description and return similarity score and suggestions.
    """
    if not body.resumeText or not body.jobDescription:
        return {
            "error": "resumeText and jobDescription are required",
            "score": 0,
            "similarity": 0.0,
            "resumeSkills": [],
            "jobSkills": [],
            "missingSkills": [],
            "suggestions": [],
        }
    
    try:
        # Generate embeddings
        resume_embedding = np.array(generate_embedding(body.resumeText))
        job_embedding = np.array(generate_embedding(body.jobDescription))
        
        # Calculate cosine similarity
        similarity = float(cosine_similarity([resume_embedding], [job_embedding])[0][0])
        score = int(similarity * 100)  # Convert to 0-100 scale
        
        # Extract skills from both
        resume_skills = extract_skills_from_text(body.resumeText)
        job_skills = extract_skills_from_text(body.jobDescription)
        
        # Find missing skills
        missing_skills = [s for s in job_skills if s.lower() not in [rs.lower() for rs in resume_skills]]
        
        # Generate suggestions
        suggestions = []
        if score < 70:
            suggestions.append("Consider highlighting more relevant skills from the job description")
        if missing_skills:
            suggestions.append(f"Consider adding experience with: {', '.join(missing_skills[:5])}")
        if len(resume_skills) < 5:
            suggestions.append("Add more technical skills to your resume")
        
        return {
            "score": score,
            "similarity": similarity,
            "resumeSkills": resume_skills,
            "jobSkills": job_skills,
            "missingSkills": missing_skills[:10],
            "suggestions": suggestions,
        }
    except Exception as e:
        print(f"Error in compare_resume: {e}")
        return {
            "error": str(e),
            "score": 0,
            "similarity": 0.0,
            "resumeSkills": [],
            "jobSkills": [],
            "missingSkills": [],
            "suggestions": [],
        }


@app.post("/match/calculate")
async def calculate_match(body: MatchRequest):
    """Calculate match score between job and candidate embeddings"""
    try:
        if np is None or cosine_similarity is None:
            return {
            "error": "NumPy/scikit-learn not available",
            "score": 0.0,
            "similarity": 0.0,
            "skillOverlap": 0.0,
            "matchingSkills": [],
        }
        
        job_emb = np.array(body.jobEmbedding)
        candidate_emb = np.array(body.candidateEmbedding)
        
        # Calculate cosine similarity
        similarity = float(cosine_similarity([job_emb], [candidate_emb])[0][0])
        
        # Calculate skill overlap
        job_skills_lower = [s.lower() for s in body.jobSkills]
        candidate_skills_lower = [s.lower() for s in body.candidateSkills]
        matching_skills = [s for s in candidate_skills_lower if s in job_skills_lower]
        skill_overlap = len(matching_skills) / max(len(job_skills_lower), 1)
        
        # Combined score (70% embedding similarity, 30% skill overlap)
        final_score = (similarity * 0.7) + (skill_overlap * 0.3)
        
        return {
            "score": float(final_score),
            "similarity": float(similarity),
            "skillOverlap": float(skill_overlap),
            "matchingSkills": matching_skills[:10],
        }
    except Exception as e:
        print(f"Error in calculate_match: {e}")
        return {"error": str(e)}, 500


@app.post("/salary/predict")
async def predict_salary(body: SalaryPredictRequest):
    """
    Predict salary based on role, experience, skills, and location.
    Uses an improved heuristic model (can be replaced with trained ML model).
    """
    try:
        # Base salary by role (simplified - in production, use trained model)
        role_multipliers = {
            'junior': 0.7,
            'entry': 0.7,
            'mid': 1.0,
            'senior': 1.4,
            'lead': 1.7,
            'principal': 2.0,
            'architect': 1.8,
            'manager': 1.6,
            'director': 2.2,
        }
        
        # Location multipliers (simplified)
        location_multipliers = {
            'san francisco': 1.4,
            'new york': 1.3,
            'seattle': 1.2,
            'boston': 1.2,
            'los angeles': 1.2,
            'chicago': 1.1,
            'austin': 1.1,
            'remote': 1.0,
        }
        
        # Skill premium (more skills = higher salary)
        skill_premium = min(len(body.skills) * 0.02, 0.2)  # Max 20% premium
        
        # Base salary calculation
        base_salary = 70000  # Base for mid-level
        
        # Apply role multiplier
        role_lower = body.role.lower()
        role_mult = 1.0
        for role_key, mult in role_multipliers.items():
            if role_key in role_lower:
                role_mult = mult
                break
        
        # Apply location multiplier
        location_lower = body.location.lower()
        loc_mult = 1.0
        for loc_key, mult in location_multipliers.items():
            if loc_key in location_lower:
                loc_mult = mult
                break
        
        # Experience factor (diminishing returns after 10 years)
        exp_factor = min(body.experience * 0.08, 0.8)  # Max 80% increase
        
        # Calculate salary
        salary = base_salary * role_mult * loc_mult * (1 + exp_factor) * (1 + skill_premium)
        
        # Add experience-based increase
        salary += body.experience * 3000
        
        # Confidence based on data quality
        confidence = 0.75
        if len(body.skills) > 5:
            confidence += 0.05
        if body.experience > 0:
            confidence += 0.05
        confidence = min(confidence, 0.95)
        
        return {
            "currency": "USD",
            "min": int(salary * 0.85),
            "max": int(salary * 1.15),
            "median": int(salary),
            "confidence": round(confidence, 2),
        }
    except Exception as e:
        print(f"Error in predict_salary: {e}")
        return {
            "currency": "USD",
            "min": 50000,
            "max": 100000,
            "median": 75000,
            "confidence": 0.5,
        }


@app.post("/assistant/chat")
async def assistant_chat(body: AssistantChatRequest):
    """Chat assistant using OpenAI API (if available)"""
    try:
        import openai
        
        # Check if OpenAI API key is available
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            # Fallback response
            last_user_message = next(
                (m.content for m in reversed(body.messages) if m.role == "user"),
                ""
            )
            return {
                "reply": f"I can help you with job matching questions. You asked: '{last_user_message[:100]}...'. To enable full AI responses, please set OPENAI_API_KEY environment variable."
            }
        
        # Build system prompt based on user role
        system_prompt = f"""You are a helpful career assistant for {body.userRole}s on JobMatch platform.
        Help users with:
        - Career advice and job search tips
        - Skill recommendations
        - Resume improvement suggestions
        - Salary negotiation tips
        Be concise and actionable."""
        
        # Prepare messages for OpenAI
        messages = [{"role": "system", "content": system_prompt}]
        for msg in body.messages[-5:]:  # Last 5 messages for context
            messages.append({"role": msg.role, "content": msg.content})
        
        # Call OpenAI API
        client = openai.OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=300,
            temperature=0.7,
        )
        
        return {"reply": response.choices[0].message.content}
    except ImportError:
        # OpenAI not available
        last_user_message = next(
            (m.content for m in reversed(body.messages) if m.role == "user"),
            ""
        )
        return {
            "reply": f"Thanks for your question. In production, this would be answered by an AI assistant. You asked: '{last_user_message[:80]}...'"
        }
    except Exception as e:
        print(f"Error in assistant_chat: {e}")
        return {
            "reply": f"I encountered an error processing your request. Please try again later."
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
