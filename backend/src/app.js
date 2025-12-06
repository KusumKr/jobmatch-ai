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

  // Core middleware - Allow all Vercel domains and configured FRONTEND_URL
  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin
        if (!origin) {
          return callback(null, true)
        }
        
        // Always allow all Vercel domains (preview and production)
        if (origin.includes(".vercel.app")) {
          return callback(null, true)
        }
        
        // Allow if matches FRONTEND_URL
        const frontendUrl = process.env.FRONTEND_URL
        if (frontendUrl) {
          const allowedUrls = frontendUrl.split(",").map((url) => url.trim().replace(/\/$/, ""))
          if (allowedUrls.some((url) => origin === url || origin.startsWith(url))) {
            return callback(null, true)
          }
        }
        
        // Default: allow all origins (for development)
        callback(null, true)
      },
      credentials: true,
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


