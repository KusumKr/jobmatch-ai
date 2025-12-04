"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const plans = [
  {
    name: "Starter",
    description: "Perfect for job seekers just getting started",
    price: "Free",
    features: [
      "Browse job listings",
      "Basic job matching",
      "Resume upload (1 document)",
      "Limited to 5 job applications/month",
      "Email support",
    ],
  },
  {
    name: "Pro",
    description: "For serious job hunters",
    price: "$9.99",
    period: "/month",
    popular: true,
    features: [
      "Everything in Starter",
      "Advanced AI job matching",
      "Resume analyzer with AI feedback",
      "Salary predictor tool",
      "Unlimited job applications",
      "Career path recommendations",
      "Priority email support",
      "Save favorite jobs",
      "Job alerts (daily)",
    ],
  },
  {
    name: "Recruiter",
    description: "For companies hiring talent",
    price: "$49.99",
    period: "/month",
    features: [
      "Post unlimited job listings",
      "AI-powered candidate matching",
      "Candidate resume preview",
      "Shortlist & messaging",
      "Interview scheduling tools",
      "Team collaboration (up to 5 members)",
      "Advanced analytics dashboard",
      "Priority support",
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">Choose the perfect plan for your career or hiring needs</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 lg:gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative p-8 flex flex-col ${plan.popular ? "border-primary bg-card/50 md:scale-105 md:shadow-lg" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>

              <Button className="w-full mb-8" variant={plan.popular ? "default" : "outline"}>
                Get Started
              </Button>

              <div className="space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Need something custom?</h3>
          <p className="text-muted-foreground mb-6">Contact our sales team for enterprise solutions and bulk pricing</p>
          <Button variant="outline">Contact Sales</Button>
        </div>
      </div>
    </div>
  )
}
