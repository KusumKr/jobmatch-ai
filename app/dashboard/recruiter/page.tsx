"use client"

import { Users, Briefcase, MessageSquare, TrendingUp } from "lucide-react"
import { TopNav } from "@/components/dashboard/top-nav"
import { CandidateCard } from "@/components/dashboard/candidate-card"

const stats = [
  { label: "Active Job Postings", value: "8", icon: Briefcase, color: "from-primary to-primary/50" },
  { label: "Matched Candidates", value: "124", icon: Users, color: "from-secondary to-secondary/50" },
  { label: "Pending Applications", value: "23", icon: MessageSquare, color: "from-accent to-accent/50" },
  { label: "Hired This Month", value: "4", icon: TrendingUp, color: "from-primary to-accent" },
]

const mockCandidates = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Senior React Developer",
    matchPercent: 98,
    skills: ["React", "TypeScript", "Node.js"],
    jobTitle: "Senior React Developer",
    image: "SC",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "Full Stack Engineer",
    matchPercent: 95,
    skills: ["React", "Python", "AWS"],
    jobTitle: "Full Stack Engineer",
    image: "MJ",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Frontend Engineer",
    matchPercent: 92,
    skills: ["Vue.js", "TypeScript", "CSS"],
    jobTitle: "Senior React Developer",
    image: "ER",
  },
]

export default function RecruiterDashboard() {
  return (
    <div className="flex-1 bg-background">
      <TopNav title="Recruiter Dashboard" />

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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div>
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 space-y-3">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <button className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition">
                Post New Job
              </button>
              <button className="w-full rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 font-semibold text-foreground hover:bg-primary/10 transition">
                View All Candidates
              </button>
              <button className="w-full rounded-lg border border-border bg-background px-4 py-2.5 font-semibold text-foreground hover:bg-muted transition">
                View Analytics
              </button>
            </div>
          </div>

          {/* Top Matched Candidates */}
          <div className="lg:col-span-2">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Top Candidate Matches</h2>
              <div className="space-y-4">
                {mockCandidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
