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
      include: {
        userLevel: true,
        userAchievements: {
          include: {
            achievement: true
          },
          orderBy: {
            unlockedAt: 'desc'
          },
          take: 5
        },
        userProgrammes: {
          include: {
            programme: true
          }
        },
        taskSubmissions: {
          where: {
            status: 'completed'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Calcular progreso
    const userLevel = user.userLevel || {
      totalXP: 0,
      currentLevel: 1,
      levelName: "Novato GF",
      avatarEmoji: "🥚",
      totalPoints: 0,
      longestStreak: 0,
      achievementsUnlocked: 0
    }

    // Calcular streak actual (simplificado)
    const weeklyStreak = userLevel.longestStreak || 0

    // Contar programas completados
    const completedProgrammes = user.userProgrammes.filter(up => up.status === 'completed').length
    const activeProgrammes = user.userProgrammes.filter(up => up.status === 'active').length

    // Contar entrenamientos (simplificado - basado en task submissions)
    const totalWorkouts = user.taskSubmissions.filter(ts => 
      ts.task.taskType === 'WORKOUT' || ts.task.taskType === 'CARDIO'
    ).length

    const progress = {
      totalXP: userLevel.totalXP,
      currentLevel: userLevel.currentLevel,
      levelName: userLevel.levelName,
      avatarEmoji: userLevel.avatarEmoji,
      weeklyStreak,
      completedProgrammes,
      activeProgrammes,
      totalWorkouts,
      recentAchievements: user.userAchievements.slice(0, 3).map(ua => ({
        id: ua.id,
        title: ua.achievement.title,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
        unlockedAt: ua.unlockedAt
      }))
    }

    return NextResponse.json({ progress })

  } catch (error) {
    console.error("Error fetching user progress:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
