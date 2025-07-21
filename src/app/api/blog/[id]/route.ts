import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

// GET /api/blog/[id] - Get specific blog post
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const blogPost = await db.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
            bio: true
          }
        }
      }
    })

    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ blogPost })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Error fetching blog post' },
      { status: 500 }
    )
  }
}

// PUT /api/blog/[id] - Update blog post
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user owns the blog post or is admin
    const existingPost = await db.blogPost.findUnique({
      where: { id },
      select: { authorId: true }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only edit your own posts' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content, tags } = body

    // Validate tags array
    const validatedTags = Array.isArray(tags) ? tags.filter(tag => typeof tag === 'string') : undefined

    const blogPost = await db.blogPost.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(validatedTags !== undefined && { tags: validatedTags })
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

    return NextResponse.json({ blogPost })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Error updating blog post' },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/[id] - Delete blog post
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user owns the blog post
    const existingPost = await db.blogPost.findUnique({
      where: { id },
      select: { authorId: true }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only delete your own posts' },
        { status: 403 }
      )
    }

    await db.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Blog post deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Error deleting blog post' },
      { status: 500 }
    )
  }
} 