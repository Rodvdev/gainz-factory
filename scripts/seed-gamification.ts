import { PrismaClient, AchievementRarity, AchievementCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function seedLevelConfigs() {
  console.log('🌱 Seeding level configurations...')
  
  const levelConfigs = [
    {
      level: 1,
      name: "Novato GF",
      description: "Recién empezando tu transformación",
      emoji: "🥚",
      requiredXP: 0,
      color: "#9CA3AF",
      benefits: ["Acceso básico", "Logros comunes"]
    },
    {
      level: 2,
      name: "Rookie GF", 
      description: "Los primeros pasos hacia los Gainz",
      emoji: "🐣",
      requiredXP: 100,
      color: "#F59E0B",
      benefits: ["Logros raros", "Estadísticas avanzadas"]
    },
    {
      level: 3,
      name: "Warrior GF",
      description: "Despertando el guerrero interior", 
      emoji: "🐓",
      requiredXP: 300,
      color: "#EF4444",
      benefits: ["Desafíos especiales", "Avatar personalizado"]
    },
    {
      level: 4,
      name: "Beast GF",
      description: "Volando alto hacia tus objetivos",
      emoji: "🦅", 
      requiredXP: 600,
      color: "#3B82F6",
      benefits: ["Logros épicos", "Contenido premium"]
    },
    {
      level: 5,
      name: "Legendary GF",
      description: "Rugiendo con fuerza y determinación",
      emoji: "🦁",
      requiredXP: 1000,
      color: "#8B5CF6",
      benefits: ["Logros legendarios", "Acceso VIP"]
    },
    {
      level: 6,
      name: "Gainz Master",
      description: "Legendario, imparable, mítico",
      emoji: "🐉",
      requiredXP: 1500,
      color: "#DC2626",
      benefits: ["Todo desbloqueado", "Mentor status"]
    },
    {
      level: 7,
      name: "Rey de los Gainz",
      description: "El pináculo de la transformación",
      emoji: "👑",
      requiredXP: 2500,
      color: "#7C3AED",
      benefits: ["Dios de los Gainz", "Acceso completo"]
    }
  ]

  for (const config of levelConfigs) {
    await prisma.levelConfig.upsert({
      where: { level: config.level },
      update: config,
      create: config
    })
  }

  console.log('✅ Level configurations seeded!')
}

async function seedAchievements() {
  console.log('🏆 Seeding achievements...')
  
  const achievements = [
    // Logros de Racha
    {
      title: "Primer Paso",
      description: "Completa tu primer hábito",
      icon: "👶",
      rarity: AchievementRarity.COMMON,
      category: AchievementCategory.HABITS,
      points: 10,
      requirements: { type: "first_habit" }
    },
    {
      title: "Semana de Fuego",
      description: "7 días consecutivos de disciplina",
      icon: "🔥",
      rarity: AchievementRarity.RARE,
      category: AchievementCategory.STREAK,
      points: 50,
      requirements: { type: "streak", days: 7 }
    },
    {
      title: "Máquina de Hábitos",
      description: "30 días sin parar",
      icon: "⚡",
      rarity: AchievementRarity.EPIC,
      category: AchievementCategory.STREAK,
      points: 200,
      requirements: { type: "streak", days: 30 }
    },
    {
      title: "Disciplina Legendaria",
      description: "100 días consecutivos",
      icon: "💎",
      rarity: AchievementRarity.LEGENDARY,
      category: AchievementCategory.STREAK,
      points: 500,
      requirements: { type: "streak", days: 100 }
    },

    // Logros de Puntos
    {
      title: "Primeros Puntos",
      description: "Acumula 100 puntos",
      icon: "⭐",
      rarity: AchievementRarity.COMMON,
      category: AchievementCategory.MILESTONE,
      points: 20,
      requirements: { type: "points", amount: 100 }
    },
    {
      title: "Mil Puntos de Poder",
      description: "Acumula 1000 puntos",
      icon: "💪",
      rarity: AchievementRarity.EPIC,
      category: AchievementCategory.MILESTONE,
      points: 100,
      requirements: { type: "points", amount: 1000 }
    },
    {
      title: "Diez Mil",
      description: "Acumula 10,000 puntos",
      icon: "🏆",
      rarity: AchievementRarity.LEGENDARY,
      category: AchievementCategory.MILESTONE,
      points: 300,
      requirements: { type: "points", amount: 10000 }
    },

    // Logros de Hábitos
    {
      title: "Maestro de la Mañana",
      description: "Completa 30 hábitos matutinos",
      icon: "🌅",
      rarity: AchievementRarity.RARE,
      category: AchievementCategory.HABITS,
      points: 75,
      requirements: { type: "habit_category", category: "MORNING_ROUTINE", count: 30 }
    },
    {
      title: "Guerrero del Gym",
      description: "Completa 50 entrenamientos",
      icon: "🏋️",
      rarity: AchievementRarity.EPIC,
      category: AchievementCategory.HABITS,
      points: 150,
      requirements: { type: "habit_category", category: "PHYSICAL_TRAINING", count: 50 }
    },
    {
      title: "Nutricionista Pro",
      description: "Completa 40 hábitos de nutrición",
      icon: "🥗",
      rarity: AchievementRarity.RARE,
      category: AchievementCategory.HABITS,
      points: 80,
      requirements: { type: "habit_category", category: "NUTRITION", count: 40 }
    },

    // Logros de Desafíos
    {
      title: "Desafiante",
      description: "Completa tu primer desafío",
      icon: "🎯",
      rarity: AchievementRarity.COMMON,
      category: AchievementCategory.CHALLENGES,
      points: 25,
      requirements: { type: "challenge_completed", count: 1 }
    },
    {
      title: "Cazador de Desafíos",
      description: "Completa 10 desafíos",
      icon: "🏹",
      rarity: AchievementRarity.EPIC,
      category: AchievementCategory.CHALLENGES,
      points: 200,
      requirements: { type: "challenge_completed", count: 10 }
    },

    // Logros de Consistencia
    {
      title: "Consistencia Semanal",
      description: "Completa hábitos 7 días seguidos",
      icon: "📅",
      rarity: AchievementRarity.RARE,
      category: AchievementCategory.CONSISTENCY,
      points: 60,
      requirements: { type: "weekly_consistency", weeks: 1 }
    },
    {
      title: "Mes de Disciplina",
      description: "Mantén consistencia por un mes",
      icon: "🗓️",
      rarity: AchievementRarity.EPIC,
      category: AchievementCategory.CONSISTENCY,
      points: 250,
      requirements: { type: "monthly_consistency", months: 1 }
    },

    // Logros Sociales
    {
      title: "Comunidad GF",
      description: "Interactúa en el foro por primera vez",
      icon: "👥",
      rarity: AchievementRarity.COMMON,
      category: AchievementCategory.SOCIAL,
      points: 15,
      requirements: { type: "forum_post", count: 1 }
    },
    {
      title: "Influencer GF",
      description: "Ayuda a otros en la comunidad",
      icon: "🌟",
      rarity: AchievementRarity.RARE,
      category: AchievementCategory.SOCIAL,
      points: 100,
      requirements: { type: "forum_helpful", count: 10 }
    }
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { 
        title_category: {
          title: achievement.title,
          category: achievement.category
        }
      },
      update: achievement,
      create: achievement
    })
  }

  console.log('✅ Achievements seeded!')
}

async function main() {
  try {
    await seedLevelConfigs()
    await seedAchievements()
    console.log('🎉 Gamification system seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding gamification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
