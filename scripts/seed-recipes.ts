import { PrismaClient, UserLevel } from '@prisma/client'

const prisma = new PrismaClient()

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
    objective: "Definición",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop"
  },
  {
    title: "Bowl Vegano de Quinoa",
    description: "Bowl nutritivo con quinoa, legumbres, aguacate y vegetales de temporada. Alto en proteínas vegetales.",
    objective: "Vegano",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=300&fit=crop"
  },
  {
    title: "Salmón Keto con Espárragos",
    description: "Receta cetogénica con salmón salvaje, espárragos y mantequilla de hierbas. Perfecta para pérdida de peso.",
    objective: "Keto",
    level: UserLevel.ADVANCED,
    isPremium: true,
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=sample2"
  },
  {
    title: "Avena Overnight de Chocolate",
    description: "Desayuno preparado la noche anterior con avena, proteína en polvo y cacao. Ideal para ganar masa muscular.",
    objective: "Volumen",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop"
  },
  {
    title: "Wrap Low Carb de Pavo",
    description: "Wrap sin carbohidratos usando lechuga como base, relleno de pavo, aguacate y vegetales frescos.",
    objective: "Low Carb",
    level: UserLevel.INTERMEDIATE,
    isPremium: true,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop"
  },
  {
    title: "Smoothie Verde Detox",
    description: "Batido verde con espinacas, apio, manzana verde y jengibre. Perfecto para desintoxicar el organismo.",
    objective: "Pérdida de peso",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&h=300&fit=crop"
  },
  {
    title: "Lasaña Vegetariana de Lenteja",
    description: "Versión saludable de lasaña usando lenteja roja, vegetales y queso bajo en grasa. Rica en proteínas vegetales.",
    objective: "Vegetariano",
    level: UserLevel.ADVANCED,
    isPremium: true,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d80c?w=500&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=sample3"
  },
  {
    title: "Pollo Teriyaki con Arroz Integral",
    description: "Pollo marinado en salsa teriyaki casera acompañado de arroz integral y verduras al vapor.",
    objective: "Mantenimiento",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop"
  },
  {
    title: "Tarta de Proteína Sin Horno",
    description: "Postre saludable con base de dátiles y nueces, relleno de proteína en polvo y mantequilla de almendra.",
    objective: "Ganancia muscular",
    level: UserLevel.ADVANCED,
    isPremium: true,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=sample4"
  }
]

async function seedRecipes() {
  try {
    console.log('🌱 Seeding recipes...')

    // Clear existing recipes
    await prisma.recipe.deleteMany()
    console.log('🧹 Cleared existing recipes')

    // Create sample recipes
    for (const recipe of sampleRecipes) {
      await prisma.recipe.create({
        data: recipe
      })
    }

    console.log(`✅ Created ${sampleRecipes.length} sample recipes`)
    console.log('🎉 Recipe seeding completed!')

  } catch (error) {
    console.error('❌ Error seeding recipes:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  seedRecipes()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedRecipes } 