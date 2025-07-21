import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuth } from "@/lib/auth"

// GET /api/media/[id]/progress - Get user progress for specific media
export async function GET(
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

    const progress = await db.mediaProgress.findFirst({
      where: {
        mediaId: id,
        userId: user.id
      },
      include: {
        media: {
          select: {
            title: true,
            type: true,
            topic: true,
            module: true,
            episode: true
          }
        }
      }
    })

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error fetching media progress:', error)
    return NextResponse.json(
      { error: 'Error fetching media progress' },
      { status: 500 }
    )
  }
}

// POST /api/media/[id]/progress - Update user progress for specific media
export async function POST(
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

    const body = await request.json()
    const { progress: progressValue } = body

    if (typeof progressValue !== 'number' || progressValue < 0 || progressValue > 1) {
      return NextResponse.json(
        { error: 'Progress must be a number between 0 and 1' },
        { status: 400 }
      )
    }

    // Check if media content exists
    const mediaContent = await db.mediaContent.findUnique({
      where: { id }
    })

    if (!mediaContent) {
      return NextResponse.json(
        { error: 'Media content not found' },
        { status: 404 }
      )
    }

    // Check if progress exists
    const existingProgress = await db.mediaProgress.findFirst({
      where: {
        userId: user.id,
        mediaId: id
      }
    })

    // Update or create progress
    const progress = existingProgress 
      ? await db.mediaProgress.update({
          where: { id: existingProgress.id },
          data: {
            progress: progressValue,
            watchedAt: progressValue > 0 ? new Date() : null
          },
          include: {
            media: {
              select: {
                title: true,
                type: true,
                topic: true,
                module: true,
                episode: true
              }
            }
          }
        })
      : await db.mediaProgress.create({
          data: {
            userId: user.id,
            mediaId: id,
            progress: progressValue,
            watchedAt: progressValue > 0 ? new Date() : null
          },
          include: {
            media: {
              select: {
                title: true,
                type: true,
                topic: true,
                module: true,
                episode: true
              }
            }
          }
        })

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error updating media progress:', error)
    return NextResponse.json(
      { error: 'Error updating media progress' },
      { status: 500 }
    )
  }
} 