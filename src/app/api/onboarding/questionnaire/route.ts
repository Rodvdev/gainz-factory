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

    const { answers, step } = await request.json()
    
    // Validate answers
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: "Respuestas del cuestionario requeridas" },
        { status: 400 }
      )
    }

    // Extract user preferences from questionnaire
    const fitnessLevel = answers.level || "beginner"
    const weeklyCommitment = answers.time_commitment === "2-3" ? 3 : 
                           answers.time_commitment === "4-5" ? 4 : 6
    const intensityPreference = answers.intensity || "balanced"
    const motivationType = answers.motivation || "health"

    // Update user with questionnaire data
    await db.user.update({
      where: { id: user.id },
      data: {
        fitnessLevel,
        weeklyCommitment,
        intensityPreference,
        motivationType,
        onboardingStep: step
      }
    })

    // Update onboarding data
    await db.onboardingData.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        questionnaireAnswers: answers,
        questionnaireCompletedAt: new Date(),
        currentStep: step
      },
      update: {
        questionnaireAnswers: answers,
        questionnaireCompletedAt: new Date(),
        currentStep: step
      }
    })

    // Update user goals with target dates based on questionnaire
    if (answers.time_commitment) {
      const goals = await db.userGoal.findMany({
        where: { userId: user.id }
      })

      // Update goals with target dates based on time commitment
      const targetDays = answers.time_commitment === "2-3" ? 90 : 
                        answers.time_commitment === "4-5" ? 60 : 45

      for (const goal of goals) {
        const targetDate = new Date()
        targetDate.setDate(targetDate.getDate() + targetDays)
        
        await db.userGoal.update({
          where: { id: goal.id },
          data: { targetDate }
        })
      }
    }

    return NextResponse.json({
      message: "Cuestionario guardado exitosamente",
      step: step,
      answers: answers,
      userId: user.id
    })
    
  } catch (error) {
    console.error("Error saving questionnaire:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
