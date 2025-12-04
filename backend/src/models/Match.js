import mongoose from "mongoose"

const matchSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    score: { type: Number, required: true },
    topSkills: [String],
    status: {
      type: String,
      enum: ["suggested", "shortlisted", "contacted", "rejected", "hired"],
      default: "suggested",
    },
  },
  { timestamps: true }
)

export const Match = mongoose.model("Match", matchSchema)


