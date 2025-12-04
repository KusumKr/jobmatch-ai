"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Briefcase, Brain, TrendingUp, LogOut, User, Settings } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const isRecruiter = pathname.includes("recruiter")
  const role = isRecruiter ? "recruiter" : "candidate"

  const links = isRecruiter
    ? [
        { href: "/dashboard/recruiter", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/recruiter/jobs", label: "My Jobs", icon: Briefcase },
        { href: "/dashboard/recruiter/matches", label: "Candidate Matches", icon: User },
      ]
    : [
        { href: "/dashboard/candidate", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/candidate/jobs", label: "Job Matches", icon: Briefcase },
        { href: "/dashboard/candidate/resume", label: "Resume Analyzer", icon: Brain },
        { href: "/dashboard/candidate/salary", label: "Salary Predictor", icon: TrendingUp },
      ]

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <span className="text-sm font-bold text-primary-foreground">JM</span>
          </div>
          <span className="font-bold text-foreground">Job Matchmakers</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-2">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-destructive/10 transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </Link>
      </div>
    </aside>
  )
}
