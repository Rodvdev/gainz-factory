import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthenticatedUser, createUnauthorizedResponse } from "@/lib/auth-middleware"
import { UserGoal, Challenge, Habit, User } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return createUnauthorizedResponse()
    }

    // Get user's complete onboarding data
    const [userData, onboardingData, habits, goals] = await Promise.all([
      db.user.findUnique({
        where: { id: user.id },
        select: {
          primaryGoals: true,
          fitnessLevel: true,
          weeklyCommitment: true,
          personalManifesto: true
        }
      }),
      db.onboardingData.findUnique({
        where: { userId: user.id }
      }),
      db.habit.findMany({
        where: { userId: user.id },
        include: {
          schedule: true
        }
      }),
      db.userGoal.findMany({
        where: { userId: user.id }
      })
    ])

    if (!userData || !onboardingData) {
      return NextResponse.json(
        { error: "Datos de onboarding incompletos" },
        { status: 400 }
      )
    }

    // Create initial daily score for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dailyScore = await db.dailyScore.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today
        }
      },
      create: {
        userId: user.id,
        date: today,
        totalPoints: 0,
        completedHabits: 0,
        totalHabits: habits.length,
        morningScore: 0,
        physicalScore: 0,
        nutritionScore: 0,
        workScore: 0,
        developmentScore: 0,
        socialScore: 0,
        reflectionScore: 0,
        sleepScore: 0,
        percentile: 0,
        rank: null
      },
      update: {
        totalHabits: habits.length
      }
    })

    // Create initial challenges based on selected habits
    const challenges = await createInitialChallenges(user.id, habits)

    // Create initial streaks for habits
    await createInitialStreaks(user.id, habits)

    // Generate welcome message based on user profile
    const welcomeMessage = generateWelcomeMessage(userData as User, habits, goals)

    return NextResponse.json({
      message: "¡Onboarding completado exitosamente!",
      dashboardData: {
        dailyScore,
        habits: habits.map((habit: Habit) => ({
          id: habit.id,
          name: habit.name,
          category: habit.category,
          points: habit.points,
          color: habit.color,
          icon: habit.icon,
          schedule: (habit as any).schedule
        })),
        goals: goals.map((goal: UserGoal) => ({
          id: goal.id,
          goal: goal.goal,
          targetDate: goal.targetDate
        })),
        challenges: challenges.map((challenge: Challenge) => ({
          id: challenge.id,
          name: challenge.name,
          description: challenge.description,
          targetValue: challenge.targetValue,
          currentValue: challenge.currentValue,
          reward: challenge.reward
        })),
        welcomeMessage
      },
      nextStep: '/dashboard'
    })
    
  } catch (error) {
    console.error("Error completing onboarding:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

async function createInitialChallenges(userId: string, habits: Habit[]) {
  const challenges = []

  for (const habit of habits.slice(0, 3)) { // Create challenges for first 3 habits
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30) // 30-day challenge

    const challenge = await db.challenge.create({
      data: {
        userId,
        name: `30 Días de ${habit.name}`,
        description: `Completa tu hábito de ${habit.name} durante 30 días consecutivos`,
        category: habit.category,
        startDate,
        endDate,
        targetValue: 30,
        currentValue: 0,
        isCompleted: false,
        reward: `🏆 Insignia de ${habit.name}`
      }
    })

    challenges.push(challenge)
  }

  return challenges
}

async function createInitialStreaks(userId: string, habits: Habit[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (const habit of habits) {
    await db.habitStreak.create({
      data: {
        habitId: habit.id,
        startDate: today,
        length: 0,
        isActive: true
      }
    })
  }
}

function generateWelcomeMessage(userData: User, habits: Habit[], goals: UserGoal[]) {
  const userName = "Transformer" // Get from user context
  const habitCount = habits.length
  const goalCount = goals.length

  let message = `¡Bienvenido a tu nueva vida, ${userName}! 🎉\n\n`
  
  message += `Tu plan personalizado está listo:\n`
  message += `• ${habitCount} hábitos seleccionados\n`
  message += `• ${goalCount} objetivos definidos\n`
  message += `• Nivel: ${userData.fitnessLevel}\n\n`

  if (userData.personalManifesto) {
    message += `Tu manifiesto personal:\n"${userData.personalManifesto}"\n\n`
  }

  message += `¡Es hora de comenzar tu transformación! 💪`
  
  return message
}
