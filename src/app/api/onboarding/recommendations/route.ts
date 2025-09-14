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

    // Get user's onboarding data
    const [userData, onboardingData] = await Promise.all([
      db.user.findUnique({
        where: { id: user.id },
        select: {
          primaryGoals: true,
          fitnessLevel: true,
          weeklyCommitment: true,
          intensityPreference: true,
          motivationType: true
        }
      }),
      db.onboardingData.findUnique({
        where: { userId: user.id },
        select: {
          selectedObjectives: true,
          questionnaireAnswers: true
        }
      })
    ])

    if (!userData) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Generate intelligent habit recommendations based on user profile
    const recommendations = generateHabitRecommendations({
      objectives: onboardingData?.selectedObjectives || userData.primaryGoals || [],
      fitnessLevel: userData.fitnessLevel || 'beginner',
      weeklyCommitment: userData.weeklyCommitment || 3,
      intensityPreference: userData.intensityPreference || 'balanced',
      motivationType: userData.motivationType || 'health'
    })

    return NextResponse.json({
      recommendations,
      userProfile: {
        fitnessLevel: userData.fitnessLevel,
        weeklyCommitment: userData.weeklyCommitment,
        intensityPreference: userData.intensityPreference,
        motivationType: userData.motivationType
      }
    })
    
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

interface UserProfile {
  objectives: string[]
  fitnessLevel: string
  weeklyCommitment: number
  intensityPreference: string
  motivationType: string
}

function generateHabitRecommendations(profile: UserProfile) {
  const { objectives, fitnessLevel, weeklyCommitment, intensityPreference, motivationType } = profile
  
  const allHabits = {
    fitness: [
      { name: "Ejercicio matutino", category: "fitness", difficulty: "medium", icon: "💪", description: "15-30 minutos de ejercicio en la mañana" },
      { name: "Caminar 10,000 pasos", category: "fitness", difficulty: "easy", icon: "🚶", description: "Mantén tu cuerpo activo durante el día" },
      { name: "Entrenamiento de fuerza", category: "fitness", difficulty: "hard", icon: "🏋️", description: "3-4 sesiones de pesas por semana" },
      { name: "Cardio intenso", category: "fitness", difficulty: "hard", icon: "🏃", description: "20-30 minutos de cardio de alta intensidad" },
      { name: "Estiramientos", category: "fitness", difficulty: "easy", icon: "🧘", description: "10 minutos de estiramientos diarios" }
    ],
    nutrition: [
      { name: "Beber 2L de agua", category: "nutrition", difficulty: "easy", icon: "💧", description: "Mantén tu cuerpo hidratado" },
      { name: "Comer 5 porciones de frutas/verduras", category: "nutrition", difficulty: "medium", icon: "🥗", description: "Aumenta tu consumo de nutrientes" },
      { name: "Evitar azúcar procesado", category: "nutrition", difficulty: "hard", icon: "🚫🍭", description: "Reduce el consumo de azúcares refinados" },
      { name: "Preparar comidas saludables", category: "nutrition", difficulty: "medium", icon: "👨‍🍳", description: "Dedica tiempo a preparar comida nutritiva" },
      { name: "Desayuno balanceado", category: "nutrition", difficulty: "easy", icon: "🍳", description: "Comienza el día con energía" }
    ],
    mindset: [
      { name: "Meditación matutina", category: "mindset", difficulty: "easy", icon: "🧘‍♂️", description: "5-10 minutos de meditación diaria" },
      { name: "Gratitud", category: "mindset", difficulty: "easy", icon: "🙏", description: "Escribe 3 cosas por las que estás agradecido" },
      { name: "Lectura personal", category: "mindset", difficulty: "medium", icon: "📚", description: "Lee 20-30 minutos de contenido inspirador" },
      { name: "Sin redes sociales por la mañana", category: "mindset", difficulty: "hard", icon: "📱", description: "Evita las redes sociales hasta después del mediodía" },
      { name: "Reflexión nocturna", category: "mindset", difficulty: "medium", icon: "🌙", description: "Evalúa tu día y planifica el siguiente" }
    ]
  }

  let recommendedHabits = []

  // Filter habits based on objectives
  objectives.forEach(objective => {
    if (objective.toLowerCase().includes('fitness') || objective.toLowerCase().includes('ejercicio')) {
      recommendedHabits.push(...allHabits.fitness)
    }
    if (objective.toLowerCase().includes('nutrición') || objective.toLowerCase().includes('comida')) {
      recommendedHabits.push(...allHabits.nutrition)
    }
    if (objective.toLowerCase().includes('mente') || objective.toLowerCase().includes('bienestar')) {
      recommendedHabits.push(...allHabits.mindset)
    }
  })

  // If no specific objectives, recommend based on fitness level
  if (recommendedHabits.length === 0) {
    if (fitnessLevel === 'beginner') {
      recommendedHabits.push(
        allHabits.fitness[0], // Ejercicio matutino
        allHabits.fitness[1], // Caminar
        allHabits.nutrition[0], // Agua
        allHabits.mindset[0] // Meditación
      )
    } else if (fitnessLevel === 'intermediate') {
      recommendedHabits.push(
        allHabits.fitness[2], // Entrenamiento fuerza
        allHabits.nutrition[1], // Frutas/verduras
        allHabits.mindset[2] // Lectura
      )
    } else {
      recommendedHabits.push(
        allHabits.fitness[3], // Cardio intenso
        allHabits.nutrition[2], // Sin azúcar
        allHabits.mindset[3] // Sin redes sociales
      )
    }
  }

  // Adjust difficulty based on intensity preference
  if (intensityPreference === 'quick') {
    recommendedHabits = recommendedHabits.filter(h => h.difficulty === 'easy')
  } else if (intensityPreference === 'intense') {
    recommendedHabits = recommendedHabits.filter(h => h.difficulty === 'hard')
  }

  // Limit based on weekly commitment
  const maxHabits = Math.min(weeklyCommitment + 1, 5) // +1 for easy habits
  recommendedHabits = recommendedHabits.slice(0, maxHabits)

  // Remove duplicates
  recommendedHabits = recommendedHabits.filter((habit, index, self) => 
    index === self.findIndex(h => h.name === habit.name)
  )

  return recommendedHabits
}
