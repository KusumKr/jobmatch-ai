import mongoose from "mongoose"

export const connectDb = async () => {
  // Support both MONGODB_URI and MONGODB_URL (common typo)
  let uri = process.env.MONGODB_URI || process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/jobmatch"
  
  if (!process.env.MONGODB_URI && !process.env.MONGODB_URL) {
    console.warn("⚠️  MONGODB_URI not found in environment. Using default:", uri)
  } else {
    const source = process.env.MONGODB_URI ? "MONGODB_URI" : "MONGODB_URL"
    console.log(`✓ Using ${source} from environment`)
    
    // Show masked URI for debugging (hide password)
    const maskedUri = uri.replace(/:([^:@]+)@/, ":****@")
    console.log(`  Connection string: ${maskedUri}`)
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
    })
    console.log("✓ Connected to MongoDB")
  } catch (error) {
    console.error("❌ MongoDB connection failed!")
    console.error("Error details:", error.message)
    
    // Check if password might need URL encoding
    if (uri.includes("@") && uri.includes(":")) {
      const passwordMatch = uri.match(/:\/\/[^:]+:([^@]+)@/)
      if (passwordMatch && passwordMatch[1]) {
        const password = passwordMatch[1]
        // Check if password contains special characters that need encoding
        if (password.includes("@") || password.includes(":") || password.includes("/") || password.includes("?")) {
          console.error("\n⚠️  Your password contains special characters that need URL encoding!")
          console.error("Special characters like @, :, /, ? need to be encoded in the connection string.")
          console.error("Example: If password is 'pass@123', use 'pass%40123'")
          console.error("Or regenerate your MongoDB Atlas password without special characters.")
        }
      }
    }
    
    throw error
  }
}


