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
    
    // Obtener logros desbloqueados por el usuario
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: decoded.userId },
      include: {
        achievement: true
      },
      orderBy: { unlockedAt: 'desc' }
    })

    // Obtener todos los logros disponibles
    const allAchievements = await prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { points: 'desc' }
    })

    // Separar logros desbloqueados y no desbloqueados
    const unlockedAchievements = userAchievements.map(ua => ({
      ...ua.achievement,
      unlockedAt: ua.unlockedAt,
      isViewed: ua.isViewed
    }))

    const unlockedIds = new Set(unlockedAchievements.map(a => a.id))
    const lockedAchievements = allAchievements.filter(a => !unlockedIds.has(a.id))

    // Estadísticas
    const totalAchievements = allAchievements.length
    const unlockedCount = unlockedAchievements.length
    const recentAchievements = unlockedAchievements.slice(0, 5)

    // Agrupar por categoría
    const achievementsByCategory = unlockedAchievements.reduce((acc, achievement) => {
      const category = achievement.category.toLowerCase()
      if (!acc[category]) acc[category] = []
      acc[category].push(achievement)
      return acc
    }, {} as Record<string, typeof unlockedAchievements>)

    return NextResponse.json({
      achievements: unlockedAchievements,
      lockedAchievements,
      totalAchievements,
      unlockedCount,
      recentAchievements,
      achievementsByCategory,
      stats: {
        common: unlockedAchievements.filter(a => a.rarity === 'COMMON').length,
        rare: unlockedAchievements.filter(a => a.rarity === 'RARE').length,
        epic: unlockedAchievements.filter(a => a.rarity === 'EPIC').length,
        legendary: unlockedAchievements.filter(a => a.rarity === 'LEGENDARY').length
      }
    })

  } catch (error) {
    console.error("Error fetching user achievements:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    const body = await request.json()
    const { achievementId } = body

    // Verificar que el logro existe
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId }
    })

    if (!achievement) {
      return NextResponse.json({ error: "Logro no encontrado" }, { status: 404 })
    }

    // Verificar que el usuario no tenga ya este logro
    const existingUserAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: decoded.userId,
          achievementId: achievementId
        }
      }
    })

    if (existingUserAchievement) {
      return NextResponse.json({ error: "Ya tienes este logro" }, { status: 400 })
    }

    // Desbloquear el logro
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId: decoded.userId,
        achievementId: achievementId
      },
      include: {
        achievement: true
      }
    })

    // Actualizar contador de logros en UserLevelData
    await prisma.userLevelData.upsert({
      where: { userId: decoded.userId },
      create: {
        userId: decoded.userId,
        achievementsUnlocked: 1,
        totalXP: achievement.points,
        totalPoints: achievement.points
      },
      update: {
        achievementsUnlocked: {
          increment: 1
        },
        totalXP: {
          increment: achievement.points
        },
        totalPoints: {
          increment: achievement.points
        }
      }
    })

    return NextResponse.json({
      achievement: userAchievement.achievement,
      unlockedAt: userAchievement.unlockedAt
    })

  } catch (error) {
    console.error("Error unlocking achievement:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
