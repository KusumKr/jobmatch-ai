"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Engineer",
    text: "Job Matchmakers helped me find the perfect role in just 2 weeks. The AI matching was incredibly accurate.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager",
    text: "The salary predictor gave me confidence in negotiations. Best career tool I've used.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist",
    text: "As a recruiter, finding qualified candidates has never been easier. The platform is a game-changer.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-balance text-4xl font-bold text-foreground sm:text-5xl">
            Loved by Job Seekers and Recruiters
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-xl border border-border bg-card/50 p-8 backdrop-blur-sm">
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-4 text-foreground">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
