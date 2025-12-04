import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      required: true,
      index: true,
    },
    candidateProfile: {
      resumeUrl: String,
      resumeText: String,
      skills: [String],
      experienceYears: Number,
      location: String,
      preferences: {
        desiredRoles: [String],
        locations: [String],
        salaryRange: {
          min: Number,
          max: Number,
          currency: String,
        },
      },
      embedding: {
        type: [Number],
        select: false,
      },
    },
    recruiterProfile: {
      companyName: String,
      companyWebsite: String,
    },
  },
  { timestamps: true }
)

export const User = mongoose.model("User", userSchema)


