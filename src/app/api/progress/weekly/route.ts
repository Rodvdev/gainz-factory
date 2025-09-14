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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]

    // Calculate date range
    const end = new Date(endDate)
    const start = new Date(end)
    start.setDate(start.getDate() - days + 1)

    // Get daily scores for the date range
    const dailyScores = await db.dailyScore.findMany({
      where: {
        userId: user.id,
        date: {
          gte: start,
          lte: end
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Get user's habits to calculate total habits
    const totalHabits = await db.habit.count({
      where: {
        userId: user.id,
        isActive: true
      }
    })

    // Generate data for all days in range (including days without scores)
    const weeklyData = []
    const currentDate = new Date(start)
    
    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0]
      const dayScore = dailyScores.find(score => 
        score.date.toISOString().split('T')[0] === dateString
      )

      weeklyData.push({
        date: dateString,
        totalPoints: dayScore?.totalPoints || 0,
        completedHabits: dayScore?.completedHabits || 0,
        totalHabits: dayScore?.totalHabits || totalHabits,
        morningScore: dayScore?.morningScore || 0,
        physicalScore: dayScore?.physicalScore || 0,
        nutritionScore: dayScore?.nutritionScore || 0,
        workScore: dayScore?.workScore || 0,
        developmentScore: dayScore?.developmentScore || 0,
        socialScore: dayScore?.socialScore || 0,
        reflectionScore: dayScore?.reflectionScore || 0,
        sleepScore: dayScore?.sleepScore || 0
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Calculate current streak
    const currentStreak = await calculateCurrentStreak(user.id)

    // Calculate summary stats
    const summaryStats = {
      totalPoints: weeklyData.reduce((sum, day) => sum + day.totalPoints, 0),
      totalCompletedHabits: weeklyData.reduce((sum, day) => sum + day.completedHabits, 0),
      activeDays: weeklyData.filter(day => day.completedHabits > 0).length,
      averageCompletionRate: weeklyData.length > 0 
        ? weeklyData.reduce((sum, day) => sum + (day.totalHabits > 0 ? (day.completedHabits / day.totalHabits) * 100 : 0), 0) / weeklyData.length
        : 0,
      bestDay: weeklyData.reduce((best, current) => 
        current.totalPoints > best.totalPoints ? current : best
      ),
      currentStreak
    }

    return NextResponse.json({
      weeklyData,
      summaryStats,
      currentStreak
    })
    
  } catch (error) {
    console.error("Error fetching weekly progress:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

async function calculateCurrentStreak(userId: string): Promise<number> {
  try {
    // Get all active habit streaks
    const activeStreaks = await db.habitStreak.findMany({
      where: {
        habit: {
          userId: userId
        },
        isActive: true
      },
      orderBy: {
        length: 'desc'
      }
    })

    if (activeStreaks.length === 0) {
      return 0
    }

    // Return the longest active streak
    return Math.max(...activeStreaks.map(streak => streak.length))
  } catch (error) {
    console.error("Error calculating current streak:", error)
    return 0
  }
}
