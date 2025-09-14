import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Fetch user's active challenges
    const challenges = await db.challenge.findMany({
      where: { 
        userId: user.id,
        isCompleted: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      challenges: challenges.map(challenge => ({
        id: challenge.id,
        name: challenge.name,
        description: challenge.description,
        category: challenge.category,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        targetValue: challenge.targetValue,
        currentValue: challenge.currentValue,
        isCompleted: challenge.isCompleted,
        reward: challenge.reward
      }))
    })
    
  } catch (error) {
    console.error("Error fetching challenges:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
