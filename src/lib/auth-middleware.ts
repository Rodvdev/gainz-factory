import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/lib/db"

export interface AuthenticatedUser {
  id: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  emailVerified: Date | null
  personalManifesto?: string | null
  fitnessLevel?: string | null
  primaryGoals?: string[]
  bio?: string | null
  profileImageUrl?: string | null
  role: string
}

export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get("authorization")
    let token: string | null = null

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7)
    } else {
      // Fallback: try to get from cookie
      const cookieToken = request.cookies.get("authToken")?.value
      if (cookieToken) {
        token = cookieToken
      }
    }

    if (!token) {
      return null
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: string }

    if (!decoded.userId) {
      return null
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        emailVerified: true,
        personalManifesto: true,
        fitnessLevel: true,
        primaryGoals: true,
        bio: true,
        profileImageUrl: true,
        role: true
      }
    })

    if (!user || !user.isActive) {
      return null
    }

    return user
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export function createUnauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: "No autorizado" }),
    { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    }
  )
}
