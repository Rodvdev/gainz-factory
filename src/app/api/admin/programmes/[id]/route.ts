import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Obtener el programa específico
    const programme = await prisma.programme.findUnique({
      where: { id },
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

    if (!programme) {
      return NextResponse.json({ error: "Programa no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ programme })

  } catch (error) {
    console.error("Error fetching programme:", error)
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      isActive
    } = body

    // Actualizar el programa
    const updatedProgramme = await prisma.programme.update({
      where: { id },
      data: {
        title,
        description,
        category,
        level,
        duration,
        isPublic,
        isActive
      },
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

    return NextResponse.json({ programme: updatedProgramme })

  } catch (error) {
    console.error("Error updating programme:", error)
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Eliminar el programa (esto eliminará en cascada los planes semanales y tareas)
    await prisma.programme.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Programa eliminado exitosamente" })

  } catch (error) {
    console.error("Error deleting programme:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
