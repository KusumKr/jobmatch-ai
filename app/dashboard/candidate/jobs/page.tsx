"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { JobCard } from "@/components/dashboard/job-card"
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
    description: "Build scalable web applications",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    matchPercent: 88,
    salary: "$130k - $160k",
    remote: true,
    description: "Help us build the future",
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "CloudServices",
    location: "Seattle, WA",
    matchPercent: 85,
    salary: "$140k - $170k",
    remote: false,
    description: "Build robust APIs",
  },
  {
    id: 4,
    title: "AI/ML Engineer",
    company: "DeepTech",
    location: "Remote",
    matchPercent: 92,
    salary: "$160k - $200k",
    remote: true,
    description: "Work on cutting-edge AI models",
  },
]

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    location: "",
    remoteOnly: false,
    salaryMin: 0,
  })

  return (
    <div className="flex-1 bg-background">
      <TopNav title="Job Matches" />

      <div className="p-8 max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search jobs by title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card/50 pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div>
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 space-y-6 sticky top-8">
              <h3 className="font-semibold text-foreground">Filters</h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                <input
                  type="text"
                  placeholder="e.g., San Francisco"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remote"
                  checked={filters.remoteOnly}
                  onChange={(e) => setFilters({ ...filters, remoteOnly: e.target.checked })}
                  className="rounded border-border accent-primary"
                />
                <label htmlFor="remote" className="text-sm font-medium text-foreground cursor-pointer">
                  Remote Only
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Min Salary</label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={filters.salaryMin}
                  onChange={(e) => setFilters({ ...filters, salaryMin: Number.parseInt(e.target.value) })}
                  className="w-full accent-primary"
                />
                <p className="text-sm text-muted-foreground mt-2">${filters.salaryMin}k+</p>
              </div>

              <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90 transition">
                Reset Filters
              </button>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {mockJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
