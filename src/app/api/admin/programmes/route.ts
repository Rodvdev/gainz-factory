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
    
    // Verificar que el usuario es admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Obtener todos los programas con sus planes semanales
    const programmes = await prisma.programme.findMany({
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
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ programmes })

  } catch (error) {
    console.error("Error fetching programmes:", error)
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
    
    // Verificar que el usuario es admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      level,
      duration,
      isPublic,
      weeklyPlans
    } = body

    // Crear nuevo programa con planes semanales usando transacción
    const newProgramme = await prisma.$transaction(async (tx) => {
      // Crear el programa
      const programme = await tx.programme.create({
        data: {
          title,
          description,
          category,
          level,
          duration,
          isPublic: isPublic || false,
          createdBy: decoded.userId
        }
      })

      // Crear los planes semanales si se proporcionan
      if (weeklyPlans && Array.isArray(weeklyPlans)) {
        for (const weeklyPlan of weeklyPlans) {
          const createdWeeklyPlan = await tx.weeklyPlan.create({
            data: {
              programmeId: programme.id,
              weekNumber: weeklyPlan.weekNumber,
              title: weeklyPlan.title,
              description: weeklyPlan.description
            }
          })

          // Crear las tareas diarias si se proporcionan
          if (weeklyPlan.dailyTasks && Array.isArray(weeklyPlan.dailyTasks)) {
            for (const dailyTask of weeklyPlan.dailyTasks) {
              await tx.dailyTask.create({
                data: {
                  weeklyPlanId: createdWeeklyPlan.id,
                  dayOfWeek: dailyTask.dayOfWeek,
                  taskType: dailyTask.taskType,
                  title: dailyTask.title,
                  description: dailyTask.description,
                  taskData: dailyTask.taskData,
                  isRequired: dailyTask.isRequired || true,
                  estimatedDuration: dailyTask.estimatedDuration,
                  order: dailyTask.order || 0
                }
              })
            }
          }
        }
      }

      // Retornar el programa completo
      return await tx.programme.findUnique({
        where: { id: programme.id },
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
      })
    })

    return NextResponse.json({ programme: newProgramme }, { status: 201 })

  } catch (error) {
    console.error("Error creating programme:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
