"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  Plus, 
  Minus, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  Heart,
  Dumbbell,
  Apple,
  Brain,
  Moon,
  Droplets,
  BookOpen,
  Sun
} from "lucide-react"

interface Habit {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  difficulty: "easy" | "medium" | "hard"
  duration: string
  frequency: string
  benefits: string[]
}

const suggestedHabits: Habit[] = [
  // Fitness Habits
  {
    id: "morning_exercise",
    name: "Ejercicio Matutino",
    description: "15 minutos de movimiento al despertar",
    icon: Sun,
    category: "fitness",
    difficulty: "easy",
    duration: "15 min",
    frequency: "Diario",
    benefits: ["Energía", "Metabolismo", "Estado de ánimo"]
  },
  {
    id: "strength_training",
    name: "Entrenamiento de Fuerza",
    description: "3 veces por semana, 45 minutos",
    icon: Dumbbell,
    category: "fitness",
    difficulty: "medium",
    duration: "45 min",
    frequency: "3x semana",
    benefits: ["Fuerza", "Masa muscular", "Huesos fuertes"]
  },
  {
    id: "cardio",
    name: "Cardio",
    description: "20-30 minutos de actividad cardiovascular",
    icon: Heart,
    category: "fitness",
    difficulty: "medium",
    duration: "30 min",
    frequency: "3-4x semana",
    benefits: ["Resistencia", "Corazón saludable", "Quema calorías"]
  },
  
  // Nutrition Habits
  {
    id: "water_intake",
    name: "Hidratación",
    description: "2-3 litros de agua al día",
    icon: Droplets,
    category: "nutrition",
    difficulty: "easy",
    duration: "Todo el día",
    frequency: "Diario",
    benefits: ["Hidratación", "Energía", "Piel saludable"]
  },
  {
    id: "healthy_meals",
    name: "Comidas Saludables",
    description: "3 comidas balanceadas al día",
    icon: Apple,
    category: "nutrition",
    difficulty: "medium",
    duration: "30 min prep",
    frequency: "Diario",
    benefits: ["Nutrición", "Energía", "Peso saludable"]
  },
  {
    id: "meal_prep",
    name: "Meal Prep",
    description: "Preparar comidas el domingo",
    icon: Clock,
    category: "nutrition",
    difficulty: "hard",
    duration: "2-3 horas",
    frequency: "Semanal",
    benefits: ["Ahorro tiempo", "Comidas saludables", "Consistencia"]
  },
  
  // Mindset Habits
  {
    id: "meditation",
    name: "Meditación",
    description: "10 minutos de mindfulness diario",
    icon: Brain,
    category: "mindset",
    difficulty: "easy",
    duration: "10 min",
    frequency: "Diario",
    benefits: ["Claridad mental", "Reducción estrés", "Foco"]
  },
  {
    id: "gratitude",
    name: "Gratitud",
    description: "Escribir 3 cosas por las que estás agradecido",
    icon: Heart,
    category: "mindset",
    difficulty: "easy",
    duration: "5 min",
    frequency: "Diario",
    benefits: ["Positividad", "Satisfacción", "Bienestar"]
  },
  {
    id: "reading",
    name: "Lectura",
    description: "20 minutos de lectura personal",
    icon: BookOpen,
    category: "mindset",
    difficulty: "easy",
    duration: "20 min",
    frequency: "Diario",
    benefits: ["Conocimiento", "Foco", "Relajación"]
  },
  {
    id: "sleep_routine",
    name: "Rutina de Sueño",
    description: "Dormir 7-8 horas y rutina antes de dormir",
    icon: Moon,
    category: "mindset",
    difficulty: "medium",
    duration: "30 min prep",
    frequency: "Diario",
    benefits: ["Descanso", "Recuperación", "Energía"]
  }
]

