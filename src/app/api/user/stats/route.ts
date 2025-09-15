import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as jwt from "jsonwebtoken"
import { 
  UserWithStats, 
  DailyScoreWithStats, 
  HabitSuccessRate, 
  RecentAchievement, 
  LatestMetric, 
  UserStatsResponse 
} from "@/types/stats-api"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    // Obtener datos del usuario con todas las relaciones necesarias
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userLevel: true,
        dailyScores: {
          orderBy: { date: 'desc' },
          take: 365 // Último año
        },
        habits: {
          include: {
            entries: {
              orderBy: { date: 'desc' }
            },
            streaks: {
              where: { isActive: true },
              orderBy: { startDate: 'desc' }
            }
          }
        },
        userAchievements: {
          include: {
            achievement: true
          },
          orderBy: { unlockedAt: 'desc' }
        },
        userProgrammes: {
          include: {
            programme: true
          }
        },
        taskSubmissions: {
          where: {
            status: 'completed'
          },
          orderBy: { completedAt: 'desc' }
        },
        progressMetrics: {
          orderBy: { date: 'desc' },
          take: 30 // Últimas 30 métricas
        },
        challenges: {
          where: { isCompleted: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Calcular estadísticas reales
    const stats = await calculateUserStats(user)

    return NextResponse.json({ stats })

  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

async function calculateUserStats(user: UserWithStats): Promise<UserStatsResponse> {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))

  // 1. Días activos (días con al menos un daily score)
  const activeDays = user.dailyScores.length
  const daysSinceRegistration = Math.ceil((now.getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))

  // 2. Racha actual (días consecutivos con daily score)
  const currentStreak = calculateCurrentStreak(user.dailyScores, today)
  
  // 3. Racha máxima (la racha más larga de todas)
  const longestStreak = calculateLongestStreak(user.dailyScores)

  // 4. Puntos totales (suma de todos los daily scores)
  const totalPoints = user.dailyScores.reduce((sum: number, score: DailyScoreWithStats) => sum + score.totalPoints, 0)

  // 5. Promedio diario de completación
  const averageScore = activeDays > 0 
    ? user.dailyScores.reduce((sum: number, score: DailyScoreWithStats) => sum + (score.completedHabits / score.totalHabits * 100), 0) / activeDays
    : 0

  // 6. Hábitos completados (total de entradas completadas)
  const completedHabits = user.habits.reduce((sum: number, habit) => 
    sum + habit.entries.filter((entry) => entry.status === 'COMPLETED').length, 0
  )

  // 7. Programas completados
  const completedProgrammes = user.userProgrammes.filter((up) => up.status === 'completed').length
  const activeProgrammes = user.userProgrammes.filter((up) => up.status === 'active').length

  // 8. Tareas completadas
  const completedTasks = user.taskSubmissions.length

  // 9. Logros desbloqueados
  const achievementsUnlocked = user.userAchievements.length
  const recentAchievements = user.userAchievements.slice(0, 5)

  // 10. Desafíos completados
  const completedChallenges = user.challenges.length

  // 11. Progreso físico (últimas métricas)
  const latestWeight = user.progressMetrics.find((m) => m.metricType === 'weight')
  const latestBodyFat = user.progressMetrics.find((m) => m.metricType === 'body_fat')
  const latestMuscleMass = user.progressMetrics.find((m) => m.metricType === 'muscle_mass')

  // 12. Nivel y XP
  const userLevel = user.userLevel || {
    currentLevel: 1,
    totalXP: 0,
    levelName: "Novato GF",
    avatarEmoji: "🥚",
    totalPoints: 0,
    longestStreak: 0,
    achievementsUnlocked: 0
  }

  // 13. Estadísticas de los últimos 30 días
  const last30DaysScores = user.dailyScores.filter((score) => 
    new Date(score.date) >= thirtyDaysAgo
  )
  const last30DaysPoints = last30DaysScores.reduce((sum: number, score) => sum + score.totalPoints, 0)
  const last30DaysAverage = last30DaysScores.length > 0 
    ? last30DaysScores.reduce((sum: number, score) => sum + (score.completedHabits / score.totalHabits * 100), 0) / last30DaysScores.length
    : 0

  // 14. Hábitos más exitosos (por completación)
  const habitSuccessRates: HabitSuccessRate[] = user.habits.map((habit) => {
    const totalEntries = habit.entries.length
    const completedEntries = habit.entries.filter((entry) => entry.status === 'COMPLETED').length
    const successRate = totalEntries > 0 ? (completedEntries / totalEntries) * 100 : 0
    
    return {
      id: habit.id,
      name: habit.name,
      category: habit.category,
      successRate: Math.round(successRate),
      totalEntries,
      completedEntries
    }
  }).sort((a, b) => b.successRate - a.successRate)

  // 15. Tendencias de progreso
  const progressTrend = calculateProgressTrend(user.dailyScores, 7) // Última semana

  return {
    // Estadísticas principales
    totalDays: activeDays,
    daysSinceRegistration,
    currentStreak,
    longestStreak,
    totalPoints,
    averageScore: Math.round(averageScore * 10) / 10,
    completedHabits,
    
    // Programas y tareas
    completedProgrammes,
    activeProgrammes,
    completedTasks,
    
    // Logros y desafíos
    achievementsUnlocked,
    completedChallenges,
    recentAchievements: recentAchievements.map((ua): RecentAchievement => ({
      id: ua.achievement.id,
      title: ua.achievement.title,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      rarity: ua.achievement.rarity,
      unlockedAt: ua.unlockedAt
    })),
    
    // Nivel y gamificación
    level: userLevel.currentLevel,
    levelName: userLevel.levelName,
    avatarEmoji: userLevel.avatarEmoji,
    totalXP: userLevel.totalXP,
    
    // Progreso físico
    latestWeight: latestWeight ? {
      value: latestWeight.value,
      unit: latestWeight.unit,
      date: latestWeight.date
    } as LatestMetric : null,
    latestBodyFat: latestBodyFat ? {
      value: latestBodyFat.value,
      unit: latestBodyFat.unit,
      date: latestBodyFat.date
    } as LatestMetric : null,
    latestMuscleMass: latestMuscleMass ? {
      value: latestMuscleMass.value,
      unit: latestMuscleMass.unit,
      date: latestMuscleMass.date
    } as LatestMetric : null,
    
    // Estadísticas de período
    last30Days: {
      points: last30DaysPoints,
      averageScore: Math.round(last30DaysAverage * 10) / 10,
      activeDays: last30DaysScores.length
    },
    
    // Análisis detallado
    habitSuccessRates: habitSuccessRates.slice(0, 5), // Top 5 hábitos
    progressTrend,
    
    // Satisfacción estimada (basada en completación y consistencia)
    satisfaction: Math.min(100, Math.round(
      (averageScore * 0.4) + 
      (Math.min(currentStreak / 30, 1) * 30) + 
      (Math.min(achievementsUnlocked / 10, 1) * 30)
    ))
  }
}

