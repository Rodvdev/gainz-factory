import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthenticatedUser, createUnauthorizedResponse } from "@/lib/auth-middleware"
import { HabitCategory, HabitFrequency, TrackingType } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return createUnauthorizedResponse()
    }

    const { habits, step } = await request.json()
    
    // Validate habits
    if (!habits || !Array.isArray(habits) || habits.length === 0) {
      return NextResponse.json(
        { error: "Debes seleccionar al menos un hábito" },
        { status: 400 }
      )
    }

    // Clear existing habits for fresh start
    await db.habit.deleteMany({
      where: { userId: user.id }
    })

    // Create new habits based on selection
    const habitPromises = habits.map(async (habitData: {
      name: string
      description: string
      category: string
      difficulty: string
      icon: string
    }, index: number) => {
      // Map habit data to Prisma schema
      const habit = {
        userId: user.id,
        name: habitData.name,
        description: habitData.description,
        category: mapCategoryToEnum(habitData.category),
        frequency: HabitFrequency.DAILY,
        trackingType: TrackingType.BINARY,
        targetCount: 1,
        targetValue: null,
        targetUnit: null,
        points: getPointsForDifficulty(habitData.difficulty),
        color: getColorForCategory(habitData.category),
        icon: habitData.icon,
        isActive: true,
        order: index
      }

      return db.habit.create({
        data: habit
      })
    })

    const createdHabits = await Promise.all(habitPromises)

    // Update onboarding data
    await db.onboardingData.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        selectedHabits: habits,
        habitsCompletedAt: new Date(),
        currentStep: step
      },
      update: {
        selectedHabits: habits,
        habitsCompletedAt: new Date(),
        currentStep: step
      }
    })

    // Update user onboarding step
    await db.user.update({
      where: { id: user.id },
      data: {
        onboardingStep: step
      }
    })

    return NextResponse.json({
      message: "Hábitos guardados exitosamente",
      step: step,
      habits: createdHabits.map(h => ({
        id: h.id,
        name: h.name,
        category: h.category,
        points: h.points
      })),
      userId: user.id
    })
    
  } catch (error) {
    console.error("Error saving habits:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// Helper functions
function mapCategoryToEnum(category: string): HabitCategory {
  switch (category.toLowerCase()) {
    case 'fitness':
      return HabitCategory.PHYSICAL_TRAINING
    case 'nutrition':
      return HabitCategory.NUTRITION
    case 'mindset':
      return HabitCategory.PERSONAL_DEVELOPMENT
    default:
      return HabitCategory.PERSONAL_DEVELOPMENT
  }
}

function getPointsForDifficulty(difficulty: string): number {
  switch (difficulty) {
    case 'easy':
      return 1
    case 'medium':
      return 2
    case 'hard':
      return 3
    default:
      return 1
  }
}

function getColorForCategory(category: string): string {
  switch (category.toLowerCase()) {
    case 'fitness':
      return '#ef4444' // Red
    case 'nutrition':
      return '#10b981' // Green
    case 'mindset':
      return '#8b5cf6' // Purple
    default:
      return '#3b82f6' // Blue
  }
}
