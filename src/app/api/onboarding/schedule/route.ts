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

    const { schedule, step } = await request.json()
    
    // Validate schedule
    if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
      return NextResponse.json(
        { error: "Configuración de horarios requerida" },
        { status: 400 }
      )
    }

    // Get user's habits to create schedules
    const userHabits = await db.habit.findMany({
      where: { userId: user.id }
    })

    // Create HabitSchedule records for each habit
    const schedulePromises = schedule.map(async (scheduleItem: any) => {
      const habit = userHabits.find(h => h.name === scheduleItem.name)
      if (habit) {
        // Determine time slot
        const timeSlot = scheduleItem.time.includes('AM') ? 'morning' : 
                        scheduleItem.time.includes('PM') && parseInt(scheduleItem.time.split(':')[0]) < 18 ? 'afternoon' : 'evening'

        // Create or update habit schedule
        return db.habitSchedule.upsert({
          where: { habitId: habit.id },
          create: {
            userId: user.id,
            habitId: habit.id,
            timeSlot,
            specificTime: scheduleItem.time,
            daysOfWeek: scheduleItem.days,
            reminderEnabled: scheduleItem.reminder,
            reminderMinutes: 15, // Default 15 minutes before
            priority: userHabits.indexOf(habit) + 1
          },
          update: {
            timeSlot,
            specificTime: scheduleItem.time,
            daysOfWeek: scheduleItem.days,
            reminderEnabled: scheduleItem.reminder,
            reminderMinutes: 15
          }
        })
      }
      return null
    })

    await Promise.all(schedulePromises.filter(Boolean))

    // Update onboarding data
    await db.onboardingData.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        scheduleData: schedule,
        scheduleCompletedAt: new Date(),
        currentStep: step
      },
      update: {
        scheduleData: schedule,
        scheduleCompletedAt: new Date(),
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
      message: "Horarios guardados exitosamente",
      step: step,
      schedule: schedule,
      userId: user.id
    })
    
  } catch (error) {
    console.error("Error saving schedule:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
