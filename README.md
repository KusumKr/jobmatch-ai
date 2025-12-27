# 🚀 JobMatch AI - AI-Powered Job Matching Platform

<div align="center">

**Intelligent job matching powered by AI, NLP, and machine learning**

</div>

## 📋 Overview

JobMatch AI is a full-stack platform that intelligently connects job seekers with recruiters using:
- 🤖 **AI Resume Parsing** - Extracts skills, experience from PDF/DOCX
- 🎯 **Smart Matching** - Cosine similarity + skill overlap matching
- 💰 **Salary Prediction** - ML-powered salary range predictions
- 📊 **Resume Analysis** - AI-powered scoring and suggestions
- 💬 **AI Assistant** - Career guidance chatbot

---

## ✨ Features

### For Candidates
- Upload & parse resumes (PDF/DOCX)
- AI-powered job matching with scores
- Resume analyzer with improvement suggestions
- Salary prediction based on role, skills, location
- Dashboard with profile overview and matches

### For Recruiters
- Post jobs with detailed requirements
- View AI-matched candidates ranked by score
- Shortlist/reject candidates
- Search and filter candidates
- Track candidate pipeline

---

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ShadCN UI** - Component library

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication

### AI Service
- **FastAPI** - Python web framework
- **sentence-transformers** - Embeddings (all-MiniLM-L6-v2)
- **spaCy** - NLP processing
- **PyMuPDF** - PDF parsing
- **OpenAI** - Chatbot (optional)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, Python 3.8+, MongoDB

### 1. Clone & Install

```bash
git clone <repository-url>
cd jobmatch-ai-main

# Backend
cd backend
npm install
cp env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET

# AI Service
cd ai-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Frontend
cd ../..
npm install
cp env.local.example .env.local
# Edit .env.local with NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 2. Start Services

**Terminal 1 - AI Service:**
```bash
cd backend/ai-service
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
npm run dev
```

### 3. Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- AI Service: http://localhost:8000/docs

---

## ⚙️ Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/jobmatch
JWT_SECRET=your-secret-key
AI_SERVICE_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Candidate
- `POST /api/candidate/upload-resume` - Upload resume (PDF/DOCX)
- `GET /api/candidate/matches?page=1&limit=20` - Get job matches
- `GET /api/candidate/profile` - Get profile

### Recruiter
- `POST /api/recruiter/post-job` - Create job posting
- `GET /api/recruiter/jobs` - Get recruiter's jobs
- `GET /api/recruiter/candidates/:jobId` - Get candidates for job
- `PUT /api/recruiter/shortlist/:matchId` - Shortlist candidate
- `PUT /api/recruiter/reject/:matchId` - Reject candidate

### AI Services
- `POST /api/resume/analyze` - Analyze resume
- `POST /api/resume/compare` - Compare resume with job
- `POST /api/salary/predict` - Predict salary
- `POST /api/assistant/chat` - Chat with AI assistant

**Full API docs:** http://localhost:8000/docs

---

## 📁 Project Structure

```
jobmatch-ai-main/
├── app/                    # Next.js pages
│   ├── auth/               # Login/signup
│   └── dashboard/          # Candidate & recruiter dashboards
├── backend/
│   ├── ai-service/         # Python FastAPI service
│   └── src/
│       ├── routes/         # API routes
│       ├── models/         # MongoDB models
│       └── services/       # Business logic
├── components/             # React components
├── lib/                    # Utilities & API client
└── public/                # Static assets
```

---

## 🧪 Testing

1. **Sign up** as candidate → Upload resume → Check matches
2. **Sign up** as recruiter → Post job → View candidates → Shortlist
3. **Test AI features:** Resume analysis, salary prediction, chatbot

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues.

---

## 🚀 Deployment

### Backend (Render/Vercel)
- Set environment variables
- Build: `npm install`
- Start: `npm start`

### AI Service (Render/Railway)
- Python 3.8+
- Install: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)
- Framework: Next.js
- Set `NEXT_PUBLIC_BACKEND_URL`

See [backend/DEPLOY.md](./backend/DEPLOY.md) for details.

---

## 🔧 Development

```bash
# Development mode (all services)
# Terminal 1: AI Service
cd backend/ai-service && uvicorn main:app --reload

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Frontend
npm run dev
```

---

## 🐛 Troubleshooting

**AI service not responding?**
- Check if running on port 8000
- First run downloads models (~80MB, takes 30-60s)

**MongoDB connection error?**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

**No matches appearing?**
- Wait 5-10 seconds (async matching)
- Verify embeddings generated
- Check if jobs/candidates exist

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for more.

---

## 📚 Documentation

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues & solutions
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Development roadmap
- [backend/DEPLOY.md](./backend/DEPLOY.md) - Deployment guide
- [backend/ai-service/README.md](./backend/ai-service/README.md) - AI service docs

---

## 📝 License

MIT License

---

<div align="center">

**Built with ❤️ using Next.js, Express.js, FastAPI, and AI**

</div>