export default function OnboardingHabits() {
  const [selectedHabits, setSelectedHabits] = useState<Habit[]>([])
  const [customHabit, setCustomHabit] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toggleHabit = (habit: Habit) => {
    setSelectedHabits(prev => {
      const exists = prev.find(h => h.id === habit.id)
      if (exists) {
        return prev.filter(h => h.id !== habit.id)
      } else {
        if (prev.length < 5) {
          return [...prev, habit]
        }
        return prev
      }
    })
  }

  const addCustomHabit = () => {
    if (customHabit.trim() && selectedHabits.length < 5) {
      const newHabit: Habit = {
        id: `custom_${Date.now()}`,
        name: customHabit.trim(),
        description: "Hábito personalizado",
        icon: Target,
        category: "custom",
        difficulty: "medium",
        duration: "Variable",
        frequency: "Diario",
        benefits: ["Personalizado"]
      }
      setSelectedHabits(prev => [...prev, newHabit])
      setCustomHabit("")
    }
  }

  const removeHabit = (habitId: string) => {
    setSelectedHabits(prev => prev.filter(h => h.id !== habitId))
  }

  const handleContinue = async () => {
    if (selectedHabits.length === 0) return
    
    setLoading(true)
    
    try {
      const response = await fetch("/api/onboarding/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          habits: selectedHabits,
          step: "habits"
        }),
      })
      
      if (response.ok) {
        router.push("/onboarding/schedule")
      }
    } catch (error) {
      console.error("Error saving habits:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400 bg-green-400/20"
      case "medium": return "text-yellow-400 bg-yellow-400/20"
      case "hard": return "text-red-400 bg-red-400/20"
      default: return "text-gray-400 bg-gray-400/20"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fitness": return Dumbbell
      case "nutrition": return Apple
      case "mindset": return Brain
      default: return Target
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Image
              src="/logo.jpeg"
              alt="Gainz Factory Logo"
              width={50}
              height={50}
              className="rounded-full border-2 border-red-500"
            />
            <div>
              <h1 className="text-xl font-bold text-white">GAINZ FACTORY</h1>
              <p className="text-red-500 text-sm">Transformation OS</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
              Selecciona tus hábitos iniciales
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Elige hasta 5 hábitos para comenzar tu transformación
            </p>
          </motion.div>
        </div>

        {/* Selected Habits Summary */}
        {selectedHabits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 mb-8"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-red-500" />
              Hábitos seleccionados ({selectedHabits.length}/5)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedHabits.map((habit, index) => {
                const Icon = habit.icon
                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-red-500/20 border border-red-500/30 p-4 rounded-xl flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-medium">{habit.name}</span>
                    </div>
                    <button
                      onClick={() => removeHabit(habit.id)}
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {suggestedHabits.map((habit, index) => {
            const isSelected = selectedHabits.find(h => h.id === habit.id)
            const Icon = habit.icon
            const CategoryIcon = getCategoryIcon(habit.category)
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleHabit(habit)}
                className={`cursor-pointer group ${
                  isSelected 
                    ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-black' 
                    : 'hover:ring-2 hover:ring-gray-600 hover:ring-offset-2 hover:ring-offset-black'
                } transition-all duration-300`}
              >
                <div className={`bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl h-full border-2 ${
                  isSelected ? 'border-red-500 bg-red-500/10' : 'border-gray-800 group-hover:border-gray-600'
                } transition-all duration-300`}>
                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{habit.name}</h3>
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400 text-sm capitalize">{habit.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {habit.description}
                  </p>
                  
                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Duración:</span>
                      <span className="text-white font-medium">{habit.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Frecuencia:</span>
                      <span className="text-white font-medium">{habit.frequency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Dificultad:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(habit.difficulty)}`}>
                        {habit.difficulty === "easy" ? "Fácil" : habit.difficulty === "medium" ? "Medio" : "Difícil"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Benefits */}
                  <div className="mt-4">
                    <h4 className="text-gray-400 text-sm mb-2">Beneficios:</h4>
                    <div className="flex flex-wrap gap-2">
                      {habit.benefits.map((benefit, idx) => (
                        <span key={idx} className="bg-gray-800/50 px-2 py-1 rounded-full text-xs text-gray-300">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Custom Habit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 mb-8"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-red-500" />
            ¿Tienes un hábito personalizado en mente?
          </h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={customHabit}
              onChange={(e) => setCustomHabit(e.target.value)}
              placeholder="Ej: Leer 30 minutos al día"
              className="flex-1 p-4 bg-gray-800/50 text-white rounded-xl border border-gray-700 focus:border-red-500 focus:outline-none transition-all duration-200"
              disabled={selectedHabits.length >= 5}
            />
            <button
              onClick={addCustomHabit}
              disabled={!customHabit.trim() || selectedHabits.length >= 5}
              className="px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar
            </button>
          </div>
          {selectedHabits.length >= 5 && (
            <p className="text-gray-400 text-sm mt-2">
              Has alcanzado el límite de 5 hábitos. Puedes quitar uno para agregar otro.
            </p>
          )}
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center"
        >
          <motion.button
            onClick={handleContinue}
            disabled={selectedHabits.length === 0 || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 group"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Guardando hábitos...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                Continuar con Horarios
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </motion.button>
          
          {selectedHabits.length === 0 && (
            <p className="text-gray-500 text-sm mt-4">
              Selecciona al menos un hábito para continuar
            </p>
          )}
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            Los pequeños hábitos crean grandes transformaciones
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
