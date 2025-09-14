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
    
    // Obtener programas activos del usuario
    const userProgrammes = await prisma.userProgramme.findMany({
      where: {
        userId: decoded.userId,
        status: 'active'
      },
      include: {
        programme: {
          include: {
            weeklyPlans: {
              include: {
                dailyTasks: {
                  orderBy: [
                    { dayOfWeek: 'asc' },
                    { order: 'asc' }
                  ]
                }
              },
              orderBy: { weekNumber: 'asc' }
            }
          }
        }
      },
      orderBy: { startDate: 'desc' }
    })

    // Transformar datos para el dashboard
    const programmes = userProgrammes.map((up) => {
      const programme = up.programme
      
      // Calcular semana actual basada en startDate
      const startDate = new Date(up.startDate)
      const currentDate = new Date()
      const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const currentWeek = Math.min(Math.floor(daysDiff / 7) + 1, programme.weeklyPlans.length)
      
      // Encontrar la próxima tarea pendiente
      let nextTask = null
      const currentWeekPlan = programme.weeklyPlans.find(wp => wp.weekNumber === currentWeek)
      if (currentWeekPlan) {
        const today = new Date().getDay() // 0 = Domingo, 1 = Lunes, etc.
        const pendingTasks = currentWeekPlan.dailyTasks.filter(task => task.dayOfWeek === today)
        if (pendingTasks.length > 0) {
          nextTask = {
            title: pendingTasks[0].title,
            type: pendingTasks[0].taskType,
            dueDate: new Date().toISOString()
          }
        }
      }

      return {
        id: programme.id,
        title: programme.title,
        category: programme.category,
        progress: up.progress,
        currentWeek,
        totalWeeks: programme.weeklyPlans.length,
        nextTask,
        startDate: up.startDate,
        endDate: up.endDate
      }
    })

    return NextResponse.json({ programmes })

  } catch (error) {
    console.error("Error fetching user programmes:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
