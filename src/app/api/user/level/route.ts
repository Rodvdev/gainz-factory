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
    
    // Obtener o crear el nivel del usuario
    let userLevel = await prisma.userLevelData.findUnique({
      where: { userId: decoded.userId }
    })

    if (!userLevel) {
      // Crear nivel inicial para el usuario
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

    // Obtener configuración de niveles
    const levelConfigs = await prisma.levelConfig.findMany({
      where: { isActive: true },
      orderBy: { level: 'asc' }
    })

    // Calcular progreso hacia el siguiente nivel
    const nextLevelConfig = levelConfigs.find(config => config.level === userLevel.currentLevel + 1)
    const currentLevelConfig = levelConfigs.find(config => config.level === userLevel.currentLevel)
    
    const progress = nextLevelConfig 
      ? ((userLevel.totalXP - (currentLevelConfig?.requiredXP || 0)) / (nextLevelConfig.requiredXP - (currentLevelConfig?.requiredXP || 0))) * 100
      : 100

    return NextResponse.json({
      userLevel,
      levelConfigs,
      progress: Math.max(0, Math.min(100, progress)),
      nextLevelXP: nextLevelConfig?.requiredXP || 0,
      currentLevelConfig,
      nextLevelConfig
    })

  } catch (error) {
    console.error("Error fetching user level:", error)
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
    const { points, streak } = body

    // Obtener nivel actual del usuario
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

    // Actualizar puntos y racha
    const updatedUserLevel = await prisma.userLevelData.update({
      where: { userId: decoded.userId },
      data: {
        totalXP: userLevel.totalXP + (points || 0),
        totalPoints: userLevel.totalPoints + (points || 0),
        longestStreak: Math.max(userLevel.longestStreak, streak || 0)
      }
    })

    // Verificar si el usuario subió de nivel
    const levelConfigs = await prisma.levelConfig.findMany({
      where: { isActive: true },
      orderBy: { level: 'asc' }
    })

    let leveledUp = false
    let newLevelConfig = null

    for (const config of levelConfigs) {
      if (updatedUserLevel.totalXP >= config.requiredXP && config.level > updatedUserLevel.currentLevel) {
        leveledUp = true
        newLevelConfig = config
        
        // Actualizar nivel del usuario
        await prisma.userLevelData.update({
          where: { userId: decoded.userId },
          data: {
            currentLevel: config.level,
            levelName: config.name,
            avatarEmoji: config.emoji,
            currentLevelXP: updatedUserLevel.totalXP - config.requiredXP,
            nextLevelXP: levelConfigs.find(c => c.level === config.level + 1)?.requiredXP || config.requiredXP
          }
        })
        break
      }
    }

    return NextResponse.json({
      userLevel: updatedUserLevel,
      leveledUp,
      newLevel: newLevelConfig
    })

  } catch (error) {
    console.error("Error updating user level:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
