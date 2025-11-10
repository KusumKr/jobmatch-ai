"use client"

import { Bell, Settings, User } from "lucide-react"

interface TopNavProps {
  title: string
}

export function TopNav({ title }: TopNavProps) {
  return (
    <div className="border-b border-border bg-card/30 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <div className="flex items-center gap-4">
          <button className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground transition">
            <Bell size={20} />
          </button>
          <button className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground transition">
            <Settings size={20} />
          </button>
          <button className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground transition">
            <User size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
