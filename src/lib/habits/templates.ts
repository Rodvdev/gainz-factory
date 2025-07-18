import { HabitCategory, HabitFrequency, TrackingType } from "@prisma/client";

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  trackingType: TrackingType;
  targetCount: number;
  targetValue?: number;
  targetUnit?: string;
  points: number;
  color: string;
  icon: string;
  isRecommended?: boolean;
}

export const HABIT_TEMPLATES: Record<HabitCategory, HabitTemplate[]> = {
  MORNING_ROUTINE: [
    {
      id: "morning-meditation",
      name: "Meditación matutina",
      description: "5-10 minutos de meditación al despertar para empezar el día con claridad mental",
      category: HabitCategory.MORNING_ROUTINE,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 10,
      targetValue: 10,
      targetUnit: "minutos",
      points: 3,
      color: "#8B5CF6",
      icon: "🧘",
      isRecommended: true
    },
    {
      id: "morning-water",
      name: "Vaso de agua al despertar",
      description: "Hidratación inmediata para activar el metabolismo",
      category: HabitCategory.MORNING_ROUTINE,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.BINARY,
      targetCount: 1,
      points: 1,
      color: "#3B82F6",
      icon: "💧",
      isRecommended: true
    },
    {
      id: "morning-gratitude",
      name: "3 cosas por las que estoy agradecido",
      description: "Escribir o pensar en 3 cosas por las que te sientes agradecido",
      category: HabitCategory.MORNING_ROUTINE,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.TEXT,
      targetCount: 1,
      points: 2,
      color: "#F59E0B",
      icon: "🙏"
    },
    {
      id: "morning-stretch",
      name: "Estiramiento matutino",
      description: "5-10 minutos de estiramiento para activar el cuerpo",
      category: HabitCategory.MORNING_ROUTINE,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 5,
      targetValue: 5,
      targetUnit: "minutos",
      points: 2,
      color: "#10B981",
      icon: "🤸"
    },
    {
      id: "morning-journal",
      name: "Journaling matutino",
      description: "Escribir pensamientos, objetivos y reflexiones del día",
      category: HabitCategory.MORNING_ROUTINE,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 10,
      targetValue: 10,
      targetUnit: "minutos",
      points: 3,
      color: "#F97316",
      icon: "📝"
    }
  ],

  PHYSICAL_TRAINING: [
    {
      id: "gym-workout",
      name: "Entrenamiento en gimnasio",
      description: "Sesión completa de entrenamiento con pesas y cardio",
      category: HabitCategory.PHYSICAL_TRAINING,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 60,
      targetValue: 60,
      targetUnit: "minutos",
      points: 5,
      color: "#EF4444",
      icon: "💪",
      isRecommended: true
    },
    {
      id: "daily-steps",
      name: "10,000 pasos diarios",
      description: "Caminar al menos 10,000 pasos para mantener actividad física",
      category: HabitCategory.PHYSICAL_TRAINING,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.NUMERIC,
      targetCount: 10000,
      targetValue: 10000,
      targetUnit: "pasos",
      points: 3,
      color: "#059669",
      icon: "🚶",
      isRecommended: true
    },
    {
      id: "home-workout",
      name: "Ejercicio en casa",
      description: "Rutina de ejercicios sin equipamiento: flexiones, sentadillas, plancha",
      category: HabitCategory.PHYSICAL_TRAINING,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 30,
      targetValue: 30,
      targetUnit: "minutos",
      points: 4,
      color: "#DC2626",
      icon: "🏠"
    },
    {
      id: "cardio-session",
      name: "Cardio",
      description: "Correr, nadar, bicicleta o cualquier actividad cardiovascular",
      category: HabitCategory.PHYSICAL_TRAINING,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 30,
      targetValue: 30,
      targetUnit: "minutos",
      points: 4,
      color: "#B91C1C",
      icon: "🏃"
    },
    {
      id: "flexibility",
      name: "Sesión de flexibilidad",
      description: "Yoga, pilates o estiramientos para mejorar flexibilidad",
      category: HabitCategory.PHYSICAL_TRAINING,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 20,
      targetValue: 20,
      targetUnit: "minutos",
      points: 3,
      color: "#7C3AED",
      icon: "🧘‍♀️"
    }
  ],

  NUTRITION: [
    {
      id: "daily-protein",
      name: "Proteína en cada comida",
      description: "Incluir una fuente de proteína en cada comida principal",
      category: HabitCategory.NUTRITION,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.NUMERIC,
      targetCount: 3,
      targetValue: 3,
      targetUnit: "comidas",
      points: 3,
      color: "#059669",
      icon: "🥩",
      isRecommended: true
    },
    {
      id: "water-intake",
      name: "2 litros de agua",
      description: "Beber al menos 2 litros de agua durante el día",
      category: HabitCategory.NUTRITION,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.NUMERIC,
      targetCount: 2000,
      targetValue: 2000,
      targetUnit: "ml",
      points: 2,
      color: "#0284C7",
      icon: "💧",
      isRecommended: true
    },
    {
      id: "vegetables-daily",
      name: "5 porciones de verduras",
      description: "Consumir al menos 5 porciones de verduras y frutas",
      category: HabitCategory.NUTRITION,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.NUMERIC,
      targetCount: 5,
      targetValue: 5,
      targetUnit: "porciones",
      points: 3,
      color: "#16A34A",
      icon: "🥬"
    },
    {
      id: "no-processed",
      name: "Evitar comida procesada",
      description: "No consumir alimentos ultraprocesados durante el día",
      category: HabitCategory.NUTRITION,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.BINARY,
      targetCount: 1,
      points: 3,
      color: "#DC2626",
      icon: "🚫"
    },
    {
      id: "meal-prep",
      name: "Preparación de comidas",
      description: "Preparar comidas saludables con anticipación",
      category: HabitCategory.NUTRITION,
      frequency: HabitFrequency.WEEKLY,
      trackingType: TrackingType.BINARY,
      targetCount: 1,
      points: 4,
      color: "#0891B2",
      icon: "🍱"
    }
  ],

  DEEP_WORK: [
    {
      id: "focused-work",
      name: "2 horas de trabajo profundo",
      description: "Trabajo concentrado sin distracciones durante 2 horas",
      category: HabitCategory.DEEP_WORK,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 120,
      targetValue: 120,
      targetUnit: "minutos",
      points: 5,
      color: "#1E40AF",
      icon: "🎯",
      isRecommended: true
    },
    {
      id: "pomodoro-sessions",
      name: "6 sesiones Pomodoro",
      description: "Completar 6 sesiones de 25 minutos con técnica Pomodoro",
      category: HabitCategory.DEEP_WORK,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.NUMERIC,
      targetCount: 6,
      targetValue: 6,
      targetUnit: "sesiones",
      points: 4,
      color: "#7C2D12",
      icon: "🍅"
    },
    {
      id: "no-social-work",
      name: "Sin redes sociales en trabajo",
      description: "No revisar redes sociales durante horas de trabajo",
      category: HabitCategory.DEEP_WORK,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.BINARY,
      targetCount: 1,
      points: 3,
      color: "#991B1B",
      icon: "📵"
    },
    {
      id: "skill-learning",
      name: "Aprender nueva habilidad",
      description: "Dedicar tiempo a aprender algo nuevo relacionado con trabajo",
      category: HabitCategory.DEEP_WORK,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 30,
      targetValue: 30,
      targetUnit: "minutos",
      points: 4,
      color: "#1D4ED8",
      icon: "📚"
    }
  ],

  PERSONAL_DEVELOPMENT: [
    {
      id: "daily-reading",
      name: "30 minutos de lectura",
      description: "Leer libros de desarrollo personal, biografías o educativos",
      category: HabitCategory.PERSONAL_DEVELOPMENT,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 30,
      targetValue: 30,
      targetUnit: "minutos",
      points: 3,
      color: "#7C3AED",
      icon: "📖",
      isRecommended: true
    },
    {
      id: "podcast-learning",
      name: "Podcast educativo",
      description: "Escuchar podcast de desarrollo personal o profesional",
      category: HabitCategory.PERSONAL_DEVELOPMENT,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 20,
      targetValue: 20,
      targetUnit: "minutos",
      points: 2,
      color: "#9333EA",
      icon: "🎧"
    },
    {
      id: "course-study",
      name: "Curso online",
      description: "Estudiar curso online o plataforma educativa",
      category: HabitCategory.PERSONAL_DEVELOPMENT,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 45,
      targetValue: 45,
      targetUnit: "minutos",
      points: 4,
      color: "#6D28D9",
      icon: "💻"
    },
    {
      id: "goal-review",
      name: "Revisar objetivos",
      description: "Revisar progreso de objetivos personales y profesionales",
      category: HabitCategory.PERSONAL_DEVELOPMENT,
      frequency: HabitFrequency.WEEKLY,
      trackingType: TrackingType.BINARY,
      targetCount: 1,
      points: 3,
      color: "#5B21B6",
      icon: "🎯"
    }
  ],

  SOCIAL_CHARISMA: [
    {
      id: "meaningful-conversation",
      name: "Conversación profunda",
      description: "Tener al menos una conversación significativa con alguien",
      category: HabitCategory.SOCIAL_CHARISMA,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.BINARY,
      targetCount: 1,
      points: 3,
      color: "#DB2777",
      icon: "💬",
      isRecommended: true
    },
    {
      id: "compliment-someone",
      name: "Elogiar a alguien",
      description: "Dar un elogio genuino a otra persona",
      category: HabitCategory.SOCIAL_CHARISMA,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.BINARY,
      targetCount: 1,
      points: 2,
      color: "#C2410C",
      icon: "🌟"
    },
    {
      id: "network-contact",
      name: "Contactar a alguien de mi red",
      description: "Llamar, escribir o reunirse con alguien de mi red profesional/personal",
      category: HabitCategory.SOCIAL_CHARISMA,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.BINARY,
      targetCount: 1,
      points: 3,
      color: "#BE185D",
      icon: "🤝"
    },
    {
      id: "public-speaking",
      name: "Practicar hablar en público",
      description: "Presentación, video, o práctica de comunicación verbal",
      category: HabitCategory.SOCIAL_CHARISMA,
      frequency: HabitFrequency.WEEKLY,
      trackingType: TrackingType.DURATION,
      targetCount: 15,
      targetValue: 15,
      targetUnit: "minutos",
      points: 4,
      color: "#A21CAF",
      icon: "🎤"
    }
  ],

  REFLECTION: [
    {
      id: "evening-journal",
      name: "Journaling nocturno",
      description: "Reflexionar sobre el día: logros, aprendizajes y mejoras",
      category: HabitCategory.REFLECTION,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 10,
      targetValue: 10,
      targetUnit: "minutos",
      points: 3,
      color: "#0F766E",
      icon: "📔",
      isRecommended: true
    },
    {
      id: "day-rating",
      name: "Calificar el día",
      description: "Calificar el día del 1 al 10 y anotar el porqué",
      category: HabitCategory.REFLECTION,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.RATING,
      targetCount: 1,
      points: 2,
      color: "#059669",
      icon: "⭐"
    },
    {
      id: "meditation-evening",
      name: "Meditación nocturna",
      description: "5-10 minutos de meditación antes de dormir",
      category: HabitCategory.REFLECTION,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 10,
      targetValue: 10,
      targetUnit: "minutos",
      points: 3,
      color: "#065F46",
      icon: "🧘‍♂️"
    },
    {
      id: "weekly-review",
      name: "Revisión semanal",
      description: "Análisis profundo de la semana: qué funcionó y qué mejorar",
      category: HabitCategory.REFLECTION,
      frequency: HabitFrequency.WEEKLY,
      trackingType: TrackingType.DURATION,
      targetCount: 30,
      targetValue: 30,
      targetUnit: "minutos",
      points: 5,
      color: "#047857",
      icon: "📊"
    }
  ],

  SLEEP_RECOVERY: [
    {
      id: "sleep-8-hours",
      name: "8 horas de sueño",
      description: "Dormir al menos 8 horas por noche",
      category: HabitCategory.SLEEP_RECOVERY,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 480,
      targetValue: 480,
      targetUnit: "minutos",
      points: 4,
      color: "#1E293B",
      icon: "😴",
      isRecommended: true
    },
    {
      id: "no-screens-bed",
      name: "Sin pantallas 1h antes de dormir",
      description: "No usar teléfono, TV o computadora 1 hora antes de acostarse",
      category: HabitCategory.SLEEP_RECOVERY,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.BINARY,
      targetCount: 1,
      points: 3,
      color: "#374151",
      icon: "📵",
      isRecommended: true
    },
    {
      id: "bed-consistent",
      name: "Acostarse a la misma hora",
      description: "Irse a la cama a la misma hora todas las noches",
      category: HabitCategory.SLEEP_RECOVERY,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.BINARY,
      targetCount: 1,
      points: 2,
      color: "#4B5563",
      icon: "🕙"
    },
    {
      id: "recovery-activity",
      name: "Actividad de recuperación",
      description: "Baño caliente, lectura relajante, o actividad que ayude a descansar",
      category: HabitCategory.SLEEP_RECOVERY,
      frequency: HabitFrequency.DAILY,
      trackingType: TrackingType.DURATION,
      targetCount: 20,
      targetValue: 20,
      targetUnit: "minutos",
      points: 3,
      color: "#6B7280",
      icon: "🛁"
    }
  ]
};

