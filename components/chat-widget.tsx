"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const botResponses = [
  {
    patterns: ["hello", "hi", "hey", "greetings"],
    responses: [
      "Hello! Welcome to Job Matchmakers. How can I help you today? You can ask me about job recommendations, resume tips, or career advice.",
      "Hi there! 👋 I'm your career assistant. Would you like help finding jobs, optimizing your resume, or learning about salary trends?",
    ],
  },
  {
    patterns: ["job", "position", "role", "opportunity"],
    responses: [
      "I'd be happy to help! Are you looking for specific types of jobs? I can help you find positions based on your skills, experience, and preferences.",
      "Looking for a new opportunity? Tell me about your skills and experience, and I'll suggest the best-matched positions for you.",
    ],
  },
  {
    patterns: ["resume", "cv", "profile", "experience"],
    responses: [
      "Great! I can help optimize your resume for better visibility. Visit the Resume Analyzer in your dashboard for AI-powered suggestions to improve your profile.",
      "Your resume is important! I recommend using our AI Resume Analyzer to identify skills gaps and get specific improvement recommendations.",
    ],
  },
  {
    patterns: ["salary", "payment", "compensation", "wage"],
    responses: [
      "Want to know your market worth? Check out the Salary Predictor tool in your dashboard to get AI-estimated salary ranges based on your profile.",
      "I can help you understand salary expectations. Use our Salary Predictor to see competitive compensation for your role and experience level.",
    ],
  },
  {
    patterns: ["career", "growth", "development", "path"],
    responses: [
      "Career growth is important! I can help you identify skill gaps and recommend paths for advancement based on industry trends.",
      "Let's discuss your career goals. What area would you like to develop in? I can suggest learning resources and career progression strategies.",
    ],
  },
  {
    patterns: ["help", "support", "question", "how"],
    responses: [
      "I'm here to help! You can ask me about: job matching, resume optimization, salary insights, career guidance, or platform features.",
      "Happy to help! What would you like to know about? I can assist with finding jobs, improving applications, or career planning.",
    ],
  },
  {
    patterns: ["thanks", "thank you", "appreciate"],
    responses: [
      "You're welcome! Let me know if there's anything else I can help you with.",
      "Happy to help! Feel free to reach out anytime you need career advice or job search assistance.",
    ],
  },
]

function getResponse(input: string): string {
  const lowerInput = input.toLowerCase()

  for (const rule of botResponses) {
    if (rule.patterns.some((pattern) => lowerInput.includes(pattern))) {
      return rule.responses[Math.floor(Math.random() * rule.responses.length)]
    }
  }

  return "Great question! I'm learning about that. In the meantime, feel free to explore our features like the Resume Analyzer, Job Matches, and Salary Predictor. Is there anything else I can help with?"
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! 👋 I'm your Job Matchmakers AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(input),
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl transition hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-h-96 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="border-b border-border bg-gradient-to-r from-primary to-accent px-6 py-4">
            <h3 className="text-lg font-semibold text-primary-foreground">Career Assistant</h3>
            <p className="text-xs text-primary-foreground/80">AI-powered job search help</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-lg px-4 py-2.5 max-w-xs text-sm ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-muted text-foreground rounded-lg px-4 py-2.5">
                  <Loader size={16} className="animate-spin" />
                  <span className="text-sm">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border bg-card/50 p-4 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="rounded-lg bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-muted-foreground text-center">Ask about jobs, resume tips, or career advice</p>
          </div>
        </div>
      )}
    </>
  )
}
