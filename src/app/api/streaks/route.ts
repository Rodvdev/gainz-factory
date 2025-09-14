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

    // Fetch user's active streaks with habit data
    const streaks = await db.habitStreak.findMany({
      where: { 
        habit: {
          userId: user.id
        },
        isActive: true
      },
      include: {
        habit: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            points: true,
            color: true,
            icon: true,
            isActive: true
          }
        }
      },
      orderBy: {
        length: 'desc'
      }
    })

    return NextResponse.json({
      streaks: streaks.map(streak => ({
        id: streak.id,
        habitId: streak.habitId,
        length: streak.length,
        startDate: streak.startDate,
        isActive: streak.isActive,
        habit: {
          id: streak.habit.id,
          name: streak.habit.name,
          description: streak.habit.description,
          category: streak.habit.category,
          points: streak.habit.points,
          color: streak.habit.color,
          icon: streak.habit.icon,
          isActive: streak.habit.isActive
        }
      }))
    })
    
  } catch (error) {
    console.error("Error fetching streaks:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
