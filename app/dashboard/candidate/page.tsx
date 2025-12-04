"use client"

import { useEffect, useState } from "react"
import { BarChart3, Zap, TrendingUp, Heart } from "lucide-react"
import { JobCard } from "@/components/dashboard/job-card"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { TopNav } from "@/components/dashboard/top-nav"
import { useAuth } from "@/hooks/use-auth"
import { apiGetCandidateMatches, type CandidateMatch } from "@/lib/api"

const stats = [
  { label: "Profile Views", value: "245", icon: BarChart3, color: "from-primary to-primary/50" },
  { label: "Pending Matches", value: "12", icon: Zap, color: "from-secondary to-secondary/50" },
  { label: "Interviews", value: "3", icon: TrendingUp, color: "from-accent to-accent/50" },
  { label: "Saved Jobs", value: "18", icon: Heart, color: "from-primary to-accent" },
]

export default function CandidateDashboard() {
  const { token } = useAuth()
  const [matches, setMatches] = useState<CandidateMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        const data = await apiGetCandidateMatches(token)
        if (!cancelled) {
          setMatches(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load matches")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div className="flex-1 bg-background">
      <TopNav title="Dashboard" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
                <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${stat.color} p-3`}>
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Profile and Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Profile Card */}
          <div>
            <ProfileCard />
          </div>

          {/* Right column - Job Matches */}
          <div className="lg:col-span-2">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Top Matches for You</h2>
              {loading && <p className="text-sm text-muted-foreground">Loading matches...</p>}
              {error && !loading && (
                <p className="text-sm text-destructive">Could not load matches: {error}</p>
              )}
              {!loading && !error && matches.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No matches yet. Upload your resume and create a profile to see AI-powered matches here.
                </p>
              )}
              <div className="space-y-4 mt-4">
                {matches.map((match) => {
                  const job = match.jobId
                  const salaryRange = job.salaryRange
                    ? `${salaryRangeToText(job.salaryRange)}`
                    : "Not specified"

                  return (
                    <JobCard
                      key={match._id}
                      job={{
                        id: 0,
                        title: job.title,
                        company: "Job Matchmakers", // placeholder; real company field can be added later
                        location: job.location || "Unknown",
                        matchPercent: Math.round(match.score),
                        salary: salaryRange,
                        remote: job.location?.toLowerCase() === "remote",
                        description: job.description,
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function salaryRangeToText(salary: {
  min?: number
  max?: number
  currency?: string
}) {
  const currency = salary.currency || "$"
  if (salary.min && salary.max) {
    return `${currency}${salary.min} - ${currency}${salary.max}`
  }
  if (salary.min) {
    return `${currency}${salary.min}+`
  }
  if (salary.max) {
    return `Up to ${currency}${salary.max}`
  }
  return "Not specified"
}

