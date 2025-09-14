"use client"

import { motion } from "framer-motion"
import { Quote, Zap, Flame, Target } from "lucide-react"

interface MotivationalQuoteProps {
  quote: string
  author: string
  category: "training" | "mindset" | "nutrition" | "discipline"
  isDaily?: boolean
}

const categoryData = {
  training: {
    icon: Target,
    color: "from-red-500 to-orange-500",
    bgColor: "bg-gradient-to-r from-red-50 to-orange-50",
    borderColor: "border-red-200"
  },
  mindset: {
    icon: Zap,
    color: "from-purple-500 to-blue-500", 
    bgColor: "bg-gradient-to-r from-purple-50 to-blue-50",
    borderColor: "border-purple-200"
  },
  nutrition: {
    icon: Flame,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-r from-green-50 to-emerald-50", 
    borderColor: "border-green-200"
  },
  discipline: {
    icon: Quote,
    color: "from-gray-600 to-gray-800",
    bgColor: "bg-gradient-to-r from-gray-50 to-gray-100",
    borderColor: "border-gray-200"
  }
}

const motivationalQuotes = {
  training: [
    "La disciplina supera a la motivación cada día de la semana",
    "Cada repetición te acerca más a tu mejor versión",
    "El dolor de hoy es la fuerza de mañana",
    "No busques atajos, busca resultados",
    "Tu cuerpo puede hacer lo que tu mente crea"
  ],
  mindset: [
    "Vamos por esos Gainz YIJU 🔥",
    "La mentalidad de un ganador se construye día a día",
    "Tu único límite es el que te pones a ti mismo",
    "El éxito es la suma de pequeños esfuerzos repetidos",
    "La transformación comienza en la mente"
  ],
  nutrition: [
    "Somos lo que comemos, así que come como un campeón",
    "La nutrición es el 80% del éxito",
    "Cada comida es una decisión que te acerca a tus objetivos",
    "El cuerpo es un templo, aliméntalo como tal",
    "La consistencia en la cocina se refleja en el espejo"
  ],
  discipline: [
    "La disciplina es el puente entre los objetivos y los logros",
    "Los hábitos que construyes hoy definen tu futuro",
    "La consistencia es la clave del éxito",
    "No es motivación, es disciplina",
    "La excelencia no es un accidente, es el resultado de la disciplina"
  ]
}

export default function MotivationalQuote({ quote, author, category, isDaily = false }: MotivationalQuoteProps) {
  const categoryInfo = categoryData[category]
  const Icon = categoryInfo.icon
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative p-6 rounded-2xl ${categoryInfo.bgColor} border-2 ${categoryInfo.borderColor} shadow-lg overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 text-6xl font-bold text-gray-400">
          💪
        </div>
        <div className="absolute bottom-4 left-4 text-4xl">
          🔥
        </div>
      </div>
      
      {/* Daily Badge */}
      {isDaily && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
        >
          FRASE DEL DÍA
        </motion.div>
      )}
      
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`w-12 h-12 bg-gradient-to-r ${categoryInfo.color} rounded-full flex items-center justify-center mb-4 shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        
        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-semibold text-gray-800 mb-4 leading-relaxed"
        >
          &quot;{quote}&quot;
        </motion.blockquote>
        
        {/* Author */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">GF</span>
            </div>
            <div>
              <p className="font-semibold text-gray-700">{author}</p>
              <p className="text-xs text-gray-500 capitalize">{category}</p>
            </div>
          </div>
          
          {/* Category Indicator */}
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${categoryInfo.color} shadow-lg`}></div>
        </motion.div>
      </div>
      
      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [-2, 2, -2],
          rotate: [-1, 1, -1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-8 right-8 text-2xl opacity-20"
      >
        ⚡
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [2, -2, 2],
          rotate: [1, -1, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-8 left-8 text-xl opacity-20"
      >
        🎯
      </motion.div>
    </motion.div>
  )
}

// Hook to get random motivational quote
export const useMotivationalQuote = (category?: "training" | "mindset" | "nutrition" | "discipline") => {
  const selectedCategory = category || (["training", "mindset", "nutrition", "discipline"][Math.floor(Math.random() * 4)] as keyof typeof motivationalQuotes)
  const quotes = motivationalQuotes[selectedCategory]
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
  
  return {
    quote: randomQuote,
    author: "Gainz Factory",
    category: selectedCategory
  }
}
