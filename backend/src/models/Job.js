import mongoose from "mongoose"

const jobSchema = new mongoose.Schema(
  {
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: [String],
    experienceLevel: { type: String },
    location: { type: String },
    salaryRange: {
      min: Number,
      max: Number,
      currency: String,
    },
    embedding: {
      type: [Number],
      select: false,
    },
  },
  { timestamps: true }
)

export const Job = mongoose.model("Job", jobSchema)


