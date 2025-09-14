import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { db } from "@/lib/db"

// GET - Get specific forum topic
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

    const topic = await db.forumTopic.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        },
        forum: {
          select: {
            name: true,
            slug: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true,
                profileImageUrl: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!topic) {
      return NextResponse.json(
        { error: "Tema no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(topic)
    
  } catch (error) {
    console.error("Error fetching forum topic:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PUT - Update forum topic
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
    const { title, content, isPinned, isLocked, isActive } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Título y contenido son requeridos" },
        { status: 400 }
      )
    }

    const topic = await db.forumTopic.update({
      where: { id: params.id },
      data: {
        title,
        content,
        isPinned,
        isLocked,
        isActive
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        },
        forum: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(topic)
    
  } catch (error) {
    console.error("Error updating forum topic:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Delete forum topic
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

    await db.forumTopic.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Tema eliminado correctamente" })
    
  } catch (error) {
    console.error("Error deleting forum topic:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
