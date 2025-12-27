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
  // Allow all Vercel domains and configured frontend URLs
  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
          return callback(null, true)
        }
        
        // Always allow Vercel domains
        if (origin.includes(".vercel.app")) {
          return callback(null, true)
        }
        
        // Allow configured frontend URL (remove trailing slash if present)
        const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "")
        if (frontendUrl && (origin === frontendUrl || origin.startsWith(frontendUrl))) {
          return callback(null, true)
        }
        
        // Allow localhost for development
        if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
          return callback(null, true)
        }
        
        // Log blocked origins for debugging
        console.log(`CORS: Allowing origin: ${origin}`)
        callback(null, true)
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["Content-Type"],
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


