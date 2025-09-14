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
      title,
      description,
      objective,
      level,
      isPremium,
      imageUrl,
      videoUrl
    } = body

    // Actualizar receta
    const updatedRecipe = await prisma.recipe.update({
      where: { id: params.id },
      data: {
        title,
        description,
        objective,
        level,
        isPremium: isPremium || false,
        imageUrl,
        videoUrl
      }
    })

    return NextResponse.json({ recipe: updatedRecipe })

  } catch (error) {
    console.error("Error updating recipe:", error)
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

    // Eliminar receta
    await prisma.recipe.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Receta eliminada correctamente" })

  } catch (error) {
    console.error("Error deleting recipe:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
