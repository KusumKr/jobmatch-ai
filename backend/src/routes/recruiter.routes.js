import express from "express"
import { authRequired } from "../middleware/auth.js"
import { Job } from "../models/Job.js"
import { Match } from "../models/Match.js"
import { matchJobToCandidatesAsync } from "../services/matching.service.js"

const router = express.Router()

// GET /api/recruiter/jobs
router.get("/jobs", authRequired("recruiter"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const [jobs, total] = await Promise.all([
      Job.find({ recruiterId: req.user._id })
        .select("_id title description location createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments({ recruiterId: req.user._id }),
    ])
    
    res.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error("Get jobs error:", err)
    res.status(500).json({ message: "Failed to fetch jobs" })
  }
})

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

    // Trigger async AI job embedding & candidate matching
    matchJobToCandidatesAsync(job._id)

    res.status(201).json(job)
  } catch (err) {
    console.error("Post job error:", err)
    res.status(500).json({ message: "Failed to create job" })
  }
})

// GET /api/recruiter/candidates/:jobId
router.get("/candidates/:jobId", authRequired("recruiter"), async (req, res) => {
  try {
    // Verify job belongs to recruiter
    const job = await Job.findById(req.params.jobId)
    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this job's candidates" })
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const [matches, total] = await Promise.all([
      Match.find({ jobId: req.params.jobId })
        .sort({ score: -1 })
        .skip(skip)
        .limit(limit)
        .populate("candidateId", "name email candidateProfile.skills candidateProfile.experienceYears"),
      Match.countDocuments({ jobId: req.params.jobId }),
    ])

    res.json({
      matches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error("Get candidates error:", err)
    res.status(500).json({ message: "Failed to fetch candidates" })
  }
})

// PUT /api/recruiter/shortlist/:matchId
router.put("/shortlist/:matchId", authRequired("recruiter"), async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId).populate("jobId")
    if (!match) {
      return res.status(404).json({ message: "Match not found" })
    }

    // Verify job belongs to recruiter
    if (match.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this match" })
    }

    match.status = "shortlisted"
    await match.save()

    res.json({ message: "Candidate shortlisted", match })
  } catch (err) {
    console.error("Shortlist error:", err)
    res.status(500).json({ message: "Failed to shortlist candidate" })
  }
})

// PUT /api/recruiter/reject/:matchId
router.put("/reject/:matchId", authRequired("recruiter"), async (req, res) => {
  try {
    const match = await Match.findById(req.params.matchId).populate("jobId")
    if (!match) {
      return res.status(404).json({ message: "Match not found" })
    }

    // Verify job belongs to recruiter
    if (match.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this match" })
    }

    match.status = "rejected"
    await match.save()

    res.json({ message: "Candidate rejected", match })
  } catch (err) {
    console.error("Reject error:", err)
    res.status(500).json({ message: "Failed to reject candidate" })
  }
})

// PUT /api/recruiter/match/:matchId/status
router.put("/match/:matchId/status", authRequired("recruiter"), async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ["suggested", "shortlisted", "contacted", "rejected", "hired"]
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` })
    }

    const match = await Match.findById(req.params.matchId).populate("jobId")
    if (!match) {
      return res.status(404).json({ message: "Match not found" })
    }

    // Verify job belongs to recruiter
    if (match.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this match" })
    }

    match.status = status
    await match.save()

    res.json({ message: `Match status updated to ${status}`, match })
  } catch (err) {
    console.error("Update match status error:", err)
    res.status(500).json({ message: "Failed to update match status" })
  }
})

export default router


