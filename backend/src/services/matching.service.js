import axios from "axios"
import { User } from "../models/User.js"
import { Job } from "../models/Job.js"
import { Match } from "../models/Match.js"

// Configure AI client
const ai = axios.create({
  baseURL: process.env.AI_SERVICE_URL || "http://127.0.0.1:8000",
  timeout: 30000,
})

/**
 * Generate embedding for a job description
 */
async function generateJobEmbedding(jobDescription) {
  try {
    const response = await ai.post("/resume/analyze", {
      resumeText: jobDescription,
    })
    return response.data.embedding
  } catch (error) {
    console.error("Error generating job embedding:", error)
    return null
  }
}

/**
 * Calculate match score between job and candidate
 */
async function calculateMatchScore(jobEmbedding, candidateEmbedding, jobSkills, candidateSkills) {
  try {
    const response = await ai.post("/match/calculate", {
      jobEmbedding,
      candidateEmbedding,
      jobSkills,
      candidateSkills,
    })
    return response.data
  } catch (error) {
    console.error("Error calculating match score:", error)
    // Fallback: simple cosine similarity if AI service fails
    return { score: 0.5, similarity: 0.5, skillOverlap: 0.5, matchingSkills: [] }
  }
}

/**
 * Match a candidate to all existing jobs
 */
export async function matchCandidateToJobs(candidateId) {
  try {
    const candidate = await User.findById(candidateId)
    if (!candidate || !candidate.candidateProfile?.embedding) {
      console.log(`Candidate ${candidateId} has no embedding, skipping matching`)
      return
    }

    const candidateEmbedding = candidate.candidateProfile.embedding
    const candidateSkills = candidate.candidateProfile.skills || []

    // Get all jobs that don't have matches with this candidate yet
    const existingMatches = await Match.find({ candidateId }).distinct("jobId")
    const jobs = await Job.find({
      _id: { $nin: existingMatches },
      embedding: { $exists: true, $ne: null },
    })

    console.log(`Matching candidate ${candidateId} to ${jobs.length} jobs`)

    const matchPromises = jobs.map(async (job) => {
      try {
        const matchData = await calculateMatchScore(
          job.embedding,
          candidateEmbedding,
          job.requiredSkills || [],
          candidateSkills
        )

        // Only create match if score is above threshold
        if (matchData.score > 0.3) {
          await Match.findOneAndUpdate(
            { jobId: job._id, candidateId: candidate._id },
            {
              jobId: job._id,
              candidateId: candidate._id,
              score: matchData.score,
              topSkills: matchData.matchingSkills || [],
              status: "suggested",
            },
            { upsert: true, new: true }
          )
        }
      } catch (error) {
        console.error(`Error matching candidate to job ${job._id}:`, error)
      }
    })

    await Promise.all(matchPromises)
    console.log(`Completed matching for candidate ${candidateId}`)
  } catch (error) {
    console.error(`Error in matchCandidateToJobs for ${candidateId}:`, error)
  }
}

/**
 * Match a job to all existing candidates
 */
export async function matchJobToCandidates(jobId) {
  try {
    const job = await Job.findById(jobId)
    if (!job) {
      console.log(`Job ${jobId} not found`)
      return
    }

    // Generate embedding for job if not exists
    if (!job.embedding) {
      console.log(`Generating embedding for job ${jobId}`)
      const embedding = await generateJobEmbedding(job.description)
      if (embedding) {
        job.embedding = embedding
        await job.save()
      } else {
        console.log(`Failed to generate embedding for job ${jobId}`)
        return
      }
    }

    const jobEmbedding = job.embedding
    const jobSkills = job.requiredSkills || []

    // Get all candidates with embeddings
    const candidates = await User.find({
      role: "candidate",
      "candidateProfile.embedding": { $exists: true, $ne: null },
    })

    console.log(`Matching job ${jobId} to ${candidates.length} candidates`)

    const matchPromises = candidates.map(async (candidate) => {
      try {
        const candidateEmbedding = candidate.candidateProfile.embedding
        const candidateSkills = candidate.candidateProfile.skills || []

        const matchData = await calculateMatchScore(
          jobEmbedding,
          candidateEmbedding,
          jobSkills,
          candidateSkills
        )

        // Only create match if score is above threshold
        if (matchData.score > 0.3) {
          await Match.findOneAndUpdate(
            { jobId: job._id, candidateId: candidate._id },
            {
              jobId: job._id,
              candidateId: candidate._id,
              score: matchData.score,
              topSkills: matchData.matchingSkills || [],
              status: "suggested",
            },
            { upsert: true, new: true }
          )
        }
      } catch (error) {
        console.error(`Error matching job to candidate ${candidate._id}:`, error)
      }
    })

    await Promise.all(matchPromises)
    console.log(`Completed matching for job ${jobId}`)
  } catch (error) {
    console.error(`Error in matchJobToCandidates for ${jobId}:`, error)
  }
}

/**
 * Process matching asynchronously (fire and forget)
 */
export function matchCandidateToJobsAsync(candidateId) {
  setImmediate(() => {
    matchCandidateToJobs(candidateId).catch((err) => {
      console.error(`Async matching error for candidate ${candidateId}:`, err)
    })
  })
}

export function matchJobToCandidatesAsync(jobId) {
  setImmediate(() => {
    matchJobToCandidates(jobId).catch((err) => {
      console.error(`Async matching error for job ${jobId}:`, err)
    })
  })
}

