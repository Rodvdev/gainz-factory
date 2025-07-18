import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

// GET /api/blog - Get all blog posts with filtering and search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    const authorId = searchParams.get('authorId')

    const where: {
      tags?: { has: string }
      authorId?: string
      OR?: Array<{ 
        title?: { contains: string; mode: 'insensitive' }
        content?: { contains: string; mode: 'insensitive' }
      }>
    } = {}
    
    if (tag) where.tags = { has: tag }
    if (authorId) where.authorId = authorId
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    const blogPosts = await db.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get all unique tags for filtering
    const allPosts = await db.blogPost.findMany({
      select: { tags: true }
    })
    
    const allTags = [...new Set(allPosts.flatMap(post => post.tags))]

    return NextResponse.json({ blogPosts, allTags })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Error fetching blog posts' },
      { status: 500 }
    )
  }
}

// POST /api/blog - Create new blog post
export async function POST(request: Request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, tags } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Validate tags array
    const validatedTags = Array.isArray(tags) ? tags.filter(tag => typeof tag === 'string') : []

    const blogPost = await db.blogPost.create({
      data: {
        title,
        content,
        tags: validatedTags,
        authorId: user.id
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true
          }
        }
      }
    })

    return NextResponse.json({ blogPost }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Error creating blog post' },
      { status: 500 }
    )
  }
} 