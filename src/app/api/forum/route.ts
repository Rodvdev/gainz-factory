import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const forumPosts = await db.forumPost.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        },
        comments: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to match expected format
    const transformedPosts = forumPosts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        firstName: post.user.firstName,
        lastName: post.user.lastName,
        profileImageUrl: post.user.profileImageUrl
      },
      category: post.category || "General",
      tags: [], // Forum posts don't have tags in current schema
      createdAt: post.createdAt.toISOString(),
      views: 0, // Not tracked in current schema
      commentsCount: post.comments.length,
      isPinned: false, // Not in current schema
      status: "active" as const
    }))

    return NextResponse.json(transformedPosts)
    
  } catch (error) {
    console.error("Error fetching forum posts:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, category } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Título y contenido son requeridos" },
        { status: 400 }
      )
    }

    const forumPost = await db.forumPost.create({
      data: {
        title,
        content,
        category: category || "General",
        userId: user.id
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        }
      }
    })

    return NextResponse.json(forumPost, { status: 201 })
    
  } catch (error) {
    console.error("Error creating forum post:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
