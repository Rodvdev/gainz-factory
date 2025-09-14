import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Verificar que el usuario es admin
    const adminUser = await prisma.user.findFirst({
      where: {
        id: token
      }
    })

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { firstName, lastName, email, role } = await request.json()
    const { id: userId } = await params

    // Verificar si el email ya existe en otro usuario
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "El email ya está registrado por otro usuario" },
          { status: 400 }
        )
      }
    }

    // Actualizar el usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(role && { role })
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        onboardingCompleted: true,
        fitnessLevel: true,
        primaryGoals: true
      }
    })

    return NextResponse.json({ user: updatedUser })

  } catch (error) {
    console.error("Error updating user:", error)
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
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Verificar que el usuario es admin
    const adminUser = await prisma.user.findFirst({
      where: {
        id: token
      }
    })

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { id: userId } = await params

    // No permitir que un admin se elimine a sí mismo
    if (userId === token) {
      return NextResponse.json(
        { error: "No puedes eliminar tu propia cuenta" },
        { status: 400 }
      )
    }

    // Eliminar el usuario
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: "Usuario eliminado correctamente" })

  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
