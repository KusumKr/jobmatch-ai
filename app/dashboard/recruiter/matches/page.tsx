"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { TopNav } from "@/components/dashboard/top-nav"
import { CandidateCard } from "@/components/dashboard/candidate-card"

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
  {
    id: 4,
    name: "David Kim",
    title: "Senior Backend Engineer",
    matchPercent: 88,
    skills: ["Python", "PostgreSQL", "Docker"],
    jobTitle: "Backend Engineer",
    image: "DK",
  },
]

export default function MatchesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex-1 bg-background">
      <TopNav title="Candidate Matches" />

      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">AI-Matched Candidates</h2>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-card/50 pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <button className="rounded-lg border border-border bg-card/50 px-4 py-3 text-muted-foreground hover:text-foreground transition flex items-center gap-2">
              <Filter size={20} />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} isRecruiterView />
          ))}
        </div>
      </div>
    </div>
  )
}
