"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import TransformationOS from "@/components/dashboard/TransformationOS"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          router.push("/login")
          return
        }

        // Verificar si el token es válido haciendo una petición simple
        const response = await fetch("/api/user/progress", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (!response.ok) {
          localStorage.removeItem("authToken")
          router.push("/login")
          return
        }

        setLoading(false)
      } catch (error) {
        console.error("Error checking auth:", error)
        localStorage.removeItem("authToken")
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return <TransformationOS />
} 