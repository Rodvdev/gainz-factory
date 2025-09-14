import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { HabitCategory } from "@prisma/client"

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
    const timeRange = searchParams.get('timeRange') || 'month'
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]

    // Calculate date range based on timeRange
    const end = new Date(endDate)
    const start = new Date(end)
    
    switch (timeRange) {
      case 'week':
        start.setDate(start.getDate() - 7)
        break
      case 'month':
        start.setDate(start.getDate() - 30)
        break
      case 'year':
        start.setDate(start.getDate() - 365)
        break
      default:
        start.setDate(start.getDate() - 30)
    }

    // Get all data in parallel
    const [
      dailyScores,
      habits,
      streaks,
      totalHabits,
      categoryStats,
      milestones
    ] = await Promise.all([
      // Get daily scores for the date range
      db.dailyScore.findMany({
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
      }),
      
      // Get user's habits
      db.habit.findMany({
        where: {
          userId: user.id,
          isActive: true
        },
        select: {
          id: true,
          name: true,
          category: true,
          points: true,
          color: true,
          icon: true
        }
      }),
      
      // Get active streaks
      db.habitStreak.findMany({
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
              category: true,
              points: true,
              color: true,
              icon: true
            }
          }
        },
        orderBy: {
          length: 'desc'
        }
      }),
      
      // Get total habits count
      db.habit.count({
        where: {
          userId: user.id,
          isActive: true
        }
      }),
      
      // Get category performance
      getCategoryPerformance(user.id, start, end),
      
      // Get milestones
      getMilestones(user.id)
    ])

    // Generate data for all days in range (including days without scores)
    const timeSeriesData = []
    const currentDate = new Date(start)
    
    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0]
      const dayScore = dailyScores.find(score => 
        score.date.toISOString().split('T')[0] === dateString
      )

      timeSeriesData.push({
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
    const currentStreak = streaks.length > 0 ? Math.max(...streaks.map(streak => streak.length)) : 0

    // Calculate total statistics
    const totalStats = {
      totalPoints: timeSeriesData.reduce((sum, day) => sum + day.totalPoints, 0),
      averageDaily: timeSeriesData.length > 0 
        ? Math.round((timeSeriesData.reduce((sum, day) => sum + day.totalPoints, 0) / timeSeriesData.length) * 10) / 10
        : 0,
      bestStreak: await getBestStreak(user.id),
      currentStreak,
      totalHabits,
      completionRate: timeSeriesData.length > 0 
        ? Math.round(timeSeriesData.reduce((sum, day) => sum + (day.totalHabits > 0 ? (day.completedHabits / day.totalHabits) * 100 : 0), 0) / timeSeriesData.length * 10) / 10
        : 0,
      activeDays: timeSeriesData.filter(day => day.completedHabits > 0).length,
      totalDays: timeSeriesData.length
    }

    // Calculate quick stats
    const quickStats = {
      daysActive: totalStats.activeDays,
      uniqueHabits: habits.length,
      bestDay: timeSeriesData.reduce((best, current) => 
        current.totalPoints > best.totalPoints ? current : best
      ),
      favoriteCategory: getFavoriteCategory(categoryStats),
      totalTime: Math.round(totalStats.activeDays * 2.5 * 10) / 10 // Estimated 2.5 hours per active day
    }

    return NextResponse.json({
      timeSeriesData,
      totalStats,
      categoryStats,
      milestones,
      quickStats,
      currentStreak,
      habits: habits.slice(0, 5), // Top 5 habits for sidebar
      streaks: streaks.slice(0, 3) // Top 3 streaks for sidebar
    })
    
  } catch (error) {
    console.error("Error fetching progress data:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

async function getCategoryPerformance(userId: string, startDate: Date, endDate: Date) {
  const categories = Object.values(HabitCategory)
  const categoryStats = []

  for (const category of categories) {
    // Get habits in this category
    const categoryHabits = await db.habit.findMany({
      where: {
        userId: userId,
        category: category,
        isActive: true
      }
    })

    if (categoryHabits.length === 0) continue

    // Get completed entries for this category in the date range
    const completedEntries = await db.habitEntry.count({
      where: {
        habit: {
          userId: userId,
          category: category
        },
        status: 'COMPLETED',
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Calculate total possible completions
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const totalPossible = categoryHabits.length * totalDays
    const percentage = totalPossible > 0 ? Math.round((completedEntries / totalPossible) * 100) : 0

    categoryStats.push({
      category,
      name: getCategoryName(category),
      icon: getCategoryIcon(category),
      completed: completedEntries,
      total: totalPossible,
      percentage,
      habits: categoryHabits.length
    })
  }

  return categoryStats.sort((a, b) => b.percentage - a.percentage)
}

async function getMilestones(userId: string) {
  // Get user's join date
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { createdAt: true }
  })

  if (!user) return []

  const joinDate = user.createdAt
  const daysSinceJoin = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24))

  // Get user's best streak
  const bestStreak = await getBestStreak(userId)

  // Get total points
  const totalPoints = await db.dailyScore.aggregate({
    where: { userId },
    _sum: { totalPoints: true }
  })

  const totalPointsValue = totalPoints._sum.totalPoints || 0

  // Define milestones
  const milestones = [
    {
      name: "Primera semana completada",
      date: new Date(joinDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      icon: "🎯",
      achieved: daysSinceJoin >= 7,
      description: "Completa tu primera semana de hábitos"
    },
    {
      name: "100 puntos en un día",
      date: "2024-01-12", // This would be calculated from actual data
      icon: "💯",
      achieved: false, // This would be calculated from actual data
      description: "Alcanza 100 puntos en un solo día"
    },
    {
      name: "Racha de 14 días",
      date: "2024-01-18", // This would be calculated from actual data
      icon: "🔥",
      achieved: bestStreak >= 14,
      description: "Mantén una racha de 14 días consecutivos"
    },
    {
      name: "Racha de 21 días",
      date: "2024-01-25", // This would be calculated from actual data
      icon: "⭐",
      achieved: bestStreak >= 21,
      description: "Mantén una racha de 21 días consecutivos"
    },
    {
      name: "Racha de 30 días",
      date: "2024-02-03", // This would be calculated from actual data
      icon: "🏆",
      achieved: bestStreak >= 30,
      description: "Mantén una racha de 30 días consecutivos"
    },
    {
      name: "1000 puntos totales",
      date: "2024-02-10", // This would be calculated from actual data
      icon: "💎",
      achieved: totalPointsValue >= 1000,
      description: "Acumula 1000 puntos en total"
    }
  ]

  return milestones
}

async function getBestStreak(userId: string): Promise<number> {
  try {
    const bestStreak = await db.habitStreak.findFirst({
      where: {
        habit: {
          userId: userId
        }
      },
      orderBy: {
        length: 'desc'
      },
      select: {
        length: true
      }
    })

    return bestStreak?.length || 0
  } catch (error) {
    console.error("Error calculating best streak:", error)
    return 0
  }
}

function getFavoriteCategory(categoryStats: { name: string; percentage: number }[]): string {
  if (categoryStats.length === 0) return "Ninguna"
  
  const favorite = categoryStats.reduce((best, current) => 
    current.percentage > best.percentage ? current : best
  )
  
  return favorite.name
}

function getCategoryName(category: HabitCategory): string {
  const names = {
    [HabitCategory.MORNING_ROUTINE]: "Rutina Matutina",
    [HabitCategory.PHYSICAL_TRAINING]: "Entrenamiento",
    [HabitCategory.NUTRITION]: "Nutrición",
    [HabitCategory.DEEP_WORK]: "Trabajo Profundo",
    [HabitCategory.PERSONAL_DEVELOPMENT]: "Desarrollo Personal",
    [HabitCategory.SOCIAL_CHARISMA]: "Carisma Social",
    [HabitCategory.REFLECTION]: "Reflexión",
    [HabitCategory.SLEEP_RECOVERY]: "Sueño y Descanso"
  }
  return names[category] || category
}

function getCategoryIcon(category: HabitCategory): string {
  const icons = {
    [HabitCategory.MORNING_ROUTINE]: "🌅",
    [HabitCategory.PHYSICAL_TRAINING]: "💪",
    [HabitCategory.NUTRITION]: "🥗",
    [HabitCategory.DEEP_WORK]: "🎯",
    [HabitCategory.PERSONAL_DEVELOPMENT]: "📚",
    [HabitCategory.SOCIAL_CHARISMA]: "🤝",
    [HabitCategory.REFLECTION]: "💭",
    [HabitCategory.SLEEP_RECOVERY]: "😴"
  }
  return icons[category] || "📋"
}
