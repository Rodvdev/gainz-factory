import { PrismaClient, UserRole, UserLevel, HabitCategory, ExerciseType, IntensityLevel, ServiceLevel, HabitFrequency, TrackingType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Sample exercises data
const sampleExercises = [
  {
    name: "Press de Banca",
    description: "Ejercicio fundamental para el desarrollo del pecho, hombros y tríceps",
    type: ExerciseType.STRENGTH,
    intensity: IntensityLevel.HIGH,
    level: UserLevel.BEGINNER,
    technique: "Acuéstate en el banco con los pies firmes en el suelo. Agarra la barra con las manos separadas al ancho de los hombros. Baja la barra controladamente hasta el pecho y empuja hacia arriba.",
    videoUrl: "https://www.youtube.com/watch?v=bench-press",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    targetMuscles: ["Pecho", "Hombros", "Tríceps"]
  },
  {
    name: "Sentadillas",
    description: "El rey de los ejercicios para piernas y glúteos",
    type: ExerciseType.STRENGTH,
    intensity: IntensityLevel.HIGH,
    level: UserLevel.BEGINNER,
    technique: "Párate con los pies separados al ancho de los hombros. Baja como si te fueras a sentar, manteniendo el pecho erguido. Baja hasta que los muslos estén paralelos al suelo y regresa a la posición inicial.",
    videoUrl: "https://www.youtube.com/watch?v=squats",
    imageUrl: "https://images.unsplash.com/photo-1534258936925-c8bedbd4e239?w=500&h=300&fit=crop",
    targetMuscles: ["Cuádriceps", "Glúteos", "Isquiotibiales"]
  },
  {
    name: "Peso Muerto",
    description: "Ejercicio completo que trabaja todo el cuerpo posterior",
    type: ExerciseType.STRENGTH,
    intensity: IntensityLevel.HIGH,
    level: UserLevel.INTERMEDIATE,
    technique: "Párate con los pies separados al ancho de las caderas. Agarra la barra con las manos separadas al ancho de los hombros. Mantén la espalda recta y baja la barra controladamente hasta el suelo, luego levántala.",
    videoUrl: "https://www.youtube.com/watch?v=deadlift",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&h=300&fit=crop",
    targetMuscles: ["Espalda", "Glúteos", "Isquiotibiales", "Trapecio"]
  },
  {
    name: "Flexiones",
    description: "Ejercicio de peso corporal para pecho, hombros y tríceps",
    type: ExerciseType.STRENGTH,
    intensity: IntensityLevel.MEDIUM,
    level: UserLevel.BEGINNER,
    technique: "Colócate en posición de plancha con las manos separadas al ancho de los hombros. Baja el pecho hacia el suelo y empuja hacia arriba manteniendo el cuerpo recto.",
    videoUrl: "https://www.youtube.com/watch?v=pushups",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    targetMuscles: ["Pecho", "Hombros", "Tríceps", "Core"]
  },
  {
    name: "Plancha",
    description: "Ejercicio isométrico para fortalecer el core",
    type: ExerciseType.STRENGTH,
    intensity: IntensityLevel.MEDIUM,
    level: UserLevel.BEGINNER,
    technique: "Colócate boca abajo apoyándote en los antebrazos y las puntas de los pies. Mantén el cuerpo recto como una tabla, contrayendo el abdomen.",
    videoUrl: "https://www.youtube.com/watch?v=plank",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    targetMuscles: ["Core", "Hombros", "Glúteos"]
  },
  {
    name: "Burpees",
    description: "Ejercicio funcional completo que combina fuerza y cardio",
    type: ExerciseType.CARDIO,
    intensity: IntensityLevel.HIGH,
    level: UserLevel.INTERMEDIATE,
    technique: "Comienza de pie, baja a sentadilla, coloca las manos en el suelo, salta los pies hacia atrás, haz una flexión, salta los pies hacia adelante, salta hacia arriba con los brazos extendidos.",
    videoUrl: "https://www.youtube.com/watch?v=burpees",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    targetMuscles: ["Todo el cuerpo"]
  },
  {
    name: "Mountain Climbers",
    description: "Ejercicio cardiovascular de alta intensidad",
    type: ExerciseType.CARDIO,
    intensity: IntensityLevel.HIGH,
    level: UserLevel.BEGINNER,
    technique: "Comienza en posición de plancha. Alterna llevando las rodillas hacia el pecho rápidamente, como si estuvieras corriendo en el lugar.",
    videoUrl: "https://www.youtube.com/watch?v=mountain-climbers",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    targetMuscles: ["Core", "Hombros", "Piernas"]
  },
  {
    name: "Estiramiento de Espalda",
    description: "Estiramiento para mejorar la flexibilidad de la columna",
    type: ExerciseType.FLEXIBILITY,
    intensity: IntensityLevel.LOW,
    level: UserLevel.BEGINNER,
    technique: "Siéntate con las piernas extendidas. Inclínate hacia adelante desde las caderas, manteniendo la espalda recta. Alcanza hacia los pies.",
    videoUrl: "https://www.youtube.com/watch?v=back-stretch",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    targetMuscles: ["Espalda", "Isquiotibiales"]
  }
]

// Sample recipes data
const sampleRecipes = [
  {
    title: "Batido Proteico Post-Entreno",
    description: "Batido rico en proteínas para optimizar la recuperación muscular después del entrenamiento. Ideal para maximizar el crecimiento muscular.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1553830591-d8632a99e6ff?w=500&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=sample1"
  },
  {
    title: "Ensalada de Pollo Mediterránea",
    description: "Ensalada completa con pollo a la plancha, vegetales frescos y aceite de oliva. Perfecta para definición muscular.",
    objective: "Pérdida de peso",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop"
  },
  {
    title: "Bowl Vegano de Quinoa",
    description: "Bowl nutritivo con quinoa, legumbres, aguacate y vegetales de temporada. Alto en proteínas vegetales.",
    objective: "Mantenimiento",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=300&fit=crop"
  },
  {
    title: "Salmón Keto con Espárragos",
    description: "Receta cetogénica con salmón salvaje, espárragos y mantequilla de hierbas. Perfecta para pérdida de peso.",
    objective: "Pérdida de peso",
    level: UserLevel.ADVANCED,
    isPremium: true,
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=sample2"
  },
  {
    title: "Avena Overnight de Chocolate",
    description: "Desayuno preparado la noche anterior con avena, proteína en polvo y cacao. Ideal para ganar masa muscular.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop"
  }
]

// Sample media content
const sampleMediaContent = [
  {
    title: "Fundamentos del Mindset Fitness",
    type: "video",
    url: "https://www.youtube.com/watch?v=mindset-fundamentals",
    topic: "Mindset",
    module: "Mindset 101",
    episode: 1,
    isPremium: false
  },
  {
    title: "Guía Completa de Nutrición",
    type: "pdf",
    url: "https://example.com/nutrition-guide.pdf",
    topic: "Nutrición",
    module: "Nutrición Básica",
    episode: 1,
    isPremium: true
  },
  {
    title: "Meditación para Atletas",
    type: "audio",
    url: "https://example.com/meditation-athletes.mp3",
    topic: "Espiritualidad",
    module: "Mindfulness",
    episode: 1,
    isPremium: true
  },
  {
    title: "Técnicas de Ejercicio Avanzadas",
    type: "video",
    url: "https://www.youtube.com/watch?v=advanced-techniques",
    topic: "Ejercicios",
    module: "Técnica Avanzada",
    episode: 1,
    isPremium: true
  }
]

// Sample services
const sampleServices = [
  {
    name: "Consulta Nutricional Básica",
    description: "Sesión de 30 minutos para evaluar tu alimentación actual y crear un plan básico",
    level: ServiceLevel.LOW,
    price: 50.00,
    duration: 30,
    isActive: true
  },
  {
    name: "Plan de Entrenamiento Personalizado",
    description: "Rutina completa diseñada específicamente para tus objetivos y disponibilidad",
    level: ServiceLevel.HIGH,
    price: 150.00,
    duration: 60,
    isActive: true
  },
  {
    name: "Coaching de Mindset",
    description: "Sesión de coaching para desarrollar la mentalidad ganadora y superar obstáculos",
    level: ServiceLevel.HIGH,
    price: 200.00,
    duration: 90,
    isActive: true
  },
  {
    name: "Seguimiento Semanal",
    description: "Revisión semanal de progreso y ajustes al plan",
    level: ServiceLevel.LOW,
    price: 75.00,
    duration: 30,
    isActive: true
  }
]

// Sample habits for the user
const sampleHabits = [
  {
    name: "Ejercicio Matutino",
    description: "Realizar 30 minutos de ejercicio por la mañana",
    category: HabitCategory.PHYSICAL_TRAINING,
    frequency: HabitFrequency.DAILY,
    trackingType: TrackingType.DURATION,
    targetValue: 30,
    targetUnit: "minutos",
    points: 5,
    color: "#EF4444",
    icon: "💪"
  },
  {
    name: "Meditación",
    description: "10 minutos de meditación diaria",
    category: HabitCategory.REFLECTION,
    frequency: HabitFrequency.DAILY,
    trackingType: TrackingType.DURATION,
    targetValue: 10,
    targetUnit: "minutos",
    points: 3,
    color: "#8B5CF6",
    icon: "🧘"
  },
  {
    name: "Agua",
    description: "Beber 2 litros de agua al día",
    category: HabitCategory.NUTRITION,
    frequency: HabitFrequency.DAILY,
    trackingType: TrackingType.NUMERIC,
    targetValue: 2,
    targetUnit: "litros",
    points: 2,
    color: "#06B6D4",
    icon: "💧"
  },
  {
    name: "Lectura",
    description: "Leer 20 páginas de un libro de desarrollo personal",
    category: HabitCategory.PERSONAL_DEVELOPMENT,
    frequency: HabitFrequency.DAILY,
    trackingType: TrackingType.NUMERIC,
    targetValue: 20,
    targetUnit: "páginas",
    points: 2,
    color: "#10B981",
    icon: "📚"
  },
  {
    name: "Sueño",
    description: "Dormir 8 horas por noche",
    category: HabitCategory.SLEEP_RECOVERY,
    frequency: HabitFrequency.DAILY,
    trackingType: TrackingType.DURATION,
    targetValue: 8,
    targetUnit: "horas",
    points: 4,
    color: "#6366F1",
    icon: "😴"
  }
]

async function seedAdmin() {
  try {
    console.log('🌱 Starting admin seeding...')

    // Clear existing data
    await prisma.ticket.deleteMany()
    await prisma.habitEntry.deleteMany()
    await prisma.habitStreak.deleteMany()
    await prisma.habit.deleteMany()
    await prisma.dailyScore.deleteMany()
    await prisma.challenge.deleteMany()
    await prisma.mediaProgress.deleteMany()
    await prisma.mediaContent.deleteMany()
    await prisma.service.deleteMany()
    await prisma.recipe.deleteMany()
    await prisma.exercise.deleteMany()
    await prisma.user.deleteMany()
    console.log('🧹 Cleared existing data')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.create({
      data: {
        email: 'bolligerfitness@gmail.com',
        password: adminPassword,
        firstName: 'Bolliger',
        lastName: 'Fitness',
        role: UserRole.ADMIN,
        isActive: true,
        emailVerified: new Date(),
        onboardingCompleted: true,
        fitnessLevel: 'advanced',
        primaryGoals: ['coaching', 'business'],
        personalManifesto: 'Transformando vidas a través del fitness y la disciplina'
      }
    })
    console.log('👑 Created admin user:', admin.email)

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 12)
    const user = await prisma.user.create({
      data: {
        email: 'rodrigovdev01@gmail.com',
        password: userPassword,
        firstName: 'Rodrigo',
        lastName: 'Vargas',
        role: UserRole.USER,
        isActive: true,
        emailVerified: new Date(),
        onboardingCompleted: true,
        fitnessLevel: 'intermediate',
        primaryGoals: ['muscle_gain', 'strength', 'endurance'],
        personalManifesto: 'Construyendo la mejor versión de mí mismo cada día',
        timezone: 'America/Lima',
        preferredLanguage: 'es',
        weeklyCommitment: 5,
        intensityPreference: 'intense',
        motivationType: 'performance'
      }
    })
    console.log('👤 Created regular user:', user.email)

    // Create exercises
    for (const exercise of sampleExercises) {
      await prisma.exercise.create({
        data: exercise
      })
    }
    console.log(`💪 Created ${sampleExercises.length} exercises`)

    // Create recipes
    for (const recipe of sampleRecipes) {
      await prisma.recipe.create({
        data: recipe
      })
    }
    console.log(`🍽️ Created ${sampleRecipes.length} recipes`)

    // Create media content
    for (const content of sampleMediaContent) {
      await prisma.mediaContent.create({
        data: content
      })
    }
    console.log(`📚 Created ${sampleMediaContent.length} media content items`)

    // Create services
    for (const service of sampleServices) {
      await prisma.service.create({
        data: service
      })
    }
    console.log(`🛍️ Created ${sampleServices.length} services`)

    // Create habits for the user
    for (const habitData of sampleHabits) {
      await prisma.habit.create({
        data: {
          ...habitData,
          userId: user.id
        }
      })
    }
    console.log(`🎯 Created ${sampleHabits.length} habits for user`)

    // Create tickets for the user (subscription to all plans)
    const tickets = [
      {
        userId: user.id,
        type: 'fitness_plan',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        isUsed: false
      },
      {
        userId: user.id,
        type: 'nutrition_plan',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        isUsed: false
      },
      {
        userId: user.id,
        type: 'mindset_plan',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        isUsed: false
      },
      {
        userId: user.id,
        type: 'premium_content',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        isUsed: false
      }
    ]

    for (const ticket of tickets) {
      await prisma.ticket.create({
        data: ticket
      })
    }
    console.log(`🎫 Created ${tickets.length} subscription tickets for user`)

    // Create some sample daily scores for the user
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      await prisma.dailyScore.create({
        data: {
          userId: user.id,
          date: date,
          totalPoints: Math.floor(Math.random() * 20) + 10,
          completedHabits: Math.floor(Math.random() * 5) + 2,
          totalHabits: 5,
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
    console.log('📊 Created sample daily scores')

    // Create some sample habit entries
    const habits = await prisma.habit.findMany({
      where: { userId: user.id }
    })

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      for (const habit of habits) {
        const isCompleted = Math.random() > 0.3 // 70% completion rate
        
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
    console.log('📝 Created sample habit entries')

    // Create some sample challenges
    const challenges = [
      {
        userId: user.id,
        name: "Desafío 30 Días de Ejercicio",
        description: "Completa 30 días consecutivos de ejercicio",
        category: HabitCategory.PHYSICAL_TRAINING,
        startDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        endDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        targetValue: 30,
        currentValue: 5,
        isCompleted: false,
        reward: "Nueva rutina personalizada"
      },
      {
        userId: user.id,
        name: "Reto de Hidratación",
        description: "Bebe 2 litros de agua por 7 días seguidos",
        category: HabitCategory.NUTRITION,
        startDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        targetValue: 7,
        currentValue: 2,
        isCompleted: false,
        reward: "Recetario de bebidas saludables"
      }
    ]

    for (const challenge of challenges) {
      await prisma.challenge.create({
        data: challenge
      })
    }
    console.log(`🏆 Created ${challenges.length} challenges`)

    console.log('✅ Admin seeding completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`👑 Admin user: bolligerfitness@gmail.com (password: admin123)`)
    console.log(`👤 Regular user: rodrigovdev01@gmail.com (password: user123)`)
    console.log(`💪 Exercises: ${sampleExercises.length}`)
    console.log(`🍽️ Recipes: ${sampleRecipes.length}`)
    console.log(`📚 Media content: ${sampleMediaContent.length}`)
    console.log(`🛍️ Services: ${sampleServices.length}`)
    console.log(`🎯 Habits: ${sampleHabits.length}`)
    console.log(`🎫 Subscription tickets: ${tickets.length}`)
    console.log(`🏆 Challenges: ${challenges.length}`)

  } catch (error) {
    console.error('❌ Error during admin seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  seedAdmin()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedAdmin }
