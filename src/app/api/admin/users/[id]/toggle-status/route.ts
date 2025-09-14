import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import * as jwt from "jsonwebtoken"

const prisma = new PrismaClient()

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
    
    // Decodificar el JWT para obtener el userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    // Verificar que el usuario es admin
    const adminUser = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      }
    })

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await request.json()
    const { isActive } = body

    // Actualizar el estado del usuario
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive },
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
        primaryGoals: true,
        bio: true,
        phoneNumber: true,
        profileImageUrl: true,
        timezone: true,
        preferredLanguage: true,
        weeklyCommitment: true,
        intensityPreference: true,
        motivationType: true,
        personalManifesto: true
      }
    })

    return NextResponse.json({ user: updatedUser })

  } catch (error) {
    console.error("Error toggling user status:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
