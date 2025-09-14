import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { db } from "@/lib/db"

// GET - List all forum replies
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
    const topicId = searchParams.get('topicId')

    const replies = await db.forumReply.findMany({
      where: topicId ? { topicId } : undefined,
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
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(replies)
    
  } catch (error) {
    console.error("Error fetching forum replies:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Create new forum reply
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
    const { content, topicId, parentId, isSolution } = body

    if (!content || !topicId) {
      return NextResponse.json(
        { error: "Contenido y tema son requeridos" },
        { status: 400 }
      )
    }

    const reply = await db.forumReply.create({
      data: {
        content,
        topicId,
        authorId: user.id,
        parentId: parentId || null,
        isSolution: isSolution ?? false
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

    // Update last reply info on topic
    await db.forumTopic.update({
      where: { id: topicId },
      data: {
        lastReplyAt: new Date(),
        lastReplyBy: user.id
      }
    })

    return NextResponse.json(reply, { status: 201 })
    
  } catch (error) {
    console.error("Error creating forum reply:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
