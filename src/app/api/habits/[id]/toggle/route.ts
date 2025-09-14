import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    const habitId = params.id
    const body = await request.json()
    const { completed, value } = body

    // Verify habit belongs to user
    const habit = await db.habit.findFirst({
      where: {
        id: habitId,
        userId: user.id
      }
    })

    if (!habit) {
      return NextResponse.json(
        { error: "Hábito no encontrado" },
        { status: 404 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if there's already a log for today
    const existingLog = await db.habitLog.findFirst({
      where: {
        habitId: habitId,
        date: today
      }
    })

    let habitLog
    let streakUpdate = null

    if (completed) {
      if (existingLog) {
        // Update existing log
        habitLog = await db.habitLog.update({
          where: { id: existingLog.id },
          data: {
            completed: true,
            value: value || 1,
            completedAt: new Date()
          }
        })
      } else {
        // Create new log
        habitLog = await db.habitLog.create({
          data: {
            habitId: habitId,
            userId: user.id,
            date: today,
            completed: true,
            value: value || 1,
            completedAt: new Date()
          }
        })

        // Update or create streak
        const currentStreak = await db.habitStreak.findFirst({
          where: {
            habitId: habitId,
            isActive: true
          }
        })

        if (currentStreak) {
          streakUpdate = await db.habitStreak.update({
            where: { id: currentStreak.id },
            data: {
              length: currentStreak.length + 1,
              lastCompletedDate: today
            }
          })
        } else {
          streakUpdate = await db.habitStreak.create({
            data: {
              habitId: habitId,
              startDate: today,
              length: 1,
              lastCompletedDate: today,
              isActive: true
            }
          })
        }
      }
    } else {
      if (existingLog) {
        // Delete existing log
        await db.habitLog.delete({
          where: { id: existingLog.id }
        })
        habitLog = null
      }
    }

    // Update daily score
    await updateDailyScore(user.id, habit.points, completed)

    return NextResponse.json({
      success: true,
      completed,
      streakLength: streakUpdate?.length || 0,
      points: completed ? habit.points : 0
    })
    
  } catch (error) {
    console.error("Error toggling habit:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

async function updateDailyScore(userId: string, points: number, completed: boolean) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dailyScore = await db.dailyScore.findFirst({
      where: {
        userId: userId,
        date: today
      }
    })

    if (dailyScore) {
      await db.dailyScore.update({
        where: { id: dailyScore.id },
        data: {
          totalPoints: completed 
            ? dailyScore.totalPoints + points 
            : Math.max(0, dailyScore.totalPoints - points),
          completedHabits: completed 
            ? dailyScore.completedHabits + 1 
            : Math.max(0, dailyScore.completedHabits - 1)
        }
      })
    } else {
      // Create new daily score
      await db.dailyScore.create({
        data: {
          userId: userId,
          date: today,
          totalPoints: completed ? points : 0,
          completedHabits: completed ? 1 : 0,
          totalHabits: 1, // This should be calculated properly
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
        }
      })
    }
  } catch (error) {
    console.error("Error updating daily score:", error)
  }
}
