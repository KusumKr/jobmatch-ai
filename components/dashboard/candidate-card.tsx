"use client"

import { MessageSquare, Download, Check } from "lucide-react"
import { useState } from "react"

interface Candidate {
  id: number
  name: string
  title: string
  matchPercent: number
  skills: string[]
  jobTitle: string
  image: string
}

interface CandidateCardProps {
  candidate: Candidate
  isRecruiterView?: boolean
}

export function CandidateCard({ candidate, isRecruiterView }: CandidateCardProps) {
  const [isShortlisted, setIsShortlisted] = useState(false)

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 hover:border-primary/50 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-primary-foreground">
            {candidate.image}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground">{candidate.title}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1">
            <span className="text-sm font-bold text-primary">{candidate.matchPercent}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Match</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Matched for: <span className="text-foreground font-semibold">{candidate.jobTitle}</span>
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {candidate.skills.map((skill) => (
          <span key={skill} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsShortlisted(!isShortlisted)}
          className={`flex-1 rounded-lg px-3 py-2 font-semibold transition flex items-center justify-center gap-2 ${
            isShortlisted
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border border-border bg-background hover:bg-muted"
          }`}
        >
          {isShortlisted ? (
            <>
              <Check size={16} />
              Shortlisted
            </>
          ) : (
            "Shortlist"
          )}
        </button>
        <button className="rounded-lg border border-border bg-background p-2 hover:bg-muted transition">
          <MessageSquare size={18} className="text-muted-foreground" />
        </button>
        <button className="rounded-lg border border-border bg-background p-2 hover:bg-muted transition">
          <Download size={18} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
