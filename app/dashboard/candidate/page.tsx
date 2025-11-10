"use client"

import { BarChart3, Zap, TrendingUp, Heart } from "lucide-react"
import { JobCard } from "@/components/dashboard/job-card"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { TopNav } from "@/components/dashboard/top-nav"

const mockJobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp Inc",
    location: "San Francisco, CA",
    matchPercent: 95,
    salary: "$150k - $180k",
    remote: true,
    description: "Build scalable web applications with React and TypeScript",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    matchPercent: 88,
    salary: "$130k - $160k",
    remote: true,
    description: "Help us build the future of web technology",
  },
  {
    id: 3,
    title: "Frontend Engineer",
    company: "DesignStudio",
    location: "Remote",
    matchPercent: 82,
    salary: "$120k - $150k",
    remote: true,
    description: "Create beautiful and responsive user interfaces",
  },
]

const stats = [
  { label: "Profile Views", value: "245", icon: BarChart3, color: "from-primary to-primary/50" },
  { label: "Pending Matches", value: "12", icon: Zap, color: "from-secondary to-secondary/50" },
  { label: "Interviews", value: "3", icon: TrendingUp, color: "from-accent to-accent/50" },
  { label: "Saved Jobs", value: "18", icon: Heart, color: "from-primary to-accent" },
]

export default function CandidateDashboard() {
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
              <div className="space-y-4">
                {mockJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
