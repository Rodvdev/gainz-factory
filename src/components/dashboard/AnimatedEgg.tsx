"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AnimatedEggProps {
  currentLevel: number
  nextLevelXP: number
  currentLevelXP: number
  isActive?: boolean
  onAttempt?: () => void
}

interface EggState {
  size: number
  color: string
  expression: string
  isGrowing: boolean
  isIllusioning: boolean
  illusionCount: number
}

export default function AnimatedEgg({ 
  currentLevel, 
  nextLevelXP, 
  currentLevelXP,
  isActive = false,
  onAttempt
}: AnimatedEggProps) {
  const [eggState, setEggState] = useState<EggState>({
    size: 1,
    color: "#FFE4B5",
    expression: "happy",
    isGrowing: false,
    isIllusioning: false,
    illusionCount: 0
  })

  const [attemptCount, setAttemptCount] = useState(0)

  // Calcular el progreso hacia el siguiente nivel
  const progress = nextLevelXP > 0 ? (currentLevelXP / nextLevelXP) * 100 : 0
  
  // Efecto para actualizar el estado del huevo
  useEffect(() => {
    // Determinar el tamaño del huevo basado en el nivel y progreso
    const calculateEggSize = () => {
      const baseSize = 1 + (currentLevel - 1) * 0.15 // Crece 15% por nivel
      const progressBonus = (progress / 100) * 0.1 // Bonus del 10% basado en progreso
      return Math.min(baseSize + progressBonus, 2.5) // Máximo 2.5x
    }

    // Determinar el color del huevo basado en el nivel
    const getEggColor = () => {
      if (currentLevel <= 2) return "#FFE4B5" // Beige claro
      if (currentLevel <= 4) return "#FFD700" // Dorado
      if (currentLevel <= 6) return "#FFA500" // Naranja
      return "#FF6347" // Tomate
    }

    // Determinar la expresión del huevo
    const getEggExpression = () => {
      if (progress >= 90) return "excited"
      if (progress >= 70) return "happy"
      if (progress >= 40) return "neutral"
      if (progress >= 20) return "worried"
      return "sleepy"
    }

    const newSize = calculateEggSize()
    const newColor = getEggColor()
    const newExpression = getEggExpression()

    setEggState(prev => ({
      ...prev,
      size: newSize,
      color: newColor,
      expression: newExpression,
      isGrowing: prev.size < newSize
    }))
  }, [currentLevel, progress])

  // Función para manejar intentos fallidos (animación de "ilusionar")
  const handleAttempt = () => {
    setAttemptCount(prev => prev + 1)
    
    if (attemptCount >= 2) { // A partir del tercer intento
      setEggState(prev => ({
        ...prev,
        isIllusioning: true,
        illusionCount: prev.illusionCount + 1
      }))
      
      // Resetear el estado después de la animación
      setTimeout(() => {
        setEggState(prev => ({
          ...prev,
          isIllusioning: false
        }))
        setAttemptCount(0)
      }, 2000)
    }
    
    onAttempt?.()
  }

  // Generar el SVG del huevo con diferentes expresiones
  const renderEggSVG = () => {
    const size = eggState.size * 60 // Tamaño base de 60px

    return (
      <motion.svg
        width={size}
        height={size * 1.2}
        viewBox="0 0 100 120"
        className="cursor-pointer"
        onClick={handleAttempt}
        animate={eggState.isIllusioning ? {
          x: [-2, 2, -2, 2, 0],
          y: [-1, 1, -1, 1, 0],
          rotate: [-1, 1, -1, 1, 0]
        } : {}}
        transition={eggState.isIllusioning ? {
          duration: 0.5,
          repeat: 3,
          ease: "easeInOut"
        } : {}}
      >
        {/* Sombra del huevo */}
        <ellipse
          cx="50"
          cy="115"
          rx="35"
          ry="8"
          fill="rgba(0,0,0,0.2)"
          opacity="0.3"
        />
        
        {/* Cuerpo del huevo */}
        <motion.ellipse
          cx="50"
          cy="60"
          rx="40"
          ry="50"
          fill={eggState.color}
          stroke="#D2691E"
          strokeWidth="2"
          animate={eggState.isGrowing ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 0.8 }}
        />
        
        {/* Patrón de cascarón */}
        <motion.path
          d="M 20 45 Q 50 35 80 45 Q 50 55 20 45"
          fill="none"
          stroke="#D2691E"
          strokeWidth="1"
          opacity="0.6"
          animate={eggState.isGrowing ? {
            pathLength: [0, 1],
          } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        />
        
        {/* Ojos */}
        <motion.circle
          cx="40"
          cy="45"
          r="4"
          fill="#333"
          animate={eggState.isIllusioning ? {
            scale: [1, 1.3, 1],
          } : {}}
          transition={{ duration: 0.2, repeat: 6 }}
        />
        <motion.circle
          cx="60"
          cy="45"
          r="4"
          fill="#333"
          animate={eggState.isIllusioning ? {
            scale: [1, 1.3, 1],
          } : {}}
          transition={{ duration: 0.2, repeat: 6, delay: 0.1 }}
        />
        
        {/* Destellos en los ojos */}
        <circle cx="42" cy="43" r="1.5" fill="white" />
        <circle cx="62" cy="43" r="1.5" fill="white" />
        
        {/* Boca basada en la expresión */}
        {eggState.expression === "happy" && (
          <motion.path
            d="M 45 55 Q 50 60 55 55"
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            animate={eggState.isIllusioning ? {
              d: ["M 45 55 Q 50 60 55 55", "M 45 57 Q 50 58 55 57", "M 45 55 Q 50 60 55 55"]
            } : {}}
            transition={{ duration: 0.2, repeat: 6 }}
          />
        )}
        
        {eggState.expression === "excited" && (
          <motion.ellipse
            cx="50"
            cy="58"
            rx="6"
            ry="4"
            fill="#FF69B4"
            animate={eggState.isIllusioning ? {
              scale: [1, 1.2, 1],
            } : {}}
            transition={{ duration: 0.2, repeat: 6 }}
          />
        )}
        
        {eggState.expression === "worried" && (
          <motion.path
            d="M 45 57 Q 50 53 55 57"
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            animate={eggState.isIllusioning ? {
              d: ["M 45 57 Q 50 53 55 57", "M 45 59 Q 50 55 55 59", "M 45 57 Q 50 53 55 57"]
            } : {}}
            transition={{ duration: 0.2, repeat: 6 }}
          />
        )}
        
        {eggState.expression === "sleepy" && (
          <motion.path
            d="M 42 57 L 58 57"
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            animate={eggState.isIllusioning ? {
              opacity: [1, 0.3, 1],
            } : {}}
            transition={{ duration: 0.2, repeat: 6 }}
          />
        )}
        
        {eggState.expression === "neutral" && (
          <motion.path
            d="M 42 57 L 58 57"
            fill="none"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
            animate={eggState.isIllusioning ? {
              scaleX: [1, 1.2, 1],
            } : {}}
            transition={{ duration: 0.2, repeat: 6 }}
          />
        )}
        
        {/* Efectos de brillo cuando está creciendo */}
        <AnimatePresence>
          {eggState.isGrowing && (
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              <circle cx="30" cy="30" r="8" fill="white" opacity="0.6" />
              <circle cx="70" cy="35" r="6" fill="white" opacity="0.4" />
              <circle cx="45" cy="25" r="4" fill="white" opacity="0.5" />
            </motion.g>
          )}
        </AnimatePresence>
        
        {/* Partículas cuando está "ilusionando" */}
        <AnimatePresence>
          {eggState.isIllusioning && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.circle
                cx="25"
                cy="25"
                r="2"
                fill="#FFD700"
                animate={{
                  y: [-5, -15, -25],
                  opacity: [1, 0.5, 0]
                }}
                transition={{ duration: 1, repeat: 2 }}
              />
              <motion.circle
                cx="75"
                cy="20"
                r="1.5"
                fill="#FF69B4"
                animate={{
                  y: [-3, -12, -20],
                  opacity: [1, 0.7, 0]
                }}
                transition={{ duration: 1, repeat: 2, delay: 0.3 }}
              />
              <motion.circle
                cx="15"
                cy="40"
                r="1"
                fill="#87CEEB"
                animate={{
                  y: [-2, -8, -15],
                  opacity: [1, 0.8, 0]
                }}
                transition={{ duration: 1, repeat: 2, delay: 0.6 }}
              />
            </motion.g>
          )}
        </AnimatePresence>
      </motion.svg>
    )
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Contenedor del huevo */}
      <motion.div
        className="relative"
        animate={isActive ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {renderEggSVG()}
        
        {/* Indicador de nivel */}
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {currentLevel}
        </motion.div>
        
        {/* Indicador de progreso */}
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-200 rounded-full overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, delay: 1 }}
          />
        </motion.div>
      </motion.div>
      
      {/* Información del huevo */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-sm text-gray-600 font-medium">
          Nivel {currentLevel} • {currentLevelXP}/{nextLevelXP} XP
        </p>
        {eggState.illusionCount > 0 && (
          <motion.p
            className="text-xs text-orange-500 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ¡El huevo está emocionado! ✨
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}
