import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth-middleware"
import { HabitCategory, Prisma } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'

    // Build where clause based on filter
    const whereClause: Prisma.ChallengeWhereInput = { userId: user.id }
    
    if (filter === 'active') {
      whereClause.isCompleted = false
    } else if (filter === 'completed') {
      whereClause.isCompleted = true
    }
    // 'all' doesn't add any additional filter

    // Fetch user's challenges
    const challenges = await db.challenge.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      challenges: challenges.map(challenge => ({
        id: challenge.id,
        name: challenge.name,
        description: challenge.description,
        category: challenge.category,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        targetValue: challenge.targetValue,
        currentValue: challenge.currentValue,
        isCompleted: challenge.isCompleted,
        reward: challenge.reward
      }))
    })
    
  } catch (error) {
    console.error("Error fetching challenges:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, category, targetValue, startDate, endDate, reward } = body

    // Validate required fields
    if (!name || !targetValue || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Campos requeridos: name, targetValue, startDate, endDate" },
        { status: 400 }
      )
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (start < today) {
      return NextResponse.json(
        { error: "La fecha de inicio no puede ser anterior a hoy" },
        { status: 400 }
      )
    }

    if (end <= start) {
      return NextResponse.json(
        { error: "La fecha de fin debe ser posterior a la fecha de inicio" },
        { status: 400 }
      )
    }

    // Create challenge
    const challenge = await db.challenge.create({
      data: {
        userId: user.id,
        name,
        description,
        category: category as HabitCategory,
        targetValue: parseInt(targetValue),
        startDate: start,
        endDate: end,
        reward,
        currentValue: 0,
        isCompleted: false
      }
    })

    return NextResponse.json({
      challenge: {
        id: challenge.id,
        name: challenge.name,
        description: challenge.description,
        category: challenge.category,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        targetValue: challenge.targetValue,
        currentValue: challenge.currentValue,
        isCompleted: challenge.isCompleted,
        reward: challenge.reward
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error("Error creating challenge:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
