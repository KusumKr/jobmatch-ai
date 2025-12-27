# JobMatch AI Service

FastAPI microservice for AI-powered resume analysis, job matching, and salary prediction.

## Features

- ✅ **Resume Parsing**: Extract text from PDF and DOCX files
- ✅ **Skill Extraction**: NLP-based skill detection using spaCy and keyword matching
- ✅ **Embedding Generation**: Generate semantic embeddings using sentence-transformers
- ✅ **Job Matching**: Calculate match scores using cosine similarity
- ✅ **Salary Prediction**: Predict salary ranges based on role, experience, skills, and location
- ✅ **Resume Analysis**: Compare resumes with job descriptions and provide suggestions
- ✅ **Chat Assistant**: OpenAI-powered chatbot for career advice

## Setup

### Prerequisites

- Python 3.8+
- pip

### Installation

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

2. **Download spaCy language model:**

```bash
python -m spacy download en_core_web_sm
```

3. **Set environment variables (optional):**

```bash
export OPENAI_API_KEY=your_api_key_here  # For chatbot features
export AI_SERVICE_URL=http://127.0.0.1:8000  # Default
```

4. **Run the service:**

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The service will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /health` - Service health and model status

### Resume Analysis
- `POST /resume/analyze` - Parse resume and extract skills, experience, and embedding
- `POST /resume/compare` - Compare resume with job description

### Matching
- `POST /match/calculate` - Calculate match score between job and candidate

### Salary Prediction
- `POST /salary/predict` - Predict salary range

### Assistant
- `POST /assistant/chat` - Chat with AI assistant

## Model Loading

Models are loaded lazily on first use:
- **Embedding Model**: `all-MiniLM-L6-v2` (384 dimensions, ~80MB)
- **NLP Model**: `en_core_web_sm` (spaCy English model)

First request may be slower as models are downloaded/loaded.

## Development

The service uses FastAPI with automatic API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Notes

- Resume parsing supports PDF (via PyMuPDF) and DOCX (via docx2txt/python-docx)
- Embeddings use sentence-transformers for semantic similarity
- Skill extraction combines keyword matching and NLP entity recognition
- Salary prediction uses heuristic model (can be replaced with trained ML model)
- Chat assistant requires OpenAI API key for full functionality

