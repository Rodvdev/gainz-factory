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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    // Obtener datos del usuario
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        personalManifesto: true,
        fitnessLevel: true,
        primaryGoals: true,
        bio: true,
        profileImageUrl: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Obtener puntuación diaria más reciente
    const today = new Date().toISOString().split('T')[0]
    const dailyScore = await prisma.dailyScore.findFirst({
      where: {
        userId: decoded.userId,
        date: new Date(today)
      }
    })

    // Obtener hábitos del usuario
    const habits = await prisma.habit.findMany({
      where: { userId: decoded.userId, isActive: true },
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
    })

    // Obtener desafíos activos
    const challenges = await prisma.challenge.findMany({
      where: {
        userId: decoded.userId,
        isCompleted: false,
        endDate: { gte: new Date() }
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        startDate: true,
        endDate: true,
        targetValue: true,
        currentValue: true,
        isCompleted: true,
        reward: true
      }
    })

    // Obtener rachas activas
    const streaks = await prisma.habitStreak.findMany({
      where: { 
        habit: { userId: decoded.userId },
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
      }
    })

    // Obtener nivel del usuario
    let userLevel = await prisma.userLevelData.findUnique({
      where: { userId: decoded.userId }
    })

    if (!userLevel) {
      userLevel = await prisma.userLevelData.create({
        data: {
          userId: decoded.userId,
          currentLevel: 1,
          totalXP: 0,
          currentLevelXP: 0,
          nextLevelXP: 100,
          levelName: "Novato GF",
          avatarEmoji: "🥚"
        }
      })
    }

    // Obtener logros del usuario
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: decoded.userId },
      include: {
        achievement: true
      },
      orderBy: { unlockedAt: 'desc' },
      take: 10
    })

    // Obtener configuración de niveles
    const levelConfigs = await prisma.levelConfig.findMany({
      where: { isActive: true },
      orderBy: { level: 'asc' }
    })

    // Calcular estadísticas
    const totalPoints = dailyScore?.totalPoints || 0
    const completedHabits = dailyScore?.completedHabits || 0
    const totalHabits = dailyScore?.totalHabits || habits.length
    const currentStreak = Math.max(...streaks.map(s => s.length), 0)
    
    // Calcular progreso hacia el siguiente nivel
    const nextLevelConfig = levelConfigs.find(config => config.level === userLevel.currentLevel + 1)
    const currentLevelConfig = levelConfigs.find(config => config.level === userLevel.currentLevel)
    
    const levelProgress = nextLevelConfig 
      ? ((userLevel.totalXP - (currentLevelConfig?.requiredXP || 0)) / (nextLevelConfig.requiredXP - (currentLevelConfig?.requiredXP || 0))) * 100
      : 100

    // Preparar datos de logros
    const achievements = userAchievements.map(ua => ({
      id: ua.achievement.id,
      title: ua.achievement.title,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      unlockedAt: ua.unlockedAt.toISOString(),
      rarity: ua.achievement.rarity.toLowerCase(),
      category: ua.achievement.category.toLowerCase()
    }))

    const recentAchievements = achievements.slice(0, 5)

    return NextResponse.json({
      user,
      dailyScore,
      habits,
      challenges,
      streaks,
      userLevel: {
        ...userLevel,
        progress: Math.max(0, Math.min(100, levelProgress)),
        nextLevelXP: nextLevelConfig?.requiredXP || 0,
        currentLevelConfig,
        nextLevelConfig
      },
      achievements,
      recentAchievements,
      stats: {
        totalPoints,
        completedHabits,
        totalHabits,
        currentStreak,
        totalAchievements: achievements.length,
        activeChallenges: challenges.length,
        activeStreaks: streaks.length
      }
    })

  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
