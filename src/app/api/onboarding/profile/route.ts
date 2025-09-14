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

    const formData = await request.formData()
    const bio = formData.get('bio') as string
    const manifesto = formData.get('manifesto') as string
    const notifications = formData.get('notifications') as string
    const profileImage = formData.get('profileImage') as File | null

    // Validate required fields
    if (!manifesto) {
      return NextResponse.json(
        { error: "El manifiesto personal es requerido" },
        { status: 400 }
      )
    }

    // Handle profile image upload (simplified - in production use proper file storage)
    let profileImageUrl = null
    if (profileImage && profileImage.size > 0) {
      // In a real implementation, you would upload to AWS S3, Cloudinary, etc.
      // For now, we'll just store the filename or use a placeholder
      profileImageUrl = `/uploads/profile-${user.id}-${Date.now()}.jpg`
    }

    // Parse notifications preferences
    let notificationPreferences = []
    try {
      notificationPreferences = JSON.parse(notifications || '[]')
    } catch (e) {
      notificationPreferences = []
    }

    // Update user with final profile data
    await db.user.update({
      where: { id: user.id },
      data: {
        bio: bio || '',
        profileImageUrl: profileImageUrl,
        personalManifesto: manifesto,
        notificationPreferences: notificationPreferences,
        onboardingCompleted: true,
        onboardingStep: 'complete'
      }
    })

    // Update onboarding data with profile completion
    await db.onboardingData.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        personalBio: bio,
        customManifesto: manifesto,
        profileCompletedAt: new Date(),
        isCompleted: true,
        completedAt: new Date(),
        currentStep: 'complete'
      },
      update: {
        personalBio: bio,
        customManifesto: manifesto,
        profileCompletedAt: new Date(),
        isCompleted: true,
        completedAt: new Date(),
        currentStep: 'complete'
      }
    })

    // Create initial daily score for the user
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await db.dailyScore.create({
      data: {
        userId: user.id,
        date: today,
        totalPoints: 0,
        completedHabits: 0,
        totalHabits: await db.habit.count({ where: { userId: user.id } }),
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

    // Create initial challenges based on selected habits
    const userHabits = await db.habit.findMany({
      where: { userId: user.id },
      take: 3 // Create challenges for first 3 habits
    })

    const challengePromises = userHabits.map(async (habit, index) => {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 30) // 30-day challenge

      return db.challenge.create({
        data: {
          userId: user.id,
          name: `30 Días de ${habit.name}`,
          description: `Completa tu hábito de ${habit.name} durante 30 días consecutivos`,
          category: habit.category,
          startDate: startDate,
          endDate: endDate,
          targetValue: 30,
          currentValue: 0,
          isCompleted: false,
          reward: `🏆 Insignia de ${habit.name}`
        }
      })
    })

    await Promise.all(challengePromises)

    return NextResponse.json({
      message: "Perfil completado exitosamente",
      step: 'profile',
      userId: user.id,
      manifesto: manifesto,
      onboardingCompleted: true,
      nextStep: '/onboarding/complete'
    })
    
  } catch (error) {
    console.error("Error completing profile:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
