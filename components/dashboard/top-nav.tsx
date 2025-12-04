"use client"

import { Bell, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth, logoutClient } from "@/hooks/use-auth"

interface TopNavProps {
  title: string
}

export function TopNav({ title }: TopNavProps) {
  const router = useRouter()
  const { user } = useAuth()

  const handleLogout = () => {
    logoutClient()
    router.replace("/auth/login")
  }

  return (
    <div className="border-b border-border bg-card/30 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <div className="flex items-center gap-4">
          <button className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            {user ? `${user.name} · ${user.role === "candidate" ? "Job Seeker" : "Recruiter"}` : "Guest"}
          </button>
          <button className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground transition">
            <Bell size={20} />
          </button>
          <button className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground transition">
            <Settings size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-destructive/10 p-2 text-destructive hover:bg-destructive/20 transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
