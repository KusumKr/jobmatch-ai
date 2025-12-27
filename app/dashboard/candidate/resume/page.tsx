"use client"

import { Upload, BarChart3, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { TopNav } from "@/components/dashboard/top-nav"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { apiUploadResume } from "@/lib/api"

export default function ResumePage() {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [experienceYears, setExperienceYears] = useState<number | null>(null)
  const { token } = useAuth()
  const { toast } = useToast()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!token) {
      toast({
        title: "Not signed in",
        description: "Please sign in again to upload your resume.",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)
      setUploaded(false)
      const result = await apiUploadResume(file, token)

      setSkills(result.skills || [])
      setExperienceYears(result.experienceYears || null)
      setUploaded(true)

      toast({
        title: "Resume uploaded successfully!",
        description:
          result.skills && result.skills.length
            ? `We detected ${result.skills.length} skills including: ${result.skills.slice(0, 5).join(", ")}`
            : result.message || "Your resume has been processed.",
      })
    } catch (error: unknown) {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Something went wrong while uploading your resume.",
        variant: "destructive",
      })
      setUploaded(false)
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  return (
    <div className="flex-1 bg-background">
      <TopNav title="Resume Analyzer" />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">AI Resume Analyzer</h2>
            <p className="text-muted-foreground">
              Upload your resume to get AI-powered insights and optimization suggestions
            </p>
          </div>

          <div className="mb-8">
            <label className={`block w-full rounded-xl border-2 border-dashed ${
              uploading 
                ? "border-primary/50 bg-primary/10 cursor-wait" 
                : "border-primary/30 bg-primary/5 cursor-pointer hover:border-primary hover:bg-primary/10"
            } p-12 text-center transition`}>
              {uploading ? (
                <>
                  <Loader2 size={40} className="mx-auto mb-4 text-primary animate-spin" />
                  <div className="text-lg font-semibold text-foreground mb-1">Processing resume...</div>
                  <p className="text-muted-foreground mb-2">This may take a few seconds</p>
                </>
              ) : (
                <>
                  <Upload size={40} className="mx-auto mb-4 text-primary" />
                  <div className="text-lg font-semibold text-foreground mb-1">Upload your resume</div>
                  <p className="text-muted-foreground mb-2">Drag and drop or click to select</p>
                  <p className="text-sm text-muted-foreground">Supported: PDF, DOCX (Max 10MB)</p>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>

          {uploaded && (
            <div className="mb-8 space-y-4">
              {skills.length > 0 && (
                <div className="rounded-lg border border-border bg-background/50 p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <BarChart3 size={20} className="text-primary" />
                    Detected Skills ({skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {experienceYears !== null && (
                <div className="rounded-lg border border-border bg-background/50 p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-secondary" />
                    Experience
                  </h4>
                  <p className="text-foreground">
                    {experienceYears} {experienceYears === 1 ? "year" : "years"} of experience detected
                  </p>
                </div>
              )}

              <div className="rounded-lg border border-border bg-background/50 p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-primary" />
                  Resume Processed Successfully
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your resume has been analyzed and your profile has been updated. Check your dashboard to see job matches!
                </p>
              </div>
            </div>
          )}

          {!uploaded && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-background/50 p-4 flex items-start gap-4">
                <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Upload a resume to get started</h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI will analyze your skills, experience, and provide personalized recommendations
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6 text-center">
            <BarChart3 className="mx-auto mb-3 text-primary" size={28} />
            <h4 className="font-semibold text-foreground mb-1">Skills Analysis</h4>
            <p className="text-sm text-muted-foreground">Get insights on your top skills</p>
          </div>
          <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6 text-center">
            <CheckCircle2 className="mx-auto mb-3 text-secondary" size={28} />
            <h4 className="font-semibold text-foreground mb-1">Resume Score</h4>
            <p className="text-sm text-muted-foreground">Get your overall resume rating</p>
          </div>
          <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6 text-center">
            <AlertCircle className="mx-auto mb-3 text-accent" size={28} />
            <h4 className="font-semibold text-foreground mb-1">Improvements</h4>
            <p className="text-sm text-muted-foreground">AI-powered optimization tips</p>
          </div>
        </div>
      </div>
    </div>
  )
}
