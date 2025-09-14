import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedUsers() {
  try {
    console.log('🌱 Starting user seeding...')

    // Check if users already exist
    const existingUser1 = await prisma.user.findUnique({
      where: { email: 'nicolasfit.coach@gmail.com' }
    })

    const existingUser2 = await prisma.user.findUnique({
      where: { email: 'nicolasherrera@gmail.com' }
    })

    if (existingUser1) {
      console.log('⚠️ User nicolasfit.coach@gmail.com already exists, skipping...')
    } else {
      // Create Nicolás Olavarría (Coach)
      const coachPassword = await bcrypt.hash('gainzfact-nico', 12)
      const coach = await prisma.user.create({
        data: {
          email: 'nicolasfit.coach@gmail.com',
          password: coachPassword,
          firstName: 'Nicolás',
          lastName: 'Olavarría',
          role: UserRole.COACH,
          isActive: true,
          emailVerified: new Date(),
          onboardingCompleted: true,
          fitnessLevel: 'advanced',
          primaryGoals: ['coaching', 'strength', 'muscle_gain'],
          personalManifesto: 'Transformando vidas a través del fitness y la disciplina. Cada día es una oportunidad para superarse.',
          timezone: 'America/Lima',
          preferredLanguage: 'es',
          weeklyCommitment: 6,
          intensityPreference: 'intense',
          motivationType: 'performance',
          bio: 'Coach certificado con más de 5 años de experiencia en entrenamiento personal y nutrición deportiva.',
          phoneNumber: '+51 999 888 777'
        }
      })
      console.log('👨‍💼 Created coach user:', coach.email)

      // Create UserLevelData for the coach
      await prisma.userLevelData.create({
        data: {
          userId: coach.id,
          currentLevel: 5,
          totalXP: 2500,
          currentLevelXP: 500,
          nextLevelXP: 1000,
          levelName: "Coach Experto",
          avatarEmoji: "💪",
          totalPoints: 2500,
          longestStreak: 30,
          achievementsUnlocked: 8
        }
      })
      console.log('📊 Created level data for coach')
    }

    if (existingUser2) {
      console.log('⚠️ User nicolasherrera@gmail.com already exists, skipping...')
    } else {
      // Create Nicolás Herrera (User)
      const userPassword = await bcrypt.hash('gaizfact-herrera', 12)
      const user = await prisma.user.create({
        data: {
          email: 'nicolasherrera@gmail.com',
          password: userPassword,
          firstName: 'Nicolás',
          lastName: 'Herrera',
          role: UserRole.USER,
          isActive: true,
          emailVerified: new Date(),
          onboardingCompleted: true,
          fitnessLevel: 'intermediate',
          primaryGoals: ['muscle_gain', 'strength', 'endurance'],
          personalManifesto: 'Construyendo la mejor versión de mí mismo cada día. La disciplina es la clave del éxito.',
          timezone: 'America/Lima',
          preferredLanguage: 'es',
          weeklyCommitment: 4,
          intensityPreference: 'balanced',
          motivationType: 'health',
          bio: 'Apasionado del fitness y la vida saludable. Buscando constantemente mejorar mi rendimiento físico y mental.',
          phoneNumber: '+51 999 777 666'
        }
      })
      console.log('👤 Created regular user:', user.email)

      // Create UserLevelData for the user
      await prisma.userLevelData.create({
        data: {
          userId: user.id,
          currentLevel: 3,
          totalXP: 1200,
          currentLevelXP: 200,
          nextLevelXP: 500,
          levelName: "Fitness Enthusiast",
          avatarEmoji: "🔥",
          totalPoints: 1200,
          longestStreak: 15,
          achievementsUnlocked: 5
        }
      })
      console.log('📊 Created level data for user')

      // Create some sample habits for the user
      const sampleHabits = [
        {
          name: "Ejercicio Matutino",
          description: "Realizar 45 minutos de ejercicio por la mañana",
          category: "PHYSICAL_TRAINING",
          frequency: "DAILY",
          trackingType: "DURATION",
          targetValue: 45,
          targetUnit: "minutos",
          points: 8,
          color: "#EF4444",
          icon: "💪"
        },
        {
          name: "Proteína",
          description: "Consumir 2g de proteína por kg de peso corporal",
          category: "NUTRITION",
          frequency: "DAILY",
          trackingType: "NUMERIC",
          targetValue: 2,
          targetUnit: "g/kg",
          points: 5,
          color: "#10B981",
          icon: "🥩"
        },
        {
          name: "Agua",
          description: "Beber 3 litros de agua al día",
          category: "NUTRITION",
          frequency: "DAILY",
          trackingType: "NUMERIC",
          targetValue: 3,
          targetUnit: "litros",
          points: 3,
          color: "#06B6D4",
          icon: "💧"
        },
        {
          name: "Sueño",
          description: "Dormir 8 horas por noche",
          category: "SLEEP_RECOVERY",
          frequency: "DAILY",
          trackingType: "DURATION",
          targetValue: 8,
          targetUnit: "horas",
          points: 6,
          color: "#6366F1",
          icon: "😴"
        }
      ]

      for (const habitData of sampleHabits) {
        await prisma.habit.create({
          data: {
            ...habitData,
            category: habitData.category as any, // Cast to HabitCategory enum
            frequency: habitData.frequency as any, // Cast to HabitFrequency enum
            trackingType: habitData.trackingType as any, // Cast to HabitTrackingType enum
            userId: user.id
          }
        })
      }
      console.log(`🎯 Created ${sampleHabits.length} habits for user`)

      // Create some sample daily scores for the user
      const today = new Date()
      for (let i = 0; i < 14; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        await prisma.dailyScore.create({
          data: {
            userId: user.id,
            date: date,
            totalPoints: Math.floor(Math.random() * 25) + 15,
            completedHabits: Math.floor(Math.random() * 4) + 2,
            totalHabits: 4,
            morningScore: Math.floor(Math.random() * 10) + 5,
            physicalScore: Math.floor(Math.random() * 10) + 5,
            nutritionScore: Math.floor(Math.random() * 10) + 5,
            workScore: Math.floor(Math.random() * 10) + 5,
            developmentScore: Math.floor(Math.random() * 10) + 5,
            socialScore: Math.floor(Math.random() * 10) + 5,
            reflectionScore: Math.floor(Math.random() * 10) + 5,
            sleepScore: Math.floor(Math.random() * 10) + 5,
            percentile: Math.random() * 100
          }
        })
      }
      console.log('📊 Created sample daily scores for user')

      // Create some sample habit entries
      const habits = await prisma.habit.findMany({
        where: { userId: user.id }
      })

      for (let i = 0; i < 14; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        for (const habit of habits) {
          const isCompleted = Math.random() > 0.25 // 75% completion rate
          
          await prisma.habitEntry.create({
            data: {
              habitId: habit.id,
              date: date,
              status: isCompleted ? 'COMPLETED' : 'SKIPPED',
              value: isCompleted ? habit.targetValue : null,
              textValue: isCompleted ? 'Completado' : null,
              timeSpent: habit.trackingType === 'DURATION' ? (isCompleted && habit.targetValue ? habit.targetValue * 60 : null) : null,
              difficulty: isCompleted ? Math.floor(Math.random() * 5) + 1 : null,
              mood: isCompleted ? Math.floor(Math.random() * 5) + 1 : null
            }
          })
        }
      }
      console.log('📝 Created sample habit entries for user')
    }

    console.log('✅ User seeding completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`👨‍💼 Coach: nicolasfit.coach@gmail.com (password: gainzfact-nico)`)
    console.log(`👤 User: nicolasherrera@gmail.com (password: gaizfact-herrera)`)

  } catch (error) {
    console.error('❌ Error during user seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  seedUsers()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedUsers }
