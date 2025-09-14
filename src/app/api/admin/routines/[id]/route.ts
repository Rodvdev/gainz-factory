import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Obtener rutina específica
    const routine = await prisma.workoutRoutine.findUnique({
      where: { id: params.id },
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
                intensity: true,
                description: true,
                technique: true,
                videoUrl: true,
                imageUrl: true,
                targetMuscles: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!routine) {
      return NextResponse.json({ error: "Rutina no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ routine })

  } catch (error) {
    console.error("Error fetching routine:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verificar que la rutina existe
    const existingRoutine = await prisma.workoutRoutine.findUnique({
      where: { id: params.id }
    })

    if (!existingRoutine) {
      return NextResponse.json({ error: "Rutina no encontrada" }, { status: 404 })
    }

    // Actualizar rutina usando transacción para manejar ejercicios
    const updatedRoutine = await prisma.$transaction(async (tx) => {
      // Actualizar datos básicos de la rutina
      const routine = await tx.workoutRoutine.update({
        where: { id: params.id },
        data: {
          title,
          objective,
          level,
          duration,
          isPublic
        }
      })

      // Si se proporcionan ejercicios, actualizar la lista
      if (exercises) {
        // Eliminar ejercicios existentes
        await tx.routineExercise.deleteMany({
          where: { routineId: params.id }
        })

        // Crear nuevos ejercicios
        await tx.routineExercise.createMany({
          data: exercises.map((exercise: any, index: number) => ({
            routineId: params.id,
            exerciseId: exercise.exerciseId,
            order: index + 1,
            sets: exercise.sets,
            reps: exercise.reps,
            restSeconds: exercise.restSeconds
          }))
        })
      }

      // Retornar rutina actualizada con ejercicios
      return await tx.workoutRoutine.findUnique({
        where: { id: params.id },
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
                  intensity: true,
                  description: true,
                  technique: true,
                  videoUrl: true,
                  imageUrl: true,
                  targetMuscles: true
                }
              }
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      })
    })

    return NextResponse.json({ routine: updatedRoutine })

  } catch (error) {
    console.error("Error updating routine:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verificar que la rutina existe
    const existingRoutine = await prisma.workoutRoutine.findUnique({
      where: { id: params.id }
    })

    if (!existingRoutine) {
      return NextResponse.json({ error: "Rutina no encontrada" }, { status: 404 })
    }

    // Eliminar rutina (los ejercicios se eliminan automáticamente por cascade)
    await prisma.workoutRoutine.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Rutina eliminada exitosamente" })

  } catch (error) {
    console.error("Error deleting routine:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
