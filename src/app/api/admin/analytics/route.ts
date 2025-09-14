import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'
    
    // Calculate date range
    const now = new Date()
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))

    // Get analytics data
    const [
      totalUsers,
      activeUsers,
      newUsers,
      totalExercises,
      totalRecipes,
      totalMediaContent,
      totalBlogPosts,
      totalServices,
      habitCompletions,
      averageStreak,
      contentViews
    ] = await Promise.all([
      // Total users
      db.user.count(),
      
      // Active users (users with activity in the last 30 days)
      db.user.count({
        where: {
          dailyScores: {
            some: {
              date: {
                gte: new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
              }
            }
          }
        }
      }),
      
      // New users in the period
      db.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Content counts
      db.exercise.count(),
      db.recipe.count(),
      db.mediaContent.count(),
      db.blogPost.count(),
      db.service.count(),
      
      // Habit completions today
      db.habitEntry.count({
        where: {
          date: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
          },
          status: 'COMPLETED'
        }
      }),
      
      // Average streak length
      db.habitStreak.aggregate({
        _avg: {
          length: true
        },
        where: {
          isActive: true
        }
      }).then(result => Math.round(result._avg.length || 0)),
      
      // Content views (mock data for now)
      0
    ])

    // Calculate growth percentages (mock data for now)
    const userGrowth = 12.5
    const sessionGrowth = 8.3
    const revenueGrowth = 15.2

    const analytics = {
      totalUsers,
      activeUsers,
      newUsers,
      totalExercises,
      totalRecipes,
      totalMediaContent,
      totalBlogPosts,
      totalServices,
      monthlyRevenue: 12450, // Mock data
      userGrowth,
      habitCompletions,
      averageStreak,
      contentViews,
      totalSessions: 3456, // Mock data
      averageSessionDuration: 12.5, // Mock data
      pageViews: 15678, // Mock data
      bounceRate: 34.2, // Mock data
      conversionRate: 8.7, // Mock data
      revenue: 12450, // Mock data
      sessionGrowth,
      revenueGrowth
    }

    // Generate chart data for the period
    const chartData = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      // Get actual data for this date
      const dayUsers = await db.user.count({
        where: {
          createdAt: {
            gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
          }
        }
      })
      
      const daySessions = await db.habitEntry.count({
        where: {
          date: {
            gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
          }
        }
      })
      
      chartData.push({
        date: date.toISOString().split('T')[0],
        users: dayUsers,
        sessions: daySessions,
        revenue: Math.floor(Math.random() * 500) + 100 // Mock revenue data
      })
    }

    return NextResponse.json({
      analytics,
      chartData
    })
    
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
