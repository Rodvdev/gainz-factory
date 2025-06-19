import { PrismaClient } from '@prisma/client';
import { HabitEntry } from './graphql/growth/types';

const prisma = new PrismaClient();

// Tu usuario real
export const myUser = {
  id: 'rodrigo-gainz-factory',
  email: 'rodrigovdev01@gmail.com',
  password: '1Ewe9920.', // En producción, esto sería un hash real
  firstName: 'Rodrigo',
  lastName: 'Vásquez de Velasco',
  bio: 'Founder & CEO de Gainz Factory - Construyendo el futuro del desarrollo personal consciente',
  isActive: true,
};

// Tus hábitos reales organizados por categorías
export const myRealHabits = [
  // 🌅 RUTINA MATUTINA (Morning Routine)
  {
    name: 'Despertar temprano',
    description: 'Levantarse a las 6:00 AM para maximizar el día',
    category: 'MORNING_ROUTINE',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'BINARY',
    points: 15,
    color: '#F59E0B',
    icon: '🌅',
    isActive: true,
    order: 1,
    userId: myUser.id,
  },
  {
    name: 'Presencia matutina',
    description: 'Establecer la base de presencia plena - el fundamento de la verdadera inteligencia',
    category: 'MORNING_ROUTINE',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'DURATION',
    targetValue: 15,
    targetUnit: 'MINUTES',
    points: 30,
    color: '#8B5CF6',
    icon: '🧘‍♂️',
    isActive: true,
    order: 2,
    userId: myUser.id,
  },
  {
    name: 'Journaling matutino',
    description: 'Escribir pensamientos y intenciones del día',
    category: 'MORNING_ROUTINE',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'DURATION',
    targetValue: 10,
    targetUnit: 'MINUTES',
    points: 15,
    color: '#6366F1',
    icon: '📔',
    isActive: true,
    order: 3,
    userId: myUser.id,
  },
  {
    name: 'Hidratación temprana',
    description: 'Beber 500ml de agua al despertar',
    category: 'MORNING_ROUTINE',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'NUMERIC',
    targetValue: 500,
    targetUnit: 'ML',
    points: 10,
    color: '#06B6D4',
    icon: '💧',
    isActive: true,
    order: 4,
    userId: myUser.id,
  },

  // 💪 ENTRENAMIENTO FÍSICO (Physical Training)
  {
    name: 'Entrenamiento de fuerza',
    description: 'Sesión de pesas o ejercicios de resistencia',
    category: 'PHYSICAL_TRAINING',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'DURATION',
    targetValue: 45,
    targetUnit: 'MINUTES',
    points: 35,
    color: '#DC2626',
    icon: '💪',
    isActive: true,
    order: 1,
    userId: myUser.id,
  },
  {
    name: 'Cardio',
    description: 'Actividad cardiovascular (correr, bicicleta, natación)',
    category: 'PHYSICAL_TRAINING',
    frequency: 'WEEKLY',
    targetCount: 3,
    trackingType: 'DURATION',
    targetValue: 30,
    targetUnit: 'MINUTES',
    points: 25,
    color: '#F97316',
    icon: '🏃',
    isActive: true,
    order: 2,
    userId: myUser.id,
  },
  {
    name: 'Pasos diarios',
    description: 'Caminar al menos 10,000 pasos',
    category: 'PHYSICAL_TRAINING',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'NUMERIC',
    targetValue: 10000,
    targetUnit: 'STEPS',
    points: 20,
    color: '#22C55E',
    icon: '👟',
    isActive: true,
    order: 3,
    userId: myUser.id,
  },

  // 🥗 NUTRICIÓN (Nutrition)
  {
    name: 'Desayuno saludable',
    description: 'Comida balanceada con proteína, carbohidratos y grasas',
    category: 'NUTRITION',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'BINARY',
    points: 15,
    color: '#16A34A',
    icon: '🥗',
    isActive: true,
    order: 1,
    userId: myUser.id,
  },
  {
    name: 'Hidratación',
    description: 'Beber al menos 2.5 litros de agua',
    category: 'NUTRITION',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'NUMERIC',
    targetValue: 2500,
    targetUnit: 'ML',
    points: 20,
    color: '#0EA5E9',
    icon: '💧',
    isActive: true,
    order: 2,
    userId: myUser.id,
  },
  {
    name: 'Evitar comida procesada',
    description: 'No consumir alimentos ultraprocesados',
    category: 'NUTRITION',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'BINARY',
    points: 25,
    color: '#DC2626',
    icon: '🚫',
    isActive: true,
    order: 3,
    userId: myUser.id,
  },

  // 🧠 TRABAJO PROFUNDO (Deep Work)
  {
    name: 'Sesión de trabajo enfocado',
    description: 'Período sin distracciones de trabajo concentrado',
    category: 'DEEP_WORK',
    frequency: 'DAILY',
    targetCount: 2,
    trackingType: 'DURATION',
    targetValue: 90,
    targetUnit: 'MINUTES',
    points: 35,
    color: '#1E40AF',
    icon: '🎯',
    isActive: true,
    order: 1,
    userId: myUser.id,
  },
  {
    name: 'Sin redes sociales (trabajo)',
    description: 'Evitar redes sociales durante horas laborales',
    category: 'DEEP_WORK',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'BINARY',
    points: 20,
    color: '#DC2626',
    icon: '🚫',
    isActive: true,
    order: 2,
    userId: myUser.id,
  },
  {
    name: 'Planificación del día',
    description: 'Revisar y organizar tareas prioritarias',
    category: 'DEEP_WORK',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'DURATION',
    targetValue: 15,
    targetUnit: 'MINUTES',
    points: 15,
    color: '#059669',
    icon: '📋',
    isActive: true,
    order: 3,
    userId: myUser.id,
  },

  // 🧠 PRESENCIA Y CONCIENCIA (Presence & Awareness) - La base más profunda
  {
    name: 'Observación consciente',
    description: 'Dar un paso atrás y observarte desde fuera, sin estar atrapado en emociones y pensamientos',
    category: 'PERSONAL_DEVELOPMENT',
    frequency: 'DAILY',
    targetCount: 3,
    trackingType: 'DURATION',
    targetValue: 10,
    targetUnit: 'MINUTES',
    points: 35,
    color: '#6366F1',
    icon: '👁️',
    isActive: true,
    order: 1,
    userId: myUser.id,
  },
  {
    name: 'Pausa consciente',
    description: 'Detenerse, observar y ver lo que normalmente pasamos por alto en el momento presente',
    category: 'PERSONAL_DEVELOPMENT',
    frequency: 'DAILY',
    targetCount: 5,
    trackingType: 'BINARY',
    points: 30,
    color: '#8B5CF6',
    icon: '⏸️',
    isActive: true,
    order: 2,
    userId: myUser.id,
  },
  {
    name: 'Lectura contemplativa',
    description: 'Leer desde la presencia, no para acumular sino para integrar sabiduría',
    category: 'PERSONAL_DEVELOPMENT',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'DURATION',
    targetValue: 25,
    targetUnit: 'MINUTES',
    points: 25,
    color: '#7C2D12',
    icon: '📖',
    isActive: true,
    order: 3,
    userId: myUser.id,
  },

  // 🤝 CARISMA SOCIAL (Social Charisma)
  {
    name: 'Llamada a familia/amigos',
    description: 'Contactar con seres queridos',
    category: 'SOCIAL_CHARISMA',
    frequency: 'WEEKLY',
    targetCount: 3,
    trackingType: 'BINARY',
    points: 20,
    color: '#EC4899',
    icon: '📞',
    isActive: true,
    order: 1,
    userId: myUser.id,
  },
  {
    name: 'Networking',
    description: 'Conocer una persona nueva o fortalecer relación',
    category: 'SOCIAL_CHARISMA',
    frequency: 'WEEKLY',
    targetCount: 2,
    trackingType: 'BINARY',
    points: 25,
    color: '#8B5CF6',
    icon: '🤝',
    isActive: true,
    order: 2,
    userId: myUser.id,
  },

  // 🛌 SUEÑO Y RECUPERACIÓN (Sleep & Recovery)
  {
    name: 'Dormir 8 horas',
    description: 'Descanso completo y reparador',
    category: 'SLEEP_RECOVERY',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'DURATION',
    targetValue: 8,
    targetUnit: 'HOURS',
    points: 25,
    color: '#1E1B4B',
    icon: '🛌',
    isActive: true,
    order: 1,
    userId: myUser.id,
  },
  {
    name: 'Rutina nocturna',
    description: 'Desconectar dispositivos 1 hora antes de dormir',
    category: 'SLEEP_RECOVERY',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'BINARY',
    points: 20,
    color: '#7C2D12',
    icon: '📱',
    isActive: true,
    order: 2,
    userId: myUser.id,
  },

  // 🔄 REFLEXIÓN CONSCIENTE (Conscious Reflection)
  {
    name: 'Observación sin juicio',
    description: 'Revisar el día desde la presencia, observando patrones sin estar atrapado en ellos',
    category: 'REFLECTION',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'DURATION',
    targetValue: 15,
    targetUnit: 'MINUTES',
    points: 30,
    color: '#7C3AED',
    icon: '👁️‍🗨️',
    isActive: true,
    order: 1,
    userId: myUser.id,
  },
  {
    name: 'Gratitud desde el ser',
    description: 'Reconocer la abundancia presente, no desde la mente sino desde el corazón',
    category: 'REFLECTION',
    frequency: 'DAILY',
    targetCount: 1,
    trackingType: 'TEXT',
    points: 25,
    color: '#DC2626',
    icon: '💖',
    isActive: true,
    order: 2,
    userId: myUser.id,
  },
];

