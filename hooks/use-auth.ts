"use client"

import { useEffect, useState } from "react"

type Role = "candidate" | "recruiter"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const token = window.localStorage.getItem("jm_token")
    const userRaw = window.localStorage.getItem("jm_user")

    if (!token || !userRaw) {
      setState({ user: null, token: null, loading: false })
      return
    }

    try {
      const user = JSON.parse(userRaw) as AuthUser
      setState({ user, token, loading: false })
    } catch {
      // Corrupt data, clear it
      window.localStorage.removeItem("jm_token")
      window.localStorage.removeItem("jm_user")
      setState({ user: null, token: null, loading: false })
    }
  }, [])

  return state
}

export function logoutClient() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem("jm_token")
  window.localStorage.removeItem("jm_user")
}


