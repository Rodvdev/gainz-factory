"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Target, Dumbbell, Apple, Brain, ArrowRight, Check } from "lucide-react"

export default function ObjectivesPage() {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const objectives = [
    {
      id: "fitness",
      title: "Fitness",
      description: "Construye fuerza, resistencia y un cuerpo más saludable",
      icon: Dumbbell,
      examples: ["Perder peso", "Ganar músculo", "Mejorar resistencia", "Tonificar"],
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      hoverBorderColor: "hover:border-red-400"
    },
    {
      id: "nutrition",
      title: "Nutrición",
      description: "Aprende a comer de manera saludable y equilibrada",
      icon: Apple,
      examples: ["Comer más sano", "Controlar porciones", "Meal prep", "Hidratación"],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      hoverBorderColor: "hover:border-green-400"
    },
    {
      id: "mindset",
      title: "Mindset",
      description: "Desarrolla hábitos mentales y disciplina personal",
      icon: Brain,
      examples: ["Meditación", "Disciplina", "Sueño", "Gestión del tiempo"],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      hoverBorderColor: "hover:border-purple-400"
    }
  ]

  const toggleObjective = (objectiveId: string) => {
    setSelectedObjectives(prev => 
      prev.includes(objectiveId) 
        ? prev.filter(id => id !== objectiveId)
        : [...prev, objectiveId]
    )
  }

  const handleContinue = async () => {
    if (selectedObjectives.length === 0) return
    
    setLoading(true)
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem("authToken")
      if (!token) {
        router.push("/signin")
        return
      }

      // Save objectives to user profile
      const response = await fetch("/api/onboarding/objectives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          objectives: selectedObjectives,
          step: "objectives"
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        router.push("/onboarding/questionnaire")
      } else {
        console.error("Error:", data.error)
        // Handle error - maybe show a toast or error message
      }
    } catch (error) {
      console.error("Error saving objectives:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-6 shadow-lg"
          >
            <Target className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">¿Qué quieres lograr?</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Selecciona tus objetivos principales. Puedes elegir uno o varios caminos.
          </p>
        </div>

        {/* Objectives Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {objectives.map((objective, index) => {
            const Icon = objective.icon
            const isSelected = selectedObjectives.includes(objective.id)
            
            return (
              <motion.button
                key={objective.id}
                onClick={() => toggleObjective(objective.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative p-8 ${objective.bgColor} backdrop-blur-sm border-2 ${isSelected ? 'border-red-400' : objective.borderColor} ${objective.hoverBorderColor} rounded-2xl transition-all duration-300 hover:shadow-2xl overflow-hidden`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                )}

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${objective.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 text-center">
                    {objective.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 text-center">
                    {objective.description}
                  </p>

                  {/* Examples */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide text-center mb-3">
                      Ejemplos:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {objective.examples.map((example, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white/60 text-gray-700 text-xs rounded-full border border-gray-200"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div className="w-16 h-1 bg-gray-300 rounded-full">
              <motion.div
                className="w-full h-full bg-red-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
            </div>
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center"
        >
          <button
            onClick={handleContinue}
            disabled={selectedObjectives.length === 0 || loading}
            className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          {selectedObjectives.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">
              Selecciona al menos un objetivo para continuar
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}