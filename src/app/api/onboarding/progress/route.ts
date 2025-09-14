import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthenticatedUser, createUnauthorizedResponse } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return createUnauthorizedResponse()
    }

    // Get user's onboarding progress
    const [userData, onboardingData] = await Promise.all([
      db.user.findUnique({
        where: { id: user.id },
        select: { 
          onboardingCompleted: true,
          onboardingStep: true,
          emailVerified: true,
          createdAt: true,
          primaryGoals: true,
          fitnessLevel: true,
          weeklyCommitment: true,
          intensityPreference: true,
          motivationType: true,
          personalManifesto: true,
          bio: true
        }
      }),
      db.onboardingData.findUnique({
        where: { userId: user.id }
      })
    ])

    // Determine current step
    const currentStep = userData?.onboardingStep || 'welcome'
    const isCompleted = userData?.onboardingCompleted || false

    // Get user's habits, goals, and schedules
    const [habits, goals, schedules] = await Promise.all([
      db.habit.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          name: true,
          category: true,
          isActive: true,
          schedule: {
            select: {
              timeSlot: true,
              specificTime: true,
              daysOfWeek: true,
              reminderEnabled: true
            }
          }
        }
      }),
      db.userGoal.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          goal: true,
          targetDate: true
        }
      }),
      db.habitSchedule.findMany({
        where: { userId: user.id },
        select: {
          timeSlot: true,
          specificTime: true,
          daysOfWeek: true,
          reminderEnabled: true,
          habit: {
            select: {
              name: true
            }
          }
        }
      })
    ])

    return NextResponse.json({
      currentStep,
      isCompleted,
      progress: {
        objectives: !!(onboardingData?.selectedObjectives?.length > 0),
        questionnaire: !!onboardingData?.questionnaireAnswers,
        habits: habits.length > 0,
        schedule: schedules.length > 0,
        profile: !!userData?.personalManifesto
      },
      data: {
        objectives: onboardingData?.selectedObjectives || userData?.primaryGoals || [],
        questionnaire: onboardingData?.questionnaireAnswers || {},
        habits: habits,
        goals: goals,
        schedules: schedules,
        profile: {
          manifesto: userData?.personalManifesto || '',
          bio: userData?.bio || '',
          fitnessLevel: userData?.fitnessLevel,
          weeklyCommitment: userData?.weeklyCommitment,
          intensityPreference: userData?.intensityPreference,
          motivationType: userData?.motivationType
        }
      },
      userId: user.id,
      emailVerified: !!userData?.emailVerified
    })
    
  } catch (error) {
    console.error("Error getting onboarding progress:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
