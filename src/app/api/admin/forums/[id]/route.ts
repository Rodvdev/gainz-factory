import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { db } from "@/lib/db"

// GET - Get specific forum
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const forum = await db.forum.findUnique({
      where: { id: params.id },
      include: {
        topics: {
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                profileImageUrl: true
              }
            },
            _count: {
              select: {
                replies: true
              }
            }
          },
          orderBy: [
            { isPinned: 'desc' },
            { createdAt: 'desc' }
          ]
        },
        _count: {
          select: {
            topics: true
          }
        }
      }
    })

    if (!forum) {
      return NextResponse.json(
        { error: "Foro no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(forum)
    
  } catch (error) {
    console.error("Error fetching forum:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PUT - Update forum
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, icon, color, isActive, order } = body

    if (!name) {
      return NextResponse.json(
        { error: "El nombre del foro es requerido" },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim()

    const forum = await db.forum.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        icon,
        color,
        isActive,
        order
      }
    })

    return NextResponse.json(forum)
    
  } catch (error) {
    console.error("Error updating forum:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Delete forum
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Check if forum has topics
    const forumWithTopics = await db.forum.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            topics: true
          }
        }
      }
    })

    if (!forumWithTopics) {
      return NextResponse.json(
        { error: "Foro no encontrado" },
        { status: 404 }
      )
    }

    if (forumWithTopics._count.topics > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar un foro que contiene temas. Elimina primero todos los temas." },
        { status: 400 }
      )
    }

    await db.forum.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Foro eliminado correctamente" })
    
  } catch (error) {
    console.error("Error deleting forum:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
