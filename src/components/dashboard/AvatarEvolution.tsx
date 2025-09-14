"use client"

import { motion } from "framer-motion"
import { Crown, Star, Zap, Flame, Target, Trophy } from "lucide-react"

interface AvatarEvolutionProps {
  level: number
  totalPoints: number
  currentStreak: number
  isActive: boolean
  onLevelUp?: () => void
}

const avatarLevels = {
  1: { 
    emoji: "🥚", 
    name: "Huevo GF", 
    description: "Recién empezando tu transformación",
    color: "from-gray-400 to-gray-600",
    bgColor: "bg-gray-100",
    requirements: { points: 0, streak: 0 }
  },
  2: { 
    emoji: "🐣", 
    name: "Pollito GF", 
    description: "Los primeros pasos hacia los Gainz",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-100",
    requirements: { points: 100, streak: 3 }
  },
  3: { 
    emoji: "🐓", 
    name: "Gallo GF", 
    description: "Despertando el guerrero interior",
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-100",
    requirements: { points: 300, streak: 7 }
  },
  4: { 
    emoji: "🦅", 
    name: "Águila GF", 
    description: "Volando alto hacia tus objetivos",
    color: "from-blue-400 to-purple-500",
    bgColor: "bg-blue-100",
    requirements: { points: 600, streak: 14 }
  },
  5: { 
    emoji: "🦁", 
    name: "León GF", 
    description: "Rugiendo con fuerza y determinación",
    color: "from-yellow-400 to-orange-600",
    bgColor: "bg-yellow-100",
    requirements: { points: 1000, streak: 21 }
  },
  6: { 
    emoji: "🐉", 
    name: "Dragón GF", 
    description: "Legendario, imparable, mítico",
    color: "from-purple-500 to-red-600",
    bgColor: "bg-purple-100",
    requirements: { points: 1500, streak: 30 }
  },
  7: { 
    emoji: "👑", 
    name: "Rey de los Gainz", 
    description: "El pináculo de la transformación",
    color: "from-yellow-400 to-purple-600",
    bgColor: "bg-gradient-to-r from-yellow-100 to-purple-100",
    requirements: { points: 2500, streak: 60 }
  }
}

const getCurrentAvatar = (level: number) => {
  return avatarLevels[level as keyof typeof avatarLevels] || avatarLevels[1]
}

const getNextAvatar = (level: number) => {
  const nextLevel = Math.min(level + 1, 7)
  return avatarLevels[nextLevel as keyof typeof avatarLevels]
}

export default function AvatarEvolution({ level, totalPoints, currentStreak, isActive, onLevelUp }: AvatarEvolutionProps) {
  const currentAvatar = getCurrentAvatar(level)
  const nextAvatar = getNextAvatar(level)
  const progress = Math.min((totalPoints / nextAvatar.requirements.points) * 100, 100)
  const streakProgress = Math.min((currentStreak / nextAvatar.requirements.streak) * 100, 100)
  
  const canEvolve = totalPoints >= nextAvatar.requirements.points && currentStreak >= nextAvatar.requirements.streak && level < 7

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Main Avatar Container */}
      <div className={`relative p-6 rounded-2xl ${currentAvatar.bgColor} border-2 border-white/20 backdrop-blur-sm overflow-hidden`}>
        {/* Background Effects */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentAvatar.color} opacity-10`}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
        
        {/* Pulsing Ring for Active State */}
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute inset-0 rounded-2xl border-4 border-gradient-to-r ${currentAvatar.color} opacity-50`}
          />
        )}
        
        <div className="relative z-10">
          {/* Avatar Display */}
          <div className="text-center mb-6">
            <motion.div
              animate={isActive ? { 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative inline-block"
            >
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${currentAvatar.color} flex items-center justify-center text-4xl shadow-2xl border-4 border-white`}>
                {currentAvatar.emoji}
              </div>
              
              {/* Level Badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {level}
              </div>
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                />
              )}
            </motion.div>
            
            <h3 className={`text-xl font-bold mt-4 bg-gradient-to-r ${currentAvatar.color} bg-clip-text text-transparent`}>
              {currentAvatar.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{currentAvatar.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-white/30 rounded-xl">
              <p className="text-2xl font-bold text-gray-800">{totalPoints.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Puntos</p>
            </div>
            <div className="text-center p-3 bg-white/30 rounded-xl">
              <p className="text-2xl font-bold text-orange-600">{currentStreak}</p>
              <p className="text-xs text-gray-600">Días seguidos</p>
            </div>
          </div>

          {/* Evolution Progress */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progreso a {nextAvatar.name}</span>
                <span className="font-semibold text-gray-800">{Math.round(progress)}%</span>
              </div>
              <div className="relative h-3 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full bg-gradient-to-r ${currentAvatar.color} rounded-full`}
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Puntos necesarios:</span>
                <span className={`font-semibold ${totalPoints >= nextAvatar.requirements.points ? 'text-green-600' : 'text-gray-600'}`}>
                  {totalPoints}/{nextAvatar.requirements.points}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Racha necesaria:</span>
                <span className={`font-semibold ${currentStreak >= nextAvatar.requirements.streak ? 'text-green-600' : 'text-gray-600'}`}>
                  {currentStreak}/{nextAvatar.requirements.streak} días
                </span>
              </div>
            </div>
          </div>

          {/* Evolution Button */}
          {canEvolve && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLevelUp}
              className={`w-full mt-4 py-3 bg-gradient-to-r ${nextAvatar.color} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2`}
            >
              <Zap className="w-5 h-5" />
              ¡EVOLUCIONAR A {nextAvatar.name.toUpperCase()}!
              <Trophy className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Floating Particles */}
        {isActive && (
          <>
            <motion.div
              animate={{ 
                y: [-10, -20, -10],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: 0
              }}
              className="absolute top-4 left-4 text-orange-500"
            >
              ⭐
            </motion.div>
            <motion.div
              animate={{ 
                y: [-15, -25, -15],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: 1
              }}
              className="absolute top-6 right-6 text-red-500"
            >
              🔥
            </motion.div>
            <motion.div
              animate={{ 
                y: [-12, -22, -12],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: 2
              }}
              className="absolute bottom-6 left-6 text-yellow-500"
            >
              ⚡
            </motion.div>
          </>
        )}
      </div>

      {/* Next Avatar Preview */}
      {level < 7 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
        >
          <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Próxima Evolución</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${nextAvatar.color} flex items-center justify-center text-2xl`}>
                {nextAvatar.emoji}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{nextAvatar.name}</p>
                <p className="text-xs text-gray-600">{nextAvatar.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Requisitos:</p>
              <p className="text-xs font-semibold">{nextAvatar.requirements.points} pts</p>
              <p className="text-xs font-semibold">{nextAvatar.requirements.streak} días</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
