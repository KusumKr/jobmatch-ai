"use client"

import { Brain, Zap, TrendingUp, Compass } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const features = [
  {
    icon: Brain,
    title: "AI Resume Analyzer",
    description: "Get intelligent feedback on your resume with AI-powered analysis",
    details: [
      "Extract skills automatically",
      "Get improvement suggestions",
      "Optimize for ATS systems",
      "Compare with top candidates",
    ],
    image: "/ai-resume-analyzer-dashboard.jpg",
    link: "/dashboard/candidate/resume",
    color: "from-primary to-primary/50",
  },
  {
    icon: Zap,
    title: "Smart Job Matching",
    description: "AI-powered recommendations tailored to your unique profile",
    details: [
      "Personalized job recommendations",
      "Real-time match percentage",
      "Culture fit analysis",
      "Career growth potential",
    ],
    image: "/smart-job-matching-interface.jpg",
    link: "/dashboard/candidate/jobs",
    color: "from-secondary to-secondary/50",
  },
  {
    icon: TrendingUp,
    title: "Salary Predictor",
    description: "Know your market worth with AI-estimated salary ranges",
    details: [
      "Market-based salary estimates",
      "Percentile comparison",
      "Location-based insights",
      "Experience level analysis",
    ],
    image: "/salary-prediction-analytics-chart.jpg",
    link: "/dashboard/candidate/salary",
    color: "from-accent to-accent/50",
  },
  {
    icon: Compass,
    title: "Career Path Recommendations",
    description: "Discover growth opportunities and progression paths",
    details: ["Personalized growth paths", "Skill gap analysis", "Industry trends", "Mentorship connections"],
    image: "/career-path-growth-visualization.jpg",
    link: "/dashboard/candidate",
    color: "from-primary to-accent",
  },
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              Explore Our AI-Powered Features
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Leverage cutting-edge AI technology to accelerate your career journey
            </p>
          </div>

          <div className="space-y-20">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {index % 2 === 0 ? (
                    <>
                      {/* Content - Left */}
                      <div>
                        <div className={`mb-6 inline-flex rounded-lg bg-gradient-to-br ${feature.color} p-3`}>
                          <Icon className="h-8 w-8 text-primary-foreground" />
                        </div>

                        <h2 className="text-4xl font-bold text-foreground mb-4">{feature.title}</h2>
                        <p className="text-lg text-muted-foreground mb-6">{feature.description}</p>

                        <ul className="space-y-3 mb-8">
                          {feature.details.map((detail, i) => (
                            <li key={i} className="flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                              <span className="text-foreground">{detail}</span>
                            </li>
                          ))}
                        </ul>

                        <Link
                          href={feature.link}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition"
                        >
                          Try Now
                          <span>→</span>
                        </Link>
                      </div>

                      {/* Image - Right */}
                      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden h-80">
                        <img
                          src={feature.image || "/placeholder.svg"}
                          alt={feature.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Image - Left */}
                      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden h-80">
                        <img
                          src={feature.image || "/placeholder.svg"}
                          alt={feature.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content - Right */}
                      <div>
                        <div className={`mb-6 inline-flex rounded-lg bg-gradient-to-br ${feature.color} p-3`}>
                          <Icon className="h-8 w-8 text-primary-foreground" />
                        </div>

                        <h2 className="text-4xl font-bold text-foreground mb-4">{feature.title}</h2>
                        <p className="text-lg text-muted-foreground mb-6">{feature.description}</p>

                        <ul className="space-y-3 mb-8">
                          {feature.details.map((detail, i) => (
                            <li key={i} className="flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                              <span className="text-foreground">{detail}</span>
                            </li>
                          ))}
                        </ul>

                        <Link
                          href={feature.link}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition"
                        >
                          Try Now
                          <span>→</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
