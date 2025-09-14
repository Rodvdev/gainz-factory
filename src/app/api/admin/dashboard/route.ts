import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Decodificar el JWT para obtener el userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: string }
    
    // Verificar que el usuario es admin
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Obtener estadísticas del dashboard
    const [
      totalUsers,
      activeUsers,
      totalExercises,
      totalRecipes,
      totalMediaContent,
      totalBlogPosts,
      totalServices,
      habitCompletions,
      averageStreak
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.exercise.count(),
      prisma.recipe.count(),
      prisma.mediaContent.count(),
      prisma.blogPost.count(),
      prisma.service.count(),
      prisma.habitEntry.count({
        where: {
          status: "COMPLETED",
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }),
      prisma.habitStreak.aggregate({
        _avg: {
          length: true
        },
        where: {
          isActive: true
        }
      })
    ])

    // Calcular ingresos mensuales (simulado)
    const monthlyRevenue = totalUsers * 29.99 * 0.15 // 15% de conversión promedio

    // Actividad reciente (últimos 10 registros)
    const recentActivity = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    })

    const formattedActivity = recentActivity.map(user => ({
      id: user.id,
      type: "user_registration",
      description: `${user.firstName} ${user.lastName} se registró`,
      timestamp: user.createdAt.toISOString(),
      user: `${user.firstName} ${user.lastName}`
    }))

    const stats = {
      totalUsers,
      activeUsers,
      totalExercises,
      totalRecipes,
      totalMediaContent,
      totalBlogPosts,
      totalServices,
      monthlyRevenue: Math.round(monthlyRevenue),
      userGrowth: 12, // Simulado
      habitCompletions,
      averageStreak: Math.round(averageStreak._avg.length || 0),
      contentViews: 1250 // Simulado
    }

    return NextResponse.json({
      stats,
      recentActivity: formattedActivity
    })

  } catch (error) {
    console.error("Error fetching admin dashboard data:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
