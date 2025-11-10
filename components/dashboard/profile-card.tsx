"use client"

import { Upload, Mail, MapPin, Award } from "lucide-react"
import { useState } from "react"

export function ProfileCard() {
  const [uploading, setUploading] = useState(false)

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-primary to-accent" />

      <div className="relative px-6 pb-6">
        <div className="mb-6 -mt-12">
          <div className="flex items-end justify-between mb-4">
            <div className="h-24 w-24 rounded-lg border-4 border-card bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl font-bold text-primary">
              JD
            </div>
            <button className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">
              Edit Profile
            </button>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-1">John Doe</h3>
          <p className="text-sm text-muted-foreground mb-3">Senior Software Engineer</p>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>john@example.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} />
              <span>8 years experience</span>
            </div>
          </div>
        </div>

        <div className="mb-6 border-t border-border pt-6">
          <h4 className="font-semibold text-foreground mb-3">Top Skills</h4>
          <div className="flex flex-wrap gap-2">
            {["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"].map((skill) => (
              <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block w-full rounded-lg border-2 border-dashed border-border bg-background/50 p-4 text-center cursor-pointer hover:border-primary/50 transition">
            <Upload size={20} className="mx-auto mb-2 text-muted-foreground" />
            <div className="text-sm font-medium text-foreground">Upload Resume</div>
            <p className="text-xs text-muted-foreground">PDF or DOCX</p>
            <input type="file" className="hidden" accept=".pdf,.docx" />
          </label>
        </div>
      </div>
    </div>
  )
}
