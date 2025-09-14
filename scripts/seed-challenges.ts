import { PrismaClient, HabitCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function seedChallenges() {
  try {
    console.log('🌱 Seeding challenges...')

    // Get the first user (assuming there's at least one user)
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log('❌ No users found. Please create a user first.')
      return
    }

    console.log(`👤 Using user: ${user.email}`)

    // Clear existing challenges for this user
    await prisma.challenge.deleteMany({
      where: { userId: user.id }
    })

    // Create sample challenges
    const challenges = [
      {
        userId: user.id,
        name: "30 Días de Meditación",
        description: "Medita al menos 10 minutos cada día durante 30 días consecutivos para desarrollar el hábito de mindfulness",
        category: HabitCategory.MORNING_ROUTINE,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-30'),
        targetValue: 30,
        currentValue: 21,
        isCompleted: false,
        reward: "🏆 Insignia de Mindfulness Master + 100 puntos bonus"
      },
      {
        userId: user.id,
        name: "Semana de Fuerza",
        description: "Completa 5 entrenamientos de fuerza esta semana para construir músculo y resistencia",
        category: HabitCategory.PHYSICAL_TRAINING,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-21'),
        targetValue: 5,
        currentValue: 3,
        isCompleted: false,
        reward: "💪 Insignia de Guerrero + 50 puntos"
      },
      {
        userId: user.id,
        name: "14 Días de Lectura",
        description: "Lee al menos 30 páginas cada día durante 2 semanas para expandir tu conocimiento",
        category: HabitCategory.PERSONAL_DEVELOPMENT,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-14'),
        targetValue: 14,
        currentValue: 14,
        isCompleted: true,
        reward: "📚 Insignia de Sabio + 75 puntos"
      },
      {
        userId: user.id,
        name: "Hidratación Perfecta",
        description: "Bebe 8 vasos de agua cada día durante una semana completa",
        category: HabitCategory.NUTRITION,
        startDate: new Date('2024-01-10'),
        endDate: new Date('2024-01-16'),
        targetValue: 7,
        currentValue: 7,
        isCompleted: true,
        reward: "💧 Insignia de Hidratación + 30 puntos"
      },
      {
        userId: user.id,
        name: "Trabajo Profundo",
        description: "Dedica 2 horas de trabajo profundo sin distracciones durante 10 días",
        category: HabitCategory.DEEP_WORK,
        startDate: new Date('2024-01-18'),
        endDate: new Date('2024-01-27'),
        targetValue: 10,
        currentValue: 2,
        isCompleted: false,
        reward: "🎯 Insignia de Concentración + 80 puntos"
      }
    ]

    for (const challenge of challenges) {
      await prisma.challenge.create({ data: challenge })
      console.log(`✅ Created challenge: ${challenge.name}`)
    }

    console.log('🎉 Challenges seeded successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding challenges:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedChallenges()
