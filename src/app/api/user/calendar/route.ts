import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { CalendarEventUnion } from "@/types/calendar"
import { 
  CalendarEventWithRelations, 
  HabitEntryWithHabit, 
  ChallengeWithRelations, 
  TaskSubmissionWithRelations, 
  ProgressMetricsWithRelations 
} from "@/types/calendar-api"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString())
    const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString())

    // Crear fechas de inicio y fin del mes
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    const userId = user.id

    // Obtener eventos principales del calendario
    const calendarEvents = await prisma.calendarEvent.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        programme: true,
        teamMember: {
          include: {
            user: true
          }
        }
      }
    })

    // Obtener entradas de hábitos
    const habitEntries = await prisma.habitEntry.findMany({
      where: {
        habit: { userId },
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        habit: true
      }
    })

    // Obtener desafíos
    const challenges = await prisma.challenge.findMany({
      where: {
        userId,
        OR: [
          {
            startDate: {
              gte: startDate,
              lte: endDate
            }
          },
          {
            endDate: {
              gte: startDate,
              lte: endDate
            }
          }
        ]
      }
    })

    // Obtener envíos de tareas
    const taskSubmissions = await prisma.taskSubmission.findMany({
      where: {
        userId,
        completedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        task: {
          include: {
            weeklyPlan: {
              include: {
                programme: true
              }
            }
          }
        }
      }
    })

    // Obtener métricas de progreso
    const progressMetrics = await prisma.progressMetrics.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Convertir todos los eventos a un formato estándar
    const events: CalendarEventUnion[] = []

    // Eventos del calendario principal
    calendarEvents.forEach((event: CalendarEventWithRelations) => {
      // Validar que el tipo sea uno de los tipos permitidos
      const validTypes = ['workout', 'nutrition', 'mindset', 'session', 'meeting'] as const
      const eventType = validTypes.includes(event.type as 'workout' | 'nutrition' | 'mindset' | 'session' | 'meeting') ? event.type as 'workout' | 'nutrition' | 'mindset' | 'session' | 'meeting' : 'workout'
      
      events.push({
        id: event.id,
        title: event.title,
        type: eventType,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
        location: event.location ?? undefined,
        coach: event.teamMember?.user?.firstName + ' ' + event.teamMember?.user?.lastName,
        programmeId: event.programmeId ?? undefined,
        programmeTitle: event.programme?.title ?? undefined,
        status: event.status,
        description: event.description ?? undefined,
        isRecurring: event.isRecurring,
        source: 'calendar'
      })
    })

    // Entradas de hábitos
    habitEntries.forEach((entry: HabitEntryWithHabit) => {
      const eventDate = new Date(entry.date)
      eventDate.setHours(9, 0, 0, 0) // Hora por defecto 9:00 AM
      const endDate = new Date(eventDate)
      endDate.setHours(10, 0, 0, 0) // Duración de 1 hora

      events.push({
        id: `habit-${entry.id}`,
        title: `${entry.habit.name} - ${entry.status}`,
        type: 'habit',
        startTime: eventDate.toISOString(),
        endTime: endDate.toISOString(),
        status: entry.status.toLowerCase(),
        description: entry.note || entry.habit.description || undefined,
        habitId: entry.habitId,
        habitCategory: entry.habit.category,
        source: 'habit'
      })
    })

    // Desafíos
    challenges.forEach((challenge: ChallengeWithRelations) => {
      const startDate = new Date(challenge.startDate)
      const endDate = new Date(challenge.endDate)
      
      events.push({
        id: `challenge-${challenge.id}`,
        title: challenge.name,
        type: 'challenge',
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        status: challenge.isCompleted ? 'completed' : 'active',
        description: challenge.description ?? undefined,
        targetValue: challenge.targetValue,
        currentValue: challenge.currentValue,
        reward: challenge.reward ?? undefined,
        source: 'challenge'
      })
    })

    // Envíos de tareas
    taskSubmissions.forEach((submission: TaskSubmissionWithRelations) => {
      events.push({
        id: `task-${submission.id}`,
        title: submission.task.title,
        type: 'task',
        startTime: submission.completedAt.toISOString(),
        endTime: new Date(submission.completedAt.getTime() + 30 * 60000).toISOString(), // +30 min
        status: submission.status,
        description: submission.task.description ?? undefined,
        programmeTitle: submission.task.weeklyPlan.programme.title,
        programmeId: submission.task.weeklyPlan.programmeId,
        taskType: submission.task.taskType,
        score: submission.score ?? undefined,
        feedback: submission.feedback ?? undefined,
        source: 'task'
      })
    })

    // Métricas de progreso
    progressMetrics.forEach((metric: ProgressMetricsWithRelations) => {
      const eventDate = new Date(metric.date)
      eventDate.setHours(8, 0, 0, 0) // Hora por defecto 8:00 AM
      const endDate = new Date(eventDate)
      endDate.setHours(9, 0, 0, 0) // Duración de 1 hora

      events.push({
        id: `metric-${metric.id}`,
        title: `Progreso: ${metric.metricType} - ${metric.value} ${metric.unit}`,
        type: 'progress',
        startTime: eventDate.toISOString(),
        endTime: endDate.toISOString(),
        status: 'completed',
        description: metric.notes ?? undefined,
        metricType: metric.metricType,
        value: metric.value,
        unit: metric.unit,
        photoUrl: metric.photoUrl ?? undefined,
        isPrivate: metric.isPrivate,
        source: 'progress'
      })
    })

    // Ordenar eventos por fecha
    events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

    return NextResponse.json({
      events,
      total: events.length,
      month,
      year
    })

  } catch (error) {
    console.error("Error fetching calendar events:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}