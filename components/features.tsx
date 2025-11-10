"use client"

import { Brain, Zap, TrendingUp, Compass } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Resume Analyzer",
    description: "Extract skills and get intelligent feedback to optimize your resume for better matches",
    color: "from-primary to-primary/50",
  },
  {
    icon: Zap,
    title: "Smart Job Matching",
    description: "Get job recommendations that align perfectly with your skills and experience",
    color: "from-secondary to-secondary/50",
  },
  {
    icon: TrendingUp,
    title: "Salary Predictor",
    description: "Know your market worth with AI-estimated salary ranges based on your profile",
    color: "from-accent to-accent/50",
  },
  {
    icon: Compass,
    title: "Career Path Recommendations",
    description: "Discover growth opportunities and career progression paths tailored to your profile",
    color: "from-primary to-accent",
  },
]

export function Features() {
  return (
    <section id="features" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-balance text-4xl font-bold text-foreground sm:text-5xl">
            Powerful Features for Smart Job Hunting
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to land your dream job with AI assistance
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm hover:border-primary/50 transition"
              >
                <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${feature.color} p-3`}>
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
