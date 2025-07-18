import { PrismaClient, ExerciseType, IntensityLevel, UserLevel } from '@prisma/client'

const prisma = new PrismaClient()

const sampleExercises = [
  // STRENGTH exercises
  {
    name: "Press de Banca",
    description: "Ejercicio fundamental para el desarrollo del pecho, hombros y tríceps. Se realiza acostado en un banco con barra.",
    type: ExerciseType.STRENGTH,
    intensity: IntensityLevel.HIGH,
    level: UserLevel.INTERMEDIATE,
    technique: "Acuéstate en el banco, agarra la barra con las manos más anchas que los hombros, baja controladamente hasta el pecho y empuja hacia arriba.",
    targetMuscles: ["Pectorales", "Deltoides", "Tríceps"],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=sample-bench-press"
  },
  {
    name: "Sentadilla",
    description: "Rey de los ejercicios para piernas. Trabaja cuádriceps, glúteos y músculos estabilizadores.",
    type: ExerciseType.STRENGTH,
    intensity: IntensityLevel.HIGH,
    level: UserLevel.BEGINNER,
    technique: "Pies separados al ancho de hombros, baja como si te fueras a sentar manteniendo la espalda recta, hasta que los muslos estén paralelos al suelo.",
    targetMuscles: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    imageUrl: "https://images.unsplash.com/photo-1566241134088-76b99285b7b2?w=500&h=300&fit=crop"
  },
  {
    name: "Peso Muerto",
    description: "Ejercicio compuesto que trabaja toda la cadena posterior. Fundamental para fuerza y masa muscular.",
    type: ExerciseType.STRENGTH,
    intensity: IntensityLevel.HIGH,
    level: UserLevel.ADVANCED,
    technique: "Pies al ancho de caderas, agarra la barra, mantén la espalda recta y levanta extendiendo caderas y rodillas simultáneamente.",
    targetMuscles: ["Isquiotibiales", "Glúteos", "Dorsales", "Trapecio"],
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=sample-deadlift"
  },
  {
    name: "Dominadas",
    description: "Ejercicio de peso corporal para el desarrollo de la espalda y bíceps. Excelente para fuerza funcional.",
    type: ExerciseType.STRENGTH,
    intensity: IntensityLevel.HIGH,
    level: UserLevel.INTERMEDIATE,
    technique: "Cuelga de la barra con agarre prono, tira de tu cuerpo hacia arriba hasta que la barbilla pase la barra.",
    targetMuscles: ["Dorsales", "Bíceps", "Romboides"],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"
  },

  // CARDIO exercises
  {
    name: "Carrera Continua",
    description: "Ejercicio cardiovascular básico. Ideal para mejorar resistencia y quemar calorías.",
    type: ExerciseType.CARDIO,
    intensity: IntensityLevel.MEDIUM,
    level: UserLevel.BEGINNER,
    technique: "Mantén un ritmo constante, aterriza con el mediopié, mantén postura erguida y respiración rítmica.",
    targetMuscles: ["Cuádriceps", "Gemelos", "Cardiovascular"],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=300&fit=crop"
  },
  {
    name: "HIIT en Bicicleta",
    description: "Entrenamiento intervalado de alta intensidad en bicicleta estática. Muy eficiente para quemar grasa.",
    type: ExerciseType.CARDIO,
    intensity: IntensityLevel.HIGH,
    level: UserLevel.INTERMEDIATE,
    technique: "Alterna 30 segundos a máxima intensidad con 90 segundos de recuperación activa.",
    targetMuscles: ["Cuádriceps", "Glúteos", "Cardiovascular"],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=sample-hiit-bike"
  },
  {
    name: "Remo en Máquina",
    description: "Ejercicio cardiovascular que también fortalece espalda y brazos. Bajo impacto en articulaciones.",
    type: ExerciseType.CARDIO,
    intensity: IntensityLevel.MEDIUM,
    level: UserLevel.BEGINNER,
    technique: "Mantén la espalda recta, tira con los brazos llevando los codos hacia atrás, extiende las piernas al final.",
    targetMuscles: ["Dorsales", "Bíceps", "Cuádriceps", "Cardiovascular"],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"
  },

  // MOBILITY exercises
  {
    name: "Gato-Camello",
    description: "Ejercicio de movilidad para la columna vertebral. Ideal para calentar y mejorar flexibilidad espinal.",
    type: ExerciseType.MOBILITY,
    intensity: IntensityLevel.LOW,
    level: UserLevel.BEGINNER,
    technique: "En cuadrupedia, alterna entre arquear y redondear la espalda lentamente.",
    targetMuscles: ["Columna vertebral", "Core"],
    imageUrl: "https://images.unsplash.com/photo-1506629905607-45cf1ae99825?w=500&h=300&fit=crop"
  },
  {
    name: "Círculos de Brazos",
    description: "Movilización articular para hombros. Prepara las articulaciones para el entrenamiento.",
    type: ExerciseType.MOBILITY,
    intensity: IntensityLevel.LOW,
    level: UserLevel.BEGINNER,
    technique: "Brazos extendidos a los lados, realiza círculos progresivamente más grandes hacia adelante y atrás.",
    targetMuscles: ["Deltoides", "Manguito rotador"],
    imageUrl: "https://images.unsplash.com/photo-1506629905607-45cf1ae99825?w=500&h=300&fit=crop"
  },

  // FLEXIBILITY exercises
  {
    name: "Estiramiento de Isquiotibiales",
    description: "Estiramiento estático para la parte posterior de las piernas. Mejora flexibilidad y previene lesiones.",
    type: ExerciseType.FLEXIBILITY,
    intensity: IntensityLevel.LOW,
    level: UserLevel.BEGINNER,
    technique: "Sentado con una pierna extendida, inclínate hacia adelante manteniendo la espalda recta.",
    targetMuscles: ["Isquiotibiales", "Gemelos"],
    imageUrl: "https://images.unsplash.com/photo-1506629905607-45cf1ae99825?w=500&h=300&fit=crop"
  },
  {
    name: "Postura del Perro Boca Abajo",
    description: "Posición de yoga que estira toda la cadena posterior y fortalece brazos y core.",
    type: ExerciseType.FLEXIBILITY,
    intensity: IntensityLevel.MEDIUM,
    level: UserLevel.INTERMEDIATE,
    technique: "Forma una V invertida con el cuerpo, manos y pies apoyados, empuja el suelo con las manos.",
    targetMuscles: ["Isquiotibiales", "Gemelos", "Deltoides", "Core"],
    imageUrl: "https://images.unsplash.com/photo-1506629905607-45cf1ae99825?w=500&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=sample-downward-dog"
  },
  {
    name: "Estiramiento de Cuádriceps",
    description: "Estiramiento para la parte frontal del muslo. Importante después de entrenamientos de piernas.",
    type: ExerciseType.FLEXIBILITY,
    intensity: IntensityLevel.LOW,
    level: UserLevel.BEGINNER,
    technique: "De pie, flexiona una rodilla llevando el talón hacia el glúteo, mantén la posición.",
    targetMuscles: ["Cuádriceps", "Hip flexors"],
    imageUrl: "https://images.unsplash.com/photo-1506629905607-45cf1ae99825?w=500&h=300&fit=crop"
  }
]

async function seedExercises() {
  try {
    console.log('🌱 Seeding exercises...')

    // Clear existing exercises
    await prisma.exercise.deleteMany()
    console.log('🧹 Cleared existing exercises')

    // Create sample exercises
    for (const exercise of sampleExercises) {
      await prisma.exercise.create({
        data: exercise
      })
    }

    console.log(`✅ Created ${sampleExercises.length} sample exercises`)
    console.log('🎉 Exercise seeding completed!')

  } catch (error) {
    console.error('❌ Error seeding exercises:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  seedExercises()
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedExercises } 