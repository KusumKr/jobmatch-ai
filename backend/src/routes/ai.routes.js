import express from "express"
import axios from "axios"
import { authRequired } from "../middleware/auth.js"

const router = express.Router()

const ai = axios.create({
  // Use explicit IPv4 loopback by default to avoid ::1/IPv6 issues on Windows
  baseURL: process.env.AI_SERVICE_URL || "http://127.0.0.1:8000",
  timeout: 30000,
})

// POST /api/resume/analyze
router.post("/resume/analyze", authRequired(["candidate", "recruiter"]), async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body
    const response = await ai.post("/resume/analyze", { resumeText, jobDescription })
    res.json(response.data)
  } catch (err) {
    console.error("AI resume analyze error:", err)
    res.status(500).json({ message: "Failed to analyze resume" })
  }
})

// POST /api/salary/predict
router.post("/salary/predict", authRequired(["candidate", "recruiter"]), async (req, res) => {
  try {
    const response = await ai.post("/salary/predict", req.body)
    res.json(response.data)
  } catch (err) {
    console.error("Salary predict error:", err)
    res.status(500).json({ message: "Failed to predict salary" })
  }
})

// POST /api/assistant/chat
router.post("/assistant/chat", authRequired(["candidate", "recruiter"]), async (req, res) => {
  try {
    const { messages } = req.body
    const response = await ai.post("/assistant/chat", { messages, userRole: req.user.role })
    res.json(response.data)
  } catch (err) {
    console.error("Assistant chat error:", err)
    res.status(500).json({ message: "Failed to process assistant request" })
  }
})

export default router


