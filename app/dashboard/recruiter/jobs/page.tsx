"use client"

import { Plus, Edit2, Eye, Trash2 } from "lucide-react"
import { TopNav } from "@/components/dashboard/top-nav"

const mockJobs = [
  {
    id: 1,
    title: "Senior React Developer",
    status: "active",
    applications: 24,
    views: 450,
    posted: "5 days ago",
    salary: "$150k - $180k",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    status: "active",
    applications: 18,
    views: 380,
    posted: "2 weeks ago",
    salary: "$130k - $160k",
  },
  {
    id: 3,
    title: "Backend Engineer",
    status: "closed",
    applications: 32,
    views: 520,
    posted: "1 month ago",
    salary: "$140k - $170k",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    status: "active",
    applications: 12,
    views: 290,
    posted: "3 days ago",
    salary: "$100k - $130k",
  },
]

export default function JobsPage() {
  return (
    <div className="flex-1 bg-background">
      <TopNav title="My Job Postings" />

      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Manage Your Postings</h2>
            <p className="text-muted-foreground">View and manage all your active and closed job listings</p>
          </div>
          <button className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition flex items-center gap-2">
            <Plus size={20} />
            Post New Job
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Job Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Applications</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Views</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Posted</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-muted/30 transition">
                    <td className="px-6 py-4 text-foreground font-medium">{job.title}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {job.status === "active" ? "Active" : "Closed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{job.applications}</td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{job.views}</td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">{job.posted}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground transition">
                          <Eye size={16} />
                        </button>
                        <button className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground transition">
                          <Edit2 size={16} />
                        </button>
                        <button className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-destructive transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
