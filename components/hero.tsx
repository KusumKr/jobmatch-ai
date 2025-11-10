"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-background to-background" />
      <div className="absolute -top-40 right-0 -z-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 left-0 -z-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2">
          <Sparkles size={16} className="text-accent" />
          <span className="text-sm text-accent">Powered by AI-driven insights</span>
        </div>

        <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Find Your Perfect Job Match
        </h1>

        <p className="mt-6 text-xl text-muted-foreground">
          AI-powered job matching that understands your skills, experience, and career goals. Connect with opportunities
          that matter.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/auth/signup?role=candidate"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            Find Jobs
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/auth/signup?role=recruiter"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-8 py-3 font-semibold text-foreground hover:bg-primary/10 transition"
          >
            Post a Job
          </Link>
        </div>
      </div>
    </section>
  )
}