function calculateCurrentStreak(dailyScores: DailyScoreWithStats[], today: Date): number {
  if (dailyScores.length === 0) return 0
  
  const sortedScores = dailyScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  let streak = 0
  let currentDate = new Date(today)
  
  for (const score of sortedScores) {
    const scoreDate = new Date(score.date)
    const daysDiff = Math.floor((currentDate.getTime() - scoreDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === streak) {
      streak++
      currentDate = new Date(scoreDate.getTime() - (24 * 60 * 60 * 1000))
    } else {
      break
    }
  }
  
  return streak
}

function calculateLongestStreak(dailyScores: DailyScoreWithStats[]): number {
  if (dailyScores.length === 0) return 0
  
  const sortedScores = dailyScores.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  let maxStreak = 0
  let currentStreak = 1
  
  for (let i = 1; i < sortedScores.length; i++) {
    const prevDate = new Date(sortedScores[i - 1].date)
    const currDate = new Date(sortedScores[i].date)
    const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 1) {
      currentStreak++
    } else {
      maxStreak = Math.max(maxStreak, currentStreak)
      currentStreak = 1
    }
  }
  
  return Math.max(maxStreak, currentStreak)
}

function calculateProgressTrend(dailyScores: DailyScoreWithStats[], days: number): 'up' | 'down' | 'stable' {
  if (dailyScores.length < days) return 'stable'
  
  const recentScores = dailyScores.slice(0, days)
  const firstHalf = recentScores.slice(0, Math.floor(days / 2))
  const secondHalf = recentScores.slice(Math.floor(days / 2))
  
  const firstHalfAvg = firstHalf.reduce((sum, score) => sum + score.totalPoints, 0) / firstHalf.length
  const secondHalfAvg = secondHalf.reduce((sum, score) => sum + score.totalPoints, 0) / secondHalf.length
  
  const difference = secondHalfAvg - firstHalfAvg
  const threshold = firstHalfAvg * 0.1 // 10% de cambio
  
  if (difference > threshold) return 'up'
  if (difference < -threshold) return 'down'
  return 'stable'
}
