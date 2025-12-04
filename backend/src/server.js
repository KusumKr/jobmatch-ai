import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

// Load .env file from backend root directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, "..", ".env")
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.warn("Warning: .env file not found at", envPath)
  console.warn("Make sure MONGODB_URI is set in environment variables")
} else {
  console.log("✓ Loaded .env file from", envPath)
  // Debug: Show what env vars were loaded (mask sensitive values)
  const envKeys = Object.keys(result.parsed || {})
  console.log("✓ Loaded environment variables:", envKeys.join(", "))
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing! Check your .env file has: MONGODB_URI=...")
  }
}

import { createApp } from "./app.js"
import { connectDb } from "./config/db.js"

const PORT = process.env.PORT || 5000

// Initialize DB connection after env vars are loaded
connectDb().catch((err) => {
  console.error("MongoDB connection error:", err)
  process.exit(1)
})

const app = createApp()

app.listen(PORT, () => {
  console.log(`JobMatch backend listening on port ${PORT}`)
})


