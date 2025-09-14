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

    // Obtener miembro del equipo específico
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true,
            phoneNumber: true
          }
        },
        schedules: true,
        clientAssignments: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        calendarEvents: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { startTime: 'desc' },
          take: 10
        }
      }
    })

    if (!teamMember) {
      return NextResponse.json({ error: "Miembro del equipo no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ teamMember })

  } catch (error) {
    console.error("Error fetching team member:", error)
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
      role,
      specialty,
      bio,
      experience,
      hourlyRate,
      isActive,
      isAvailable,
      schedules
    } = body

    // Actualizar miembro del equipo
    const updatedTeamMember = await prisma.$transaction(async (tx) => {
      // Actualizar datos básicos
      const teamMember = await tx.teamMember.update({
        where: { id },
        data: {
          role,
          specialty,
          bio,
          experience,
          hourlyRate,
          isActive,
          isAvailable
        }
      })

      // Actualizar horarios si se proporcionan
      if (schedules && Array.isArray(schedules)) {
        // Eliminar horarios existentes
        await tx.schedule.deleteMany({
          where: { teamMemberId: id }
        })

        // Crear nuevos horarios
        for (const schedule of schedules) {
          await tx.schedule.create({
            data: {
              teamMemberId: id,
              dayOfWeek: schedule.dayOfWeek,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              isAvailable: schedule.isAvailable || true
            }
          })
        }
      }

      return teamMember
    })

    // Obtener el miembro actualizado con detalles
    const teamMemberWithDetails = await prisma.teamMember.findUnique({
      where: { id: updatedTeamMember.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true
          }
        },
        schedules: true
      }
    })

    return NextResponse.json({ teamMember: teamMemberWithDetails })

  } catch (error) {
    console.error("Error updating team member:", error)
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

    // Obtener el miembro del equipo para acceder al userId
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
      select: { userId: true }
    })

    if (!teamMember) {
      return NextResponse.json({ error: "Miembro del equipo no encontrado" }, { status: 404 })
    }

    // Eliminar miembro del equipo y actualizar rol del usuario
    await prisma.$transaction(async (tx) => {
      // Eliminar el miembro del equipo (esto eliminará en cascada los horarios y asignaciones)
      await tx.teamMember.delete({
        where: { id }
      })

      // Actualizar el rol del usuario de vuelta a USER
      await tx.user.update({
        where: { id: teamMember.userId },
        data: { role: "USER" }
      })
    })

    return NextResponse.json({ message: "Miembro del equipo eliminado exitosamente" })

  } catch (error) {
    console.error("Error deleting team member:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
