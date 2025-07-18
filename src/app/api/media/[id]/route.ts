import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/media/[id] - Get specific media content
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const mediaContent = await db.mediaContent.findUnique({
      where: { id: params.id },
      include: {
        progress: {
          select: {
            id: true,
            userId: true,
            progress: true,
            watchedAt: true
          }
        }
      }
    })

    if (!mediaContent) {
      return NextResponse.json(
        { error: 'Media content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ mediaContent })
  } catch (error) {
    console.error('Error fetching media content:', error)
    return NextResponse.json(
      { error: 'Error fetching media content' },
      { status: 500 }
    )
  }
}

// PUT /api/media/[id] - Update media content
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, type, url, topic, module, episode, isPremium } = body

    // Validate type if provided
    if (type) {
      const validTypes = ['video', 'pdf', 'ebook', 'audio']
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: 'Invalid media type. Must be: video, pdf, ebook, or audio' },
          { status: 400 }
        )
      }
    }

    // Validate topic if provided
    if (topic) {
      const validTopics = ['Mindset', 'Nutrición', 'Espiritualidad', 'Ejercicios']
      if (!validTopics.includes(topic)) {
        return NextResponse.json(
          { error: 'Invalid topic. Must be: Mindset, Nutrición, Espiritualidad, or Ejercicios' },
          { status: 400 }
        )
      }
    }

    const mediaContent = await db.mediaContent.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(url && { url }),
        ...(topic && { topic }),
        ...(module !== undefined && { module }),
        ...(episode !== undefined && { episode: episode ? parseInt(episode) : null }),
        ...(isPremium !== undefined && { isPremium })
      }
    })

    return NextResponse.json({ mediaContent })
  } catch (error) {
    console.error('Error updating media content:', error)
    return NextResponse.json(
      { error: 'Error updating media content' },
      { status: 500 }
    )
  }
}

// DELETE /api/media/[id] - Delete media content
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.mediaContent.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Media content deleted successfully' })
  } catch (error) {
    console.error('Error deleting media content:', error)
    return NextResponse.json(
      { error: 'Error deleting media content' },
      { status: 500 }
    )
  }
} 