import { PrismaClient, UserLevel } from '@prisma/client'

const prisma = new PrismaClient()

const sampleRecipes = [
  {
    title: "Mousse de Chocolate FIT y PROTEICO",
    description: "Mousse rico en proteínas con cacao, mantequilla de maní y claras batidas. Perfecto para satisfacer el antojo de chocolate de manera saludable.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "Torta de Avena Anabólica",
    description: "Torta proteica con avena, huevos, plátano y cacao. Fácil, práctica y recontra PROTEICA, ideal para librarte de ese antojito dulce.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop"
  },
  {
    title: "Chaufa de Quinua Anabólico",
    description: "Chaufa saludable con quinua, pollo, vegetales y huevo. Rico en proteínas y perfecto para meal prep.",
    objective: "Ganancia muscular",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop"
  },
  {
    title: "Carrot Cake FIT (en 2 minutos)",
    description: "Carrot cake saludable preparado en microondas con harina de avena, zanahoria y frutos secos. Listo en solo 2 minutos.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "DELICIA de Blueberries (sabor cheesecake)",
    description: "Postre cremoso con yogurt griego, huevos y arándanos. Te da la sensación que estás comiendo un cheesecake super saludable.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "PIZZA +30G PROTE (masa de huevos)",
    description: "Pizza saludable con masa de huevos, salsa de tomate, queso mozzarella y pepperoni. Excelente opción casera para librarte del antojo de pizza.",
    objective: "Ganancia muscular",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop"
  },
  {
    title: "Masa de Galleta Fit (Cookie Dough)",
    description: "Cookie dough saludable con harina de almendra, mantequilla de maní y proteína. Perfecto para satisfacer el antojo de galletas.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "Galletas al horno / air fryer ANABÓLICAS",
    description: "Galletas proteicas horneadas con harina de almendra, mantequilla de maní y chips de chocolate. Manjar de dios.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "Salsa de MANGO PICANTE",
    description: "Salsa agridulce con mango, ají limo, kion y miel. Ideal para acompañar y darle un toque especial a tus comidas.",
    objective: "Mantenimiento",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop"
  },
  {
    title: "Crema de AJÍ AMARILLO FIT y PROTEICA (salsa a la huancaína)",
    description: "Crema picante con ají amarillo, quinua, queso fresco y huevos. Perfecta para acompañar papas, arroz o como dip.",
    objective: "Ganancia muscular",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop"
  },
  {
    title: "Crema de AJÍ con HUACATAY FIT y PROTEICA (ocopa)",
    description: "Crema picante con ají amarillo, huacatay, quinua y mantequilla de maní. Sabor único y más proteína.",
    objective: "Ganancia muscular",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop"
  },
  {
    title: "BROWNIE DE AVOCADO",
    description: "Brownie saludable con palta, plátano, cacao y avena. La palta le da una textura cremosa y grasas saludables.",
    objective: "Ganancia muscular",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "Salsa BBQ FIT",
    description: "Salsa BBQ saludable con tomates, cebolla, paprika y miel. Perfecta para acompañar pollo, pescado o hamburguesas.",
    objective: "Mantenimiento",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop"
  },
  {
    title: "NUGGETS FIT (mejores que los de mcdonalds)",
    description: "Nuggets saludables con pollo, galletas de arroz y almendras. Mejores que los de McDonald's y perfectos para meal prep.",
    objective: "Ganancia muscular",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop"
  },
  {
    title: "CUCHAREABLE MINI sabor PIE de LIMÓN",
    description: "Mini pie de limón cuchareable con avena, yogur griego y mantequilla de maní. Perfecto para un postre rápido y saludable.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "Maki Cuchareable (versión económica)",
    description: "Maki cuchareable con arroz, atún, palta y salsa acevichada fit. Versión económica y fácil de hacer en casa.",
    objective: "Ganancia muscular",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop"
  },
  {
    title: "Huevos Anabólicos",
    description: "Huevos cremosos con mostaza, yogur griego y perejil. Perfecto para el desayuno con mucha proteína.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop"
  },
  {
    title: "Vinagreta FIT (Honey Mustard)",
    description: "Vinagreta saludable con yogur griego, mostaza, naranja y vinagre de manzana. Perfecta para ensaladas y como dip.",
    objective: "Mantenimiento",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop"
  },
  {
    title: "CHIPS SALUDABLES",
    description: "Chips de vegetales horneados con papa, beterraga, zanahoria y camote. Ideales para comer viendo una película sin salirte de la dieta.",
    objective: "Mantenimiento",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop"
  },
  {
    title: "Pastel de MANZANA FIT y PROTEICO",
    description: "Pastel de manzana saludable con huevos, yogur griego y avena. Perfecto para el desayuno o como postre.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "TIRAMISÚ de QUINUA a la OLLA",
    description: "Tiramisú saludable con quinua, cacao, café y leche de almendras. Cambiar el agua del hervor 3 veces para que no salga amarga.",
    objective: "Ganancia muscular",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "Batido Proteína (definición)",
    description: "Batido proteico con plátano, fresas, proteína Iso Xp y yogur griego. Perfecto para definición muscular.",
    objective: "Definición",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1553830591-d8632a99e6ff?w=500&h=300&fit=crop"
  },
  {
    title: "Batido Proteína (volumen)",
    description: "Batido proteico con plátano, arándanos, avena y mantequilla de maní. Perfecto para ganar volumen muscular.",
    objective: "Volumen",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1553830591-d8632a99e6ff?w=500&h=300&fit=crop"
  },
  {
    title: "Mayonesa de Palta",
    description: "Mayonesa saludable con palta, huevos duros y yogur griego. Perfecta para sándwiches y wraps.",
    objective: "Mantenimiento",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop"
  },
  {
    title: "Cookie Dough +30g de proteína",
    description: "Cookie dough saludable con harina de avena, proteína y mantequilla de maní. Perfecto para satisfacer el antojo de cookie dough.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "POKE ANABÓLICO",
    description: "Poke bowl con arroz, pollo, vegetales frescos y palta. Puedes ajustar las porciones según tus necesidades.",
    objective: "Ganancia muscular",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop"
  },
  {
    title: "HELADO CON +50G DE PROTEÍNA",
    description: "Helado proteico con yogur griego, queso crema, proteína y mantequilla de maní. Perfecto para post-entreno o como postre saludable.",
    objective: "Ganancia muscular",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "CHAUFA ANABÓLICO",
    description: "Chaufa saludable con arroz, pollo, vegetales y huevo. Usar arroz integral para más fibra y nutrientes.",
    objective: "Ganancia muscular",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop"
  },
  {
    title: "Panqueques Proteicos",
    description: "Panqueques con huevos, avena protein, plátano y chía. Perfecto para desayuno o post-entreno.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop"
  },
  {
    title: "TOSTADAS FRANCESAS DE LA ROCA",
    description: "Tostadas francesas con huevos, leche, canela y proteína ISO TECH. Saben a Donuts y son ideales para cualquier momento.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop"
  },
  {
    title: "Panqueques de Espinaca",
    description: "Panqueques salados con avena, huevos, atún y vegetales. Perfecto para desayuno o almuerzo.",
    objective: "Ganancia muscular",
    level: UserLevel.INTERMEDIATE,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop"
  },
  {
    title: "Mousse con SOLO 2 ingredientes",
    description: "Mousse cremoso con manzanas y chocolate bitter. La textura es increíblemente suave y cremosa.",
    objective: "Mantenimiento",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "AREPA SOLO 3 INGREDIENTES",
    description: "Arepa saludable con queso, zanahoria rayada y huevos. IDEAL como desayuno o snack FACILITA de hacer.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop"
  },
  {
    title: "Cheesecake de Chocolate FIT y PROTEICO",
    description: "Cheesecake saludable con yogur griego, huevos y chocolate bitter. La textura y sabor es ESPECTACULAR.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "Tostadas de Atún con mayonesa FIT y PROTEICA",
    description: "Tostadas con atún, palta, yogur griego y vegetales. Perfecto para desayuno, almuerzo o snack.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop"
  },
  {
    title: "Bombón helado PROTEICO cuchareable",
    description: "Bombón helado con yogur griego, proteína y fresas. Perfecto como snack saludable cuando estés antojado de algo dulce.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "Bolitas CRISPY de ATÚN",
    description: "Bolitas crujientes de atún con huevos y corn flakes. Perfecto para snack o almuerzo.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop"
  },
  {
    title: "ARROZ ÁRABE",
    description: "Arroz árabe con tocino, crema de aceituna, pasas y almendras. Una recetita que había grabado para Navidad.",
    objective: "Mantenimiento",
    level: UserLevel.ADVANCED,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop"
  },
  {
    title: "Tostadas Francesas +40g proteína",
    description: "Tostadas francesas con huevos, leche, canela y proteína. Saben a Donuts y son ideales para cualquier momento.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=300&fit=crop"
  },
  {
    title: "Bombones Fit",
    description: "Bombones saludables con arándanos, fresas, yogur griego y chocolate. Perfecto como snack saludable.",
    objective: "Mantenimiento",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
  },
  {
    title: "Flan de Café Fit (en 2 minutos)",
    description: "Flan de café saludable preparado en microondas con huevo, leche y café. Súper rápido de preparar en solo 2 minutos.",
    objective: "Ganancia muscular",
    level: UserLevel.BEGINNER,
    isPremium: false,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=300&fit=crop"
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