import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

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
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')

    // Build where clause
    const where: any = {
      userId: user.id
    }

    if (category && category !== 'ALL') {
      where.category = category
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    // Fetch user's habits with related data
    const habits = await db.habit.findMany({
      where,
      include: {
        schedule: true,
        streaks: {
          where: { isActive: true },
          orderBy: { length: 'desc' },
          take: 1
        },
        entries: {
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            },
            status: 'COMPLETED'
          },
          take: 1
        }
      },
      orderBy: [
        { isActive: 'desc' },
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    // Process habits data
    const processedHabits = habits.map(habit => ({
      id: habit.id,
      name: habit.name,
      description: habit.description,
      category: habit.category,
      trackingType: habit.trackingType,
      targetCount: habit.targetCount,
      points: habit.points,
      color: habit.color,
      icon: habit.icon,
      isActive: habit.isActive,
      order: habit.order,
      currentStreak: habit.streaks[0]?.length || 0,
      completedToday: habit.entries.length > 0,
      schedule: habit.schedule,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt
    }))

    return NextResponse.json({
      habits: processedHabits,
      totalCount: processedHabits.length,
      activeCount: processedHabits.filter(h => h.isActive).length,
      completedTodayCount: processedHabits.filter(h => h.completedToday).length
    })
    
  } catch (error) {
    console.error("Error fetching habits:", error)
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
    const {
      name,
      description,
      category,
      trackingType,
      targetCount,
      points,
      color,
      icon
    } = body

    // Validate required fields
    if (!name || !category || !trackingType) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    // Get the next order number
    const lastHabit = await db.habit.findFirst({
      where: { userId: user.id },
      orderBy: { order: 'desc' }
    })
    const nextOrder = (lastHabit?.order || 0) + 1

    // Create new habit
    const habit = await db.habit.create({
      data: {
        name,
        description,
        category,
        trackingType,
        targetCount: targetCount || 1,
        points: points || 5,
        color: color || '#3B82F6',
        icon: icon || '⭐',
        userId: user.id,
        order: nextOrder,
        isActive: true
      }
    })

    // Create initial streak
    await db.habitStreak.create({
      data: {
        habitId: habit.id,
        startDate: new Date(),
        length: 0,
        isActive: true
      }
    })

    return NextResponse.json({
      habit: {
        id: habit.id,
        name: habit.name,
        description: habit.description,
        category: habit.category,
        trackingType: habit.trackingType,
        targetCount: habit.targetCount,
        points: habit.points,
        color: habit.color,
        icon: habit.icon,
        isActive: habit.isActive,
        order: habit.order,
        currentStreak: 0,
        completedToday: false,
        createdAt: habit.createdAt
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error("Error creating habit:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
