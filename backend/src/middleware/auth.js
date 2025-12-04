import jwt from "jsonwebtoken"
import { User } from "../models/User.js"

export const authRequired = (roles = []) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles]

  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || ""
      const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null

      if (!token) {
        return res.status(401).json({ message: "Authentication required" })
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(payload.sub)

      if (!user) {
        return res.status(401).json({ message: "User not found" })
      }

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" })
      }

      req.user = user
      next()
    } catch (err) {
      console.error("Auth error:", err)
      return res.status(401).json({ message: "Invalid or expired token" })
    }
  }
}


