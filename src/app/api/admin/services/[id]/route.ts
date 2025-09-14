import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Verificar que el usuario es admin
    const user = await prisma.user.findFirst({
      where: {
        id: token
      }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      description,
      level,
      price,
      duration,
      isActive
    } = body

    // Actualizar servicio
    const updatedService = await prisma.service.update({
      where: { id: params.id },
      data: {
        name,
        description,
        level,
        price: price ? parseFloat(price) : null,
        duration: duration ? parseInt(duration) : null,
        isActive
      }
    })

    return NextResponse.json({ service: updatedService })

  } catch (error) {
    console.error("Error updating service:", error)
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
    
    // Verificar que el usuario es admin
    const user = await prisma.user.findFirst({
      where: {
        id: token
      }
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Eliminar servicio
    await prisma.service.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Servicio eliminado correctamente" })

  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
