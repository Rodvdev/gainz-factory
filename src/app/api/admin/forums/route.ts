import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { db } from "@/lib/db"

// GET - List all forums
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const forums = await db.forum.findMany({
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
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            topics: true
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(forums)
    
  } catch (error) {
    console.error("Error fetching forums:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// POST - Create new forum
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

    const forum = await db.forum.create({
      data: {
        name,
        slug,
        description,
        icon,
        color,
        isActive: isActive ?? true,
        order: order ?? 0
      }
    })

    return NextResponse.json(forum, { status: 201 })
    
  } catch (error) {
    console.error("Error creating forum:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
