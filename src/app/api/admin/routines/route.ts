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
    
    // Decodificar el JWT para obtener el userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    // Verificar que el usuario es admin
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Obtener todas las rutinas con información del usuario y ejercicios
    const routines = await prisma.workoutRoutine.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                type: true,
                level: true,
                intensity: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            exercises: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ routines })

  } catch (error) {
    console.error("Error fetching routines:", error)
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
    
    // Decodificar el JWT para obtener el userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    // Verificar que el usuario es admin
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      objective,
      level,
      duration,
      isPublic,
      exercises
    } = body

    // Crear nueva rutina con ejercicios
    const newRoutine = await prisma.workoutRoutine.create({
      data: {
        userId: decoded.userId, // Admin crea la rutina
        title,
        objective,
        level,
        duration,
        isPublic: isPublic || false,
        exercises: {
          create: exercises.map((exercise: any, index: number) => ({
            exerciseId: exercise.exerciseId,
            order: index + 1,
            sets: exercise.sets,
            reps: exercise.reps,
            restSeconds: exercise.restSeconds
          }))
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                type: true,
                level: true,
                intensity: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return NextResponse.json({ routine: newRoutine }, { status: 201 })

  } catch (error) {
    console.error("Error creating routine:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
