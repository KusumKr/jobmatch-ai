import express from "express"
import { authRequired } from "../middleware/auth.js"
import { Job } from "../models/Job.js"
import { Match } from "../models/Match.js"

const router = express.Router()

// POST /api/recruiter/post-job
router.post("/post-job", authRequired("recruiter"), async (req, res) => {
  try {
    const job = await Job.create({
      recruiterId: req.user._id,
      title: req.body.title,
      description: req.body.description,
      requiredSkills: req.body.requiredSkills || [],
      experienceLevel: req.body.experienceLevel,
      location: req.body.location,
      salaryRange: req.body.salaryRange,
    })

    // TODO: trigger async AI job embedding & candidate matching

    res.status(201).json(job)
  } catch (err) {
    console.error("Post job error:", err)
    res.status(500).json({ message: "Failed to create job" })
  }
})

// GET /api/recruiter/candidates/:jobId
router.get("/candidates/:jobId", authRequired("recruiter"), async (req, res) => {
  try {
    const matches = await Match.find({ jobId: req.params.jobId })
      .sort({ score: -1 })
      .limit(50)
      .populate("candidateId", "name email candidateProfile.skills")

    res.json(matches)
  } catch (err) {
    console.error("Get candidates error:", err)
    res.status(500).json({ message: "Failed to fetch candidates" })
  }
})

export default router


