import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { db } from "@/lib/db"

// GET - List all forum topics
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const forumId = searchParams.get('forumId')

    const topics = await db.forumTopic.findMany({
      where: forumId ? { forumId } : undefined,
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
    })

    return NextResponse.json(topics)
    
  } catch (error) {
    console.error("Error fetching forum topics:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Create new forum topic
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, forumId, isPinned, isLocked, isActive } = body

    if (!title || !content || !forumId) {
      return NextResponse.json(
        { error: "Título, contenido y foro son requeridos" },
        { status: 400 }
      )
    }

    const topic = await db.forumTopic.create({
      data: {
        title,
        content,
        forumId,
        authorId: user.id,
        isPinned: isPinned ?? false,
        isLocked: isLocked ?? false,
        isActive: isActive ?? true
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

    return NextResponse.json(topic, { status: 201 })
    
  } catch (error) {
    console.error("Error creating forum topic:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
