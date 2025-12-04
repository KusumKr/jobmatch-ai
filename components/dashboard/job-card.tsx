"use client"

import { MapPin, DollarSign, Heart, Globe, ArrowRight } from "lucide-react"
import { useState } from "react"

interface Job {
  id: number
  title: string
  company: string
  location: string
  matchPercent: number
  salary: string
  remote: boolean
  description: string
}

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  return (
    <div className="group rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1">
            <span className="text-sm font-bold text-primary">{job.matchPercent}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Match</p>
        </div>
      </div>

      <p className="text-sm text-foreground mb-4">{job.description}</p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign size={16} />
          <span>{job.salary}</span>
        </div>
        {job.remote && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe size={16} />
            <span>Remote</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="flex-1 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90 transition flex items-center justify-center gap-2">
          View & Apply
          <ArrowRight size={16} />
        </button>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="rounded-lg border border-border bg-background p-2 hover:bg-muted transition"
        >
          <Heart size={18} className={isSaved ? "fill-primary text-primary" : "text-muted-foreground"} />
        </button>
      </div>
    </div>
  )
}