// Utility functions
export function getTemplatesByCategory(category: HabitCategory): HabitTemplate[] {
  return HABIT_TEMPLATES[category] || [];
}

export function getRecommendedTemplates(): HabitTemplate[] {
  const recommended: HabitTemplate[] = [];
  
  Object.values(HABIT_TEMPLATES).forEach(categoryTemplates => {
    categoryTemplates.forEach(template => {
      if (template.isRecommended) {
        recommended.push(template);
      }
    });
  });
  
  return recommended;
}

export function getTemplateById(id: string): HabitTemplate | undefined {
  for (const categoryTemplates of Object.values(HABIT_TEMPLATES)) {
    const template = categoryTemplates.find(t => t.id === id);
    if (template) return template;
  }
  return undefined;
}

export function getAllTemplates(): HabitTemplate[] {
  const allTemplates: HabitTemplate[] = [];
  
  Object.values(HABIT_TEMPLATES).forEach(categoryTemplates => {
    allTemplates.push(...categoryTemplates);
  });
  
  return allTemplates;
}

// Category metadata
export const CATEGORY_INFO = {
  [HabitCategory.MORNING_ROUTINE]: {
    name: "Rutina Matutina",
    description: "Establece una base sólida para comenzar cada día con energía y propósito",
    icon: "🌅",
    color: "#F59E0B"
  },
  [HabitCategory.PHYSICAL_TRAINING]: {
    name: "Entrenamiento Físico", 
    description: "Fortalece tu cuerpo y aumenta tu energía y resistencia",
    icon: "💪",
    color: "#EF4444"
  },
  [HabitCategory.NUTRITION]: {
    name: "Nutrición",
    description: "Alimenta tu cuerpo con los nutrientes necesarios para el rendimiento óptimo",
    icon: "🥗",
    color: "#10B981"
  },
  [HabitCategory.DEEP_WORK]: {
    name: "Trabajo Profundo",
    description: "Maximiza tu productividad y enfoque en tareas importantes",
    icon: "🎯", 
    color: "#3B82F6"
  },
  [HabitCategory.PERSONAL_DEVELOPMENT]: {
    name: "Desarrollo Personal",
    description: "Invierte en tu crecimiento personal y profesional continuo",
    icon: "📚",
    color: "#8B5CF6"
  },
  [HabitCategory.SOCIAL_CHARISMA]: {
    name: "Carisma Social",
    description: "Desarrolla tus habilidades sociales y construye relaciones significativas",
    icon: "🤝",
    color: "#EC4899"
  },
  [HabitCategory.REFLECTION]: {
    name: "Reflexión",
    description: "Procesa experiencias y aprende de cada día para mejorar continuamente",
    icon: "💭",
    color: "#14B8A6"
  },
  [HabitCategory.SLEEP_RECOVERY]: {
    name: "Sueño y Recuperación",
    description: "Optimiza tu descanso para mejorar rendimiento y bienestar general",
    icon: "😴",
    color: "#6B7280"
  }
}; 