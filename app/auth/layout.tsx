import type { ReactNode } from "react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-primary/20 via-background to-secondary/10 lg:flex flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <span className="text-lg font-bold text-primary-foreground">JM</span>
          </div>
          <span className="text-2xl font-bold text-foreground">Job Matchmakers</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Your AI-Powered Career Companion</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of professionals finding their perfect job match through intelligent AI matching and
              insights.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              "AI-driven job recommendations tailored to your skills",
              "Real-time salary market insights and predictions",
              "Smart resume analysis and optimization suggestions",
              "Direct connection with top companies",
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex w-full items-center justify-center lg:w-1/2 p-4">{children}</div>
    </div>
  )
}
