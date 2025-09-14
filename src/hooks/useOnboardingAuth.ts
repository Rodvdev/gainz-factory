import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  emailVerified?: Date | null
  personalManifesto?: string | null
  fitnessLevel?: string | null
  primaryGoals?: string[]
  bio?: string | null
  profileImageUrl?: string | null
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  user: User | null
}

export function useOnboardingAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    token: null,
    user: null
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("authToken")
        const userData = localStorage.getItem("user")

        if (token && userData) {
          const user = JSON.parse(userData)
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            token,
            user
          })
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            token: null,
            user: null
          })
          // Redirect to signin if not authenticated
          router.push("/signin")
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          token: null,
          user: null
        })
        router.push("/signin")
      }
    }

    checkAuth()
  }, [router])

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("authToken")
    
    if (!token) {
      router.push("/signin")
      throw new Error("No authentication token")
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      router.push("/signin")
      throw new Error("Authentication expired")
    }

    return response
  }

  return {
    ...authState,
    makeAuthenticatedRequest
  }
}
