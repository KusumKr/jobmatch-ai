"use client"

import { Menu, X, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/job%20matchmakers%20logo-ylsHIZseNNDYC2jKMn0GeoXoHovuC7.png"
                alt="Job Matchmakers Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">Job Matchmakers</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition">
              Testimonials
            </Link>
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground transition"
              aria-label="Toggle theme"
            >
              {mounted ? theme === "dark" ? <Sun size={20} /> : <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden rounded-lg bg-muted p-2 text-muted-foreground hover:text-foreground transition"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4 md:hidden">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition">
              Testimonials
            </Link>
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition">
              About
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
