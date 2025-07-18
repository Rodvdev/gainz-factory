import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ExerciseType, IntensityLevel, UserLevel } from "@prisma/client"

// GET /api/exercises - Get all exercises with filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as ExerciseType | null
    const intensity = searchParams.get('intensity') as IntensityLevel | null
    const level = searchParams.get('level') as UserLevel | null
    const search = searchParams.get('search')
    const targetMuscles = searchParams.get('targetMuscles')

    const where: {
      type?: ExerciseType
      intensity?: IntensityLevel
      level?: UserLevel
      OR?: Array<{ name?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }>
      targetMuscles?: { has: string }
    } = {}
    
    if (type) where.type = type
    if (intensity) where.intensity = intensity
    if (level) where.level = level
    if (targetMuscles) where.targetMuscles = { has: targetMuscles }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const exercises = await db.exercise.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ exercises })
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return NextResponse.json(
      { error: 'Error fetching exercises' },
      { status: 500 }
    )
  }
}

// POST /api/exercises - Create new exercise
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      type, 
      intensity, 
      level, 
      technique, 
      videoUrl, 
      imageUrl, 
      targetMuscles 
    } = body

    if (!name || !type || !intensity || !level) {
      return NextResponse.json(
        { error: 'Name, type, intensity, and level are required' },
        { status: 400 }
      )
    }

    const exercise = await db.exercise.create({
      data: {
        name,
        description,
        type,
        intensity,
        level,
        technique,
        videoUrl,
        imageUrl,
        targetMuscles: targetMuscles || []
      }
    })

    return NextResponse.json({ exercise }, { status: 201 })
  } catch (error) {
    console.error('Error creating exercise:', error)
    return NextResponse.json(
      { error: 'Error creating exercise' },
      { status: 500 }
    )
  }
} 