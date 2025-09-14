"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, 
  ArrowRight, 
  Sparkles,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Heart,
  CheckCircle
} from "lucide-react"

interface Question {
  id: string
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  options: {
    id: string
    label: string
    value: string
    description?: string
  }[]
  type: "single" | "multiple" | "slider" | "select"
}

const questions: Question[] = [
  {
    id: "level",
    title: "¿Cuál es tu nivel actual?",
    subtitle: "Para personalizar tu experiencia",
    icon: TrendingUp,
    type: "single",
    options: [
      { id: "beginner", label: "Principiante", value: "beginner", description: "Empiezo desde cero" },
      { id: "intermediate", label: "Intermedio", value: "intermediate", description: "Tengo algo de experiencia" },
      { id: "advanced", label: "Avanzado", value: "advanced", description: "Soy experto en esto" }
    ]
  },
  {
    id: "time_commitment",
    title: "¿Cuántos días a la semana puedes comprometerte?",
    subtitle: "La consistencia es clave",
    icon: Clock,
    type: "single",
    options: [
      { id: "2-3", label: "2-3 días", value: "2-3", description: "Perfecto para empezar" },
      { id: "4-5", label: "4-5 días", value: "4-5", description: "Compromiso sólido" },
      { id: "6-7", label: "6-7 días", value: "6-7", description: "Máximo compromiso" }
    ]
  },
  {
    id: "intensity",
    title: "¿Prefieres rutinas rápidas o intensas?",
    subtitle: "Tu estilo de entrenamiento",
    icon: Zap,
    type: "single",
    options: [
      { id: "quick", label: "Rápidas", value: "quick", description: "15-30 minutos" },
      { id: "intense", label: "Intensas", value: "intense", description: "45-60 minutos" },
      { id: "balanced", label: "Balanceadas", value: "balanced", description: "30-45 minutos" }
    ]
  },
  {
    id: "motivation",
    title: "¿Qué te motiva más?",
    subtitle: "Tu motor interno",
    icon: Heart,
    type: "single",
    options: [
      { id: "health", label: "Salud", value: "health", description: "Sentirme bien por dentro" },
      { id: "appearance", label: "Apariencia", value: "appearance", description: "Verme mejor" },
      { id: "energy", label: "Energía", value: "energy", description: "Más vitalidad diaria" },
      { id: "performance", label: "Rendimiento", value: "performance", description: "Ser más fuerte" }
    ]
  },
  {
    id: "first_habit",
    title: "¿Qué hábito quieres construir primero?",
    subtitle: "Empezamos por lo más importante",
    icon: Target,
    type: "single",
    options: [
      { id: "exercise", label: "Ejercicio", value: "exercise", description: "Movimiento diario" },
      { id: "nutrition", label: "Alimentación", value: "nutrition", description: "Comer mejor" },
      { id: "sleep", label: "Sueño", value: "sleep", description: "Descansar mejor" },
      { id: "mindfulness", label: "Mindfulness", value: "mindfulness", description: "Meditación" }
    ]
  }
]

export default function OnboardingQuestionnaire() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const canContinue = answers[currentQuestion.id] !== undefined

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      handleComplete()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    
    try {
      const response = await fetch("/api/onboarding/questionnaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          answers,
          step: "questionnaire"
        }),
      })
      
      if (response.ok) {
        router.push("/onboarding/habits")
      }
    } catch (error) {
      console.error("Error saving questionnaire:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProgress = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
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
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-2xl mb-8"
        >
          {/* Question Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4 mx-auto">
              <currentQuestion.icon className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-red-500 bg-clip-text text-transparent">
              {currentQuestion.title}
            </h2>
            <p className="text-gray-400 text-lg">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <AnimatePresence>
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === option.value
                
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {option.label}
                        </h3>
                        {option.description && (
                          <p className="text-gray-400">
                            {option.description}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 disabled:bg-gray-800/30 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </motion.button>

          <motion.button
            onClick={handleNext}
            disabled={!canContinue || loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : (
              <>
                {isLastQuestion ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Finalizar
                    <CheckCircle className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </>
            )}
          </motion.button>
        </div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            Cada respuesta nos ayuda a conocerte mejor
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
