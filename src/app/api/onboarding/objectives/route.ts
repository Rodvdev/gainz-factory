import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthenticatedUser, createUnauthorizedResponse } from "@/lib/auth-middleware"

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return createUnauthorizedResponse()
    }

    const { objectives, step } = await request.json()
    
    // Validate objectives
    if (!objectives || !Array.isArray(objectives) || objectives.length === 0) {
      return NextResponse.json(
        { error: "Debes seleccionar al menos un objetivo" },
        { status: 400 }
      )
    }

    // Update user with primary goals
    await db.user.update({
      where: { id: user.id },
      data: {
        primaryGoals: objectives,
        onboardingStep: step
      }
    })

    // Save objectives as UserGoals
    const userGoals = objectives.map((objective: string) => ({
      userId: user.id,
      goal: objective,
      targetDate: null // Will be set later in questionnaire
    }))

    // Delete existing goals for this user (fresh start)
    await db.userGoal.deleteMany({
      where: { userId: user.id }
    })

    // Create new goals
    await db.userGoal.createMany({
      data: userGoals
    })

    // Create or update onboarding data
    await db.onboardingData.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        selectedObjectives: objectives,
        objectivesCompletedAt: new Date(),
        currentStep: step
      },
      update: {
        selectedObjectives: objectives,
        objectivesCompletedAt: new Date(),
        currentStep: step
      }
    })

    return NextResponse.json({
      message: "Objetivos guardados exitosamente",
      step: step,
      objectives: objectives,
      userId: user.id
    })
    
  } catch (error) {
    console.error("Error saving objectives:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
