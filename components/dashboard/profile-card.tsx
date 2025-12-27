"use client"

import { Upload, Mail, MapPin, Award } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { apiUploadResume } from "@/lib/api"

interface UserProfile {
  name: string
  email: string
  candidateProfile?: {
    skills?: string[]
    experienceYears?: number
    location?: string
  }
}

export function ProfileCard() {
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const { toast } = useToast()

  // Fetch user profile data
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    async function fetchProfile() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/candidate/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!token) {
      toast({
        title: "Not signed in",
        description: "Please sign in again to upload your resume.",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)
      const result = await apiUploadResume(file, token)

      toast({
        title: "Resume uploaded",
        description:
          result.skills && result.skills.length
            ? `We detected skills like: ${result.skills.slice(0, 5).join(", ")}`
            : result.message || "Your resume has been processed.",
      })

      // Refresh profile data after upload
      if (token) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/candidate/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        }
      }
    } catch (error: unknown) {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Something went wrong while uploading your resume.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // reset input so same file can be selected again if needed
      event.target.value = ""
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary to-accent" />

      <div className="relative px-6 pb-6">
        <div className="mb-6 -mt-12">
          <div className="flex items-end justify-between mb-4">
            <div className="h-24 w-24 rounded-lg border-4 border-card bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {(() => {
                if (loading) return <span className="opacity-70">...</span>
                if (!profile?.name) return <span className="opacity-70">?</span>
                // Get initials from name (first letter of first and last word)
                const nameParts = profile.name.trim().split(/\s+/)
                let initials = ""
                if (nameParts.length === 1) {
                  // Single name - use first 2 letters
                  initials = profile.name.substring(0, 2).toUpperCase()
                } else {
                  // Multiple names - use first letter of first and last
                  initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
                }
                return <span className="drop-shadow-md">{initials}</span>
              })()}
            </div>
            <button className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">
              Edit Profile
            </button>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-1">
            {loading ? "Loading..." : profile?.name || "Your Name"}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {profile?.candidateProfile?.location || "Update your location"}
          </p>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>{profile?.email || "your@email.com"}</span>
            </div>
            {profile?.candidateProfile?.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{profile.candidateProfile.location}</span>
              </div>
            )}
            {profile?.candidateProfile?.experienceYears !== undefined && (
              <div className="flex items-center gap-2">
                <Award size={16} />
                <span>
                  {profile.candidateProfile.experienceYears}{" "}
                  {profile.candidateProfile.experienceYears === 1 ? "year" : "years"} experience
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 border-t border-border pt-6">
          <h4 className="font-semibold text-foreground mb-3">
            Top Skills
            {profile?.candidateProfile?.skills && profile.candidateProfile.skills.length > 0 && (
              <span className="text-xs text-muted-foreground ml-2">
                ({profile.candidateProfile.skills.length})
              </span>
            )}
          </h4>
          <div className="flex flex-wrap gap-2">
            {loading ? (
              <span className="text-sm text-muted-foreground">Loading skills...</span>
            ) : profile?.candidateProfile?.skills && profile.candidateProfile.skills.length > 0 ? (
              profile.candidateProfile.skills.slice(0, 10).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Upload a resume to see your skills here
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block w-full rounded-lg border-2 border-dashed border-border bg-background/50 p-4 text-center cursor-pointer hover:border-primary/50 transition">
            <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm font-medium text-foreground">
              {uploading ? "Uploading..." : "Upload Resume"}
            </div>
            <p className="text-xs text-muted-foreground">PDF or DOCX</p>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
