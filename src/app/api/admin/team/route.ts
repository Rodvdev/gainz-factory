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

    // Obtener todos los miembros del equipo
    const teamMembers = await prisma.teamMember.findMany({
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
        _count: {
          select: {
            clientAssignments: true,
            calendarEvents: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ teamMembers })

  } catch (error) {
    console.error("Error fetching team members:", error)
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
      userId,
      role,
      specialty,
      bio,
      experience,
      hourlyRate,
      schedules
    } = body

    // Verificar que el usuario existe y no es ya un miembro del equipo
    const existingTeamMember = await prisma.teamMember.findUnique({
      where: { userId }
    })

    if (existingTeamMember) {
      return NextResponse.json({ error: "Este usuario ya es miembro del equipo" }, { status: 400 })
    }

    // Crear nuevo miembro del equipo
    const newTeamMember = await prisma.$transaction(async (tx) => {
      // Crear el miembro del equipo
      const teamMember = await tx.teamMember.create({
        data: {
          userId,
          role,
          specialty,
          bio,
          experience: experience || 0,
          hourlyRate
        }
      })

      // Crear horarios si se proporcionan
      if (schedules && Array.isArray(schedules)) {
        for (const schedule of schedules) {
          await tx.schedule.create({
            data: {
              teamMemberId: teamMember.id,
              dayOfWeek: schedule.dayOfWeek,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              isAvailable: schedule.isAvailable || true
            }
          })
        }
      }

      // Actualizar el rol del usuario a COACH
      await tx.user.update({
        where: { id: userId },
        data: { role: "COACH" }
      })

      return teamMember
    })

    // Obtener el miembro del equipo completo
    const teamMemberWithDetails = await prisma.teamMember.findUnique({
      where: { id: newTeamMember.id },
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

    return NextResponse.json({ teamMember: teamMemberWithDetails }, { status: 201 })

  } catch (error) {
    console.error("Error creating team member:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
