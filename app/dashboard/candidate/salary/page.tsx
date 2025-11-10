"use client"

import { TrendingUp, BarChart3 } from "lucide-react"
import { TopNav } from "@/components/dashboard/top-nav"

export default function SalaryPage() {
  return (
    <div className="flex-1 bg-background">
      <TopNav title="Salary Predictor" />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">Estimate Your Market Value</h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Job Title</label>
              <input
                type="text"
                placeholder="e.g., Senior React Developer"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Years of Experience</label>
              <input
                type="number"
                placeholder="e.g., 8"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g., San Francisco, CA"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Top Skills</label>
              <input
                type="text"
                placeholder="e.g., React, TypeScript, Node.js"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <button className="w-full rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition">
              Predict Salary
            </button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Estimated Salary Range</h3>
                <TrendingUp className="text-primary" size={24} />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Annual Salary</p>
                  <p className="text-4xl font-bold text-primary">$145k - $185k</p>
                </div>
                <div className="rounded-lg bg-background/50 p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Salary Range</p>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: "65%" }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>$100k</span>
                    <span>$250k</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Market Insights</h3>
                <BarChart3 className="text-secondary" size={24} />
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span className="text-foreground">
                    You're in the <strong>75th percentile</strong> of earners in your field
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span className="text-foreground">
                    Highest demand for React developers in <strong>tech hubs</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span className="text-foreground">
                    Remote positions offer <strong>5-15% more</strong> in your market
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
