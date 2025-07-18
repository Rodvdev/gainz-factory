import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/media - Get all media content with filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const topic = searchParams.get('topic')
    const module = searchParams.get('module')
    const isPremium = searchParams.get('isPremium')
    const search = searchParams.get('search')

    const where: {
      type?: string
      topic?: { contains: string; mode: 'insensitive' }
      module?: { contains: string; mode: 'insensitive' }
      isPremium?: boolean
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' } }>
    } = {}
    
    if (type) where.type = type
    if (topic) where.topic = { contains: topic, mode: 'insensitive' }
    if (module) where.module = { contains: module, mode: 'insensitive' }
    if (isPremium !== null && isPremium !== undefined) where.isPremium = isPremium === 'true'
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } }
      ]
    }

    const mediaContent = await db.mediaContent.findMany({
      where,
      orderBy: [
        { module: 'asc' },
        { episode: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({ mediaContent })
  } catch (error) {
    console.error('Error fetching media content:', error)
    return NextResponse.json(
      { error: 'Error fetching media content' },
      { status: 500 }
    )
  }
}

// POST /api/media - Create new media content
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, type, url, topic, module, episode, isPremium } = body

    if (!title || !type || !url || !topic) {
      return NextResponse.json(
        { error: 'Title, type, URL, and topic are required' },
        { status: 400 }
      )
    }

    // Validate type
    const validTypes = ['video', 'pdf', 'ebook', 'audio']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid media type. Must be: video, pdf, ebook, or audio' },
        { status: 400 }
      )
    }

    // Validate topic
    const validTopics = ['Mindset', 'Nutrición', 'Espiritualidad', 'Ejercicios']
    if (!validTopics.includes(topic)) {
      return NextResponse.json(
        { error: 'Invalid topic. Must be: Mindset, Nutrición, Espiritualidad, or Ejercicios' },
        { status: 400 }
      )
    }

    const mediaContent = await db.mediaContent.create({
      data: {
        title,
        type,
        url,
        topic,
        module,
        episode: episode ? parseInt(episode) : null,
        isPremium: isPremium || false
      }
    })

    return NextResponse.json({ mediaContent }, { status: 201 })
  } catch (error) {
    console.error('Error creating media content:', error)
    return NextResponse.json(
      { error: 'Error creating media content' },
      { status: 500 }
    )
  }
} 