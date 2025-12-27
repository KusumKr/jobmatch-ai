"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Loader2 } from "lucide-react"
import { TopNav } from "@/components/dashboard/top-nav"
import { CandidateCard } from "@/components/dashboard/candidate-card"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { apiGetRecruiterCandidates, type RecruiterMatch } from "@/lib/api"

interface Job {
  _id: string
  title: string
}

export default function MatchesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string>("")
  const [matches, setMatches] = useState<RecruiterMatch[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const { token } = useAuth()
  const { toast } = useToast()

  // Fetch recruiter's jobs
  useEffect(() => {
    if (!token) return

    async function fetchJobs() {
      try {
        setLoadingJobs(true)
        // Note: We need to add a GET /api/recruiter/jobs endpoint
        // For now, we'll fetch jobs from matches or create a simple endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/recruiter/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          const jobsList = data.jobs || data // Handle both paginated and non-paginated responses
          setJobs(jobsList)
          if (jobsList.length > 0 && !selectedJobId) {
            setSelectedJobId(jobsList[0]._id)
          }
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
      } finally {
        setLoadingJobs(false)
      }
    }

    fetchJobs()
  }, [token])

  // Fetch candidates for selected job
  useEffect(() => {
    if (!token || !selectedJobId) return

    async function fetchCandidates() {
      try {
        setLoading(true)
        const data = await apiGetRecruiterCandidates(selectedJobId, token)
        setMatches(data.matches || [])
      } catch (error) {
        toast({
          title: "Failed to load candidates",
          description: error instanceof Error ? error.message : "Something went wrong.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [selectedJobId, token, toast])

  const handleStatusChange = () => {
    // Refresh candidates after status change
    if (selectedJobId && token) {
      apiGetRecruiterCandidates(selectedJobId, token)
        .then((data) => setMatches(data.matches || []))
        .catch(console.error)
    }
  }

  const filteredMatches = matches.filter((match) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      match.candidateId.name.toLowerCase().includes(query) ||
      match.candidateId.email.toLowerCase().includes(query) ||
      match.candidateId.candidateProfile?.skills?.some((skill) =>
        skill.toLowerCase().includes(query)
      )
    )
  })

  return (
    <div className="flex-1 bg-background">
      <TopNav title="Candidate Matches" />

      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">AI-Matched Candidates</h2>
          
          {loadingJobs ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              Loading jobs...
            </div>
          ) : jobs.length > 0 ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Select Job:</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full md:w-auto rounded-lg border border-border bg-card/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">
              No jobs posted yet. Post a job to see AI-matched candidates.
            </p>
          )}

          {selectedJobId && (
            <div className="flex gap-4 mt-4">
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
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading candidates...</span>
          </div>
        ) : !selectedJobId ? (
          <div className="text-center py-12 text-muted-foreground">
            Select a job to view matched candidates
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">No candidates found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No candidates match your search" : "No matches yet. Candidates will appear here after they upload resumes."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMatches.map((match) => (
              <CandidateCard key={match._id} match={match} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
