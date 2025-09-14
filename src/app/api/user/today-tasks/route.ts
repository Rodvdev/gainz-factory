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
    
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
    
    // Obtener tareas de hoy del usuario
    const todayTasks = await prisma.calendarEvent.findMany({
      where: {
        userId: decoded.userId,
        startTime: {
          gte: todayStart,
          lt: todayEnd
        },
        status: {
          not: 'cancelled'
        }
      },
      include: {
        programme: true,
        teamMember: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { startTime: 'asc' }
    })

    // Obtener tareas de programmes activos para hoy
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
                dailyTasks: true
              }
            }
          }
        }
      }
    })

    // Calcular tareas de programmes para hoy
    const programmeTasks = []
    const todayWeekDay = today.getDay() // 0 = Domingo, 1 = Lunes, etc.

    for (const userProgramme of userProgrammes) {
      const programme = userProgramme.programme
      
      // Calcular semana actual
      const startDate = new Date(userProgramme.startDate)
      const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const currentWeek = Math.min(Math.floor(daysDiff / 7) + 1, programme.weeklyPlans.length)
      
      // Buscar tareas para hoy en la semana actual
      const currentWeekPlan = programme.weeklyPlans.find(wp => wp.weekNumber === currentWeek)
      if (currentWeekPlan) {
        const todayTasksFromPlan = currentWeekPlan.dailyTasks.filter((task) => task.dayOfWeek === todayWeekDay)
        
        for (const task of todayTasksFromPlan) {
          // Verificar si ya está completada
          const isCompleted = await prisma.taskSubmission.findUnique({
            where: {
              userId_taskId: {
                userId: decoded.userId,
                taskId: task.id
              }
            }
          })

          programmeTasks.push({
            id: task.id,
            title: task.title,
            type: task.taskType,
            time: `${task.estimatedDuration || 30} min`,
            isCompleted: !!isCompleted,
            programmeId: programme.id,
            programmeTitle: programme.title,
            taskData: task.taskData
          })
        }
      }
    }

    // Combinar eventos del calendario con tareas de programmes
    const calendarTasks = todayTasks.map(event => ({
      id: event.id,
      title: event.title,
      type: event.type,
      time: new Date(event.startTime).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isCompleted: event.status === 'completed',
      programmeId: event.programmeId,
      programmeTitle: event.programme?.title,
      location: event.location,
      coach: event.teamMember ? 
        `${event.teamMember.user.firstName} ${event.teamMember.user.lastName}` : 
        null
    }))

    // Combinar y ordenar todas las tareas
    const allTasks = [...programmeTasks, ...calendarTasks].sort((a, b) => {
      // Ordenar por hora si está disponible, sino por orden de creación
      if (a.time && b.time) {
        return a.time.localeCompare(b.time)
      }
      return 0
    })

    return NextResponse.json({ tasks: allTasks })

  } catch (error) {
    console.error("Error fetching today's tasks:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
