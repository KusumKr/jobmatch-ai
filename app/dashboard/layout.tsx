 "use client"

 import type { ReactNode } from "react"
 import { useEffect } from "react"
 import { useRouter } from "next/navigation"
 import { Sidebar } from "@/components/dashboard/sidebar"
 import { ThemeProvider } from "@/components/theme-provider"
 import { useAuth } from "@/hooks/use-auth"

function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        Checking your session...
      </div>
    )
  }

  if (!user) {
    // Short flash before redirect
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="jm-theme">
      <DashboardShell>{children}</DashboardShell>
    </ThemeProvider>
  )
}
