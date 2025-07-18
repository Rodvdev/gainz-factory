import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { UserLevel } from "@prisma/client"

// GET /api/recipes - Get all recipes with filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level') as UserLevel | null
    const objective = searchParams.get('objective')
    const isPremium = searchParams.get('isPremium') === 'true'
    const search = searchParams.get('search')

    const where: {
      level?: UserLevel
      objective?: { contains: string; mode: 'insensitive' }
      isPremium?: boolean
      OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }>
    } = {}
    
    if (level) where.level = level
    if (objective) where.objective = { contains: objective, mode: 'insensitive' }
    if (isPremium !== undefined) where.isPremium = isPremium
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const recipes = await db.recipe.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ recipes })
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { error: 'Error fetching recipes' },
      { status: 500 }
    )
  }
}

// POST /api/recipes - Create new recipe
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, objective, level, isPremium, imageUrl, videoUrl } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const recipe = await db.recipe.create({
      data: {
        title,
        description,
        objective,
        level,
        isPremium: isPremium || false,
        imageUrl,
        videoUrl
      }
    })

    return NextResponse.json({ recipe }, { status: 201 })
  } catch (error) {
    console.error('Error creating recipe:', error)
    return NextResponse.json(
      { error: 'Error creating recipe' },
      { status: 500 }
    )
  }
} 