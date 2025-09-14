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

    const blogPosts = await db.blogPost.findMany({
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
        createdAt: 'desc'
      }
    })

    return NextResponse.json(blogPosts)
    
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

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
    const { title, content, tags } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Título y contenido son requeridos" },
        { status: 400 }
      )
    }

    const blogPost = await db.blogPost.create({
      data: {
        title,
        content,
        tags: tags || [],
        authorId: user.id
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        }
      }
    })

    return NextResponse.json(blogPost, { status: 201 })
    
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}