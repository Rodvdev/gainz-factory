import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
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

    // Obtener todo el contenido multimedia
    const content = await prisma.mediaContent.findMany({
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ content })

  } catch (error) {
    console.error("Error fetching content:", error)
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
      type,
      url,
      topic,
      module,
      episode,
      isPremium = false
    } = body

    // Crear nuevo contenido
    const newContent = await prisma.mediaContent.create({
      data: {
        title,
        type,
        url,
        topic,
        module,
        episode: episode ? parseInt(episode) : null,
        isPremium
      }
    })

    return NextResponse.json({ content: newContent }, { status: 201 })

  } catch (error) {
    console.error("Error creating content:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