// Tus challenges personalizados
export const myChallenges = [
  {
    name: 'El Despertar de la Presencia',
    description: 'ACTITUD #9: El punto de inflexión del desarrollo real. Practica observación consciente 9 días seguidos',
    category: 'PERSONAL_DEVELOPMENT',
    startDate: new Date(),
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    targetValue: 9,
    currentValue: 0,
    isCompleted: false,
    reward: 'Estado "Observador Consciente" + 900 puntos bonus',
    userId: myUser.id,
  },
  {
    name: 'Fundador Consistente',
    description: 'Como founder, mantén todas las categorías activas por 7 días consecutivos',
    category: 'DEEP_WORK',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    targetValue: 7,
    currentValue: 0,
    isCompleted: false,
    reward: 'Título "Founder Consistente" + 700 puntos bonus',
    userId: myUser.id,
  },
];

// Función principal de seed simplificada
export async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed para Rodrigo (Gainz Factory)...');
    
    // Crear tu usuario
    await prisma.user.upsert({
      where: { id: myUser.id },
      update: myUser,
      create: myUser,
    });
    
    console.log(`👤 Usuario creado: ${myUser.firstName}`);

    // Crear tus hábitos
    for (const habitData of myRealHabits) {
      await prisma.habit.upsert({
        where: { 
          id: `${habitData.name.replace(/\s+/g, '-').toLowerCase()}-${myUser.id}`
        },
        update: habitData,
        create: {
          id: `${habitData.name.replace(/\s+/g, '-').toLowerCase()}-${myUser.id}`,
          ...habitData,
        },
      });
    }
    
    console.log(`✅ ${myRealHabits.length} hábitos creados`);

    // Crear tus challenges
    for (const challengeData of myChallenges) {
      await prisma.challenge.upsert({
        where: { 
          id: `${challengeData.name.replace(/\s+/g, '-').toLowerCase()}-${myUser.id}`
        },
        update: challengeData,
        create: {
          id: `${challengeData.name.replace(/\s+/g, '-').toLowerCase()}-${myUser.id}`,
          ...challengeData,
        },
      });
    }
    
    console.log(`🏆 ${myChallenges.length} challenges creados`);

    // Crear datos de ejemplo para los últimos 7 días
    await createSampleEntries();
    console.log(`📊 Datos de ejemplo creados`);

    console.log('🎉 Seed de Gainz Factory completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Función auxiliar para crear entradas de ejemplo
async function createSampleEntries() {
  const habits = await prisma.habit.findMany({
    where: { userId: myUser.id },
  });

  // Crear entradas para los últimos 7 días
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    for (const habit of habits) {
      // Simular completitud realista (80% de probabilidad para hábitos importantes)
      const completionRate = habit.category === 'PERSONAL_DEVELOPMENT' ? 0.9 : 0.75;
      if (Math.random() < completionRate) {
        await prisma.habitEntry.upsert({
          where: {
            habitId_date: {
              habitId: habit.id,
              date: new Date(dateString),
            },
          },
          update: {},
          create: {
            habitId: habit.id,
            date: new Date(dateString),
            status: 'COMPLETED',
            value: habit.targetValue ? Math.floor(habit.targetValue * (0.8 + Math.random() * 0.4)) : null,
            note: i === 0 ? 'Completado hoy!' : null,
          },
        });
      }
    }
  }

  // Crear scores diarios
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    const entriesForDay = await prisma.habitEntry.findMany({
      where: {
        date: new Date(dateString),
        habit: { userId: myUser.id },
      },
      include: { habit: true },
    });

    const completedHabits = entriesForDay.filter((e: HabitEntry) => e.status === 'COMPLETED').length;
    const totalPoints = entriesForDay
      .filter((e: HabitEntry) => e.status === 'COMPLETED')
      .reduce((sum: number, e: HabitEntry) => sum + e.habit.points, 0);

    await prisma.dailyScore.upsert({
      where: {
        userId_date: {
          userId: myUser.id,
          date: new Date(dateString),
        },
      },
      update: {},
      create: {
        userId: myUser.id,
        date: new Date(dateString),
        totalPoints,
        completedHabits,
        totalHabits: habits.length,
        // Calcular scores por categoría
        morningScore: entriesForDay
          .filter((e: HabitEntry) => e.habit.category === 'MORNING_ROUTINE' && e.status === 'COMPLETED')
          .reduce((sum: number, e: HabitEntry) => sum + e.habit.points, 0),
        physicalScore: entriesForDay
          .filter((e: HabitEntry) => e.habit.category === 'PHYSICAL_TRAINING' && e.status === 'COMPLETED')
          .reduce((sum: number, e: HabitEntry) => sum + e.habit.points, 0),
        nutritionScore: entriesForDay
          .filter((e: HabitEntry) => e.habit.category === 'NUTRITION' && e.status === 'COMPLETED')
          .reduce((sum: number, e: HabitEntry) => sum + e.habit.points, 0),
        workScore: entriesForDay
          .filter((e: HabitEntry) => e.habit.category === 'DEEP_WORK' && e.status === 'COMPLETED')
          .reduce((sum: number, e: HabitEntry) => sum + e.habit.points, 0),
        developmentScore: entriesForDay
          .filter((e: HabitEntry) => e.habit.category === 'PERSONAL_DEVELOPMENT' && e.status === 'COMPLETED')
          .reduce((sum: number, e: HabitEntry) => sum + e.habit.points, 0),
        socialScore: entriesForDay
          .filter((e: HabitEntry) => e.habit.category === 'SOCIAL_CHARISMA' && e.status === 'COMPLETED')
          .reduce((sum: number, e: HabitEntry) => sum + e.habit.points, 0),
        sleepScore: entriesForDay
          .filter((e: HabitEntry) => e.habit.category === 'SLEEP_RECOVERY' && e.status === 'COMPLETED')
          .reduce((sum: number, e: HabitEntry) => sum + e.habit.points, 0),
        reflectionScore: entriesForDay
          .filter((e: HabitEntry) => e.habit.category === 'REFLECTION' && e.status === 'COMPLETED')
          .reduce((sum: number, e: HabitEntry) => sum + e.habit.points, 0),
        percentile: Math.floor(Math.random() * 20) + 80, // 80-100 (como founder exitoso)
        rank: Math.floor(Math.random() * 10) + 1, // Top 10
      },
    });
  }
}

// Ejecutar seed si se llama directamente
if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
} 