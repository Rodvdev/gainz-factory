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
    
    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString())
    
    // Calcular rango de fechas para el mes
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)
    
    // Obtener eventos del calendario del usuario
    const calendarEvents = await prisma.calendarEvent.findMany({
      where: {
        userId: decoded.userId,
        startTime: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        programme: {
          select: {
            id: true,
            title: true
          }
        },
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

    // Obtener tareas de programmes activos para el mes
    const userProgrammes = await prisma.userProgramme.findMany({
      where: {
        userId: decoded.userId,
        status: 'active',
        startDate: {
          lte: endDate
        },
        OR: [
          { endDate: null },
          { endDate: { gte: startDate } }
        ]
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

    // Generar eventos de programmes para el mes
    const programmeEvents = []
    
    for (const userProgramme of userProgrammes) {
      const programme = userProgramme.programme
      const startProgrammeDate = new Date(userProgramme.startDate)
      
      for (const weeklyPlan of programme.weeklyPlans) {
        const weekStartDate = new Date(startProgrammeDate)
        weekStartDate.setDate(startProgrammeDate.getDate() + (weeklyPlan.weekNumber - 1) * 7)
        
        for (const dailyTask of weeklyPlan.dailyTasks) {
          const taskDate = new Date(weekStartDate)
          taskDate.setDate(weekStartDate.getDate() + dailyTask.dayOfWeek)
          
          // Verificar si la tarea está en el rango del mes solicitado
          if (taskDate >= startDate && taskDate <= endDate) {
            // Verificar si ya está completada
            const isCompleted = await prisma.taskSubmission.findUnique({
              where: {
                userId_taskId: {
                  userId: decoded.userId,
                  taskId: dailyTask.id
                }
              }
            })

            programmeEvents.push({
              id: `programme-${dailyTask.id}`,
              title: dailyTask.title,
              type: dailyTask.taskType.toLowerCase(),
              startTime: taskDate.toISOString(),
              endTime: new Date(taskDate.getTime() + (dailyTask.estimatedDuration || 30) * 60000).toISOString(),
              status: isCompleted ? 'completed' : 'scheduled',
              programmeId: programme.id,
              programmeTitle: programme.title,
              taskData: dailyTask.taskData
            })
          }
        }
      }
    }

    // Combinar eventos del calendario con eventos de programmes
    const allEvents = [
      ...calendarEvents.map(event => ({
        id: event.id,
        title: event.title,
        type: event.type,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
        location: event.location,
        coach: event.teamMember ? 
          `${event.teamMember.user.firstName} ${event.teamMember.user.lastName}` : 
          null,
        programmeId: event.programmeId,
        programmeTitle: event.programme?.title,
        status: event.status
      })),
      ...programmeEvents
    ]

    // Ordenar eventos por fecha
    allEvents.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    return NextResponse.json({ events: allEvents })

  } catch (error) {
    console.error("Error fetching calendar events:", error)
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
    const {
      type,
      title,
      description,
      startTime,
      endTime,
      location,
      programmeId,
      teamMemberId
    } = body

    // Crear nuevo evento en el calendario
    const newEvent = await prisma.calendarEvent.create({
      data: {
        userId: decoded.userId,
        type,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        programmeId,
        teamMemberId
      },
      include: {
        programme: {
          select: {
            id: true,
            title: true
          }
        },
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
      }
    })

    return NextResponse.json({ event: newEvent }, { status: 201 })

  } catch (error) {
    console.error("Error creating calendar event:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
