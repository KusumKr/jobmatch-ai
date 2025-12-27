"use client"

import { MessageSquare, Download, Check, X, Loader2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { apiShortlistCandidate, apiRejectCandidate, type RecruiterMatch } from "@/lib/api"

interface CandidateCardProps {
  match: RecruiterMatch
  onStatusChange?: () => void
}

export function CandidateCard({ match, onStatusChange }: CandidateCardProps) {
  const [loading, setLoading] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(match.status)
  const { token } = useAuth()
  const { toast } = useToast()

  const candidate = match.candidateId
  const skills = candidate.candidateProfile?.skills || match.topSkills || []
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return name.substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const handleShortlist = async () => {
    if (!token) {
      toast({
        title: "Not signed in",
        description: "Please sign in again.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await apiShortlistCandidate(match._id, token)
      setCurrentStatus("shortlisted")
      toast({
        title: "Candidate shortlisted",
        description: `${candidate.name} has been added to your shortlist.`,
      })
      onStatusChange?.()
    } catch (error) {
      toast({
        title: "Failed to shortlist",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!token) {
      toast({
        title: "Not signed in",
        description: "Please sign in again.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await apiRejectCandidate(match._id, token)
      setCurrentStatus("rejected")
      toast({
        title: "Candidate rejected",
        description: `${candidate.name} has been removed from matches.`,
      })
      onStatusChange?.()
    } catch (error) {
      toast({
        title: "Failed to reject",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isShortlisted = currentStatus === "shortlisted"
  const isRejected = currentStatus === "rejected"
  const matchPercent = Math.round(match.score * 100)

  return (
    <div className={`rounded-xl border backdrop-blur-sm p-6 transition ${
      isRejected 
        ? "border-destructive/50 bg-card/30 opacity-60" 
        : isShortlisted
        ? "border-primary/50 bg-primary/5"
        : "border-border bg-card/50 hover:border-primary/50"
    }`}>
      {isShortlisted && (
        <div className="mb-3 flex items-center gap-2 text-primary text-sm font-medium">
          <Check size={16} />
          Shortlisted
        </div>
      )}
      {isRejected && (
        <div className="mb-3 flex items-center gap-2 text-destructive text-sm font-medium">
          <X size={16} />
          Rejected
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-lg">
            {getInitials(candidate.name)}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{candidate.name}</h3>
            <p className="text-sm text-muted-foreground">{candidate.email}</p>
            {candidate.candidateProfile?.experienceYears && (
              <p className="text-xs text-muted-foreground mt-1">
                {candidate.candidateProfile.experienceYears} {candidate.candidateProfile.experienceYears === 1 ? "year" : "years"} experience
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1">
            <span className="text-sm font-bold text-primary">{matchPercent}%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Match</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Matched for: <span className="text-foreground font-semibold">{match.jobId.title}</span>
        </p>
      </div>

      {skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Top Skills:</p>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 6).map((skill, idx) => (
              <span key={idx} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {skill}
              </span>
            ))}
            {skills.length > 6 && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                +{skills.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {!isRejected && (
          <button
            onClick={handleShortlist}
            disabled={loading || isShortlisted}
            className={`flex-1 rounded-lg px-3 py-2 font-semibold transition flex items-center justify-center gap-2 ${
              isShortlisted
                ? "bg-primary text-primary-foreground cursor-not-allowed opacity-70"
                : "border border-border bg-background hover:bg-muted disabled:opacity-50"
            }`}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isShortlisted ? (
              <>
                <Check size={16} />
                Shortlisted
              </>
            ) : (
              "Shortlist"
            )}
          </button>
        )}
        {!isShortlisted && (
          <button
            onClick={handleReject}
            disabled={loading || isRejected}
            className={`rounded-lg px-3 py-2 font-semibold transition flex items-center justify-center gap-2 ${
              isRejected
                ? "bg-destructive/10 text-destructive cursor-not-allowed opacity-70"
                : "border border-destructive/50 bg-background hover:bg-destructive/10 text-destructive disabled:opacity-50"
            }`}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isRejected ? (
              <>
                <X size={16} />
                Rejected
              </>
            ) : (
              <>
                <X size={16} />
                Reject
              </>
            )}
          </button>
        )}
        <button className="rounded-lg border border-border bg-background p-2 hover:bg-muted transition" title="Message candidate">
          <MessageSquare size={18} className="text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
