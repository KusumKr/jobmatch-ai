"use client"

import { Users, Briefcase, MessageSquare, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { TopNav } from "@/components/dashboard/top-nav"

const stats = [
  { label: "Active Job Postings", value: "8", icon: Briefcase, color: "from-primary to-primary/50" },
  { label: "Matched Candidates", value: "124", icon: Users, color: "from-secondary to-secondary/50" },
  { label: "Pending Applications", value: "23", icon: MessageSquare, color: "from-accent to-accent/50" },
  { label: "Hired This Month", value: "4", icon: TrendingUp, color: "from-primary to-accent" },
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
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">Top Candidate Matches</h2>
                <Link
                  href="/dashboard/recruiter/matches"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  View All
                  <ArrowRight size={16} />
                </Link>
              </div>
              <p className="text-muted-foreground mb-4">
                View and manage AI-matched candidates for your job postings
              </p>
              <Link
                href="/dashboard/recruiter/matches"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition"
              >
                <Users size={18} />
                View Candidate Matches
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
