"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiSignup } from "@/lib/api"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const role = (searchParams.get("role") || "candidate") as "candidate" | "recruiter"
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const res = await apiSignup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      })

      if (typeof window !== "undefined") {
        window.localStorage.setItem("jm_token", res.token)
        window.localStorage.setItem("jm_user", JSON.stringify(res.user))
      }

      toast({
        title: "Success!",
        description: "Account created successfully. Redirecting to your dashboard...",
      })

      const target =
        res.user.role === "candidate" ? "/dashboard/candidate" : "/dashboard/recruiter"
      window.location.href = target
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create account. Please try again."
      toast({
        title: "Signup failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create Your {role === "candidate" ? "Job Seeker" : "Recruiter"} Account
        </h1>
        <p className="text-muted-foreground">
          {role === "candidate"
            ? "Start finding your perfect job match today"
            : "Begin posting jobs and finding top talent"}
        </p>
      </div>

      {/* Role toggle */}
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-card/50 p-1">
        <Link
          href="/auth/signup?role=candidate"
          className={`flex-1 rounded py-2 px-4 text-center font-medium transition ${
            role === "candidate" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Job Seeker
        </Link>
        <Link
          href="/auth/signup?role=recruiter"
          className={`flex-1 rounded py-2 px-4 text-center font-medium transition ${
            role === "recruiter" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Recruiter
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full rounded-lg border border-border bg-card/50 px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-border bg-card/50 px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-card/50 px-4 py-2.5 pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-card/50 px-4 py-2.5 pr-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={`/auth/login?role=${role}`} className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
