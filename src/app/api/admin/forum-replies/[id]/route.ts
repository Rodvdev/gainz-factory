import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { db } from "@/lib/db"

// GET - Get specific forum reply
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { id } = await params
    const reply = await db.forumReply.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        },
        topic: {
          select: {
            title: true,
            forum: {
              select: {
                name: true
              }
            }
          }
        },
        parent: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    if (!reply) {
      return NextResponse.json(
        { error: "Respuesta no encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(reply)
    
  } catch (error) {
    console.error("Error fetching forum reply:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PUT - Update forum reply
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { content, isSolution } = body

    if (!content) {
      return NextResponse.json(
        { error: "Contenido es requerido" },
        { status: 400 }
      )
    }

    const reply = await db.forumReply.update({
      where: { id },
      data: {
        content,
        isSolution
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        },
        topic: {
          select: {
            title: true,
            forum: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(reply)
    
  } catch (error) {
    console.error("Error updating forum reply:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Delete forum reply
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { id } = await params
    await db.forumReply.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Respuesta eliminada correctamente" })
    
  } catch (error) {
    console.error("Error deleting forum reply:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
