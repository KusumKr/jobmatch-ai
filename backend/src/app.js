import express from "express"
import cors from "cors"
import morgan from "morgan"

import { connectDb } from "./config/db.js"
import authRoutes from "./routes/auth.routes.js"
import candidateRoutes from "./routes/candidate.routes.js"
import recruiterRoutes from "./routes/recruiter.routes.js"
import aiRoutes from "./routes/ai.routes.js"

export const createApp = () => {
  const app = express()

  // Core middleware - CORS configuration
  const allowedOrigins = [
    // Vercel domains
    /^https:\/\/.*\.vercel\.app$/,
    // Specific frontend URLs from environment
    process.env.FRONTEND_URL,
    // Development
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter(Boolean)

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
          return callback(null, true)
        }
        
        // Check against allowed origins
        const isAllowed = allowedOrigins.some((allowed) => {
          if (typeof allowed === "string") {
            return origin === allowed || origin.startsWith(allowed)
          }
          if (allowed instanceof RegExp) {
            return allowed.test(origin)
          }
          return false
        })
        
        if (isAllowed) {
          callback(null, true)
        } else {
          // Log for debugging
          console.log(`CORS blocked origin: ${origin}`)
          // In production, you might want to be stricter, but for now allow all
          callback(null, true)
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  app.use(express.json({ limit: "10mb" }))
  app.use(express.urlencoded({ extended: true }))
  app.use(morgan("dev"))

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "jobmatch-backend" })
  })

  // API routes
  app.use("/api/auth", authRoutes)
  app.use("/api/candidate", candidateRoutes)
  app.use("/api/recruiter", recruiterRoutes)
  app.use("/api", aiRoutes)

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: "Not found", path: req.path })
  })

  return app
}

// Note: DB connection is initialized in server.js after dotenv loads


