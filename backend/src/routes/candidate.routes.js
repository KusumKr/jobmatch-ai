import express from "express"
import multer from "multer"
import axios from "axios"
import { authRequired } from "../middleware/auth.js"
import { User } from "../models/User.js"
import { Job } from "../models/Job.js"
import { Match } from "../models/Match.js"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Configure AI client (same default as ai.routes.js)
const ai = axios.create({
  // Use explicit IPv4 loopback by default to avoid ::1/IPv6 issues on Windows
  baseURL: process.env.AI_SERVICE_URL || "http://127.0.0.1:8000",
  timeout: 30000,
})

// POST /api/candidate/upload-resume
router.post(
  "/upload-resume",
  authRequired("candidate"),
  upload.single("resume"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" })
    }

    try {
      // Call AI microservice for parsing & embedding
      const aiResponse = await ai.post("/resume/analyze", {
        fileBase64: req.file.buffer.toString("base64"),
        fileName: req.file.originalname,
      })

      const { text, skills, experienceYears, embedding } = aiResponse.data

      // Ensure candidateProfile & preferences objects exist to satisfy schema shape
      if (!req.user.candidateProfile) {
        req.user.candidateProfile = {}
      }
      if (!req.user.candidateProfile.preferences) {
        req.user.candidateProfile.preferences = {
          desiredRoles: [],
          locations: [],
          salaryRange: {},
        }
      }

      req.user.candidateProfile.resumeText = text
      req.user.candidateProfile.skills = skills
      req.user.candidateProfile.experienceYears = experienceYears
      req.user.candidateProfile.embedding = embedding
      await req.user.save()

      res.json({ message: "Resume processed", skills, experienceYears })
    } catch (err) {
      console.error("Resume upload error:", err)
      res.status(500).json({ message: "Failed to process resume" })
    }
  }
)

// GET /api/candidate/matches
router.get("/matches", authRequired("candidate"), async (req, res) => {
  try {
    const matches = await Match.find({ candidateId: req.user._id })
      .sort({ score: -1 })
      .limit(50)
      .populate("jobId")

    res.json(matches)
  } catch (err) {
    console.error("Get matches error:", err)
    res.status(500).json({ message: "Failed to fetch matches" })
  }
})

// GET /api/candidate/profile
router.get("/profile", authRequired("candidate"), async (req, res) => {
  const user = await User.findById(req.user._id).select("-passwordHash")
  res.json(user)
})

export default router


